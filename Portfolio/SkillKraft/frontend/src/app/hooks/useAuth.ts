import { useMutation } from "@tanstack/react-query";
import type { UserRegistryData, RegisterResponse, UserLoginData, LoginResponse, LogoutResponse } from "../types/api.types";
import apiRequest from "@/lib/apiClient";
import { useRouter } from 'next/navigation';
import * as authHelpers from "@/lib/auth"

export const useAuth = () => {
    const router = useRouter();

    // Register Mutation

    const registerMutation = useMutation({
        mutationFn: async (userRegistryData: UserRegistryData) => {
            const response = await apiRequest.post<RegisterResponse>("/auth/register", userRegistryData);
            return response;
        },
        onSuccess:(data) => {
            console.log("Registered user:", data.data);
        },
        onError: (error) => {
            console.error("Registration failed:", error.message)
        }

    });

    // Login Mutation 

    const loginMutation = useMutation({
        mutationFn: async (userLoginData: UserLoginData) => {
            const response = await apiRequest.post<LoginResponse>("/auth/login", userLoginData)
            return response;
        },
        onSuccess: (data) => {
            console.log("User Login Success: ", data.data)
            authHelpers.setAccessToken(data.data.accessToken);
            authHelpers.setRefreshToken(data.data.refreshToken);

        },
        onError: (error) => {
            console.error("Login failed: ", error.message)
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async(refreshToken: string) => {
            const response = await apiRequest.post<LogoutResponse>("/auth/logout", refreshToken);
            return response;
        },
        onSuccess: (data) => {
            authHelpers.clearAccessToken();
            authHelpers.clearRefreshToken();
            console.log("User logged out at: ", data.data);
        },
        onError: (error) => {
            console.error("Error logging out user", error.message);
        }
    })


    return {
        register: registerMutation.mutate,
        registerError: registerMutation.error,
        isRegistering: registerMutation.isPending,
        
        login: loginMutation.mutate,
        loginError: loginMutation.error,
        isLogging: loginMutation.isPending,

        logout: logoutMutation.mutate
    }
    
}

