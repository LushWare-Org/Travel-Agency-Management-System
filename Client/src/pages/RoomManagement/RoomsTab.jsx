import React from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Button, Box, IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const RoomsTab = ({ rooms, hotels, onAddRoom, onEditRoom, onDeleteRoom, onViewProfile }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddRoom} sx={{ mb: 2 }}>
        Add Room
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hotel</TableCell>
              <TableCell>Room Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">No rooms found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map(r => (
                <TableRow key={r._id}>
                  <TableCell>
                    {(() => {
                      const hotel = r.hotel;
                      if (!hotel) return 'Unknown Hotel';
                      const hotelId = typeof hotel === 'object' ? (hotel._id || hotel.$oid) : hotel;
                      return hotels.find(h => h._id === hotelId)?.name || 'Unknown Hotel';
                    })()}
                  </TableCell>
                  <TableCell>{r.roomName}</TableCell>
                  <TableCell>{r.roomType}</TableCell>
                  <TableCell>
                    ${(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const currentPeriod = r.pricePeriods?.find(p => {
                        const start = new Date(p.startDate);
                        const end = new Date(p.endDate);
                        return start <= today && end >= today;
                      });
                      return currentPeriod?.price || 0;
                    })()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditRoom(r)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteRoom(r._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <Button onClick={() => onViewProfile(r)}>
                      Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RoomsTab;
