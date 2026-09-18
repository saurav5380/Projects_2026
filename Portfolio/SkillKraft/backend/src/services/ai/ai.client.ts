import { aiConfig } from "../../config/aiConfig.js";
import { z } from "zod";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { AIProvider as PrismaAIProvider } from "../../generated/prisma/enums.js";
import { aiLog } from "../../repositories/aiCallLog.repository.js";

type ModelTier = keyof typeof aiConfig;

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_CLAUDE_API_KEY });

const MAX_TRIES = 3;               // provider-level retry attempts (timeout/5xx/429)
const INITIAL_BACKOFF_MS = 1000;   // 1s, then 2s — not the same as the request timeout
const CORRECTIVE_RETRY_LIMIT = 1;  // schema-validation retries: one extra attempt

// Module-scope Map — created ONCE, shared across every aiClient call 
const inFlightRequests = new Map<string, Promise<unknown>>();

export class AIValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AIValidationError";
    }
}

// Only retry transient failures — a 400/401 would just fail identically again
const isRetryable = (error: unknown): boolean => {
    if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status?: number }).status;
        if (status === 429) return true;
        if (status !== undefined && status >= 500) return true;
        return false; 
    }
    return true; 
};

const aiClient = async <T extends z.ZodType>(
    taskName: string,
    userId: string,
    prompt: string,
    options: { tier: ModelTier; schema: T }  
): Promise<z.infer<T>> => {
    const requestKey = `${taskName}:${userId}`;

    // Idempotency: a call already in flight for this exact key returns the SAME promise
    if (inFlightRequests.has(requestKey)) {
        return inFlightRequests.get(requestKey) as Promise<z.infer<T>>;
    }

    const resultPromise = runAICall(taskName, userId, prompt, options);
    inFlightRequests.set(requestKey, resultPromise);

    try {
        return await resultPromise;
    } finally {
        inFlightRequests.delete(requestKey);
    }
};

const runAICall = async <T extends z.ZodType>(
    taskName: string,
    userId: string,
    prompt: string,
    options: { tier: ModelTier; schema: T }
): Promise<z.infer<T>> => {
    const modelTier: ModelTier = options.tier || "standard";
    const timerStart = Date.now();

    let success = true;
    let usedFallback = false;
    let provider: PrismaAIProvider = PrismaAIProvider.OPENAI;
    let modelUsed = aiConfig[modelTier].models.openai;

    const callOpenai = async (priorError?: string): Promise<string> => {
        const userPrompt = priorError
            ? `${prompt}\n\nYour previous response had this error — please correct it: ${priorError}`
            : prompt;
        const response = await openaiClient.responses.create({
            model: aiConfig[modelTier].models.openai,
            input: userPrompt,
        });
        return response.output_text;
    };

    const callAnthropic = async (priorError?: string): Promise<string> => {
        const userPrompt = priorError
            ? `${prompt}\n\nYour previous response had this error — please correct it: ${priorError}`
            : prompt;
        const response = await anthropicClient.messages.create({
            model: aiConfig[modelTier].models.anthropic,
            max_tokens: 1000,
            messages: [{ role: "user", content: userPrompt }],
        });
        // Anthropic returns an array of content blocks — normalize to a plain
        // string so both providers hand back the SAME shape to the caller
        const textBlock = response.content.find((block) => block.type === "text");
        if (!textBlock || textBlock.type !== "text") {
            throw new Error("Anthropic response contained no text block");
        }
        return textBlock.text;
    };

    // Retries the SAME provider fn on transient failures only (timeout/5xx/429)
    const retryWithBackoff = async (
        fn: (priorError?: string) => Promise<string>,
        priorError?: string
    ): Promise<string> => {
        let currentDelay = INITIAL_BACKOFF_MS;
        let lastErrorMsg = priorError;

        for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
            try {
                return await fn(lastErrorMsg);
            } catch (error) {
                lastErrorMsg = error instanceof Error ? error.message : String(error);

                if (!isRetryable(error) || attempt === MAX_TRIES) {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, currentDelay));
                currentDelay += 1000; // 1s → 2s
               
            }
        }
        throw new Error("Retry limit exceeded"); 
    };

    // Parses + validates raw AI text against the schema. On failure, retries
    // ONCE more with the validation error appended to the prompt (the
    // "corrective retry" guardrail), then gives up entirely.
    const callWithSchemaGuardrail = async (
        fn: (priorError?: string) => Promise<string>
    ): Promise<z.infer<T>> => {
        let validationError: string | undefined;

        for (let attempt = 0; attempt <= CORRECTIVE_RETRY_LIMIT; attempt++) {
            const rawText = await retryWithBackoff(fn, validationError);

            try {
                const parsed = JSON.parse(rawText);
                return options.schema.parse(parsed);
            } catch (error) {
                validationError = error instanceof Error ? error.message : String(error);
            }
        }

        throw new AIValidationError(
            `AI response failed schema validation after ${CORRECTIVE_RETRY_LIMIT + 1} attempt(s): ${validationError}`
        );
    };

    try {
        try {
            return await callWithSchemaGuardrail(callOpenai);
        } catch (error) {
            usedFallback = true;
            provider = PrismaAIProvider.ANTHROPIC;
            modelUsed = aiConfig[modelTier].models.anthropic;
            return await callWithSchemaGuardrail(callAnthropic);
        }
    } catch (error) {
        success = false;
        throw error;
    } finally {
        const elapsedMs = Date.now() - timerStart;
        // Runs regardless of success/failure — awaited for reliability
        await aiLog(userId, taskName, provider, modelUsed, elapsedMs, success, usedFallback);
    }
};

export default aiClient;