import { createContext, useContext, useState, useEffect } from 'react';
import { threads, showThreadMessage, chatMessage } from "../api/chatApi";
import { DEFAULT_TEXT_MODEL, GROQ_MODELS } from "../constants/chatModels";

// Shared chat state for the whole app.
const ChatContext = createContext();

// Convenience hook so components can read chat context.
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [threadList, setThreadList] = useState([]);
    const [user, setUser] = useState({});
    const [selectedThread, setSelectedThread] = useState(null); // { _id, title, messages: [] }
    const [threadContext, setThreadContext] = useState({}); // Cache messages by thread id for quick access. like { threadId1: [msg1, msg2], threadId2: [msg3, msg4] }
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(DEFAULT_TEXT_MODEL);

    // Fetch sidebar threads and current user.
    const loadThreads = async () => {
        try {
            const result = await threads();
            setThreadList(result.data?.data || []);
            setUser(result.data?.user || {});
        } catch (error) {
            console.error("Failed to load threads:", error);
        }
    };

    // Load initial data once when provider mounts.
    useEffect(() => {
        loadThreads();
    }, []);

    // On thread click, load its full message history.
    const handleThreadSelect = async (thread) => {
        setIsLoading(true);
        try {
            const res = await showThreadMessage(thread._id);
            const messages = res.data.data.messages || [];

            // Cache messages by thread id.
            setThreadContext(prev => ({
                ...prev,
                [thread._id]: messages,
            }));
            // Update selected thread with messages for easy access. like :{threadId, title, messages: []}
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

    // Message flow: optimistic update first, then sync with backend result.
    const handleSendMessage = async ({ messageInput = "", imageFile = null } = {}) => {
        if (!selectedThread) return;

        const trimmedMessage = messageInput.trim();
        if (!trimmedMessage && !imageFile) return;

        setIsLoading(true);
        const threadId = selectedThread._id;

        const userMessage = {
            role: "user",
            content: trimmedMessage || "[Image uploaded]",
            timestamp: new Date().toISOString(),
        };

        // Step 1: append the user message in cached thread messages.
        setThreadContext(prev => ({
            ...prev,
            [threadId]: [...(prev[threadId] || []), userMessage],
        }));

        // Step 2: mirror optimistic message in selected thread panel.
        setSelectedThread(prev => ({
            ...prev,
            messages: [...(prev.messages || []), userMessage],
        }));

        try {
            await chatMessage(threadId, {
                userMessage: trimmedMessage,
                model: selectedModel,
                imageFile,
            });

            const res = await showThreadMessage(threadId);
            const backendMessages = res.data.data.messages || [];

            // Step 3: replace optimistic state with backend source of truth.
            setThreadContext(prev => ({
                ...prev,
                [threadId]: backendMessages,
            }));

            setSelectedThread(prev => ({
                ...prev,
                messages: backendMessages,
            }));
        } catch (error) {
            console.error("Failed to send message:", error);
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
            selectedModel,
            setSelectedModel,
            modelOptions: GROQ_MODELS,
            loadThreads,
            handleThreadSelect,
            handleSendMessage,
            setSelectedThread
        }}>
            {children}
        </ChatContext.Provider>
    );
};
