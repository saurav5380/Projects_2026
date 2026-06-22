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
        <Breadcrumb className="mt-2 ml-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbPage>Body Stats</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                <BreadcrumbLink>Fitness Goal</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                <BreadcrumbLink>Activity Level</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                <BreadcrumbLink>Workout Preferences</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                <BreadcrumbLink>Dietary Preferences</BreadcrumbLink>
                </BreadcrumbItem>
               
            </BreadcrumbList>
        </Breadcrumb>

       
       
        <div className="w-full">
            {step === 1 && <BodyStats userData={userData.bodyStats} onUpdate={handleBodyStatsUpdate}/>}
        </div>
       
        
         
        </>
    )
}

export default Registration;
