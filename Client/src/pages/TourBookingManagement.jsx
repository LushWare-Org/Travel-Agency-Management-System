import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as ConfirmIcon,
  Cancel as CancelIcon,
  Refresh as ReconfirmIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import axios from 'axios';

const TourBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/tour-bookings', { withCredentials: true });

      // Tour bookings are already filtered on the backend
      const tourBookings = response.data
        .map(booking => ({
          ...booking,
          _id: booking._id?.$oid || booking._id,
          travelDate: booking.travelDate ? new Date(booking.travelDate) : null,
          status: booking.status || 'Pending',
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(tourBookings);
    } catch (err) {
      console.error('Error fetching tour bookings:', err);
      setError('Failed to load tour bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      let newStatus = '';
      switch (action) {
        case 'confirm':
          newStatus = 'Confirmed';
          break;
        case 'cancel':
          newStatus = 'Cancelled';
          break;
        case 'reconfirm':
          newStatus = 'Confirmed';
          break;
        default:
          return;
      }

      await axios.put(`/tour-bookings/${id}/status`, { status: newStatus }, { withCredentials: true });
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error(`Error ${action}ing booking:`, err);
      setError(`Failed to ${action} booking`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`/tour-bookings/${id}`, { withCredentials: true });
      fetchBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
    }
  };

  const openDetailsDialog = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setSelectedBooking(null);
    setDetailsDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  const parseMessageDetails = (message) => {
    // For tour bookings, special requests and emergency contact are direct fields
    return {
      specialRequests: selectedBooking?.specialRequests || '',
      emergencyContact: selectedBooking?.emergencyContact || '',
      paymentMethod: selectedBooking?.paymentMethod || 'bank-transfer'
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={fetchBookings} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tour Booking Management
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Manage tour bookings submitted through the booking form
      </Typography>

      <Paper sx={{ p: 3 }}>
        {bookings.length === 0 ? (
          <Typography variant="body1" color="textSecondary" textAlign="center" py={4}>
            No tour bookings found
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Tour</strong></TableCell>
                <TableCell><strong>Travel Date</strong></TableCell>
                <TableCell><strong>Travellers</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {booking.clientName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {booking.clientEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{booking.tourTitle}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {booking.selectedNightsOption} • {booking.selectedFoodCategory}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {booking.travelDate ? (
                      <Typography variant="body2">
                        {booking.travelDate.toLocaleDateString()}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="textSecondary">Not set</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{booking.travellerCount}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {booking.currency} {booking.finalPrice?.toLocaleString()}
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
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openDetailsDialog(booking)}
                      >
                        Details
                      </Button>

                      {booking.status === 'Pending' && (
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() => handleStatusChange(booking._id, 'confirm')}
                          startIcon={<ConfirmIcon />}
                        >
                          Confirm
                        </Button>
                      )}

                      {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleStatusChange(booking._id, 'cancel')}
                          startIcon={<CancelIcon />}
                        >
                          Cancel
                        </Button>
                      )}

                      {booking.status === 'Cancelled' && (
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          onClick={() => handleStatusChange(booking._id, 'reconfirm')}
                          startIcon={<ReconfirmIcon />}
                        >
                          Reconfirm
                        </Button>
                      )}

                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(booking._id)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={closeDetailsDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Tour Booking Details
          {selectedBooking && (
            <Chip
              label={selectedBooking.status}
              color={getStatusColor(selectedBooking.status)}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography><strong>Name:</strong> {selectedBooking.clientName}</Typography>
                      <Typography><strong>Email:</strong> {selectedBooking.clientEmail}</Typography>
                      <Typography><strong>Phone:</strong> {selectedBooking.phoneCountryCode} {selectedBooking.clientPhone}</Typography>
                      <Typography><strong>Nationality:</strong> {selectedBooking.nationality}</Typography>
                      {selectedBooking.emergencyContact && (
                        <Typography><strong>Emergency Contact:</strong> {selectedBooking.emergencyContact}</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tour Details */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tour Details
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography><strong>Tour:</strong> {selectedBooking.tourTitle}</Typography>
                      <Typography><strong>Duration:</strong> {selectedBooking.selectedNightsKey} Nights</Typography>
                      <Typography><strong>Package:</strong> {selectedBooking.selectedNightsOption}</Typography>
                      <Typography><strong>Meal Plan:</strong> {selectedBooking.selectedFoodCategory}</Typography>
                      <Typography><strong>Travellers:</strong> {selectedBooking.travellerCount}</Typography>
                      <Typography><strong>Travel Date:</strong> {
                        selectedBooking.travelDate
                          ? selectedBooking.travelDate.toLocaleDateString()
                          : 'Not specified'
                      }</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pricing & Payment */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Pricing & Payment
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h5" color="primary">
                        <strong>{selectedBooking.currency} {selectedBooking.finalPrice?.toLocaleString()}</strong>
                      </Typography>
                      {(() => {
                        const details = parseMessageDetails(selectedBooking.specialRequests);
                        return details.paymentMethod && (
                          <Typography><strong>Payment Method:</strong> {details.paymentMethod}</Typography>
                        );
                      })()}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Special Requests */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Special Requests
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {(() => {
                        const details = parseMessageDetails(selectedBooking.specialRequests);
                        return details.specialRequests && details.specialRequests !== 'None' ? (
                          <Typography>{details.specialRequests}</Typography>
                        ) : (
                          <Typography color="textSecondary">No special requests</Typography>
                        );
                      })()}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Booking Timeline */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Booking Timeline
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography><strong>Submitted:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</Typography>
                      {selectedBooking.updatedAt !== selectedBooking.createdAt && (
                        <Typography><strong>Last Updated:</strong> {new Date(selectedBooking.updatedAt).toLocaleString()}</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsDialog}>Close</Button>
          {selectedBooking && (
            <Box display="flex" gap={1}>
              {selectedBooking.status === 'Pending' && (
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, 'confirm');
                    closeDetailsDialog();
                  }}
                  startIcon={<ConfirmIcon />}
                >
                  Confirm Booking
                </Button>
              )}
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    handleStatusChange(selectedBooking._id, 'cancel');
                    closeDetailsDialog();
                  }}
                  startIcon={<CancelIcon />}
                >
                  Cancel Booking
                </Button>
              )}
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TourBookingManagement;
