
let accessToken: string | null;
let refreshToken: string | null;

export const setAccessToken = (token: string) => {
     accessToken = token;
}

export const getAccessToken = (): string | null => {
     return accessToken 
}

export const setRefreshToken = (token: string) => {
    refreshToken = token;
}

export const getRefreshToken = (): string | null => {
    return refreshToken;
}

export const clearAccessToken = () => {
    accessToken = null;
}

export const clearRefreshToken = () => {
    refreshToken = null;
}

