import React, { useState } from 'react';
import {
  Paper, Typography, Box, IconButton, Chip, Button, Grid, Card, CardContent,
  Divider, Stack, Tooltip, Collapse, useTheme, useMediaQuery, Badge,
  ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableHead, 
  TableRow, TableContainer
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
  DateRange as DateRangeIcon,
  Group as GroupIcon,
  ViewModule as ViewModuleIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';

const RoomBookingsView = ({ bookings, onViewDetails, onEdit, onDelete, onConfirm, onCancel, onMarkPaid }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
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

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric'
    });
  };

  const toggleExpand = (bookingId) => {
    setExpandedCard(expandedCard === bookingId ? null : bookingId);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Card View Component
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
                    {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                    {booking.children?.length > 0 && `, ${booking.children.length} child${booking.children.length !== 1 ? 'ren' : ''}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {booking.rooms || 1} room{booking.rooms !== 1 ? 's' : ''}
                    {(booking.rooms || 1) > 1 && booking.passengerDetails && booking.passengerDetails.length > 0 && (
                      <span> • Per room config</span>
                    )}
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onViewDetails(booking)}
                  sx={{ minWidth: 'auto' }}
                >
                  Details
                </Button>
                {booking.status === 'Pending' && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => onConfirm(booking._id)}
                    startIcon={<CheckCircleIcon />}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    Confirm
                  </Button>
                )}
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(booking._id)}
                  sx={{ 
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
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
                      <Typography variant="body2" color="text.secondary">Total Adults:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.adults}
                      </Typography>
                    </Box>
                    {booking.children?.length > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Total Children:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.children.length}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Rooms:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.rooms || 1}
                      </Typography>
                    </Box>
                    
                    {/* Per-Room Breakdown */}
                    {(booking.rooms || 1) > 1 && booking.passengerDetails && booking.passengerDetails.length > 0 && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                          Room Distribution:
                        </Typography>
                        {(() => {
                          // Group passengers by room number
                          const roomGroups = booking.passengerDetails.reduce((acc, passenger) => {
                            const roomNum = passenger.roomNumber || 1;
                            if (!acc[roomNum]) {
                              acc[roomNum] = { adults: 0, children: 0 };
                            }
                            if (passenger.type === 'adult') {
                              acc[roomNum].adults++;
                            } else {
                              acc[roomNum].children++;
                            }
                            return acc;
                          }, {});

                          return Object.entries(roomGroups).map(([roomNum, counts]) => (
                            <Typography key={roomNum} variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                              Room {roomNum}: {counts.adults} adult{counts.adults !== 1 ? 's' : ''}
                              {counts.children > 0 && `, ${counts.children} child${counts.children !== 1 ? 'ren' : ''}`}
                            </Typography>
                          ));
                        })()}
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

  // Compact Table View Component
  const CompactTable = () => (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Guest</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Hotel</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Dates</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Guests</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No room bookings found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            bookings.map(booking => (
              <TableRow 
                key={booking._id}
                sx={{ 
                  '&:hover': { bgcolor: 'grey.50' },
                  borderLeft: `3px solid ${getStatusColor(booking.status)}`
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {booking.bookingReference}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {booking.clientDetails?.name || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                      {booking.hotel?.name || 'Unknown Hotel'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {booking.room?.roomName || 'Unknown Room'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {formatDateShort(booking.checkIn)} - {formatDateShort(booking.checkOut)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {booking.adults}A
                    {booking.children?.length > 0 && `, ${booking.children.length}C`}
                    {booking.rooms > 1 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {booking.rooms} rooms
                      </Typography>
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={statusColor(booking.status)}
                    variant={booking.status === 'Pending' ? 'outlined' : 'filled'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onViewDetails(booking)}
                      sx={{ minWidth: 70 }}
                    >
                      Details
                    </Button>
                    {booking.status === 'Pending' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onConfirm(booking._id)}
                        startIcon={<CheckCircleIcon />}
                        sx={{ minWidth: 80 }}
                      >
                        Confirm
                      </Button>
                    )}
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onEdit(booking)}
                        sx={{
                          bgcolor: 'info.light',
                          color: 'info.contrastText',
                          '&:hover': { bgcolor: 'info.main' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Room Bookings
          </Typography>
          <Badge badgeContent={bookings.length} color="primary">
            <Box sx={{ width: 20, height: 20 }} />
          </Badge>
        </Box>
        
        {/* View Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          size="small"
          aria-label="view mode"
        >
          <ToggleButton value="cards" aria-label="card view">
            <ViewModuleIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}>
              Cards
            </Typography>
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <TableChartIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}>
              Table
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
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
        <>
          {viewMode === 'cards' ? (
            <Box>
              {bookings.map(booking => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </Box>
          ) : (
            <CompactTable />
          )}
        </>
      )}
    </Paper>
  );
};

export default RoomBookingsView;
