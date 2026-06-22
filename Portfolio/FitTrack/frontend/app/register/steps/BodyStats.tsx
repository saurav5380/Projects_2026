import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { UserBodyStats } from "@/utils/types";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const bodyStatsSchema = z.object({
    age: z.coerce.number({error: "Age is required"})
        .int({error: "Age must be a whole number"})
        .min(18, {error: "Age must be at least 18"})
        .max(100, {error: "Age must be at most 100"}),
    gender: z.enum(["male", "female"], {error: "Gender must be 'male' or 'female'"}),
    height: z.coerce.number({error: "Height is required"})
        .min(50, {error: "Height must be at least 50cm"})
        .max(300, {error: "Height must be at most 300cm"}),
    weight: z.coerce.number({error: "Weight is required"})
        .min(20, {error: "Weight must be at least 20kg"})
        .max(500, {error: "Weight must be at most 500kg"}),
    bodyFatPercentage: z.coerce.number({error: "Body fat percentage is required"})
        .min(0, {error: "Body fat percentage cannot be negative"})
        .max(100, {error: "Body fat percentage cannot exceed 100"})
});

type BodyStatsFormInput = z.input<typeof bodyStatsSchema>;

type BodyStatsProps = {
    userData: UserBodyStats;
    onUpdate: (data: UserBodyStats) => void;
}

const BodyStats = ({ userData, onUpdate }: BodyStatsProps) => {
    const {register, handleSubmit, formState: {errors}} = useForm<BodyStatsFormInput, unknown, UserBodyStats>({
        resolver: zodResolver(bodyStatsSchema),
        defaultValues: userData
    });

    const formSubmit: SubmitHandler<UserBodyStats> = (data) => {
        onUpdate(data);
    }

    return (
        <>

        <form onSubmit={handleSubmit(formSubmit)}>
            <div className="flex flex-col gap-2 mx-auto w-96 justify-center items-center mt-6">
            <Field>
                <Input {...register("age")} type="text" placeholder="Enter Age" className="px-8 py-1 border rounded-md border-gray-500"/>
                <FieldError errors={errors.age ? [errors.age] : undefined}/>
            </Field>
            <Field>
                <Input {...register("gender")} type="text" placeholder="Enter Gender" className="px-8 py-1 border rounded-md border-gray-500"/>
                <FieldError errors={errors.gender ? [errors.gender] : undefined}/>
            </Field>
            <Field>
                <Input {...register("height")} type="text" placeholder="Enter Height(cm)" className="px-8 py-1 border rounded-md border-gray-500"/>
                <FieldError errors={errors.height ? [errors.height] : undefined}/>
            </Field>
            <Field>
                <Input {...register("weight")} type="text" placeholder="Enter Weight(kg)" className="px-8 py-1 border rounded-md border-gray-500"/>
                <FieldError errors={errors.weight ? [errors.weight] : undefined}/>
            </Field>
            <Field>
                <Input {...register("bodyFatPercentage")} type="text" placeholder="Enter Body Fat Percentage" className="px-8 py-1 border rounded-md border-gray-500"/>
                <FieldError errors={errors.bodyFatPercentage ? [errors.bodyFatPercentage] : undefined}/>
            </Field>
            <Button>Submit</Button>
            </div>

        </form>
        </>
    )
}

export default BodyStats;