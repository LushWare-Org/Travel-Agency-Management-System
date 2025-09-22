// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simple function to check authentication status
  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get('/users/me', { 
        withCredentials: true 
      });
      setUser(data);
      return true;
    } catch (err) {
      // If 401, try refresh token once
      if (err.response?.status === 401) {
        try {
          await axios.post('/auth/refresh-token', {}, { 
            withCredentials: true 
          });
          // If refresh succeeds, try getting user data again
          const userData = await axios.get('/users/me', { 
            withCredentials: true 
          });
          setUser(userData.data);
          return true;
        } catch (refreshError) {
          setUser(null);
          return false;
        }
      }
      setUser(null);
      return false;
    }
  };

  // Initial auth check on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Initial auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Simple axios interceptor that only handles 401s for protected endpoints
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Only try refresh for protected endpoints
          const isProtectedEndpoint = originalRequest.url.includes('/users/me') ||
                                     originalRequest.url.includes('/bookings') ||
                                     originalRequest.url.includes('/admin') ||
                                     originalRequest.url.includes('/staff');
          
          if (isProtectedEndpoint) {
            try {
              await axios.post('/auth/refresh-token', {}, { withCredentials: true });
              return axios(originalRequest);
            } catch (refreshError) {
              setUser(null);
              // Only redirect if on protected routes
              const currentPath = window.location.pathname;
              if (currentPath.includes('/staff') || currentPath.includes('/admin') || currentPath.includes('/profile')) {
                navigate('/login', { replace: true });
              }
            }
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Login function
  const login = async (email, password) => {
    try {
      await axios.post('/auth/login', { email, password }, { withCredentials: true });
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
    console.log('🔴 LOGOUT CALLED - User role:', user?.role);
    
    // Clear user state immediately to prevent race conditions
    setUser(null);
    console.log('🔴 User state cleared');
    
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      console.log('🔴 Logout API call successful');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear any stored data
      localStorage.clear();
      sessionStorage.clear();
      console.log('🔴 Storage cleared, redirecting to login...');
      
      // Force a complete page reload to ensure all state is cleared
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};