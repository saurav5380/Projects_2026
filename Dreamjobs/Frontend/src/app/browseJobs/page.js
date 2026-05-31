"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const Browsejobs = () => {
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [jobs, setJobs] = useState([]);
    // const [error, setError] = useState("");
    // const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({totalPages: 1, hasNextPage: false, hasPreviousPage: false })


    const words = ["Full-time", "Hybrid", "Remote"];
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true); 
    
    useEffect(() =>{
        const interval = setInterval(()=>{
            setVisible(false);
            setTimeout(() =>{
                setIndex(prev => (prev+1) % words.length)
                setVisible(true)
            },300)
        },2000)
        return () => clearInterval(interval)
    },[])

    useEffect(() => {
        const fetchData = async() => {
            try{
            const response = await fetch(`${API_BASE_URL}/api/jobs?page=${page}`)
            if (!response.ok){
                throw new Error ("failed to fetch data")
            }
            const result = await response.json();
            setJobs(result.data);
            setPagination({
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPreviousPage
            });
            setPage(result.currentPage);
            console.log(result.data);
            }
            catch(error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchData();
    },[page])

    const handleJobCategory = (e) =>{
        setCategory(e.target.value)
    }

    const handleJobLocation = (e) =>{
        setLocation(e.target.value)
    }

    const handleJobType = (e) =>{
        setJobType(e.target.value)
    }

    const handleMoveToNextPage = () =>{
        if (!pagination.hasNextPage) return alert("You have reached the end")
        setPage(prev => prev+1)
    }

    const handleMoveToPreviousPage = () =>{
        if (!pagination.hasPreviousPage) return alert("this is the first page")
        setPage(prev => prev-1)
    }

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
        <h1 className='text-5xl font-extrabold mt-6 ml-6'><span style={{transition: 'opacity 1s ease, transform 1s ease'}} className={visible ? 'opacity-100 translate-y-0' : 'opacity-0 trasnlate-y-2'}>
            {words[index]}</span> {"   "} Jobs</h1> 
        <div className='flex'>
            <div className='ml-6'>
                <p className='max-w-3/4 mt-4'>Discover your dream job on Dreamjobs.
                Speed up your job search to find roles that match your skills and time zone.
                Get noticed by leading companies and startups worldwide.
                Land a high-paying full-time, remote job or freelance gig faster with Dreamjobs!</p>
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
        <div className='flex justify-center items-center gap-10'>
            <select name='category' id='category' value={category} onChange={handleJobCategory}
            className='border rounded-lg p-2 mt-4 border-[#896ae8] cursor-pointer hover:cursor-pointer hover:border-[#5b1cda] 
             focus:outline-none focus:outline-[#5b1cda] transition-all'>
                <option value={''} selected disabled>Select Job Category</option>
                <option value={'engineering'}>Engineering</option>
                <option value={'data science'}>Data Science</option>
                <option value={'design'}>Design</option>
                <option value={'marketing'}>Marketing</option>
                <option value={'sales'}>Sales</option>
                <option value={'product'}>Product</option>
                <option value={'finance'}>Finance</option>
                <option value={'hr'}>HR</option>
            </select>

            <select name='location' id='location' value={location} onChange={handleJobLocation} className='border rounded-lg p-2 mt-4 border-[#896ae8] hover:cursor-pointer hover:border-[#5b1cda] transition-all'>
                <option value={''} selected disabled>Select Job Location</option>
                <option value={'new york'}>New york</option>
                <option value={'london'}>London</option>
                <option value={'san francisco'}>San francisco</option>
                <option value={'berlin'}>Berlin</option>
                <option value={'toronto'}>Toronto</option>
                <option value={'bangalore'}>Bangalore</option>
                <option value={'austin'}>Austin</option>
                <option value={'sydney'}>Sydney</option>
                <option value={'singapore'}>Singapore</option>
                <option value={'remote'}>Remote</option>
            </select>

            <select name='job_type' id='job_type' value={jobType} onChange={handleJobType} className='border rounded-lg p-2 mt-4 border-[#896ae8] hover:cursor-pointer hover:border-[#5b1cda] transition-all'>
                <option value={""} selected disabled>Select Job Type</option>
                <option value={'full_time'}>Full time</option>
                <option value={'part_time'}>Part time</option>
                <option value={'remote'}>Remote</option>
            </select>
        </div>
        <div className='flex flex-col justify-center items-center border border-[#896ae8] rounded-lg mt-8 mx-auto w-3/4'>
                {(() => {
                    const filtered = jobs
                        .filter(job => !category || job.category.toLowerCase() === category)
                        .filter(job => !location || job.location.toLowerCase() === location)
                        .filter(job => !jobType || job.job_type.toLowerCase() === jobType);

                    return filtered.length === 0
                        ? <p className='text-gray-400 p-8'>No jobs found for the selected filters.</p>
                        : filtered.map(job => (
                            <ul key={job.id}>
                                <li className='flex flex-col items-start border border-gray-600 p-4 rounded-lg m-4 w-2xl'>
                                    <span className='font-bold text-xl'>{job.title}</span>
                                    <span>{job.description}</span>
                                    <span>Category: {job.category}</span>
                                    <span>Job Type: {job.job_type.split("_").join(" ")}</span>
                                    <span>{job.location}</span>
                                </li>
                            </ul>
                        ));
                })()}
        </div>
        <div className='flex justify-center items-center mt-4 gap-4'>
            <button className='border border-[#896ae8] rounded-md p-2 hover:cursor-pointer hover:border-[#4212d4]'
            onClick={handleMoveToPreviousPage}>Previous</button>
            <button className='border border-[#896ae8] rounded-md p-2 hover:cursor-pointer hover:border-[#4212d4]' 
            onClick={handleMoveToNextPage}>Next</button>
        </div>
        <footer>
            <div className='border border-[#896ae8] w-full mt-2'></div>
            <p className='flex justify-center text-sm mx-auto mt-2'>&copy; 2026 DreamJobs</p>
        </footer>
        </>
    )
}

export default Browsejobs;
