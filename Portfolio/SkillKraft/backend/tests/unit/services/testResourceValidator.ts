import { searchAndValidate } from "../../../src/services/resourceValidator.service.js";

const run = async () => {
    const title = "Learn fastAPI";
    const searchQuery = "learn fastAPI from basics";
    const result = await searchAndValidate(title, searchQuery);
    console.log(result);
}

run();