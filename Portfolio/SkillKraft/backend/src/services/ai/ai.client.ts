import { aiConfig } from "../../config/aiConfig.js"
import z from "zod"
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "../../db/prisma.js";
import { AIProvider as PrismaAIProvider } from "../../generated/prisma/enums.js";
import { aiLog } from "../../repositories/aiCallLog.repository.js";

type ModelTier = keyof typeof aiConfig;


const openaiClient = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const anthropicClient = new Anthropic({apiKey: process.env.ANTHROPIC_CLAUDE_API_KEY});
const MAX_TRIES = 3;
const INITIAL_DELAY = 15000;

const userRequestMap = new Map();

const aiClient = async (taskName: string, userId: number, prompt: string, options: {tier: ModelTier, schema: z.ZodType}) => {
    const timerStart = Date.now();
    let elapsedTime;
    let aiResponse;
    let fallbackStatus = false;
    let success = true; 
    let modelUsed = aiConfig[options.tier].models.openai;
    let provider: PrismaAIProvider = PrismaAIProvider.OPENAI;
    const modelTier: ModelTier = options.tier || "standard";
   
    
    const requestKey = `${taskName}:${userId}`

    const callOpenai = async(priorError: string = "") => {
        const userPrompt = prompt + "   " + `Error from Previous Prompt: ${priorError}`
        const response = await openaiClient.responses.create({
                model: aiConfig[modelTier]["models"].openai,
                input: userPrompt
            })
            return response.output_text
    }

    const callAnthropic = async(priorError: string = "") => {
        const userPrompt = prompt + "   " + `Error from Previous Prompt: ${priorError}`
        const response = await anthropicClient.messages.create({
                model: aiConfig[modelTier]["models"].anthropic,
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: userPrompt
                }],
            })
            return response.content
    }
    
    const retry = async <T>(fn: (err: string | undefined) => Promise<T>): Promise<T> => {
            let currentDelay = INITIAL_DELAY;
            let lastErrorMsg : string | undefined = "";
            for (let attempt = 1; attempt <= MAX_TRIES; attempt++){
                try{
                    return await fn(lastErrorMsg);
                }
                catch(error){
                    if (error instanceof Error){
                        lastErrorMsg =  String(error.message);
                    }
                    
                    if (attempt === MAX_TRIES) {
                        throw error;
                    }
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    currentDelay += 1000;
                    return await fn(lastErrorMsg);                
                }
            }
            throw new Error("Retry limit exceeded");
    }

    const fallback = async () => {
        fallbackStatus = false;
        
        try{
            success = true;
            aiResponse = await retry(callOpenai); 
            return aiResponse
        }
        catch(error){
            success = false;
            fallbackStatus = true;
            modelUsed = aiConfig[options.tier].models.anthropic
            provider = PrismaAIProvider.ANTHROPIC;
            return await retry(callAnthropic);
            // throw error
        }
    }

    try{
        if (userRequestMap.has(requestKey)){
            return fallback
        }
        else{
            userRequestMap.set(requestKey, fallback())
            const aiResult = await fallback();
            userRequestMap.delete(requestKey)
            return ({taskName, userId, aiResult})
        }
    } catch(error){
        if (error instanceof Error){
        console.error('Error: ', error.message)
        throw error
        }
    }

    elapsedTime = Date.now() - timerStart;
    
    aiLog(String(userId), taskName, provider, modelUsed, elapsedTime, success, fallbackStatus);

}


export default aiClient;