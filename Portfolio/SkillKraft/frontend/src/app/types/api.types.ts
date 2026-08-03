
export type UserRegistryData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
};

export type RegisterResponse = {
    success: boolean,
    data: {
        firstName: string,
        lastName: string,
        email: string
    }
};

export type UserLoginData = {
    email: string,
    password: string
};

export type LoginResponse = {
    success: boolean,
    data: {
        accessToken: string,
        refreshToken: string
    }
};

export type LogoutResponse = {
    success: boolean,
    data: {
        revokedAt: Date 
    }
}

