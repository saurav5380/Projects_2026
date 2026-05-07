'use client'

import { useAuth } from '@/context/authContext';
import { useState } from 'react';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';


const PostEditor = () => {
        const [content, setContent] = useState("");
        return(
            <div className="[&_label]:hidden">
                <SimpleMdeReact
                value={content}
                onChange={setContent}
                options={{
                    autofocus: true,
                    spellChecker: false,
                    lineWrapping: true,
                    placeholder: "Write your post here...",
                    minHeight: "400px",
                    autoDownloadFontAwesome: true,
                    toolbar: [
                        "bold", "italic", "heading", "|",
                        "quote", "unordered-list", "ordered-list", "|",
                        "link", "image", "|",
                        "preview", "fullscreen", "side-by-side", "|",
                        "guide"
                    ],
                    sideBySideFullscreen: false,
                    status: ["lines", "words"],
                }}
                />
            </div>
        )
    }

const handleFormSubmit = (e) => {
    e.preventDefault();
}

const NewPost = () => {
   
    // const { user, login, logout } = useAuth();
    
    
    return (
        <>
        <div className="min-h-screen items-center justify-center text-center min-w-screen bg-linear-to-r from-slate-500 to-slate-800 ">
        <header className='flex justify-between'>
            <h2 className='inline-block font-extrabold text-3xl  text-gray-300 m-6 p-4'>Bloggs</h2>
            <h2 className='inline-block font-bold text-3xl text-gray-300 m-6 p-4'>Welcome Saurav</h2>
        </header>
        <div className='border-2 border-black'></div>
        <div className='min-w-3/4 min-h-5/6 border border-gray-500'>
            <form onSubmit={handleFormSubmit}>
                <PostEditor />
            </form>
        </div>
        </div>
        </>
    )
}

export default NewPost;