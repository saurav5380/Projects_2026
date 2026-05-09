'use client'

// import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();


    const handleForm = async (e) => {
        e.preventDefault();
        if (!email || !password){
            setError("Email or password is missing");
            return;
        }
        const response = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if (!response.ok){
            setError("Invalid email or password")
        }
        else{
            const data = await response.json();
            login(data.user, data.token);
            router.push("/viewPost")
        }
    }

    
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleNameChange = (e) =>{
        setName(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <>
        <div className="font-sans min-h-screen min-w-screen bg-linear-to-r from-slate-500 to-slate-800">
        <form onSubmit={handleForm} >
            <h2 className="font-bold text-3xl text-left p-6 m-4 text-gray-800">Bloggs</h2>
            <div className="flex flex-col text-xl p-6 min-h-96 max-w-3xl m-auto justify-center items-center">
            <input type="text" value={name} name="userName" placeholder="Name" className="w-lg p-2 m-2  border border-gray-500 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500" onChange={handleNameChange}></input>
            <input type="email" value={email} name="userEmail" placeholder="Email" className="w-lg p-2 m-2  border border-gray-500 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500" onChange={handleEmailChange}></input>
            <input type="password" value={password} name="userPassword" placeholder="Password" className="w-lg p-2 m-2  border border-gray-500 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500" onChange={handlePasswordChange}></input>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="bg-slate-400 w-sm p-2 m-2 border text-gray-700 rounded-lg cursor-pointer">Login</button>
            </div>
            <footer>
                <div className="flex items-center justify-center gap-6">
                    <Link href={"/registration"} className="text-gray-400">Create an Account</Link>
                    <Link href={"/registration"} className="text-gray-400">Forgot Password</Link>
                </div>
                <div className="border border-gray-400 mt-6"></div>
                
            <p className="mb-4 text-center mt-6 text-gray-400">All Rights Reserved <span className="text-gray-400">&copy; 2026</span></p>
            </footer>
        </form>
        </div>
        </>
    )
}

