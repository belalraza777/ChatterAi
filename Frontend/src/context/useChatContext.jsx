import { createContext, useContext, useState, useEffect } from 'react';
import { threads, showThreadMessage, chatMessage } from "../api/chatApi";

// Create context
const ChatContext = createContext();

// Custom hook for easier access
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [threadList, setThreadList] = useState([]);
    const [user, setUser] = useState({});
    const [selectedThread, setSelectedThread] = useState(null);
    const [threadContext, setThreadContext] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Load all threads
    const loadThreads = async () => {
        try {
            const result = await threads();
            setThreadList(result.data?.data || []);
            setUser(result.data?.user || {});
        } catch (error) {
            console.error("Failed to load threads:", error);
        }
    };

    useEffect(() => {
        loadThreads();
    }, []);

    // Select a thread and load its messages
    const handleThreadSelect = async (thread) => {
        setIsLoading(true);
        try {
            const res = await showThreadMessage(thread._id);
            const messages = res.data.data.messages || [];

            // Save to context
            setThreadContext(prev => ({
                ...prev,
                [thread._id]: messages,
            }));

            setSelectedThread({
                ...res.data.data,
                messages,
            });
        } catch (error) {
            console.error("Failed to load thread messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Send a message
    const handleSendMessage = async (messageInput) => {
        if (!messageInput.trim() || !selectedThread) return;
        setIsLoading(true);
        const threadId = selectedThread._id;

        const userMessage = {
            role: "user",
            content: messageInput,
            timestamp: new Date().toISOString(),
        };

        // Update local context
        setThreadContext(prev => ({
            ...prev,
            [threadId]: [...(prev[threadId] || []), userMessage],
        }));

        // Optimistic UI update
        setSelectedThread(prev => ({
            ...prev,
            messages: [...(prev.messages || []), userMessage],
        }));

        try {
            await chatMessage(threadId, messageInput);
            const res = await showThreadMessage(threadId);
            const backendMessages = res.data.data.messages || [];

            setThreadContext(prev => ({
                ...prev,
                [threadId]: [...(prev[threadId] || []), ...backendMessages],
            }));

            setSelectedThread(prev => ({
                ...prev,
                messages: [...(threadContext[threadId] || []), ...backendMessages],
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatContext.Provider value={{
            threadList,
            user,
            selectedThread,
            threadContext,
            isLoading,
            loadThreads,
            handleThreadSelect,
            handleSendMessage,
            setSelectedThread
        }}>
            {children}
        </ChatContext.Provider>
    );
};
