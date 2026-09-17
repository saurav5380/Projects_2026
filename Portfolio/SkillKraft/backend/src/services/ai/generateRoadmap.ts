import aiClient from "./ai.client.js";
import { roadmapSchema } from "../../validators/airesponse.validators.js";

enum tgtMonths {three = 3,six = 6,twelve = 12}

type onboardingData = {
    currentRole: string,
    targetRole: string,
    weeklyHours: number,
    targetMonths: tgtMonths
}

export const generateRoadmap = async(id: string, onboardingData: onboardingData) => {
    try{
        const TASK_NAME = "generateRoadmap";
        const prompt = `Create a personalized learning roadmap for someone transitioning from ${onboardingData.currentRole} to ${onboardingData.targetRole}.
                        They can commit ${onboardingData.weeklyHours} hours per week, and want to reach this goal within ${onboardingData.targetMonths} months.
                        Return ONLY a JSON object matching this shape: 
                        { phases: [{ title, order, topics: [{ title, description, estimatedHours, isCheckpoint, order }] }] }`;

        const result = await aiClient(TASK_NAME, id, prompt, {tier: "powerful", schema: roadmapSchema});
        return result;
    }
    catch(error){
        if (error instanceof Error){
            console.error(`Error: ${error.message}`)
            return (`Error finding resources: ${error.message}`)
        }
    }
}

