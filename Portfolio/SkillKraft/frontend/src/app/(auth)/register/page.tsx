"use client"

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/app/hooks/useAuth';

const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name should have at least one character" }).max(50, { message: "Max 50 characters allowed" }),
    lastName: z.string().min(1, { message: "First name should have at least one character" }).max(50, { message: "Max 50 characters allowed" }),
    email: z.email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(72, { message: "Max 72 characters allowed" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {

    const {register, registerError, registerIsPending} = useAuth();

    const {register: registerField, handleSubmit, formState: {errors}} = useForm<RegisterFormData>({resolver: zodResolver(registerSchema)});

    const onFormSubmit = (data: RegisterFormData) => {
        register(data)
    }

    return (
        <>
        <img src="/SK_logo.png" alt='SkillKraft logo' className='w-xl h-32 mx-auto '/>
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="border-2 border-sky-500 rounded-lg flex flex-col max-w-2xl mx-auto my-10 gap-4 p-2 items-center justify-center">
            <h1 className='text-2xl font-bold mx-auto my-2 font-mono'>Register</h1>
            <input {...registerField('firstName')} placeholder ="Enter First Name" className=" px-4 font-mono border border-sky-500 rounded-lg"/>
            {errors.firstName && <p>{errors.firstName.message}</p>}

            <input {...registerField('lastName')} placeholder ="Enter Last Name" className="font-mono px-4 border border-sky-500 rounded-lg"/>
            {errors.lastName && <p>{errors.lastName.message}</p>}

            <input {...registerField('email')} placeholder ="Enter Email" className=" font-mono px-4 border border-sky-500 rounded-lg"/>
            {errors.email && <p>{errors.email.message}</p>}

            <input {...registerField('password')} placeholder ="Enter Password" className="font-mono px-4 border border-sky-500 rounded-lg"/>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <button type='submit' disabled={registerIsPending} className="font-mono border border-blue-500 bg-blue-300 px-4 rounded-lg">{registerIsPending ? "Registering..." : "Register"}</button>
            {registerError && <p>registerError.message</p>}
            </div>
        </form>
        </>
    )

}

export default Register;