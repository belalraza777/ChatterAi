import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './protectedRoute.css';

// ProtectedRoute: renders children if authenticated, otherwise redirects to /login
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Use dynamic API base URL for production/local
    let API_BASE = import.meta.env.VITE_API_BASE_URL;
    if (!API_BASE) {
      API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://chatterai-backend.onrender.com';
    }
    axios.get(`${API_BASE}/api/user/check`, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      })
      .catch(err => {
        if (err.response?.status === 401) {
          setIsAuthenticated(false);
        }
      })
      .finally(() => setLoading(false));
  }, []);

// while checking auth
  if (loading) return <div className="spinner-container">
    <div className="advanced-spinner"></div></div>;         

  
  if (!isAuthenticated) return <Navigate to="/login" replace />; // redirect if not

  return children; // render protected content
};

export default ProtectedRoute;
