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
            <div className="border-2 border-sky-500 rounded-lg flex flex-col max-w-2xl mx-auto my-10 gap-4 p-2 items-center justify-center">
            <h1 className='text-2xl font-bold mx-auto my-2 font-mono'>Login to SkillKraft</h1>
            <input {...register('email')} placeholder="Enter Email" className="font-mono px-4 border border-sky-500 rounded-lg"/>
            {errors?.email && <p className="text-red-500">{errors.email.message}</p>}

            <input {...register('password')} placeholder="Enter Password" className="font-mono px-4 border border-sky-500 rounded-lg"/>
            {errors?.password && <p className="text-red-500">{errors.password.message}</p>}

            <button type='submit' disabled={loginIsPending} className="font-mono border border-blue-500 bg-blue-300 px-4 rounded-lg">{loginIsPending? "Attempting User Login..." : "Login"}</button>
            {loginError && <p className="text-red-500">{loginError.message}</p>}
            </div>
        </form>
        </>
    )
}

export default Login;