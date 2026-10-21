"use client"

import { Control, Controller } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Onboarding } from './onboardingValidator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const StepTimeline = ({ ctrl }: { ctrl: Control<Onboarding> }) => {
    const timeline = [{ label: "three months", value: "3" },
    { label: "six months", value: "6" },
    { label: "twelve months", value: "12" }
    ]
    return (
        <Controller
            name='targetMonths'
            control={ctrl}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='targetMonths'> Target Months </FieldLabel>
                    <Select
                        name={field.name}
                        value={String(field.value)}
                        onValueChange={field.onChange}>
                        <SelectTrigger id='targetMonths' aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {timeline.map((option) => (
                                    <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
                                ))}

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} className="text-xs text-danger mt-1.5" />
                </Field>
            )}
        />
    )
}

export default StepTimeline;