import aiClient from "./ai.client.js";
import { aiResponseSchema } from "../../validators/airesponse.validators.js";
// import { ResourceType } from "../../generated/prisma/enums.js";


type resourceData = {
    topic: string,
    description: string
}

export const recommendResources = async(id: string, resourceData:resourceData) => {
    try{
        const TASK_NAME = "recommendResources";
        const prompt = `Suggest 3 learning resources for this topic:
                            Title: ${resourceData.topic}
                            Description: ${resourceData.description}
                        For each resource, provide:
                            - suggestedTitle: a short descriptive title for the resource
                            - searchQuery: a search phrase someone could use to find this resource online (do NOT provide a URL — only a search phrase)
                            - resourceType: one of "ARTICLE", "COURSE", "DOCUMENTATION", "VIDEO"
                        Return ONLY a JSON array matching this shape:[{ suggestedTitle, searchQuery, resourceType }]`;

        const result = await aiClient(TASK_NAME, id, prompt, {tier: "standard", schema: aiResponseSchema});
        return result;
    }
    catch(error){
        if (error instanceof Error){
            console.error(`Error: ${error.message}`)
            return (`Error finding resources: ${error.message}`)
        }
    }
}



