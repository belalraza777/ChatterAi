import React, { useEffect, useState } from 'react'
import { newThread } from "../../api/chatApi.js";  
import './newThread.css';

export default function NewThread({ setSelectedThread, loadThreads }) {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        setShowForm(false);
        setTitle("");
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true); // start loader
        try {
            const newth = await newThread(title);
            setSelectedThread(newth.data.data);
            await loadThreads();
            setShowForm(false);
            setTitle("");
        } finally {
            setLoading(false); // stop loader
        }
    }

    return(
        <div className="new-thread-container">
            {showForm ? (
                <form onSubmit={handleSubmit} className="new-thread-form">
                    <input
                        type="text"
                        placeholder="New Chat title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        disabled={loading} 
                    />
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => setShowForm(false)}
                            disabled={loading} 
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={!title.trim() || loading}>
                            {loading ? <span className="loader"></span> : "Create"}
                        </button>
                    </div>
                </form>
            ) : (
                <button 
                    className="new-thread-button"
                    onClick={() => setShowForm(true)}
                >
                    + New Chat
                </button>
            )}
        </div>
    )
}
