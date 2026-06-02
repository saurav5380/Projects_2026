"use client"

import { useState, useEffect, use } from 'react';

const getJobsBySlug = async(slug) => {
    const response = await fetch(`http://localhost:3001/api/jobs/${slug}`)
    if (!response.ok) {
        throw new Error("Job not found")
    }
    return response.json();
}



const JobDetail = ({ params }) => {
    const { slug } = use(params);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const jobs = async () => {
           try{
            const data = await getJobsBySlug(slug);
            if(isMounted){ 
                // if user moves to different page before the job detail is loaded then it causes a memory leak
                // therefore using a boolean variable to update state. 
                setJob(data);
            }
            
           }
           catch(error){
            if(isMounted){
                console.error('Failed to fetch job', error)
                if (error.message.includes('404')){
                    setError('Job note found')
                }
                else if(error.message.includes('Failed to fetch')){
                    setError('Network error. Check your connection')
                }
                else{
                    setError(error.message || 'Failed to load job')
                }
            }
           } finally {
                if (isMounted){
                    setLoading(false);
                }
           }
        }
        jobs();
        // cleanup function - when isMounted is false then in the above logic the code sections for rendering the job only work 
        // when isMOunted is true
        return () => {
            isMounted = false;
        };
    },[slug]);

    // Error state
    if (error) {
        return (
        <div className="p-8">
            <p className="text-red-600 font-semibold">{error}</p>
            <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 underline"
            >
            Try Again
            </button>
        </div>
        );
    }

    // Not found state
    if (!job) {
        return (
        <div className="p-8">
            <p>No job data available</p>
        </div>
        );
    }

    // success state
    return (
       <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
      <p className="text-xl text-gray-600 mb-4">{job.company_name}</p>
      <p className="text-gray-500 mb-6">
        {job.location} • {job.job_type}
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p>{job.description}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Requirements</h2>
        <ul className="list-disc ml-6">
          {job.requirements?.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </section>

      <button className="bg-blue-600 text-white px-6 py-3 rounded font-semibold">
        Apply Now
      </button>
    </main>
  );
}

export default JobDetail;
