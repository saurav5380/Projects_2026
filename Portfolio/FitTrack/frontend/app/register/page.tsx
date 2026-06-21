"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const Registration = () => {
    const [step, setStep] = useState<number>(1);
    
    // type formFields = {
    //     name: string,
    //     email: string,
    //     password:string
    // }

    // const userSchema = z.object({
    //     name: z.string(),
    //     email: z.email(),
    //     password:z.string()
    //         .min(8) 
    //         .max(16)
    //         .refine(val=> val.includes('@'))
    //         .trim()
        
    // })

    // type User = z.infer<typeof userSchema> 
    
    // const {register, handleSubmit, formState: {errors}} = useForm<formFields>();
    // const formSubmit: SubmitHandler<formFields> = (data) => {console.log(data)};
    

    return (
        <>
     {/* <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb> */}
        {/* <form onSubmit={handleSubmit(formSubmit)}> */}
            <div className="flex flex-col w-3/4">
                {/* <input {...register("name")} type="text" name="name" placeholder="Enter name" className="mx-auto mt-2 border rounded-md border-gray-500 px-2"/>
                <input {...register("email")} type="email" name="email" placeholder="Enter email" className="mx-auto mt-2 border rounded-md border-gray-500 px-2"/>
                <input {...register("password")} type="password" name="password" placeholder="Enter password" className="mx-auto mt-2 border rounded-md border-gray-500 px-2"/>
                <button type="submit" className="mx-auto mt-2 border rounded-md border-gray-500 px-2">Submit</button> */}
            </div>
        {/* </form> */}
        
        
        </>
    )
}

export default Registration;
