import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import CancellationDialog from '../../Components/CancellationDialog';
import StaffLayout from '../../Components/StaffLayout';

export default function StaffTourBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [filter, setFilter] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/tour-bookings', { withCredentials: true });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching tour bookings:', error);
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

  const openCancellationDialog = (booking) => {
    setSelectedBooking(booking);
    setCancellationDialogOpen(true);
  };

  const closeCancellationDialog = () => {
    setCancellationDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      await axios.put(`/tour-bookings/${selectedBooking._id}/status`, editForm, { withCredentials: true });
      closeEditDialog();
      fetchBookings();
      alert('Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    }
  };

  const handleCancellation = async (cancellationData) => {
    if (!selectedBooking) return;

    try {
      await axios.put(`/tour-bookings/${selectedBooking._id}/cancel`, cancellationData, { withCredentials: true });
      closeCancellationDialog();
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    paid: bookings.filter(b => b.status === 'Paid').length
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StaffLayout title="Tour Bookings Management">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tour Bookings Management
        </Typography>
        
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Manage tour bookings and reservations
        </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Bookings</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending</Typography>
              <Typography variant="h5" color="warning.main">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Confirmed</Typography>
              <Typography variant="h5" color="success.main">{stats.confirmed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Cancelled</Typography>
              <Typography variant="h5" color="error.main">{stats.cancelled}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Paid</Typography>
              <Typography variant="h5" color="info.main">{stats.paid}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Table */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6">Tour Bookings</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredBookings.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Tour</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Participants</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking._id} hover>
                    <TableCell>{booking.bookingReference}</TableCell>
                    <TableCell>{booking.tour?.title || 'N/A'}</TableCell>
                    <TableCell>{booking.customerDetails?.fullName || 'N/A'}</TableCell>
                    <TableCell>{new Date(booking.tourDate).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.participants}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={statusColor(booking.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>${booking.totalAmount}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => openDetailDialog(booking)}>
                          <ViewIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => openEditDialog(booking)}>
                          <EditIcon />
                        </IconButton>
                        {booking.status !== 'Cancelled' && (
                          <IconButton size="small" onClick={() => openCancellationDialog(booking)}>
                            <CancelIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No bookings found for the selected filter.</Alert>
        )}
      </Paper>

      {/* Booking Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={closeDetailDialog} maxWidth="md" fullWidth>
        <DialogTitle>Tour Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Reference:</strong> {selectedBooking.bookingReference}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Status:</strong> 
                    <Chip label={selectedBooking.status} color={statusColor(selectedBooking.status)} size="small" sx={{ ml: 1 }} />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Tour:</strong> {selectedBooking.tour?.title || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Date:</strong> {new Date(selectedBooking.tourDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Participants:</strong> {selectedBooking.participants}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Customer:</strong> {selectedBooking.customerDetails?.fullName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Email:</strong> {selectedBooking.customerDetails?.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Phone:</strong> {selectedBooking.customerDetails?.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
                </Grid>
                {selectedBooking.specialRequests && (
                  <Grid item xs={12}>
                    <Typography><strong>Special Requests:</strong> {selectedBooking.specialRequests}</Typography>
                  </Grid>
                )}
                {selectedBooking.cancellationDetails && (
                  <Grid item xs={12}>
                    <Typography><strong>Cancellation Reason:</strong> {selectedBooking.cancellationDetails.cancellationReason}</Typography>
                    <Typography><strong>Cancelled At:</strong> {new Date(selectedBooking.cancellationDetails.cancelledAt).toLocaleString()}</Typography>
                    {selectedBooking.cancellationDetails.cancellationNotes && (
                      <Typography><strong>Cancellation Notes:</strong> {selectedBooking.cancellationDetails.cancellationNotes}</Typography>
                    )}
                  </Grid>
                )}
              </Grid>
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

      {/* Cancellation Dialog */}
      <CancellationDialog
        open={cancellationDialogOpen}
        onClose={closeCancellationDialog}
        onConfirm={handleCancellation}
        bookingReference={selectedBooking?.bookingReference}
      />
      </Box>
    </StaffLayout>
  );
}
