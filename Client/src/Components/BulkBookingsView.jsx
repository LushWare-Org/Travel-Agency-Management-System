import React, { useState, useEffect } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';

export default function BulkBookingsView() {
  const [bulkBookings, setBulkBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  
  // Edit functionality state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBulkBooking, setEditingBulkBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // Delete functionality state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBulkBooking, setDeletingBulkBooking] = useState(null);

  useEffect(() => {
    fetchBulkBookings();
  }, []);

  const fetchBulkBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bulk-bookings', { withCredentials: true });
      setBulkBookings(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bulk bookings:', err);
      setError('Failed to fetch bulk bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const toggleRowExpansion = (bookingId) => {
    setExpandedRows(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  // Edit functionality
  const handleEdit = (bulkBooking) => {
    setEditingBulkBooking(bulkBooking);
    setEditFormData({
      groupName: bulkBooking.groupName,
      status: bulkBooking.status,
      checkIn: bulkBooking.checkIn ? new Date(bulkBooking.checkIn).toISOString().split('T')[0] : '',
      checkOut: bulkBooking.checkOut ? new Date(bulkBooking.checkOut).toISOString().split('T')[0] : '',
      checkInTime: bulkBooking.checkInTime || '14:00',
      checkOutTime: bulkBooking.checkOutTime || '12:00',
      adults: bulkBooking.adults || 1,
      children: bulkBooking.children || 0,
      mealPlan: bulkBooking.mealPlan || 'All-Inclusive',
      specialRequests: bulkBooking.specialRequests || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`/bulk-bookings/${editingBulkBooking._id}`, editFormData, {
        withCredentials: true
      });
      
      // Update the bulk bookings list
      setBulkBookings(prev => 
        prev.map(booking => 
          booking._id === editingBulkBooking._id ? response.data : booking
        )
      );
      
      setEditDialogOpen(false);
      setEditingBulkBooking(null);
      setEditFormData({});
    } catch (err) {
      console.error('Error updating bulk booking:', err);
      setError('Failed to update bulk booking');
    }
  };

  // Delete functionality
  const handleDelete = (bulkBooking) => {
    setDeletingBulkBooking(bulkBooking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/bulk-bookings/${deletingBulkBooking._id}`, {
        withCredentials: true
      });
      
      // Remove from the bulk bookings list
      setBulkBookings(prev => 
        prev.filter(booking => booking._id !== deletingBulkBooking._id)
      );
      
      setDeleteDialogOpen(false);
      setDeletingBulkBooking(null);
    } catch (err) {
      console.error('Error deleting bulk booking:', err);
      setError('Failed to delete bulk booking');
    }
  };

  const viewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchBulkBookings} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Bulk Bookings Management</Typography>
        <Button
          variant="contained"
          onClick={fetchBulkBookings}
        >
          Refresh
        </Button>
      </Box>

      {bulkBookings.length === 0 ? (
        <Alert severity="info">
          No bulk bookings found. Create a new bulk booking to get started.
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Total Bookings</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bulkBookings.map((booking) => (
                <React.Fragment key={booking._id}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {booking.groupName || 'Unnamed Group'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {booking.bulkBookingReference}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(booking.checkIn)}</TableCell>
                    <TableCell>{formatDate(booking.checkOut)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.bookings?.length || 0} 
                        color="primary" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(booking.summary?.totalAmount || 0)}
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => viewDetails(booking)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Booking">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(booking)}
                            color="warning"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Booking">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(booking)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(booking._id)}
                      >
                        {expandedRows[booking._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row with Individual Bookings */}
                  {expandedRows[booking._id] && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2 }}>
                            Individual Bookings ({booking.bookings?.length || 0})
                          </Typography>
                          <Grid container spacing={2}>
                            {booking.bookings?.map((individualBooking, index) => (
                              <Grid item xs={12} md={6} key={index}>
                                <Card variant="outlined">
                                  <CardContent sx={{ p: 2 }}>
                                    <Typography variant="body2" fontWeight="bold">
                                      {individualBooking.clientDetails?.name || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {individualBooking.clientDetails?.email || 'N/A'}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="textSecondary">
                                      Room: {individualBooking.room?.roomName || 'N/A'}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="textSecondary">
                                      Status: {individualBooking.status}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="textSecondary">
                                      Amount: {formatCurrency(individualBooking.priceBreakdown?.total || 0)}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Bulk Booking Details: {selectedBooking?.groupName || 'Unnamed Group'}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              {/* Booking Summary */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Booking Summary</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography><strong>Reference:</strong> {selectedBooking.bulkBookingReference}</Typography>
                        <Typography><strong>Group Name:</strong> {selectedBooking.groupName || 'N/A'}</Typography>
                        <Typography><strong>Status:</strong> {selectedBooking.status}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Check-in:</strong> {formatDate(selectedBooking.checkIn)} {selectedBooking.checkInTime}</Typography>
                        <Typography><strong>Check-out:</strong> {formatDate(selectedBooking.checkOut)} {selectedBooking.checkOutTime}</Typography>
                        <Typography><strong>Created:</strong> {formatDate(selectedBooking.createdAt)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Individual Bookings */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Individual Bookings</Typography>
                <Grid container spacing={2}>
                  {selectedBooking.bookings?.map((individualBooking, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {individualBooking.clientDetails?.name || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Email: {individualBooking.clientDetails?.email || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Phone: {individualBooking.clientDetails?.phone || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Company: {individualBooking.clientDetails?.companyName || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2">
                                <strong>Room:</strong> {individualBooking.room?.roomName || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Hotel:</strong> {individualBooking.hotel?.name || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Status:</strong> {individualBooking.status}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Amount:</strong> {formatCurrency(individualBooking.priceBreakdown?.total || 0)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Bulk Booking</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                value={editFormData.groupName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, groupName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-in Date"
                type="date"
                value={editFormData.checkIn || ''}
                onChange={(e) => setEditFormData({ ...editFormData, checkIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-out Date"
                type="date"
                value={editFormData.checkOut || ''}
                onChange={(e) => setEditFormData({ ...editFormData, checkOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-in Time"
                type="time"
                value={editFormData.checkInTime || ''}
                onChange={(e) => setEditFormData({ ...editFormData, checkInTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check-out Time"
                type="time"
                value={editFormData.checkOutTime || ''}
                onChange={(e) => setEditFormData({ ...editFormData, checkOutTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Adults"
                type="number"
                value={editFormData.adults || 1}
                onChange={(e) => setEditFormData({ ...editFormData, adults: parseInt(e.target.value) })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Children"
                type="number"
                value={editFormData.children || 0}
                onChange={(e) => setEditFormData({ ...editFormData, children: parseInt(e.target.value) })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Meal Plan"
                value={editFormData.mealPlan || 'All-Inclusive'}
                onChange={(e) => setEditFormData({ ...editFormData, mealPlan: e.target.value })}
              >
                <MenuItem value="Bed & Breakfast">Bed & Breakfast</MenuItem>
                <MenuItem value="Half Board">Half Board</MenuItem>
                <MenuItem value="Full Board">Full Board</MenuItem>
                <MenuItem value="All-Inclusive">All-Inclusive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={editFormData.status || 'Pending'}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requests"
                multiline
                rows={3}
                value={editFormData.specialRequests || ''}
                onChange={(e) => setEditFormData({ ...editFormData, specialRequests: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the bulk booking "{deletingBulkBooking?.groupName}"?
            This action cannot be undone and will also release any reserved rooms.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

