import { aiConfig } from "../../config/aiConfig.js"
import z from "zod"
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const OPENAI = process.env.OPENAI_API_KEY;
const ANTHROPIC = process.env.ANTHROPIC_CLAUDE_API_KEY;
type ModelTier = keyof typeof aiConfig;
type Provider = keyof typeof aiConfig[ModelTier]["models"];

const openaiClient = new OpenAI();
const anthropicClient = new Anthropic();
 

const aiClient = (taskName: string, userId: number, prompt: string, options: {tier: ModelTier, schema: z.ZodType}) => {
    
    const modelTier: ModelTier = options.tier;
    const llmProvider: Provider = Object.keys(aiConfig[modelTier].models)[0] as Provider;
    
    const promptResponse = async () => {
        if (llmProvider === "openai"){
            const response = await openaiClient.responses.create({
                model: aiConfig[modelTier]["models"].openai,
                input: prompt
            })
            return response.output_text 
        }
        else if (llmProvider === "anthropic"){
            const response = await anthropicClient.messages.create({
                model: aiConfig[modelTier]["models"].anthropic,
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: prompt
                }],
            })
            return response.content
        }   
    }

    



}


export default aiClient;