// /api/userApi.js
import axios from "axios";

const API_BASE = "https://chatterai-backend.onrender.com/api/chat"; // set your backend base URL here if needed

const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // send cookies for auth
    headers: {
        "Content-Type": "application/json",
    },
});

// all threads of a user
export function threads() {
    return axiosInstance.get("/");
}

// create new thread
export function newThread(title) {
    return axiosInstance.post("/new", { title });
}

// Show messages in a specific thread
export function showThreadMessage(threadId) {
    return axiosInstance.get(`/${threadId}`);
}

// Send a chat message to a specific thread
export function chatMessage(threadId, userMessage) {
    return axiosInstance.post(`/${threadId}/message`, { userMessage });
}

//delete thread 
export function deleteThread(threadId) {
    return axiosInstance.delete(`/${threadId}`);
}