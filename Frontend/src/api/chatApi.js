// /api/userApi.js
import axios from "axios";

// Production-ready: dynamic API base URL (root only), fallback, and error handling
let API_BASE = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE) {
    API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://chatterai-backend.onrender.com';
}

const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // You can customize error handling here (e.g., show toast, redirect, etc.)
        return Promise.reject(error);
    }
);

// all threads of a user
export function threads() {
    return axiosInstance.get("/api/chat/");
}

// create new thread
export function newThread(title) {
    return axiosInstance.post("/api/chat/new", { title });
}

// Show messages in a specific thread
export function showThreadMessage(threadId) {
    return axiosInstance.get(`/api/chat/${threadId}`);
}

// Send a chat message to a specific thread
export function chatMessage(threadId, userMessage) {
    return axiosInstance.post(`/api/chat/${threadId}/message`, { userMessage });
}

//delete thread 
export function deleteThread(threadId) {
    return axiosInstance.delete(`/api/chat/${threadId}`);
}