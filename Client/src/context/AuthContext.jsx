// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to handle token refreshing
  const refreshToken = async () => {
    try {
      // Make sure credentials are included
      await axios.post('/auth/refresh-token', {}, {
        withCredentials: true
      });

      // If token refresh was successful, get user data
      const userData = await axios.get('/users/me', {
        withCredentials: true
      });

      setUser(userData.data);
      return true; // Return success
    } catch (error) {
      console.error("Token refresh failed:", error);
      setUser(null);

      // Only navigate to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        navigate('/login', { replace: true });
      }

      return false; // Return failure
    }
  };

  // Axios interceptor for 401 errors
  useEffect(() => {
    const id = axios.interceptors.response.use(
      res => res,
      async err => {
        const originalReq = err.config;

        if (err.response?.status === 401 && !originalReq._retry) {
          if (originalReq.url.includes('/auth/refresh-token')) {
            setUser(null);
            navigate('/login', { replace: true });
            return Promise.reject(err);
          }

          originalReq._retry = true;
          try {
            const success = await refreshToken();
            if (success) {
              return axios(originalReq);
            } else {
              return Promise.reject(err);
            }
          } catch (error) {
            setUser(null);
            navigate('/login', { replace: true });
            return Promise.reject(err);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [navigate]);

  // Initial whoami
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/users/me', { withCredentials: true });
        setUser(data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Try to refresh token
          await refreshToken();
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Set up token refresh interval (every 45 minutes)
  useEffect(() => {
    const interval = setInterval(refreshToken, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Login function for use after registration
  const login = async (email, password) => {
    try {
      // Post to login endpoint
      await axios.post('/auth/login', { email, password }, { withCredentials: true });
      // Fetch user info
      const { data } = await axios.get('/users/me', { withCredentials: true });
      setUser(data);
      return { success: true };
    } catch (err) {
      setUser(null);
      return { success: false, error: err.response?.data?.msg || 'Login failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if logout fails on server, clear user locally
      setUser(null);
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};