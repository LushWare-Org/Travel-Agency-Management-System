import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, Typography, Box, IconButton, Chip, Button
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
  Payment as PaymentIcon
} from '@mui/icons-material';

const RoomBookingsTable = ({ bookings, onViewDetails, onEdit, onDelete, onConfirm, onCancel, onMarkPaid }) => {
  const statusColor = (status) => ({
    Pending: 'warning',
    Confirmed: 'success',
    Cancelled: 'error',
    Modified: 'info',
    Completed: 'default',
    Paid: 'primary'
  }[status] || 'default');

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reference</TableCell>
            <TableCell>Guest</TableCell>
            <TableCell>Hotel</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Guests</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography color="textSecondary">No room bookings found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            bookings.map(booking => (
              <TableRow key={booking._id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {booking.bookingReference}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography>{booking.clientDetails?.name || 'N/A'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HotelIcon />
                    <Typography>
                      {booking.hotel?.name || 'Unknown Hotel'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <KingBedIcon />
                    <Typography>{booking.room?.roomName || 'Unknown Room'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon />
                    <Typography>{new Date(booking.checkIn).toLocaleDateString()}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon />
                    <Typography>{new Date(booking.checkOut).toLocaleDateString()}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography>
                      {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                      {booking.children?.length > 0 && `, ${booking.children.length} child${booking.children.length !== 1 ? 'ren' : ''}`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={statusColor(booking.status)}
                    variant={booking.status === 'Pending' ? 'outlined' : 'filled'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onViewDetails(booking)}
                    >
                      Details
                    </Button>
                    {booking.status === 'Pending' && (
                      <IconButton
                        color="success"
                        onClick={() => onConfirm(booking._id)}
                        title="Confirm Booking"
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                    {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                      <IconButton
                        color="error"
                        onClick={() => onCancel(booking._id)}
                        title="Cancel Booking"
                        size="small"
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                    {booking.status !== 'Paid' && booking.status !== 'Cancelled' && (
                      <IconButton
                        color="primary"
                        onClick={() => onMarkPaid(booking._id)}
                        title="Mark as Paid"
                        size="small"
                      >
                        <PaymentIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="info"
                      onClick={() => onEdit(booking)}
                      title="Edit Booking"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => onDelete(booking._id)}
                      title="Delete Booking"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoomBookingsTable;
