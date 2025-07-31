// src/hooks/useAuthCheck.js
import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useAuthCheck = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (redirectPath, additionalState = {}) => {
    if (loading) {
      return false; // Still checking authentication
    }
    
    if (!user) {
      // Store the intended destination and any additional state
      navigate('/login', {
        state: { 
          from: { 
            pathname: redirectPath,
            search: location.search,
            ...additionalState
          }
        }
      });
      return false;
    }
    
    return true; // User is authenticated
  };

  const requireAuthForBooking = (bookingType, bookingData = {}) => {
    if (loading) {
      return false;
    }
    
    if (!user) {
      // Store booking intent for after login
      navigate('/login', {
        state: { 
          bookingIntent: {
            type: bookingType,
            data: bookingData,
            returnTo: location.pathname + location.search
          }
        }
      });
      return false;
    }
    
    return true;
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    requireAuth,
    requireAuthForBooking
  };
};
