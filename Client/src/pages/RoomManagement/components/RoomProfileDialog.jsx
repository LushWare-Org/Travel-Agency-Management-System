import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Box, Chip, ImageList, ImageListItem
} from '@mui/material';

const RoomProfileDialog = ({ open, onClose, selectedRoom }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Room Profile</DialogTitle>
      <DialogContent dividers>
        {selectedRoom && (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Basic</Typography>
              <Typography>
                <strong>Name:</strong> {selectedRoom.roomName}
              </Typography>
              <Typography>
                <strong>Type:</strong> {selectedRoom.roomType}
              </Typography>
              <Typography>
                <strong>Size:</strong> {selectedRoom.size} sqm
              </Typography>
              <Typography>
                <strong>Bed:</strong> {selectedRoom.bedType}
              </Typography>
              <Typography>
                <strong>Max:</strong> {selectedRoom.maxOccupancy.adults} adults,{' '}
                {selectedRoom.maxOccupancy.children} children
              </Typography>
              {selectedRoom.prices && selectedRoom.prices.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Additional Market Prices
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                    {selectedRoom.prices.map((p, i) => (
                      <Chip
                        key={i}
                        label={p.market ? `${p.market}: +$${p.price}` : 'Unknown Market'}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
              {selectedRoom.pricePeriods && selectedRoom.pricePeriods.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Price Periods
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                    {selectedRoom.pricePeriods.map((p, i) => (
                      <Chip
                        key={i}
                        label={`${new Date(p.startDate).toLocaleDateString()} - ${new Date(p.endDate).toLocaleDateString()}: $${p.price}`}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
              {selectedRoom.transportations && selectedRoom.transportations.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Transportation
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                    {selectedRoom.transportations.map((t, i) => (
                      <Chip
                        key={i}
                        label={`${t.type.charAt(0).toUpperCase() + t.type.slice(1)}: ${t.method}`}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography variant="subtitle1">Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedRoom.amenities.map((a, i) => (
                  <Chip key={i} label={a} />
                ))}
              </Box>
              <Typography variant="subtitle1">Availability</Typography>
              {selectedRoom.availabilityCalendar.map((r, i) => (
                <Typography key={i}>{`${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}`}</Typography>
              ))}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Gallery
              </Typography>
              <ImageList cols={3} rowHeight={120} gap={8}>
                {selectedRoom.gallery.map((url, i) => (
                  <ImageListItem key={i}>
                    <img src={url} alt="room" loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomProfileDialog;
