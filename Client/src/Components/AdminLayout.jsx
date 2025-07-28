import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const AdminLayout = ({ children, title = 'Admin Management' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    // If we're in an activity-related page, go back to activities
    if (location.pathname.includes('/admin/activities')) {
      // If we're on the main activities page, go to admin dashboard
      if (location.pathname === '/admin/activities') {
        navigate('/admin');
      } else {
        // Otherwise go to activities list
        navigate('/admin/activities');
      }
    } else {
      // Default behavior - go to admin dashboard
      navigate('/admin');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={handleBackClick}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
