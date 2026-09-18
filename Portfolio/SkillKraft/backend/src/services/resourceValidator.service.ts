
import 'dotenv/config';
// import type { SerperResponse } from 'serper';

type SerperResponse = { 
    organic?: Array<{
        title: string,
        link: string
    }>;
};

type ValidatedResource = {
    url: string | null,
    title: string,
    verified: boolean
};

const SEARCH_API_URL = "https://google.serper.dev/search";
const SEARCH_API_KEY = process.env.SEARCH_API_KEY;
const HEAD_REQUEST_TIMEOUT_MS = 2000;

const searchTopResult = async(searchQuery: String): Promise<{url: string; title: string} | null> => {
    const response = await fetch(SEARCH_API_URL as string, {
        method: "POST",
        headers: {
            "X-API-KEY": SEARCH_API_KEY as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({q: searchQuery})
    })
    if (!response.ok){
        return null
    }

    const data: SerperResponse = await response.json();
    const topResult = data.organic?.[0];

    if (!topResult){
        return null
    }

    return {url:topResult.link, title:topResult?.title}
};

const isUrlReachable = async(url:string): Promise<boolean> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEAD_REQUEST_TIMEOUT_MS);
    try{
        const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal
        })
        return response.status >= 200 && response.status <= 400;
    }
    catch(error){
        return false;
    }
    finally{
        clearTimeout(timeoutId)
    }
};

export const searchAndValidate = async (suggestedTitle: string, searchQuery: string): Promise<ValidatedResource> => {
    try{
        const topresult = await searchTopResult(searchQuery);
        if(!topresult){
            return {url:null, title: suggestedTitle, verified: false}
        }
        const reachable = await isUrlReachable(topresult.url)
        if (!reachable){
            return {url: topresult.url, title: suggestedTitle, verified: false}
        }
        return {url: topresult.url, title: suggestedTitle, verified: true}
    }
    catch(error){
        return {url:null, title: suggestedTitle, verified: false}
    }
};


