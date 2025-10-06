import React, { useState, useEffect, useContext } from 'react';
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
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalActivity as LocalActivityIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  Tour as TourIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useAdminLayout } from '../hooks/useAdminLayout';

const StaffLayout = ({ children, title = 'Staff Dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useContext(AuthContext);
  
  const {
    isMobile,
    mobileOpen,
    layoutKey,
    drawerWidth,
    handleDrawerToggle,
    getMainContentStyles,
    getAppBarStyles
  } = useAdminLayout();

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      // For all other sections, go to main staff dashboard
      navigate('/staff');
    }
    // Close mobile drawer after navigation
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const openProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const closeProfileMenu = () => setAnchorEl(null);
  const goTo = (path) => { navigate(path); closeProfileMenu(); };
  const handleLogout = () => logout();

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/staff' },
    { id: 'hotels', text: 'Hotel Bookings', icon: <HotelIcon />, path: '/staff/hotels' },
    { id: 'tours', text: 'Tour Bookings', icon: <TourIcon />, path: '/staff/tours' },
    { id: 'activities', text: 'Activity Bookings', icon: <LocalActivityIcon />, path: '/staff/activities' },
  ];

  const isActiveItem = (item) => {
    return location.pathname === item.path;
  };

  const drawer = (
    <>
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
    </>
  );

  return (
    <Box key={layoutKey} sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={getAppBarStyles()}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
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

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: '#1e293b', 
            color: 'white' 
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer 
        variant="permanent" 
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box', 
            bgcolor: '#1e293b', 
            color: 'white' 
          } 
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={getMainContentStyles()}>
        <Box sx={{ width: '100%', maxWidth: 'none' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default StaffLayout;