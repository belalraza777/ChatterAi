import { useEffect, useState } from 'react';
import './chat.css';
import { threads, showThreadMessage, chatMessage } from "../../api/chatApi.js";
import SelectedThread from './selectedThread.jsx';
import MessageBox from './messageBox.jsx';
import Sidebar from './sideBar.jsx';
import Loader from './loader.jsx';

export default function Chat() {
    // Initialize component state
    const [threadList, setThreadList] = useState([]); // Stores all chat threads
    const [user, setUser] = useState({}); // Stores current user data
    const [selectedThread, setSelectedThread] = useState(null); // Currently active chat
    const [isLoading, setIsLoading] = useState(false); // Loading state for messages

    // Fetch all chat threads for the current user
    async function loadThreads() {
        try {
            const result = await threads();
            setThreadList(result.data?.data || []); // Update thread list
            setUser(result.data?.user || {}); // Update user info
        } catch (error) {
            console.error("Failed to load threads:", error);
        }
    }

    // Load threads when component mounts
    useEffect(() => {
        loadThreads();
    }, []);

    // Handle sending a new message
    async function handleSendMessage(messageInput) {
        if (!messageInput.trim()) return; // Ignore empty messages

        setIsLoading(true); // Show loading indicator

        // Optimistically update UI with user's message
        setSelectedThread(prev => ({
            ...prev,
            messages: [
                ...(prev.messages || []),
                {
                    role: "user",
                    content: messageInput,
                    timestamp: new Date().toISOString(),
                }
            ]
        }));

        try {
            // Send message to backend
            await chatMessage(selectedThread._id, messageInput);
            // Refresh thread with latest messages
            const res = await showThreadMessage(selectedThread._id);
            setSelectedThread(res.data.data);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    }

    return (
        <div className="chat-app">
            {/* Left sidebar with chat list */}
            <Sidebar
                user={user}
                threadList={threadList}
                selectedThread={selectedThread}
                setSelectedThread={setSelectedThread}
                loadThreads={loadThreads}
            />

            {/* Main chat area */}
            <div className="chat-area">
                {selectedThread ? (
                    // If a thread is selected, show messages
                    <>
                        <SelectedThread thread={selectedThread} />
                        {/* Show loading indicator when waiting for response */}
                        {isLoading && <Loader />}
                        {/* Message input box */}
                        <MessageBox onSend={handleSendMessage} />
                    </>
                ) : (
                    // If no thread selected, show prompt
                    <div className="empty-thread">
                        <h2>📂 No thread selected</h2>
                        <p>Select a conversation from the sidebar or start a new one.</p>
                    </div>
                )}
            </div>
        </div>
    )
}