"use client"

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import BodyStats from "./steps/BodyStats";
import ActivityLevel from "./steps/ActivityLevel";
import DietaryPreferences from "./steps/DietaryPreferences";
import WorkoutPreferences from "./steps/WorkoutPreferences";
import FitnessGoal from "./steps/FitnessGoal";
import { UserActivityLevel, UserBodyStats, UserDietaryPreferences, UserFitnessGoal, UserWorkoutPreferences } from "@/utils/types";

const Registration = () => {
    const [step, setStep] = useState<number>(1);
    const [userData, setUserData] = useState<{
        bodyStats: UserBodyStats;
        fitnessGoal:UserFitnessGoal,
        activityLevel:UserActivityLevel,
        workoutPreferences:UserWorkoutPreferences,
        dietaryPreferences:UserDietaryPreferences
    }>({
         bodyStats: {} as UserBodyStats,
         fitnessGoal: {} as UserFitnessGoal,
         activityLevel: {} as UserActivityLevel,
         workoutPreferences: {} as UserWorkoutPreferences,
         dietaryPreferences: {} as UserDietaryPreferences
    })

    const handleBodyStatsUpdate = (data: UserBodyStats) => {
        setUserData(prev => ({ ...prev, bodyStats: data }));
        setStep(2);
    }

    return (
        <>
         <div className="bg-[linear-gradient(135deg,#0F0F0F_0%,#1A1A2E_100%)] w-full min-h-screen">
           
        <Breadcrumb className="mt-2 ml-6 text-[#FF6B35] cursor-pointer">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink className="text-zinc-50 hover:text-[#FF6B35]">Body Stats</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                <BreadcrumbLink className="text-zinc-50 hover:text-[#FF6B35]">Fitness Goal</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                <BreadcrumbLink className="text-zinc-50 hover:text-[#FF6B35]">Activity Level</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                <BreadcrumbLink className="text-zinc-50 hover:text-[#FF6B35]">Workout Preferences</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                <BreadcrumbLink className="text-zinc-50 hover:text-[#FF6B35]">Dietary Preferences</BreadcrumbLink>
                </BreadcrumbItem>
               
            </BreadcrumbList>
        </Breadcrumb>

       
       
        <div className="w-full">
            {step === 1 && <BodyStats userData={userData.bodyStats} onUpdate={handleBodyStatsUpdate}/>}
        </div>
       
        
         </div>
        </>
    )
}

export default Registration;


 // background: linear-gradient(135deg, #0F0F0F 0%, #1A1A2E 100%)