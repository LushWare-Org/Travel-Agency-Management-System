import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Avatar,
  Stack,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Hotel as HotelIcon,
  KingBed as KingBedIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  Close as CloseIcon,
  Flight as FlightIcon,
  CreditCard as PassportIcon,
  Public as CountryIcon
} from '@mui/icons-material';

const BookingDetailsDialog = ({ open, onClose, booking }) => {
  if (!booking) return null;

  const statusColor = (status) => ({
    Pending: 'warning',
    Confirmed: 'success',
    Cancelled: 'error',
    Modified: 'info',
    Completed: 'default',
    Paid: 'primary'
  }[status] || 'default');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Booking Details - {booking.bookingReference}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Chip
          label={booking.status}
          color={statusColor(booking.status)}
          size="small"
          sx={{ mt: 1 }}
        />
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Booking Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon />
              Booking Information
            </Typography>
            <Box sx={{ pl: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Check-in Date</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(booking.checkIn)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Check-out Date</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(booking.checkOut)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Nights</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.nights || Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Booking Date</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(booking.createdAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Guest Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              Guest Information
            </Typography>
            <Box sx={{ pl: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Guest Name</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.clientDetails?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Company</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.clientDetails?.companyName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    {booking.clientDetails?.email || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    {booking.clientDetails?.phone || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Hotel & Room Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HotelIcon />
              Accommodation Details
            </Typography>
            <Box sx={{ pl: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Hotel</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.hotel?.name || 'Unknown Hotel'}
                  </Typography>
                  {booking.hotel?.location && (
                    <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                      {booking.hotel.location}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Room</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.room?.roomName || 'Unknown Room'}
                  </Typography>
                  {booking.room?.roomType && (
                    <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                      {booking.room.roomType}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Guest Count & Meal Plan */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              Guest Details & Services
            </Typography>
            <Box sx={{ pl: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Total Adults</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.adults} adult{booking.adults !== 1 ? 's' : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Total Children</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.children?.length || 0} child{booking.children?.length !== 1 ? 'ren' : ''}
                    {booking.children?.length > 0 && (
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5 }}>
                        Ages: {booking.children.map(child => child.age).join(', ')}
                      </Typography>
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Meal Plan</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.mealPlan || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Rooms</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {booking.rooms || 1} room{booking.rooms !== 1 ? 's' : ''}
                  </Typography>
                </Grid>
                
                {/* Per-Room Breakdown */}
                {(booking.rooms || 1) > 1 && booking.passengerDetails && booking.passengerDetails.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
                      Room Distribution:
                    </Typography>
                    <Box sx={{ pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                      {(() => {
                        // Group passengers by room number
                        const roomGroups = booking.passengerDetails.reduce((acc, passenger) => {
                          const roomNum = passenger.roomNumber || 1;
                          if (!acc[roomNum]) {
                            acc[roomNum] = { adults: [], children: [] };
                          }
                          if (passenger.type === 'adult') {
                            acc[roomNum].adults.push(passenger);
                          } else {
                            acc[roomNum].children.push(passenger);
                          }
                          return acc;
                        }, {});

                        return Object.entries(roomGroups).map(([roomNum, passengers]) => (
                          <Box key={roomNum} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                              Room {roomNum}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {passengers.adults.length} adult{passengers.adults.length !== 1 ? 's' : ''}
                              {passengers.children.length > 0 && `, ${passengers.children.length} child${passengers.children.length !== 1 ? 'ren' : ''}`}
                            </Typography>
                            {passengers.children.length > 0 && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Children ages: {passengers.children.map(child => {
                                  // Find the corresponding child age from booking.children
                                  const childIndex = booking.passengerDetails.indexOf(child);
                                  const globalChildIndex = booking.passengerDetails.slice(0, childIndex).filter(p => p.type === 'child').length;
                                  return booking.children?.[globalChildIndex]?.age || 'N/A';
                                }).join(', ')}
                              </Typography>
                            )}
                          </Box>
                        ));
                      })()}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>

          {/* Price Breakdown */}
          {booking.priceBreakdown && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon />
                  Price Breakdown
                </Typography>
                <Box sx={{ pl: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Base Price per Night</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${booking.priceBreakdown.basePricePerNight || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Room Total</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${booking.priceBreakdown.roomTotal || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Meal Plan</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${booking.priceBreakdown.mealPlan?.price || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Market Surcharge</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${booking.priceBreakdown.marketSurcharge?.price || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${booking.priceBreakdown.total || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </>
          )}

          {/* Agent Information */}
          {booking.user && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Agent Information
                </Typography>
                <Box sx={{ pl: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Agent Email</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {booking.user.email || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Agency</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {booking.user.agencyProfile?.agencyName || 'Independent'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </>
          )}

          {/* Additional Services */}
          {booking.additionalServices && booking.additionalServices.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Additional Services</Typography>
                <Box sx={{ pl: 4 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {booking.additionalServices.map((service, index) => (
                      <Chip key={index} label={service} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </>
          )}

          {/* Passenger Details */}
          {booking.passengerDetails && booking.passengerDetails.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Passenger Details
                </Typography>
                <Box sx={{ pl: 4 }}>
                  {/* Group passengers by room */}
                  {(() => {
                    const passengersByRoom = booking.passengerDetails.reduce((acc, passenger, index) => {
                      const roomNumber = passenger.roomNumber || 1;
                      if (!acc[roomNumber]) {
                        acc[roomNumber] = [];
                      }
                      acc[roomNumber].push({ ...passenger, originalIndex: index });
                      return acc;
                    }, {});

                    return Object.entries(passengersByRoom).map(([roomNumber, passengers]) => (
                      <Box key={`room-${roomNumber}`} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HotelIcon fontSize="small" />
                          Room {roomNumber}
                        </Typography>
                        
                        {/* Room Summary */}
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {passengers.filter(p => p.type === 'adult').length} Adult{passengers.filter(p => p.type === 'adult').length !== 1 ? 's' : ''}, 
                            {passengers.filter(p => p.type === 'child').length} Child{passengers.filter(p => p.type === 'child').length !== 1 ? 'ren' : ''}
                          </Typography>
                        </Box>

                        {/* Individual Passengers */}
                        {passengers.map((passenger, passengerIndex) => (
                          <Box key={passenger.originalIndex} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: passenger.type === 'child' ? '#f8f9fa' : 'white' }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon fontSize="small" />
                              Passenger {passengerIndex + 1} ({passenger.type === 'child' ? 'Child' : 'Adult'})
                              {passenger.type === 'child' && (() => {
                                // Find the corresponding child age
                                const childPassengers = passengers.filter(p => p.type === 'child');
                                const childIndex = childPassengers.indexOf(passenger);
                                const globalChildIndex = booking.passengerDetails.slice(0, passenger.originalIndex).filter(p => p.type === 'child').length;
                                const age = booking.children?.[globalChildIndex]?.age;
                                return age ? ` - Age ${age}` : '';
                              })()}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Name</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.name || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PassportIcon fontSize="small" />
                                  Passport
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.passport || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CountryIcon fontSize="small" />
                                  Country
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.country || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <FlightIcon fontSize="small" />
                                  Arrival Flight
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.arrivalFlightNumber || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Arrival Time</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.arrivalTime ? formatTime(passenger.arrivalTime) : 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <FlightIcon fontSize="small" />
                                  Departure Flight
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.departureFlightNumber || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Departure Time</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {passenger.departureTime ? formatTime(passenger.departureTime) : 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    ));
                  })()}
                </Box>
              </Grid>
            </>
          )}

          {/* Children Details - Only show if no passenger details available */}
          {(!booking.passengerDetails || booking.passengerDetails.length === 0) && booking.children && booking.children.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  Children Details
                </Typography>
                <Box sx={{ pl: 4 }}>
                  {booking.children.map((child, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f8f9fa' }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                        Child {index + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Age: {child.age} {child.age === 1 ? 'year' : 'years'} old
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsDialog;
