import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Alert,
  Divider
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const CancellationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  booking, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    cancellationReason: '',
    cancellationNotes: '',
    refundAmount: 0,
    refundMethod: 'No Refund',
    cancellationFee: 0
  });

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleConfirm = () => {
    if (!formData.cancellationReason) {
      alert('Please select a cancellation reason');
      return;
    }
    onConfirm(formData);
  };

  const handleClose = () => {
    setFormData({
      cancellationReason: '',
      cancellationNotes: '',
      refundAmount: 0,
      refundMethod: 'No Refund',
      cancellationFee: 0
    });
    onClose();
  };

  const calculateRefund = () => {
    const totalAmount = booking?.priceBreakdown?.total || 0;
    const paidAmount = booking?.amountPaid || 0;
    const fee = parseFloat(formData.cancellationFee) || 0;
    return Math.max(0, paidAmount - fee);
  };

  React.useEffect(() => {
    if (booking) {
      setFormData(prev => ({
        ...prev,
        refundAmount: booking.amountPaid || 0
      }));
    }
  }, [booking]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <CancelIcon color="error" sx={{ mr: 1 }} />
          Cancel Booking
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {booking && (
          <>
            {/* Booking Information */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Booking Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Reference:</strong> {booking.bookingReference}</Typography>
                  <Typography><strong>Guest:</strong> {booking.clientDetails?.name}</Typography>
                  <Typography><strong>Hotel:</strong> {booking.hotel?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</Typography>
                  <Typography><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</Typography>
                  <Typography><strong>Total Amount:</strong> ${booking.priceBreakdown?.total || 0}</Typography>
                  <Typography><strong>Paid Amount:</strong> ${booking.amountPaid || 0}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Cancellation Form */}
            <Grid container spacing={3}>
              {/* Cancellation Reason */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Cancellation Reason</InputLabel>
                  <Select
                    value={formData.cancellationReason}
                    onChange={handleChange('cancellationReason')}
                    label="Cancellation Reason"
                  >
                    <MenuItem value="Customer Request">Customer Request</MenuItem>
                    <MenuItem value="No Show">No Show</MenuItem>
                    <MenuItem value="Payment Failed">Payment Failed</MenuItem>
                    <MenuItem value="Hotel Issue">Hotel Issue</MenuItem>
                    <MenuItem value="Weather">Weather</MenuItem>
                    <MenuItem value="Force Majeure">Force Majeure</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Cancellation Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Cancellation Notes"
                  value={formData.cancellationNotes}
                  onChange={handleChange('cancellationNotes')}
                  placeholder="Additional details about the cancellation..."
                />
              </Grid>

              {/* Refund Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Refund Information</Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cancellation Fee"
                  value={formData.cancellationFee}
                  onChange={handleChange('cancellationFee')}
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Fee to be deducted from refund"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Refund Amount"
                  value={calculateRefund().toFixed(2)}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated refund amount"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Refund Method</InputLabel>
                  <Select
                    value={formData.refundMethod}
                    onChange={handleChange('refundMethod')}
                    label="Refund Method"
                  >
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="No Refund">No Refund</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Warning Alert */}
              <Grid item xs={12}>
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Warning:</strong> This action cannot be undone. The booking will be marked as cancelled 
                    and the customer will be notified. Make sure all refund details are correct before proceeding.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading || !formData.cancellationReason}
          startIcon={<SaveIcon />}
        >
          {loading ? 'Processing...' : 'Confirm Cancellation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancellationDialog;
