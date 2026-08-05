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
        <form onSubmit={handleSubmit(onFormSubmit)}>

            <input {...registerField('firstName')}/>
            {errors.firstName && <p>{errors.firstName.message}</p>}

            <input {...registerField('lastName')}/>
            {errors.lastName && <p>{errors.lastName.message}</p>}

            <input {...registerField('email')}/>
            {errors.email && <p>{errors.email.message}</p>}

            <input {...registerField('password')}/>
            {errors.password && <p>{errors.password.message}</p>}

            <button type='submit' disabled={registerIsPending}>{registerIsPending ? "Registering..." : "Register"}</button>
            {registerError && <p>registerError.message</p>}
        </form>
        </>
    )

}

export default Register;