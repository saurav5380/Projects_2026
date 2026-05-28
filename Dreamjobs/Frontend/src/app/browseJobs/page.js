"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const Browsejobs = () => {
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async() => {
            try{
            const response = await fetch(`${API_BASE_URL}/api/jobs`)
            if (!response.ok){
                throw new Error ("failed to fetch data")
            }
            const data = await response.json();
            setJobs(data);
            console.log(data);
            }
            catch(error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchData();
    },[])

    return (
        <>
        <nav className='flex items-center justify-between ml-4 mr-16 p-2'>
            <Image alt='dreamjobs logo' src={'/DJ_Dark_logo.png'} height={240} width={240} className='mt-4' style={{height:'auto'}}/>
            <div className='flex justify-evenly mt-4 gap-4'>
                <button className='hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[#6f3db4]'>Log In</button>
                <button className='hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[#6f3db4]'>Find jobs</button>
                <button className='hover:cursor-pointer hover:underline hover:underline-offset-4 hover:decoration-[#6f3db4]'>Hire talent</button>
            </div>
        </nav>   
        <div className='border border-[#896ae8] w-full'></div>
        <h1 className='text-5xl font-extrabold mt-6 ml-6'>Remote Jobs</h1>
        <div className='flex'>
            <div className='ml-6'>
                <p className='max-w-3/4 mt-4'>Discover your dream remote job on Dreamjobs.
                Speed up your job search to find roles that match your skills and time zone.
                Get noticed by leading companies and startups worldwide.
                Land a high-paying remote job or freelance gig faster with Dreamjobs!</p>
                <div className='flex justify-start items-center gap-20'>
                    <button className='mt-16 p-4 border border-[#896ae8] rounded-md hover:bg-[#6f3db4] hover:border-[#4212d4] hover:transition-all'>Hire talent</button>
                    <button className='mt-16 p-4 border border-[#896ae8] rounded-md hover:bg-[#6f3db4] hover:border-[#4212d4] hover:transition-all'>Find jobs</button>
                </div>
            </div>
            <Image alt='remote developer' src={'/remote_developer.png'} height={400} width={400} loading='eager' className='mr-6 gap-24' style={{height:'auto'}}/>
        </div>
        <div>
            <h2 className='ml-6 font-bold text-3xl'>Featured Jobs exclusively on Dreamjobs</h2>
            <p className='ml-6 mt-4'>Explore opportunities from top companies actively hiring now. 
                Our team supports you during the process, ensuring you stand out to our network of top startups and tech companies.</p>
        </div>
        <div>

        </div>

        </>
    )
}

export default Browsejobs;
