import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Paper, Typography, IconButton, Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const RoomsTable = ({ rooms, hotels, onEdit, onDelete, onViewProfile }) => {
  return (
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
                  <IconButton onClick={() => onEdit(r)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(r._id)} color="error">
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
  );
};

export default RoomsTable;
