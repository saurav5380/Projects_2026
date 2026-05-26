"use client"
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const Newjob = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!description.trim()) return setError("Job description is empty");

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/jobs", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, category, location, job_type: jobType })
            });

            if (response.ok) {
                alert("New Job Post created");
                setTitle("");
                setDescription("");
                setCategory("");
                setLocation("");
                setJobType("");
            } else {
                const result = await response.json();
                setError(result.message || "Failed to create job post");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Error creating job post: ", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <input
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    placeholder="Category (e.g. Engineering)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
                    <option value="" disabled>Select Job Type</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="remote">Remote</option>
                </select>
                <ReactQuill theme='snow' value={description} onChange={setDescription} />
                {error && <p>{error}</p>}
                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save to Database"}
                </button>
            </form>
        </>
    )
}

export default Newjob;
