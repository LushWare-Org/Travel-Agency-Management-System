import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Tour as TourIcon,
  LocalActivity as ActivityIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import bookingsAPI from '../services/bookingsAPI';

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hotelBookings: 0,
    tourBookings: 0,
    activityBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all booking types
      const [hotelBookings, tourBookings, activityBookings] = await Promise.all([
        bookingsAPI.getAll().catch(() => []),
        axios.get('/tour-bookings', { withCredentials: true }).then(res => res.data).catch(() => []),
        axios.get('/activity-bookings', { withCredentials: true }).then(res => res.data.data || []).catch(() => [])
      ]);

      // Calculate stats
      const hotelPending = hotelBookings.filter(b => b.status === 'Pending').length;
      const hotelConfirmed = hotelBookings.filter(b => b.status === 'Confirmed').length;
      const tourPending = tourBookings.filter(b => b.status === 'Pending').length;
      const tourConfirmed = tourBookings.filter(b => b.status === 'Confirmed').length;
      const activityPending = activityBookings.filter(b => b.status === 'Pending').length;
      const activityConfirmed = activityBookings.filter(b => b.status === 'Confirmed').length;

      setStats({
        hotelBookings: hotelBookings.length,
        tourBookings: tourBookings.length,
        activityBookings: activityBookings.length,
        pendingBookings: hotelPending + tourPending + activityPending,
        confirmedBookings: hotelConfirmed + tourConfirmed + activityConfirmed
      });

      // Set recent bookings (last 5 from each type)
      setRecentBookings([
        ...hotelBookings.slice(0, 5).map(b => ({ ...b, type: 'Hotel' })),
        ...tourBookings.slice(0, 5).map(b => ({ ...b, type: 'Tour' })),
        ...activityBookings.slice(0, 5).map(b => ({ ...b, type: 'Activity' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10));


    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetailDialog = (booking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedBooking(null);
  };

  const openEditDialog = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      status: booking.status,
      notes: booking.notes || ''
    });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditForm({});
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      if (selectedBooking.type === 'Hotel') {
        await bookingsAPI.update(selectedBooking._id, editForm);
      } else if (selectedBooking.type === 'Tour') {
        await axios.put(`/tour-bookings/${selectedBooking._id}/status`, editForm, { withCredentials: true });
      } else if (selectedBooking.type === 'Activity') {
        await axios.put(`/activity-bookings/${selectedBooking._id}`, editForm, { withCredentials: true });
      }

      closeEditDialog();
      fetchDashboardData();
      alert('Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'success';
      case 'Cancelled': return 'error';
      case 'Paid': return 'info';
      default: return 'default';
    }
  };

  const getBookingIcon = (type) => {
    switch (type) {
      case 'Hotel': return <HotelIcon />;
      case 'Tour': return <TourIcon />;
      case 'Activity': return <ActivityIcon />;
      default: return <HotelIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Welcome back, {user?.firstName} {user?.lastName}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <HotelIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>Hotel Bookings</Typography>
                  <Typography variant="h5">{stats.hotelBookings}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TourIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>Tour Bookings</Typography>
                  <Typography variant="h5">{stats.tourBookings}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ActivityIcon color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>Activity Bookings</Typography>
                  <Typography variant="h5">{stats.activityBookings}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>Pending</Typography>
                  <Typography variant="h5">{stats.pendingBookings}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>Confirmed</Typography>
                  <Typography variant="h5">{stats.confirmedBookings}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Bookings</Typography>
            {recentBookings.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={`${booking.type}-${booking._id}`} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {getBookingIcon(booking.type)}
                            <Typography sx={{ ml: 1 }}>{booking.type}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{booking.bookingReference}</TableCell>
                        <TableCell>
                          {booking.clientDetails?.name || 
                           booking.clientName || 
                           booking.customerDetails?.fullName || 
                           'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={booking.status} 
                            color={statusColor(booking.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" onClick={() => openDetailDialog(booking)}>
                              <MessageIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => openEditDialog(booking)}>
                              <EditIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No recent bookings found.</Alert>
            )}
          </Paper>
        </Grid>

      </Grid>

      {/* Booking Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={closeDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography><strong>Type:</strong> {selectedBooking.type}</Typography>
              <Typography><strong>Reference:</strong> {selectedBooking.bookingReference}</Typography>
              <Typography><strong>Status:</strong> 
                <Chip label={selectedBooking.status} color={statusColor(selectedBooking.status)} size="small" sx={{ ml: 1 }} />
              </Typography>
              <Typography><strong>Customer:</strong> 
                {selectedBooking.clientDetails?.name || 
                 selectedBooking.clientName || 
                 selectedBooking.customerDetails?.fullName || 
                 'N/A'}
              </Typography>
              <Typography><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
              {selectedBooking.notes && (
                <Typography><strong>Notes:</strong> {selectedBooking.notes}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={editForm.notes || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes about this booking..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
