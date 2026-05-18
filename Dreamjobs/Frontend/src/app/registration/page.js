"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Registration = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    // const [error, setError] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (password!==confirmPassword){
            throw new Error("passwords do not match")
        }
        const response = await fetch("http://localhost:3000/api/register",{
                                    method: "POST",
                                    headers: {"Content-Type":"application/json"},
                                    body: JSON.stringify({
                                        username:username,
                                        password:password,
                                        email:email,
                                        role: role
                                    })
                                    })
        
        if (!response.ok){
            throw new Error("Network error")
        }
        const result = await response.json();
        console.log(result);    
    }
    
    return (
        <>
        <div className="flex flex-col justify-center align-center items-center max-w-md m-auto">
            <Image alt="dream jobs circular icon" width={128} height={128} src={"/DJ_icon_round.png"} loading="eager"/>
            <h2>Create your workspace</h2>
            <form className="flex flex-col gap-2 mt-6" onSubmit={handleFormSubmit}>
              <input placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} className="text-center bg-[#4d4d50] rounded-lg p-2"/>
              <input placeholder="Email"  type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-center bg-[#4d4d50] rounded-lg p-2"/>
              <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-center bg-[#4d4d50] rounded-lg p-2"/>
              <input placeholder="Confirm Password" type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="text-center bg-[#4d4d50] rounded-lg p-2"/>
              <select name="role" id="role" value={role} defaultValue={""} onChange={(e) => setRole(e.target.value)} className="text-center text-[#9393a6] bg-[#4d4d50] rounded-lg p-2">
                <option>Select the role</option>
                <option value={"company"}>company</option>
                <option value={"candidate"}>candidate</option>
              </select>

              <button className="bg-[#4d4d50] text-[#9393a6] rounded-lg max-w-36 m-auto pl-10 pr-10" type="submit">Submit</button>
              <p className="text-center text-sm">By signing up, you agree to our <Link href={"/terms"} className="underline text-amber-50">Terms of Service</Link> and <Link href={"/agreement"} className="underline text-amber-50">Data Processing Agreement</Link></p>
              <p className="text-center text-sm">Already have an account? <Link href={"/login"} className="underline text-amber-50">Login</Link></p>             
            </form>
        </div>
        </>
     )
}

export default Registration;