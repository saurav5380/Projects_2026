
import "dotenv/config"; 


type ValidatedResource = {
    url: string | null;
    title: string;
    verified: boolean;
};

type SerperResponse = {
    organic?: Array<{
        title: string;
        link: string;
    }>;
};

const SEARCH_API_KEY = process.env.SEARCH_API_KEY;
const SEARCH_API_URL = process.env.SEARCH_API_URL; // e.g. https://google.serper.dev/search

const HEAD_REQUEST_TIMEOUT_MS = 2000;

const searchTopResult = async (
    searchQuery: string
): Promise<{ url: string; title: string } | null> => {
    
    const response = await fetch(SEARCH_API_URL as string, {
        method: "POST",
        headers: {
            "X-API-KEY": SEARCH_API_KEY as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: searchQuery }),
    });

    if (!response.ok) {
        return null;
    }

    const data: SerperResponse = await response.json();
    const topResult = data.organic?.[0];

    if (!topResult) {
        return null;
    }

    return { url: topResult.link, title: topResult.title };
};

//Issues a HEAD request to the given URL with a 2-second timeout
const isUrlReachable = async (url: string): Promise<boolean> => {
    // AbortController: built-in, provided by the JS/Node runtime —
    // used here to enforce the 2-second timeout on the HEAD request.
    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        HEAD_REQUEST_TIMEOUT_MS
    );

    try {
        const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
        });

        // 2xx or 3xx both count as "reachable" per the requirement.
        return response.status >= 200 && response.status < 400;
    } catch (error) {
        // Covers: timeout abort, DNS failure, connection refused, etc.
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
};

/**
 * Given an AI-suggested resource title and a search query, finds a real,
 * reachable URL for it via web search + HEAD validation.
 *
 * Falls back to an unverified placeholder ({ url: null, verified: false })
 * if the search fails or the top result's URL is not reachable.
 */
export const searchAndValidate = async (
    suggestedTitle: string,
    searchQuery: string
): Promise<ValidatedResource> => {
    try {
        const topResult = await searchTopResult(searchQuery);

        if (!topResult) {
            return { url: null, title: suggestedTitle, verified: false };
        }

        const reachable = await isUrlReachable(topResult.url);

        if (!reachable) {
            return { url: null, title: suggestedTitle, verified: false };
        }

        return { url: topResult.url, title: topResult.title, verified: true };
    } catch (error) {
        // Any unexpected failure in the search step itself (network error,
        // malformed response, etc.) falls back the same way a search
        // failure does per the requirement.
        return { url: null, title: suggestedTitle, verified: false };
    }
};