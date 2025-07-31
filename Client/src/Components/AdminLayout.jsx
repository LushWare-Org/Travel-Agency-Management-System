import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Container,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  KingBed as RoomIcon,
  Bookmark as BookingIcon,
  LocalOffer as DiscountIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  TourOutlined,
  LocalActivity as LocalActivityIcon,
} from '@mui/icons-material';
import axios from 'axios';

const drawerWidth = 240;

const AdminLayout = ({ children, title = 'Admin Management' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNavigation = (item) => {
    if (item.id === 'activities') {
      navigate('/admin/activities');
    } else {
      // For all other sections, go to main admin panel
      navigate('/admin');
    }
  };

  const openProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const closeProfileMenu = () => setAnchorEl(null);
  const goTo = (path) => { navigate(path); closeProfileMenu(); };
  const handleLogout = () => axios.post('/api/auth/logout', {}, { withCredentials: true }).finally(() => goTo('/login'));

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { id: 'hotels', text: 'Hotel Management', icon: <HotelIcon />, section: 'hotels' },
    { id: 'rooms', text: 'Room Management', icon: <RoomIcon />, section: 'rooms' },
    { id: 'activities', text: 'Activity Management', icon: <LocalActivityIcon />, path: '/admin/activities' },
    { id: 'bookings', text: 'Booking Oversight', icon: <BookingIcon />, section: 'bookings' },
    { id: 'discounts', text: 'Discount Management', icon: <DiscountIcon />, section: 'discounts' },
    { id: 'tours', text: 'Tour Management', icon: <TourOutlined/>, section: 'tours' },
    { id: 'contacts', text: 'Contact Submissions', icon: <EmailIcon />, section: 'contacts' },
  ];

  const isActiveItem = (item) => {
    if (item.id === 'activities') {
      return location.pathname.startsWith('/admin/activities');
    }
    if (item.id === 'dashboard') {
      return location.pathname === '/admin';
    }
    return false;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton color="inherit" onClick={openProfileMenu}>
              <PersonIcon />
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={closeProfileMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => goTo('/profile')}>My Profile</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer 
        variant="permanent" 
        anchor="left" 
        sx={{ 
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: '#1e293b', 
            color: 'white' 
          } 
        }}
      >
        <Toolbar />
        <Divider sx={{ bgcolor: '#374151' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.id} 
              onClick={() => handleNavigation(item)}
              sx={{ 
                '&:hover': { bgcolor: '#374151' }, 
                bgcolor: isActiveItem(item) ? '#374151' : 'transparent' 
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: '64px', 
          ml: `${drawerWidth}px`, 
          width: `calc(100% - ${drawerWidth}px)`,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
