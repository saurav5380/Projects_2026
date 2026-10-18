"use client"

import { Control, Controller } from "react-hook-form";
import { Slider } from '../ui/slider';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Onboarding } from './onboardingValidator';

const StepWeeklyHours = ({ctrl} : {ctrl : Control<Onboarding>}) => {
    return (
        <Controller
            name="weeklyHours"
            control={ctrl}
            render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="weeklyHours">Weekly Hours</FieldLabel>
                    <Slider 
                    defaultValue={[2]}
                    max={20}
                    step={1}
                    onChange={field.onChange}
                    className="mx-auto w-full max-w-xs"
                    />
                    <label>{field.value} hours per week</label>
                <FieldError errors={[fieldState.error]} className="text-xs text-danger mt-1.5" />
                </Field>
                
            )}
        />
    )
}


export default StepWeeklyHours