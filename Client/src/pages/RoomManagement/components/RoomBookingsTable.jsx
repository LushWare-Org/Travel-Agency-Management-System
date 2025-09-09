import React, { useState } from 'react';
import {
  Paper, Typography, Box, IconButton, Chip, Button, Grid, Card, CardContent,
  Divider, Stack, Tooltip, Collapse, useTheme, useMediaQuery, Badge
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  KingBed as KingBedIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DateRange as DateRangeIcon,
  Group as GroupIcon
} from '@mui/icons-material';

const RoomBookingsTable = ({ bookings, onViewDetails, onEdit, onDelete, onConfirm, onCancel, onMarkPaid }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const statusColor = (status) => ({
    Pending: 'warning',
    Confirmed: 'success',
    Cancelled: 'error',
    Modified: 'info',
    Completed: 'default',
    Paid: 'primary'
  }[status] || 'default');

  const getStatusColor = (status) => {
    const colorMap = {
      Pending: theme.palette.warning?.main || '#ff9800',
      Confirmed: theme.palette.success?.main || '#4caf50',
      Cancelled: theme.palette.error?.main || '#f44336',
      Modified: theme.palette.info?.main || '#2196f3',
      Completed: theme.palette.grey?.[500] || '#9e9e9e',
      Paid: theme.palette.primary?.main || '#1976d2'
    };
    return colorMap[status] || theme.palette.grey?.[500] || '#9e9e9e';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleExpand = (bookingId) => {
    setExpandedCard(expandedCard === bookingId ? null : bookingId);
  };

  const BookingCard = ({ booking }) => {
    const isExpanded = expandedCard === booking._id;
    
    return (
      <Card 
        sx={{ 
          mb: 2, 
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)'
          },
          border: `1px solid ${theme.palette.divider}`,
          borderLeft: `4px solid ${getStatusColor(booking.status)}`
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header Row - Always Visible */}
          <Grid container spacing={2} alignItems="center">
            {/* Booking Reference & Status */}
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  {booking.bookingReference}
                </Typography>
                <Chip
                  label={booking.status}
                  color={statusColor(booking.status)}
                  variant={booking.status === 'Pending' ? 'outlined' : 'filled'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Grid>

            {/* Guest Info */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {booking.clientDetails?.name || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Guest
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Hotel & Room */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HotelIcon color="action" fontSize="small" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                    {booking.hotel?.name || 'Unknown Hotel'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {booking.room?.roomName || 'Unknown Room'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onViewDetails(booking)}
                  sx={{ minWidth: 'auto' }}
                >
                  Details
                </Button>
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(booking._id)}
                  sx={{ 
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Expandable Content */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              {/* Dates Section */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon fontSize="small" />
                    Stay Duration
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Check-in:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(booking.checkIn)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Check-out:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(booking.checkOut)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Guest Count Section */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon fontSize="small" />
                    Guest Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Adults:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.adults}
                      </Typography>
                    </Box>
                    {booking.children?.length > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Children:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.children.length}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Grid>

              {/* Actions Section */}
              <Grid item xs={12} sm={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {booking.status === 'Pending' && (
                      <Tooltip title="Confirm Booking">
                        <IconButton
                          color="success"
                          onClick={() => onConfirm(booking._id)}
                          size="small"
                          sx={{ 
                            bgcolor: 'success.light',
                            color: 'success.contrastText',
                            '&:hover': { bgcolor: 'success.main' }
                          }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <Tooltip title="Cancel Booking">
                        <IconButton
                          color="error"
                          onClick={() => onCancel(booking._id)}
                          size="small"
                          sx={{ 
                            bgcolor: 'error.light',
                            color: 'error.contrastText',
                            '&:hover': { bgcolor: 'error.main' }
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {booking.status !== 'Paid' && booking.status !== 'Cancelled' && (
                      <Tooltip title="Mark as Paid">
                        <IconButton
                          color="primary"
                          onClick={() => onMarkPaid(booking._id)}
                          size="small"
                          sx={{ 
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': { bgcolor: 'primary.main' }
                          }}
                        >
                          <PaymentIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit Booking">
                      <IconButton
                        color="info"
                        onClick={() => onEdit(booking)}
                        size="small"
                        sx={{ 
                          bgcolor: 'info.light',
                          color: 'info.contrastText',
                          '&:hover': { bgcolor: 'info.main' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Booking">
                      <IconButton
                        color="error"
                        onClick={() => onDelete(booking._id)}
                        size="small"
                        sx={{ 
                          bgcolor: 'error.light',
                          color: 'error.contrastText',
                          '&:hover': { bgcolor: 'error.main' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Room Bookings
        </Typography>
        <Badge badgeContent={bookings.length} color="primary">
          <Typography variant="body2" color="text.secondary">
            Total Bookings
          </Typography>
        </Badge>
      </Box>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: `2px dashed ${theme.palette.grey[300]}`
          }}
        >
          <HotelIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No room bookings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bookings will appear here once they are created
          </Typography>
        </Box>
      ) : (
        <Box>
          {bookings.map(booking => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default RoomBookingsTable;
