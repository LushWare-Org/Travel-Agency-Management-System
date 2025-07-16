import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, setUser, loading } = useContext(AuthContext);
  const location = useLocation();

  // ➡️ on every mount, re‑check session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/users/me', { withCredentials: true });
        setUser(data);
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      }
    };
    checkAuth();
  }, [setUser, location.pathname]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        p: 3
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          You don't have permission to access this page.
        </Typography>
        <Navigate to="/" replace />
      </Box>
    );
  }

  return children;
}
