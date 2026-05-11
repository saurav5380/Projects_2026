'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


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

    const handleEditPost = (postId) => {
        router.push(`/editPost/${postId}`)
    }

    const handleDeletePost = async (postId) => {
        const response = await fetch(`http://localhost:3001/posts/deletePost/${postId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.ok){
            setPost(post.filter(p => p.id !== postId));
        }
        else{
            alert("Post could not be deleted")
        }
    }

    return(
        <>
        
        <div className=" font-sans min-h-screen min-w-screen bg-linear-to-r from-slate-500 to-slate-800">
            <div className='flex justify-between'>
            <h2 className="inline-block font-bold text-3xl text-left p-6 m-4 text-gray-800 ">Bloggs</h2>
            <div className='inline-block w-48 mr-6 mt-10 text-center text-gray-400 font-bold'>Username: {user?.name}</div>
            </div>
             <div className='border border-gray-900 w-full'></div>
            <div className='w-3/4 h-3/4 m-auto mt-6 flex flex-col items-center'>    
                {post.length > 0 ? (
                    post.map((element) => (
                    <div key={element.id} className='flex-none w-3/7 border border-gray-500 rounded-lg m-2 p-2 text-center'>
                        <h2>{element.title}</h2>
                        <p>Meta Description: {element.meta_description}</p>
                        <span>Status: {element.status}</span>
                        <div className='flex justify-end'>
                            <button className='cursor-pointer' onClick={() => handleEditPost(element.id)}><Image src='/edit-button.png' width={32} height={32} alt='edit'/></button>
                            <button className='cursor-pointer' onClick={() => handleDeletePost(element.id)}><Image src='/trash.png' width={20} height={16} alt='delete'/></button>
                        </div>
                    </div>
                    ))
                    ) : (<p className='text-center font-bold'>No Posts found</p>)
                }
                <button onClick={handleClick} className="bg-slate-400 w-72 p-2 mb-2 border text-gray-700 rounded-lg cursor-pointer">Create New Post</button>                
            </div>
        </div>        
        </>
    )
}

export default ViewPosts;
