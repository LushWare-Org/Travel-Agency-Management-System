import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Container,
  Paper,
  Grid,
  Button,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  KingBed as RoomIcon,
  Bookmark as BookingIcon,
  LocalOffer as DiscountIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  TourOutlined,
  LocalActivity as LocalActivityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import DiscountManagement from './DiscountManagement';
import TourManagement from './TourManagement';
import ContactManagement from './ContactManagement';

const drawerWidth = 240;

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);
  const [stats, setStats] = useState({ 
    users: 0, 
    hotels: 0, 
    bookings: 0, 
    tours: 0, 
    contacts: 0, 
    activities: 0, 
    activityBookings: 0 
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [u, h, b, t, c, a, ab] = await Promise.all([
          axios.get('/users', { withCredentials: true }),
          axios.get('/hotels', { withCredentials: true }),
          axios.get('/bookings', { withCredentials: true }),
          axios.get('/tours', { withCredentials: true }),
          axios.get('/contacts', { withCredentials: true }),
          axios.get('/activities', { withCredentials: true }),
          axios.get('/activity-bookings', { withCredentials: true }).catch(() => ({ data: { data: [] } }))
        ]);
        setStats({ 
          users: u.data.length, 
          hotels: h.data.length, 
          bookings: b.data.length, 
          tours: t.data.length,
          contacts: c.data.length,
          activities: a.data.success ? a.data.data.length : 0,
          activityBookings: ab.data.success ? ab.data.data.length : 0
        });
        setRecentBookings(b.data.slice(0, 5));
        setRecentMessages(c.data.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin dashboard data. Please try refreshing the page.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const openProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const closeProfileMenu = () => setAnchorEl(null);
  const goTo = (path) => { navigate(path); closeProfileMenu(); };
  const handleLogout = () => axios.post('/api/auth/logout', {}, { withCredentials: true }).finally(() => goTo('/login'));
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavigation = (item) => {
    if (item.id === 'activities') {
      navigate('/admin/activities');
    } else {
      setSection(item.id);
    }
    // Close mobile drawer after navigation
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'hotels', text: 'Hotel Management', icon: <HotelIcon /> },
    { id: 'rooms', text: 'Room Management', icon: <RoomIcon /> },
    { id: 'activities', text: 'Activity Management', icon: <LocalActivityIcon />, path: '/admin/activities' },
    { id: 'bookings', text: 'Booking Oversight', icon: <BookingIcon /> },
    { id: 'discounts', text: 'Discount Management', icon: <DiscountIcon /> },
    { id: 'tours', text: 'Tour Management', icon: <TourOutlined/> },
    { id: 'contacts', text: 'Contact Submissions', icon: <EmailIcon /> },
  ];

  const Dashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      {loading ? (
        <Box textAlign="center" p={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Loading dashboard data...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[{ title: 'Users', value: stats.users, color: '#3f51b5' },
              { title: 'Hotels', value: stats.hotels, color: '#f50057' },
              { title: 'Bookings', value: stats.bookings, color: '#ff9800' },
              { title: 'Tours', value: stats.tours, color: '#2196f3' },
              { title: 'Activities', value: stats.activities, color: '#9c27b0' },
              { title: 'Activity Bookings', value: stats.activityBookings, color: '#4caf50' },
              { title: 'Messages', value: stats.contacts, color: '#607d8b' }]
              .map((s) => (
                <Grid key={s.title} item xs={12} sm={6} md={3}>
                  <Paper sx={{ p:3, textAlign:'center', borderTop:`4px solid ${s.color}`, bgcolor:'white' }}>
                    <Typography>{s.title}</Typography>
                    <Typography variant="h3" color={s.color}>{s.value}</Typography>
                  </Paper>
                </Grid>
            ))}
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p:2 }}>
                <Typography variant="h6">Recent Bookings</Typography>
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => (
                    <Box key={b._id} sx={{ p:1, m:1, border:'1px solid #ddd', borderRadius:1 }}>
                      <Typography>{b.hotel.name} • {new Date(b.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography color="textSecondary" sx={{ p: 2 }}>No recent bookings</Typography>
                )}
                <Button onClick={() => setSection('bookings')}>View All</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p:2 }}>
                <Typography variant="h6">Recent Messages</Typography>
                {recentMessages.length > 0 ? (
                  recentMessages.map((m) => (
                    <Box key={m._id} sx={{ p:1, m:1, border:'1px solid #ddd', borderRadius:1 }}>
                      <Typography noWrap>{m.name}: {m.subject}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography color="textSecondary" sx={{ p: 2 }}>No recent messages</Typography>
                )}
                <Button onClick={() => setSection('contacts')}>View All</Button>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <Dashboard />;
      case 'hotels': return <HotelManagement />;
      case 'rooms': return <RoomManagement />;
      case 'bookings': return <BookingManagement />;
      case 'discounts': return <DiscountManagement />;
      case 'tours': return <TourManagement />;
      case 'contacts': return <ContactManagement />;
      default: return <Dashboard />;
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display:'flex', minHeight:'100vh' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` }, 
          bgcolor:'#1976d2' 
        }}
      >
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
          <Typography variant="h6">Admin Panel</Typography>
          <Box sx={{ ml:'auto' }}>
            <IconButton color="inherit" onClick={openProfileMenu}><PersonIcon /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeProfileMenu}
              anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
              transformOrigin={{ vertical:'top', horizontal:'right' }}
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
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing:'border-box', 
            bgcolor:'#1e293b', 
            color:'white' 
          }
        }}
      >
        <Toolbar />
        <Divider sx={{ bgcolor:'#374151' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.id} onClick={() => handleNavigation(item)}
              sx={{ '&:hover':{ bgcolor:'#374151' }, bgcolor: section===item.id?'#374151':'transparent' }}>
              <ListItemIcon sx={{ color:'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Desktop drawer */}
      <Drawer 
        variant="permanent" 
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper':{ 
            width:drawerWidth, 
            boxSizing:'border-box', 
            bgcolor:'#1e293b', 
            color:'white' 
          } 
        }}
      >
        <Toolbar />
        <Divider sx={{ bgcolor:'#374151' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.id} onClick={() => handleNavigation(item)}
              sx={{ '&:hover':{ bgcolor:'#374151' }, bgcolor: section===item.id?'#374151':'transparent' }}>
              <ListItemIcon sx={{ color:'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow:1, 
          p:3, 
          mt:'64px', 
          ml: { xs: 0, md: `${drawerWidth}px` }, 
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          overflow: 'hidden' // Prevent horizontal scroll
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 'none' }}>{renderSection()}</Box>
      </Box>
    </Box>
  );
}