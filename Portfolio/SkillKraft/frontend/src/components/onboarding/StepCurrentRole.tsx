"use client"

import { Controller, Control } from 'react-hook-form';
import { Input } from '../ui/input';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Onboarding } from './onboardingValidator';

const StepCurrentRole = ({ ctrl }: { ctrl: Control<Onboarding> }) => {

    return (
            <Controller
                name='currentRole'
                control={ctrl}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='currentRole'>Current Role</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder='list your current role'
                        />
                        <p>{field.value.length}/100</p>
                        <FieldError errors={[fieldState.error]} className="text-xs text-danger mt-1.5" />
                    </Field>
                )}
            />
    )
}

export default StepCurrentRole;