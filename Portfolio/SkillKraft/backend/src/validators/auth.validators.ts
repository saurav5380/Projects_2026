import * as z from 'zod';


export const RegisterBody = z.object({
    firstName: z.string().min(1, {message: "First name should have at least one character"}).max(50, {message:"Max 50 characters allowed"}),
    lastName: z.string().min(1, {message: "First name should have at least one character"}).max(50, {message:"Max 50 characters allowed"}),
    email: z.email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).max(72, {message:"Max 72 characters allowed"}),
})

export const LoginBody = z.object({
    email: z.email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).max(72, {message:"Max 72 characters allowed"})
})

export const RefreshBody = z.object({
    currToken: z.string()
})