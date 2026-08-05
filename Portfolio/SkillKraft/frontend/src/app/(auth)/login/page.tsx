"use client"

import {z} from 'zod';
import { useAuth } from '@/app/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).max(72, {message:"Max 72 characters allowed"})
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
    
    const { login, loginError, loginIsPending } = useAuth();
    
    const {register, handleSubmit, formState: {errors} } = useForm<LoginFormData>({resolver: zodResolver(loginSchema)});

    const formSubmit = (data: LoginFormData) => {
        login(data);
    };

    return (
        <>
        <form onSubmit={handleSubmit(formSubmit)}>
        <input {...register('email')}/>
        {errors?.email && <p>{errors.email.message}</p>}

        <input {...register('password')}/>
        {errors?.password && <p>{errors.password.message}</p>}

        <button type='submit' disabled={loginIsPending}>{loginIsPending? "Attempting User Login..." : "Login"}</button>
        {loginError && <p>{loginError.message}</p>}
        
        </form>
        </>
    )
}



export default Login;