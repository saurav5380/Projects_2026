
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

export type UserDetails = {
    success: boolean,
    data: {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
    passwordHash: string;
    currentRole: string | null;
    targetRole: string | null;
    weeklyHours: number | null;
    targetMonths: number | null;
    onboardingDone: boolean;
    createdAt: Date;
    updatedAt: Date;
}
}


