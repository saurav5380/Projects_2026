"use client"

import { useState } from 'react';

const CompanyProfile = () => {

    const API_BASE_URL = "http://localhost:3001"

    const [loading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("companyLogo", e.target.companyLogo.files[0]);
            const response = await fetch(`${API_BASE_URL}/api/companies/profile`, {
                method: 'PATCH',
                body: formData
            })
            
            if (!response.ok) {
                throw new Error(`upload failed: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Upload successful: ${data}`);

        }
        catch (error) {
            console.error("Error: ", error)
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center">
                <form onSubmit={handleFormSubmit}>
                    <input type="file" name="companyLogo" accept="image/*" required className="border border-[#fffeff] rounded-lg p-2 mt-4 mx-5" />
                    <button type="submit" className="border rounded-lg p-2 mt-4 mx-5 border-[#ffffff]">{loading ? 'Uploading...' : 'Upload Logo'}</button>
                </form>
            </div>
        </>
    )
}

export default CompanyProfile;