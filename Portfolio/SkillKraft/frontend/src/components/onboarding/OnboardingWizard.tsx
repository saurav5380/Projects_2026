"use client"

import { useState } from "react"
import type { Onboarding } from "./onboardingValidator";
import { OnboardingSchema } from "./onboardingValidator";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../ui/card";
import StepCurrentRole from "./StepCurrentRole";
import StepTargetRole from "./StepTargetRole";
import StepTimeline from "./StepTimeline";
import StepWeeklyHours from "./StepWeeklyHours";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiRequest from "@/lib/apiClient";
import { Spinner } from "../ui/spinner";


export const OnboardingWizard = () => {
    const {handleSubmit, trigger, control} = useForm<Onboarding>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {currentRole: "", targetRole: "", weeklyHours: 2, targetMonths: 3}

    })

    const router = useRouter();
    const queryClient = useQueryClient();

    const onboardingMutation = useMutation({
        mutationFn: async (onboardingData: Onboarding) => {
            const response = await apiRequest.post<Onboarding>("/onboarding", onboardingData)
            return response
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me']})
            router.push("/dashboard")
            console.log(data)
        },
        onError: (error) => {
            console.error("Onboarding failed", error.message)
        }
})
    const [counter, setCounter] = useState(0);

    // const steps = [StepCurrentRole,StepTargetRole, StepWeeklyHours, StepTimeline];

    const Step: (keyof Onboarding)[] = ["currentRole", "targetRole","weeklyHours", "targetMonths"];

    const LAST_STEP = Step.length - 1;

    const handleNext = async () => {
        const isValid = await trigger(Step[counter])
        if (isValid){
            setCounter((count) => count + 1)
        }
    }

    const handlePrev = () => {
        setCounter ((count) => count - 1)
    }

    // submit to POST /onboarding
    const formSubmit = (data: Onboarding) => {
        if (counter === 3){
            onboardingMutation.mutate(data)
            console.log(data)
        }

    }

    if (onboardingMutation.isPending){
        return (
            <>
            <Spinner/>
            <h2>Building your personalised roadmap...</h2>
            <h3> This will take about 30 seconds.</h3>
            </>
        )
    }

    return (
        <>
        <form onSubmit={handleSubmit(formSubmit)}>
            <Card>
                {counter === 0 && <StepCurrentRole ctrl={control} />}
                {counter === 1 && <StepTargetRole ctrl={control}/>}
                {counter === 2 && <StepWeeklyHours ctrl={control}/>}
                {counter === 3 && <StepTimeline ctrl={control}/>}
                {counter > 0 && <Button type="button" onClick={handlePrev}>Prev</Button>}
                {counter < LAST_STEP && <Button type="button" onClick={handleNext}>Next</Button>}
                {counter === LAST_STEP && <Button type="submit">Submit</Button>}
            </Card>
        </form>
        </>
    )
}