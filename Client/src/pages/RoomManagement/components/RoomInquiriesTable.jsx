import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, Typography, Box, IconButton, Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  KingBed as KingBedIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const RoomInquiriesTable = ({ inquiries, onAction }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Guest Name</TableCell>
            <TableCell>Contact</TableCell>
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
          {inquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography color="textSecondary">No room inquiries found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map(inquiry => (
              <TableRow key={inquiry._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography>{inquiry.guestName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">{inquiry.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" />
                      <Typography variant="body2">{inquiry.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HotelIcon />
                    <Typography>
                      {inquiry.hotel_name || 'Unknown Hotel'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <KingBedIcon />
                    <Typography>{inquiry.room_name || 'Unknown Room'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon />
                    <Typography>{new Date(inquiry.check_in).toLocaleDateString()}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon />
                    <Typography>{new Date(inquiry.check_out).toLocaleDateString()}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    <Typography>{inquiry.guest_count} guests</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={inquiry.status}
                    color={inquiry.status === 'confirmed' ? 'success' : inquiry.status === 'cancelled' ? 'error' : 'warning'}
                    variant={inquiry.status === 'pending' ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {inquiry.status === 'pending' && (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => onAction(inquiry._id, 'confirmed')}
                          title="Confirm Inquiry"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => onAction(inquiry._id, 'cancelled')}
                          title="Cancel Inquiry"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
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

export default RoomInquiriesTable;
