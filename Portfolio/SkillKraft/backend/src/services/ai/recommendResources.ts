import aiClient from "./ai.client.js";
import { aiResponseSchema } from "../../validators/airesponse.validators.js";

export const recommendResources = async(task: string, id: string, prompt: string) => {
    try{
        const result = await aiClient(task, id, prompt, {tier: "standard", schema: aiResponseSchema});
        return result;
    }
    catch(error){
        if (error instanceof Error){
            console.error(`Error: ${error.message}`)
            return (`Error finding resources: ${error.message}`)
        }
    }
}