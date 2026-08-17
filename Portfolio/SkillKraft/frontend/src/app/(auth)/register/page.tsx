"use client"

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/app/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils'; // In-built ShadCN helper — merges Tailwind classes safely
import Image from 'next/image';

const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name should have at least one character" }).max(50, { message: "Max 50 characters allowed" }),
    lastName: z.string().min(1, { message: "First name should have at least one character" }).max(50, { message: "Max 50 characters allowed" }),
    email: z.email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(72, { message: "Max 72 characters allowed" }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Custom reusable classNames matching Design System v1.1 §5.3 — kept as constants
// so every input on this page stays visually identical without repeating strings
const inputClassName = "bg-bg-subtle border-border rounded-md px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted h-10 focus-visible:ring aria-invalid:border-danger aria-invalid:focus-visible:ring-danger";
const labelClassName = "text-[13px] font-medium text-text-secondary mb-1.5";

const Register = () => {

    const { register, registerError, registerIsPending } = useAuth();

    const { control, handleSubmit } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "" }
    });

    const onFormSubmit = (data: RegisterFormData) => {
        register(data);
    };

    return (
        // Design System §2 — page background token; §4.3 — centred layout for auth pages
        <div className="relative h-dvh overflow-hidden bg-bg-base flex p-4 ">
            <div className="relative min-h-screen bg-bg-base w-[35vw] border-border-soft">
            <Image src={"/skillkraft-growth-steps-transparent.svg"} alt='skillkraft logo' width={128} height={128}/>
            <Image src={"/skillkraft-minimal-navigation-watermark.svg"} alt='skillkraft compass image' fill className='object-contain object-left opacity-10 pointer-events-none'/>
            </div>
            {/* Design System §5.1 Default card — bg-bg-surface, border-border, rounded-lg, p-6 */}
            <div className="min-h-screen bg-bg-base p-4 flex justify-center items-center w-full">
                
                <Card className="w-full max-w-md bg-bg-surface border-border rounded-lg p-6">  
                    <CardHeader>
                        {/* Design System §3.3 H2 style */}
                        <CardTitle className="text-2xl font-bold tracking-tight font-sans text-text-primary text-center">
                            Start your Journey
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Design System §4.1 Rule 3 — gap-4 between list/form items */}
                        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">

                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} className={labelClassName}>
                                            First Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Enter First Name"
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

                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} className={labelClassName}>
                                            Last Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Enter Last Name"
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

                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} className={labelClassName}>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Enter Email"
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

                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} className={labelClassName}>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="password"
                                            placeholder="Enter Password"
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

                            {/* Design System §5.2 Primary button */}
                            <Button
                                type="submit"
                                disabled={registerIsPending}
                                className="bg-brand text-[#0E1825] text-sm font-semibold px-4 py-2.5 rounded-md hover:opacity-90 disabled:opacity-40 active:scale-[0.98] transition"
                            >
                                {registerIsPending ? "Registering..." : "Register"}
                            </Button>

                            {registerError && (
                                // Design System §5.2 Danger button colour system applied to Alert
                                <Alert
                                    variant="destructive"
                                    className="bg-danger-soft border-danger/40 text-danger"
                                >
                                    <AlertDescription className="text-danger">
                                        {registerError.message}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </form>
                    </CardContent>
                </Card>
                </div>
            </div>
    );
};

export default Register;