'use client'

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Registration() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleForm = (e) => {
        e.preventDefault();
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    const handleClick = async (e) => {
       e.preventDefault();
       try{
        if (password !== confirmPassword){
            alert("Passwords do not match!")
            return
        }
        const response = await fetch("http://localhost:3001/auth/registration", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, email, password})
        });
        const data = await response.json();

        if (!response.ok){
            alert(data.error || data.message || "Registration failed")
            return
        }
        alert("Registration successful!");
        router.push("/login");
       }
       catch(err){
        console.error("Error occurred: ", err);
        // alert("Network error. Please try again.");
       }
    }

    return (
        <>
        <div className=" font-sans min-h-screen min-w-screen bg-linear-to-r from-slate-500 to-slate-800">
        <form onSubmit={handleForm}>
            <h2 className="font-bold text-3xl text-left p-6 m-4 text-gray-800">Bloggs</h2>
            <div className="flex flex-col text-xl p-6 min-h-96 max-w-3xl m-auto justify-center items-center">
            <input type="text" value={name} name="userName" placeholder="Name" onChange={handleNameChange} className="w-lg p-2 m-2  border border-gray-800 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500"></input>
            <input type="email" value={email} name="userEmail" placeholder="Email" className="w-lg p-2 m-2  border border-gray-800 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500" onChange={handleEmailChange}></input>
            <input type="password" value={password} name="userPassword" placeholder="Password" className="w-lg p-2 m-2  border border-gray-800 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500" onChange={handlePasswordChange}></input>
            <input type="text" value={confirmPassword} name="userConfirmPassword" placeholder="Confirm Password" className="w-lg p-2 m-2  border border-gray-800 rounded-lg bg-gray-900 placeholder-gray-500 text-gray-500" onChange={handleConfirmPasswordChange}></input>
            <button type="submit" className="bg-slate-400 w-sm p-2 m-2 border text-gray-700 rounded-lg cursor-pointer" onClick={handleClick}>Register</button>
            </div>
            <div className="border border-gray-400 mt-6"></div>
            <footer className="mt-8  pt-6">
                <p className="mb-4 text-center text-gray-400">All Rights Reserved <span className="text-gray-400">&copy; 2026</span></p>
                <div className="flex items-center justify-center gap-6">
                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                        <Image className="block invert-75" width={32} height={32} src="/instagram.svg" alt="instagram" />
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                        <Image className="block invert-75" width={32} height={32} src="/facebook.svg" alt="facebook" />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                        <Image className="block invert-75" width={32} height={32} src="/linkedin.svg" alt="linkedin" />
                    </a>
                </div>
            </footer>
        </form>
        </div>
        </>
    )
}

