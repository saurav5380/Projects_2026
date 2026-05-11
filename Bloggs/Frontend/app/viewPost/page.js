'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';


const ViewPosts = () => {
    const [post, setPost] = useState([]);
    const { user } = useAuth();
    const userId = user?.id;
    const router = useRouter();
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch("http://localhost:3001/posts/user/my-posts", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setPost(data);
        };
        fetchPosts();
        }, []);
    
    const handleClick = () => {
        router.push("/newPost");
    }
    return(
        <>
        
        <div className=" font-sans min-h-screen min-w-screen bg-linear-to-r from-slate-500 to-slate-800">
            <h2 className="font-bold text-3xl text-left p-6 m-4 text-gray-800">Bloggs</h2>
            <div className='flex-column items-center justify-center'>
            <div className='max-w-1/6 border-2 border-gray-500 m-auto text-center'>User: {user?.name} UserId: {userId}</div>
            <div className="max-w-3/4 max-h-3/4 border border-gray-500 rounded-lg m-auto mt-6 ">
                {post.length > 0 ? (
                    post.map((element) => (
                    <div key={element.id} className='border border-gray-500 rounded-lg m-4 p-4'>
                        <h2>{element.title}</h2>
                        <p>{element.meta_description}</p>
                        <span>{element.status}</span>
                    </div>
                    ))
                    ) : (<p className='text-center font-bold'>No Posts found</p>)
                    
                }
            </div>
            <button onClick={handleClick} className="bg-slate-400 w-sm p-2 border text-gray-700 rounded-lg cursor-pointer">Create New Post</button>
            </div>
        </div>        
        </>
    )
}

export default ViewPosts;