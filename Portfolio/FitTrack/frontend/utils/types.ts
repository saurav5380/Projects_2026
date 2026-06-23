type Gender = "male" | "female"

export type UserBodyStats = {
    age: number,
    gender: Gender,
    height: number,
    weight: number,
    bodyFatPercentage: number
};

export type UserFitnessGoal = "Lose Weight" | "Build Muscle" |  "Improve Endurance" 

export type UserActivityLevel = "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active";

type WorkoutDaysPerWeek = 3 | 4 | 5;

type Duration = 30 | 45 | 60;

type Equipment = "Home" | "No Equipment" | "Home with Dumbbells" | "Gym Membership";

export type UserWorkoutPreferences = {
    workoutDaysPerWeek: WorkoutDaysPerWeek,
    preferredWorkoutDuration: Duration,
    workoutEquipment: Equipment,
}


type Diet = "None" | "Omnivore" | "Vegetarian" | "Vegan" | "Keto";

export type UserDietaryPreferences = {
    dietaryType: Diet,
    allergy: string,
    cuisinePreference: string
}


