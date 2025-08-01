import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as ConfirmIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import axios from 'axios';

const ActivityBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stats, setStats] = useState({});

  // Form state for editing
  const [editForm, setEditForm] = useState({
    status: '',
    paymentStatus: '',
    notes: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [statusFilter, paymentFilter, typeFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentStatus = paymentFilter;
      if (typeFilter) params.type = typeFilter;
      
      const response = await axios.get('/activity-bookings', { 
        params,
        withCredentials: true 
      });
      
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch activity bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/activity-bookings/stats', { 
        withCredentials: true 
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes || ''
    });
    setEditDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    try {
      const response = await axios.put(
        `/activity-bookings/${selectedBooking._id}`,
        editForm,
        { withCredentials: true }
      );

      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === selectedBooking._id ? response.data.data : booking
        ));
        setEditDialogOpen(false);
        setSelectedBooking(null);
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      setError('Failed to update booking');
      console.error('Error updating booking:', err);
    }
  };

  const handleQuickStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(
        `/activity-bookings/${bookingId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? response.data.data : booking
        ));
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'success';
      case 'Cancelled': return 'error';
      case 'Completed': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Paid': return 'success';
      case 'Refunded': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Activity Bookings & Inquiries Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Requests
              </Typography>
              <Typography variant="h4">
                {stats.totalBookings || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pendingBookings || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Confirmed
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.confirmedBookings || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary.main">
                {formatCurrency(stats.totalRevenue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="inquiry">Inquiry</MenuItem>
            <MenuItem value="booking">Booking</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            value={paymentFilter}
            label="Payment Status"
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => { setStatusFilter(''); setPaymentFilter(''); setTypeFilter(''); }}>
          Clear Filters
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Bookings Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.bookingReference}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.type === 'inquiry' ? 'Inquiry' : 'Booking'}
                        color={booking.type === 'inquiry' ? 'info' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.activity?.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.activity?.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.customerDetails.fullName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.customerDetails.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(booking.bookingDetails.date)}
                    </TableCell>
                    <TableCell>
                      {booking.bookingDetails.guests}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(booking.pricing.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.paymentStatus} 
                        color={getPaymentStatusColor(booking.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(booking.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewBooking(booking)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Booking">
                          <IconButton
                            size="small"
                            onClick={() => handleEditBooking(booking)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {booking.status === 'Pending' && (
                          <Tooltip title="Confirm Booking">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleQuickStatusUpdate(booking._id, 'Confirmed')}
                            >
                              <ConfirmIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleQuickStatusUpdate(booking._id, 'Cancelled')}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* View Booking Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Booking Information</Typography>
                <Typography><strong>Reference:</strong> {selectedBooking.bookingReference}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedBooking.status} 
                    color={getStatusColor(selectedBooking.status)}
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Payment Status:</strong> 
                  <Chip 
                    label={selectedBooking.paymentStatus} 
                    color={getPaymentStatusColor(selectedBooking.paymentStatus)}
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Created:</strong> {formatDate(selectedBooking.createdAt)}</Typography>
                {selectedBooking.confirmedAt && (
                  <Typography><strong>Confirmed:</strong> {formatDate(selectedBooking.confirmedAt)}</Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Activity Information</Typography>
                <Typography><strong>Activity:</strong> {selectedBooking.activity?.title}</Typography>
                <Typography><strong>Location:</strong> {selectedBooking.activity?.location}</Typography>
                <Typography><strong>Duration:</strong> {selectedBooking.activity?.duration} hours</Typography>
                <Typography><strong>Date:</strong> {formatDate(selectedBooking.bookingDetails.date)}</Typography>
                <Typography><strong>Guests:</strong> {selectedBooking.bookingDetails.guests}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {selectedBooking.customerDetails.fullName}</Typography>
                <Typography><strong>Email:</strong> {selectedBooking.customerDetails.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedBooking.customerDetails.phone}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Pricing</Typography>
                <Typography><strong>Price per Person:</strong> {formatCurrency(selectedBooking.pricing.pricePerPerson)}</Typography>
                <Typography><strong>Number of Guests:</strong> {selectedBooking.bookingDetails.guests}</Typography>
                <Typography><strong>Total Price:</strong> {formatCurrency(selectedBooking.pricing.totalPrice)}</Typography>
              </Grid>
              
              {selectedBooking.bookingDetails.specialRequests && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Special Requests</Typography>
                  <Typography>{selectedBooking.bookingDetails.specialRequests}</Typography>
                </Grid>
              )}
              
              {selectedBooking.notes && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Admin Notes</Typography>
                  <Typography>{selectedBooking.notes}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status}
                label="Status"
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={editForm.paymentStatus}
                label="Payment Status"
                onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Admin Notes"
              multiline
              rows={4}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              placeholder="Add any notes about this booking..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateBooking} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityBookings;
