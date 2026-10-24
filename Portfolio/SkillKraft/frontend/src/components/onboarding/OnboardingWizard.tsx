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
import { toast } from "sonner";
import { AxiosError, isAxiosError } from "axios";
import type { ApiSuccess, OnboardingResult } from "../../app/types/api.types";

export const OnboardingWizard = () => {
    const {handleSubmit, trigger, control} = useForm<Onboarding>({
        resolver: zodResolver(OnboardingSchema),
        defaultValues: {currentRole: "", targetRole: "", weeklyHours: 2, targetMonths: 3}

    })

    const router = useRouter();
    const queryClient = useQueryClient();

    const onboardingMutation = useMutation({
        mutationFn: async (onboardingData: Onboarding) => {
            const response = await apiRequest.post<ApiSuccess<OnboardingResult>>("/onboarding", onboardingData)
            return response
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['user', 'me']})
            router.push("/dashboard")
            console.log(data)
        },
        onError: (error: AxiosError<{ error?: { message?: string } }>) => {
            if (error.response?.status === 409){
                router.push("/dashboard")
            }
            if (isAxiosError(error)){
            console.error("Onboarding failed", error.response?.data?.error?.message ?? error.message)
            toast.error(`Onboarding failed: ${error.message}`)
        }}
})
    const [counter, setCounter] = useState(0);


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
        onboardingMutation.mutate(data)
        // console.log(data)
    }

    const handleFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (counter < LAST_STEP){
            handleNext()
            return
        }
        handleSubmit(formSubmit)(e)
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
        <form onSubmit={handleFormSubmit}>
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