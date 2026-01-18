// /api/userApi.js
import axios from "axios";

const API_BASE = "https://chatterai-backend.onrender.com/api/user"; // set your backend base URL here if needed

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Signup user
export function signup(username, email, password) {
  return axiosInstance.post("/signup", { username, email, password });
}

// Login user
export function login(email, password) {
  return axiosInstance.post("/login", { email, password });
}

// Logout user
export function logout() {
  return axiosInstance.get("/logout");
}
