// /api/userApi.js
import axios from "axios";

// Use only VITE_API_BASE_URL from .env, fallback to root, and prepend /api/user in calls
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

// Signup user
export function signup(username, email, password) {
  return axiosInstance.post("/api/user/signup", { username, email, password });
}

// Login user
export function login(email, password) {
  return axiosInstance.post("/api/user/login", { email, password });
}

// Logout user
export function logout() {
  return axiosInstance.get("/api/user/logout");
}
