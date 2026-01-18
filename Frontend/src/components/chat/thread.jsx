import { useState } from "react";
import { deleteThread } from "../../api/chatApi.js";

export default function Thread({ thread, onSelect, isSelected, loadThreads, setSelectedThread }) {
    const [isDeleting, setIsDeleting] = useState(false); 

    async function handleDeleteThread(threadId, event) {
        event.stopPropagation();
        setIsDeleting(true);
        try {
            await deleteThread(threadId);
            await loadThreads();
            setSelectedThread(null);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div
            className={`thread ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="thread-btn">
                <h4>{thread.title}</h4>
                <span 
                    onClick={(event) => handleDeleteThread(thread._id, event)} 
                    className="deleteThread"
                >
                    {isDeleting ? (
                        <span className="delete-loader"></span>
                    ) : (
                        <i className="fa-solid fa-trash"></i>
                    )}
                </span>
            </div>
            <p>{thread.messages?.[0]?.content || 'No messages yet'}</p>
        </div>
    );
}
