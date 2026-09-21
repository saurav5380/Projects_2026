import aiClient from "../../../src/services/ai/ai.client.js";
import { z } from "zod";

const testSchema = z.object({
    message: z.string(),
    timestamp: z.number()
});

const prompt = `
Return ONLY a JSON object with exactly two fields:
- message: a short greeting string
- timestamp: the current year as a number

Return nothing except the JSON object. No markdown, no code fences, no explanation.
`;

const run = async () => {
    const result = await aiClient("testTask", "test-user-1", prompt, {
        tier: "standard",
        schema: testSchema
    });

    console.log("Result:", result);
};

run();