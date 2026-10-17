"use client"

import { useState } from "react"
import type { Onboarding } from "./onboardingValidator";
import { OnboardingSchema } from "./onboardingValidator";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../ui/card";
import StepCurrentRole from "./StepCurrentRole";
import { Button } from "../ui/button";

export const OnboardingWizard = () => {
    const {handleSubmit, control} = useForm<Onboarding>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {currentRole: "", targetRole: "", weeklyHours: 2, targetMonths: 3}

    })
    const [counter, setCounter] = useState(0);

    const formSubmit = (data: Onboarding) => {
        console.log(data)
    }

    return (
        <>
        <form onSubmit={handleSubmit(formSubmit)}>
            <Card>
                <StepCurrentRole ctrl={control}/>
                <Button type="button">Prev</Button>
                <Button type="button">Next</Button>
            </Card>
        </form>
        </>
    )
}