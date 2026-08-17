"use client"

import {z} from 'zod';
import { useAuth } from '@/app/hooks/useAuth';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';


const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).max(72, {message:"Max 72 characters allowed"})
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
    
    const { login, loginError, loginIsPending } = useAuth();
    
    const { handleSubmit, control } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" }
    });

    const formSubmit = (data: LoginFormData) => {
        login(data);
    };

    const inputClassName = "bg-bg-subtle border-border rounded-md px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted h-10 focus-visible:ring aria-invalid:border-danger aria-invalid:focus-visible:ring-danger";
    const labelClassName = "text-[13px] font-medium text-text-secondary mb-1.5";

    return (
        <>
       <div className="relative h-dvh overflow-hidden bg-bg-base flex items-center justify-start p-4 ">
        <div className="relative min-h-screen bg-bg-base w-[35vw] border-border-soft">
        <Image src={"/skillkraft-growth-steps-transparent.svg"} alt='skillkraft logo' loading='eager' width={128} height={128}/>     
        <Image src={"/skillkraft-minimal-navigation-watermark.svg"} alt='skillkraft compass image' loading='eager' fill className='object-contain object-left opacity-10 pointer-events-none'/>     
        <h1 className="text-primary text-xl font-bold px-4">SkillKraft</h1>
        </div>
        <Card className="w-full max-w-md max-h-lg  bg-bg-surface border-border rounded-lg p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight font-sans text-text-primary text-center">
                    Login to SkillKraft
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit(formSubmit)} className="flex flex-col gap-4">
                    <Controller 
                    name="email"
                    control={control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor='email' className={labelClassName}>Email</FieldLabel>
                            <Input 
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder='Enter email'
                                className={cn(inputClassName)}
                            />
                            {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                                className="text-xs text-danger mt-1.5"
                                            />
                                        )}
                        </Field>
                    )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='password' className={labelClassName}>Password</FieldLabel>
                                <Input 
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className={cn(inputClassName)}
                                />
                                {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                                className="text-xs text-danger mt-1.5"
                                            />
                                        )}
                            </Field>
                        )}
                    />
                    <Button
                        type='submit'
                        disabled={loginIsPending}
                        className="bg-brand text-[#0E1825] text-sm font-semibold px-4 py-2.5 rounded-md hover:opacity-90 disabled:opacity-40 active:scale-[0.98] transition"
                        >
                            Login
                        </Button>
                        {loginError && (
                            <Alert variant='destructive' className="bg-danger-soft border-danger/40 text-danger">
                                <AlertDescription className='text-danger'>{loginError.message}</AlertDescription>
                            </Alert>
                        )}
                 </form>
            </CardContent>
        </Card>

       
            
            </div>
        
       
        </>
    )
}

export default Login;