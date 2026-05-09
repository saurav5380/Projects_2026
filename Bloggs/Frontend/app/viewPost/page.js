'use client'

import { useContext, useState, useEffect } from 'react';
import useAuth from '@/context/authContext';


const ViewPosts = () => {
    const [post, setPost] = useState([]);
    const userContext = useContext(useAuth);
    const userId = userData.id;
    useEffect(() => {
        const data = fetch("http://localhost:3001/posts/user/my-posts", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(token)}`
            }
        }).then(response => response.json);
        setPost(data);
    }, []);
    
    return(
        <>
        <div className="max-w-3/4 max-h-3/4 border border-gray-500 rounded-lg">
            {post.length > 0 ? (
                post.map((element) => (
                <div key={element.id} className='border border-gray-500 rounded-lg m-4 p-4'>
                    <h2>{element.title}</h2>
                    <p>{element.meta_description}</p>
                    <span>{element.status}</span>
                </div>
                ))
                ) : (<p>No Posts found</p>)
                 
            }
        </div>
        </>
    )
}

export default ViewPosts;