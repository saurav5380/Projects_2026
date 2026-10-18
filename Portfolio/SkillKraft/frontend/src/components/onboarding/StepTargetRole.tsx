"use client"

import { Controller, Control } from 'react-hook-form';
import { Input } from '../ui/input';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Onboarding } from './onboardingValidator';

const StepTargetRole = ({ ctrl }: { ctrl: Control<Onboarding> }) => {

    return (
            <Controller
                name='targetRole'
                control={ctrl}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='targetRole'>Current Role</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            list='tgtRole'
                            aria-invalid={fieldState.invalid}
                            placeholder='list your current role'
                        />
                        <datalist id="tgtRole">
                            <option value="Software Engineer"></option>
                            <option value="Data Scientist"></option>
                            <option value="Product Manager"></option>
                            <option value="UX Designer"></option>
                            <option value="DevOps Engineer"></option>
                        </datalist>
                        <p>{field.value.length}/100</p>
                        <FieldError errors={[fieldState.error]} className="text-xs text-danger mt-1.5" />
                    </Field>
                )}
            />
    )
}

export default StepTargetRole;