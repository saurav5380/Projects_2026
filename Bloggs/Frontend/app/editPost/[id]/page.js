'use client'

import { useAuth } from '@/context/authContext';
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const generateSlug = (title) =>
    title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const PostEditor = ({ content, setContent }) => {
    const options = useMemo(() => ({
        autofocus: false,
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
    }), []);

    return (
        <div className="[&_label]:hidden">
            <SimpleMdeReact
            value={content}
            onChange={setContent}
            options={options}
            />
        </div>
    )
}

const EditPost = () => {
    const { user } = useAuth();
    const { id: postId } = useParams();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (response.ok) {
                setTitle(data.title || "");
                setContent(data.content || "");
                setMetaDescription(data.meta_description || "");
                setCoverImageUrl(data.cover_image_url || "");
            }
            setLoading(false);
        };
        fetchPost();
    }, [postId]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    const buildPostBody = (status) => JSON.stringify({
        title,
        slug: generateSlug(title),
        content,
        meta_description: metaDescription,
        cover_image_url: coverImageUrl,
        status,
    });

    const submitPost = async (status) => {
        const response = await fetch(`http://localhost:3001/posts/updatePost/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: buildPostBody(status)
        });
        const data = await response.json();
        if (!response.ok) {
            const reason = data.message || data.error || 'Unknown error';
            const details = data.details ? '\n' + data.details.map(d => d.msg).join('\n') : '';
            console.error('Post update failed:', data);
            alert(`Failed: ${reason}${details}`);
        } else {
            alert(status === 'DRAFT' ? 'Draft saved!' : 'Post published!');
        }
    }

    const handleDraft = () => submitPost('DRAFT');
    const handlePublish = () => submitPost('PUBLISHED');

    return (
        <>
        <div className="min-h-screen min-w-screen bg-linear-to-r from-slate-500 to-slate-800">
        <header className='flex justify-between'>
            <h2 className='inline-block font-extrabold text-3xl text-gray-300 m-6 p-4'>Bloggs</h2>
            <h2 className='inline-block font-bold text-3xl text-gray-300 m-6 p-4'>Welcome {user?.name}</h2>
        </header>
        <div className='border-2 border-black'></div>
        <div className='min-w-3/4 min-h-5/6 border border-gray-500 p-6'>
            <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border border-gray-500 rounded bg-gray-900 text-gray-300 placeholder-gray-500"
                />
                {loading ? <p className="text-gray-400">Loading...</p> : <PostEditor content={content} setContent={setContent} />}
                <input
                    type="text"
                    placeholder="Cover Image URL"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="p-2 border border-gray-500 rounded bg-gray-900 text-gray-300 placeholder-gray-500"
                />
                <textarea
                    placeholder="Meta Description (max 160 characters)"
                    value={metaDescription}
                    maxLength={160}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="p-2 border border-gray-500 rounded bg-gray-900 text-gray-300 placeholder-gray-500 resize-none"
                    rows={3}
                />
            </form>
            <div className='flex justify-center mt-4'>
                <button className='m-4 p-2 border border-gray-500 bg-gray-300 rounded-sm cursor-pointer' onClick={handleDraft}>Save Draft</button>
                <button className='m-4 p-2 border border-gray-500 bg-gray-300 rounded-sm cursor-pointer' onClick={handlePublish}>Publish</button>
            </div>
        </div>
        </div>
        </>
    )
}

export default EditPost;
