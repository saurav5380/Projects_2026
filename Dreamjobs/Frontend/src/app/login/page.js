"use client"

import { useState } from "react";
import Image from "next/image";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/api/login",{
                                    method: "POST",
                                    headers: {"Content-Type":"application/json"},
                                    body: JSON.stringify({
                                        email:email,
                                        password:password
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
        <div className="mt-6 ml-6">
            <Image alt="dream-jobs dark logo" width={360} height={180} src={"/DJ_Dark_logo.png"} loading="eager"/>
            <div className="border border-[#f7ef8a] mt-2"></div>
        </div>
        <div className="flex flex-col justify-center align-center items-center max-w-md m-auto">
            <Image alt="dream-jobs circular icon" width={128} height={128} src={"/DJ_icon_round.png"} loading="eager"/>
            <h2>Sign-in to your workspace</h2>
            <form className="flex flex-col gap-2 mt-6" onSubmit={handleFormSubmit}>
              <input placeholder="Email"  type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-center bg-[#4d4d50] rounded-lg p-2"/>
              <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-center bg-[#4d4d50] rounded-lg p-2"/>
              <button className="bg-[#4d4d50] text-[#9393a6] rounded-lg max-w-36 m-auto pl-10 pr-10" type="submit">Submit</button>
            </form>
        </div>
        </>
     )
}

export default Login;