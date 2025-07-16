import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchBookings();
  }, []);
  async function fetchBookings() {
    try {
      const { data } = await axios.get('/bookings', { withCredentials: true });
      console.log('Fetched bookings:', data);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  function openDetailDialog(booking) {
    console.log('Selected booking:', JSON.stringify(booking, null, 2)); 
    setSelected(booking);
    setDetailDialogOpen(true);
  }
  function closeDetailDialog() {
    setDetailDialogOpen(false);
    setSelected(null);
  }

  function openEditDialog() {
    if (!selected) return;
    
    if (!isAdmin) {
      alert('Only administrators can modify bookings');
      return;
    }
    
    setEditForm({
      mealPlan: selected.mealPlan || '',
      adults: selected.adults || 1,
      children: selected.children || [],
      specialRequests: selected.specialRequests || '',
      clientDetails: {
        name: selected.clientDetails?.name || '',
        email: selected.clientDetails?.email || '',
        phone: selected.clientDetails?.phone || '',
        companyName: selected.clientDetails?.companyName || ''
      },
      checkIn: selected.checkIn ? new Date(selected.checkIn).toISOString().split('T')[0] : '',
      checkOut: selected.checkOut ? new Date(selected.checkOut).toISOString().split('T')[0] : '',
      passengerDetails: selected.passengerDetails || [],
    });
    setEditDialogOpen(true);
  }
  function closeEditDialog() {
    setEditDialogOpen(false);
    setEditForm({});
  }

  async function saveEditedBooking() {
    if (!selected || !isAdmin) return;
    
    const ok = window.confirm('Save changes to this booking? This will mark the booking as Modified.');
    if (!ok) return;
    try {
      const { data } = await axios.put(
        `/bookings/${selected._id}`,
        { 
          ...editForm,
          status: 'Modified',
          hotelId: selected.hotel?._id,
          roomId: selected.room?._id
        },
        { withCredentials: true }
      );
      setBookings(bs => bs.map(b => b._id === data._id ? data : b));
      setSelected(data);
      closeEditDialog();
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save booking changes. Please try again.');
    }
  }

  async function updateStatus(newStatus) {
    if (!selected || !isAdmin) return;
    
    if (newStatus === 'Confirmed') {
      alert('Please use the "Confirm" button to handle booking confirmation');
      return;
    }
    
    const ok = window.confirm(`Mark booking as "${newStatus}"?`);
    if (!ok) return;
    try {
      const { data } = await axios.put(
        `/bookings/${selected._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setBookings(bs => bs.map(b => b._id === data._id ? data : b));
      setSelected(data);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  }

  async function markAsPaid() {
    if (!selected || !isAdmin) return;
    const ok = window.confirm('Confirm marking as Paid?');
    if (!ok) return;
    try {
      const { data } = await axios.put(
        `/bookings/${selected._id}`,
        { status: 'Paid' },
        { withCredentials: true }
      );
      setBookings(bs => bs.map(b => b._id === data._id ? data : b));
      setSelected(data);
    } catch (err) {
      console.error('Error marking paid:', err);
      alert('Failed to mark as paid. Please try again.');
    }
  }

  async function deleteBooking(id) {
    if (!isAdmin) {
      alert('Only administrators can delete bookings');
      return;
    }
    const ok = window.confirm('Delete booking permanently?');
    if (!ok) return;
    try {
      await axios.delete(`/bookings/${id}`, { withCredentials: true });
      setBookings(bs => bs.filter(b => b._id !== id));
      if (selected?._id === id) closeDetailDialog();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete booking. Please try again.');
    }
  }

  async function confirmBooking(id, event) {
    if (event) event.stopPropagation();
    if (!isAdmin) {
      alert('Only administrators can confirm bookings');
      return;
    }
    const bookingId = id || selected?._id;
    if (!bookingId) {
      alert('No booking selected');
      return;
    }
    const booking = bookings.find(b => b._id === bookingId);
    if (!booking) {
      alert('Booking not found');
      return;
    }
    if (!booking.hotel?._id || !booking.room?._id) {
      alert('Invalid hotel or room data. Please check booking details.');
      console.error('Missing hotelId or roomId:', { hotelId: booking.hotel?._id, roomId: booking.room?._id });
      return;
    }
    if (!booking.checkIn || !booking.checkOut) {
      alert('Invalid check-in or check-out dates. Please edit the booking to set valid dates.');
      console.error('Invalid dates:', { checkIn: booking.checkIn, checkOut: booking.checkOut });
      return;
    }
    const ok = window.confirm('Confirm this booking?');
    if (!ok) return;
    try {
      const payload = {
        status: 'Confirmed',
        forceConfirm: true,
        hotelId: booking.hotel._id,
        roomId: booking.room._id,
        checkIn: new Date(booking.checkIn).toISOString().split('T')[0], 
        checkOut: new Date(booking.checkOut).toISOString().split('T')[0],
        mealPlan: booking.mealPlan || 'All-Inclusive',
        adults: booking.adults || 1,
        children: booking.children || [],
        specialRequests: booking.specialRequests || '',
        clientDetails: {
          name: booking.clientDetails?.name || '',
          email: booking.clientDetails?.email || '',
          phone: booking.clientDetails?.phone || '',
          companyName: booking.clientDetails?.companyName || ''
        }
      };
      console.log('Confirming booking with payload:', payload);
      const { data } = await axios.put(
        `/bookings/${bookingId}`,
        payload,
        { withCredentials: true }
      );
      if (!data || !data._id) {
        throw new Error('Invalid response from server');
      }
      setBookings(bs => bs.map(b => b._id === data._id ? data : b));
      if (selected && selected._id === bookingId) {
        setSelected(data);
      }
      alert('Booking confirmed successfully');
    } catch (err) {
      console.error('Error confirming booking:', err);
      console.error('Full error response:', err.response);
      const errorMessage = err.response?.data?.msg || 'Failed to confirm booking. Please try again.';
      alert(errorMessage);
    }
  }

  async function reconfirmBooking(id, event) {
    if (event) event.stopPropagation();
    if (!isAdmin) {
      alert('Only administrators can reconfirm bookings');
      return;
    }
    const bookingId = id || selected?._id;
    if (!bookingId) {
      alert('No booking selected');
      return;
    }
    const booking = bookings.find(b => b._id === bookingId);
    if (!booking) {
      alert('Booking not found');
      return;
    }
    if (!booking.hotel?._id || !booking.room?._id) {
      alert('Invalid hotel or room data. Please check booking details.');
      console.error('Missing hotelId or roomId:', { hotelId: booking.hotel?._id, roomId: booking.room?._id });
      return;
    }
    if (!booking.checkIn || !booking.checkOut) {
      alert('Invalid check-in or check-out dates. Please edit the booking to set valid dates.');
      console.error('Invalid dates:', { checkIn: booking.checkIn, checkOut: booking.checkOut });
      return;
    }
    const ok = window.confirm('Reconfirm this booking?');
    if (!ok) return;
    try {
      const payload = {
        status: 'Confirmed',
        forceConfirm: true,
        hotelId: booking.hotel._id,
        roomId: booking.room._id,
        checkIn: new Date(booking.checkIn).toISOString().split('T')[0], // Match editForm format
        checkOut: new Date(booking.checkOut).toISOString().split('T')[0],
        mealPlan: booking.mealPlan || 'All-Inclusive',
        adults: booking.adults || 1,
        children: booking.children || [],
        specialRequests: booking.specialRequests || '',
        clientDetails: {
          name: booking.clientDetails?.name || '',
          email: booking.clientDetails?.email || '',
          phone: booking.clientDetails?.phone || '',
          companyName: booking.clientDetails?.companyName || ''
        }
      };
      console.log('Reconfirming booking with payload:', payload);
      const { data } = await axios.put(
        `/bookings/${bookingId}`,
        payload,
        { withCredentials: true }
      );
      if (!data || !data._id) {
        throw new Error('Invalid response from server');
      }
      setBookings(bs => bs.map(b => b._id === data._id ? data : b));
      if (selected && selected._id === bookingId) {
        setSelected(data);
      }
      alert('Booking reconfirmed successfully');
    } catch (err) {
      console.error('Error reconfirming booking:', err);
      console.error('Full error response:', err.response);
      const errorMessage = err.response?.data?.msg || 'Failed to reconfirm booking. Please try again.';
      alert(errorMessage);
    }
  }

  const statusColor = s => ({
    Pending: 'warning',
    Confirmed: 'success',
    Cancelled: 'error',
    Modified: 'info',
    Completed: 'default',
    Paid: 'primary'
  }[s] || 'default');

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Booking Management</Typography>
      {loading ? (
        <Box textAlign="center" p={4}><CircularProgress/></Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Hotel</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>Check‑In</TableCell>
                <TableCell>Check‑Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b._id} hover>
                  <TableCell>{b.bookingReference}</TableCell>
                  <TableCell>{b.hotel?.name||'—'}</TableCell>
                  <TableCell>{b.clientDetails?.name||'—'}</TableCell>
                  <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                  <TableCell><Chip label={b.status} color={statusColor(b.status)}/></TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={()=>openDetailDialog(b)}>Details</Button>
                      {isAdmin && b.status === 'Pending' && (
                        <IconButton 
                          color="success" 
                          onClick={(e) => confirmBooking(b._id, e)}
                          size="small"
                          title="Confirm Booking"
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                      {isAdmin && b.status === 'Modified' && (
                        <IconButton 
                          color="info" 
                          onClick={(e) => reconfirmBooking(b._id, e)}
                          size="small"
                          title="Reconfirm Booking"
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                      {isAdmin && <IconButton color="error" size="small" onClick={(e)=>{e.stopPropagation(); deleteBooking(b._id)}}><DeleteIcon/></IconButton>}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog open={detailDialogOpen} onClose={closeDetailDialog} fullWidth maxWidth="sm">
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selected && (
            <Grid container spacing={2} sx={{mt:1}}>
              <Grid item xs={6}>
                <Typography><strong>Reference:</strong> {selected.bookingReference}</Typography>
                <Typography><strong>Hotel:</strong> {selected.hotel?.name}</Typography>
                <Typography><strong>Guest:</strong> {selected.clientDetails?.name}</Typography>
                <Typography><strong>Room:</strong> {selected.room?.roomName}</Typography>
                <Typography><strong>Status:</strong><Chip size="small" label={selected.status} color={statusColor(selected.status)} sx={{ml:1}}/></Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Check‑In:</strong> {new Date(selected.checkIn).toLocaleDateString()}</Typography>
                <Typography><strong>Check‑Out:</strong> {new Date(selected.checkOut).toLocaleDateString()}</Typography>
                <Typography><strong>Adults:</strong> {selected.adults}</Typography>
                <Typography><strong>Children:</strong> {selected.children?.map(c=>c.age).join(', ')||'None'}</Typography>
              </Grid>
            </Grid>
          )}

          {/* Client Details */}
          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Client Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-blue-900">{selected?.clientDetails?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-blue-900">{selected?.clientDetails?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium text-blue-900">{selected?.clientDetails?.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Company</span>
                  <span className="font-medium text-blue-900">{selected?.clientDetails?.companyName}</span>
                </div>
              </div>
            </div>
          </div>            
          {/* Agent Details */}
          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Agent Details
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Agent Email</span>
                <span className="font-medium text-blue-900">{selected?.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          {/* Add price breakdown component here */}
        </DialogContent>
        <DialogActions>
          {isAdmin && selected?.status === 'Pending' && (
            <Button 
              variant="contained"
              color="success" 
              onClick={() => confirmBooking(selected._id)} 
              startIcon={<CheckIcon />}
            >
              Confirm
            </Button>
          )}
          {isAdmin && selected?.status === 'Modified' && (
            <Button 
              variant="contained"
              color="info" 
              onClick={() => reconfirmBooking()} 
              startIcon={<CheckIcon />}
            >
              Reconfirm
            </Button>
          )}
          {isAdmin && selected && selected.status !== 'Cancelled' && (
            <IconButton color="warning" onClick={() => updateStatus('Cancelled')} title="Cancel">
              <CancelIcon />
            </IconButton>
          )}
          {isAdmin && selected && (
            <IconButton color="info" onClick={markAsPaid} title="Mark Paid">
              <PaymentIcon />
            </IconButton>
          )}
          {isAdmin && (
            <IconButton color="primary" onClick={openEditDialog} title="Edit">
              <EditIcon />
            </IconButton>
          )}
          {isAdmin && selected && (
            <IconButton color="error" onClick={() => deleteBooking(selected._id)} title="Delete">
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={closeDetailDialog}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="md">
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{mt:1}}>
            {/* Client Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{mb:1}}>Client Details</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Client Name" 
                value={editForm.clientDetails?.name || ''} 
                onChange={e => setEditForm({
                  ...editForm, 
                  clientDetails: {...editForm.clientDetails, name: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Company Name" 
                value={editForm.clientDetails?.companyName || ''} 
                onChange={e => setEditForm({
                  ...editForm, 
                  clientDetails: {...editForm.clientDetails, companyName: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Email" 
                type="email"
                value={editForm.clientDetails?.email || ''} 
                onChange={e => setEditForm({
                  ...editForm, 
                  clientDetails: {...editForm.clientDetails, email: e.target.value}
                })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Phone" 
                value={editForm.clientDetails?.phone || ''} 
                onChange={e => setEditForm({
                  ...editForm, 
                  clientDetails: {...editForm.clientDetails, phone: e.target.value}
                })}
              />
            </Grid>
            
            {/* Passenger Details*/}
            {Array.isArray(editForm.passengerDetails) && editForm.passengerDetails.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{mt:2, mb:1}}>Passenger Details</Typography>
                {editForm.passengerDetails.map((p, idx) => (
                  <React.Fragment key={idx}>
                    <Typography variant="subtitle2" sx={{mt:2, mb:1}}>Passenger {idx + 1}</Typography>
                    <Grid container spacing={2} sx={{mb:1, pl:1}}>
                      {/* Row 1*/}
                      <Grid item xs={4}>
                        <TextField label="Name" fullWidth value={p.name || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].name = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }}/>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField label="Passport" fullWidth value={p.passport || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].passport = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }}/>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField label="Country" fullWidth value={p.country || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].country = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }}/>
                      </Grid>
                      {/* Row 2*/}
                      <Grid item xs={3}>
                        <TextField label="Arrival Flight No." fullWidth value={p.arrivalFlightNumber || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].arrivalFlightNumber = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }}/>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField label="Arrival Time" type="time" fullWidth value={p.arrivalTime || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].arrivalTime = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }} InputLabelProps={{ shrink: true }}/>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField label="Departure Flight No." fullWidth value={p.departureFlightNumber || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].departureFlightNumber = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }}/>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField label="Departure Time" type="time" fullWidth value={p.departureTime || ''} onChange={e => {
                          const updated = [...editForm.passengerDetails];
                          updated[idx].departureTime = e.target.value;
                          setEditForm({...editForm, passengerDetails: updated});
                        }} InputLabelProps={{ shrink: true }}/>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            )}

            {/* Children Details */}
            {Array.isArray(editForm.children) && editForm.children.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{mt:2, mb:1}}>Children Details</Typography>
                {editForm.children.map((child, idx) => (
                  <Grid container spacing={2} sx={{mb:1, pl:1}} key={idx} alignItems="center">
                    <Grid item xs={2}>
                      <Typography variant="subtitle2">Child {idx + 1}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Age"
                        type="number"
                        fullWidth
                        value={child.age || ''}
                        onChange={e => {
                          const updated = [...editForm.children];
                          updated[idx].age = Number(e.target.value);
                          setEditForm({...editForm, children: updated});
                        }}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Booking Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{mt:2, mb:1}}>Booking Details</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Check-In Date" 
                type="date"
                value={editForm.checkIn || ''} 
                onChange={e => setEditForm({...editForm, checkIn: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Check-Out Date" 
                type="date"
                value={editForm.checkOut || ''} 
                onChange={e => setEditForm({...editForm, checkOut: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Meal Plan</InputLabel>
                <Select 
                  value={editForm.mealPlan || ''} 
                  onChange={e => setEditForm({...editForm, mealPlan: e.target.value})} 
                  label="Meal Plan"
                >
                  <MenuItem value="Room Only">Room Only</MenuItem>
                  <MenuItem value="Bed & Breakfast">Bed & Breakfast</MenuItem>
                  <MenuItem value="Half Board">Half Board</MenuItem>
                  <MenuItem value="Full Board">Full Board</MenuItem>
                  <MenuItem value="All-Inclusive">All-Inclusive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Adults" 
                type="number" 
                value={editForm.adults || 1} 
                onChange={e => setEditForm({...editForm, adults: Number(e.target.value)})} 
                InputProps={{ inputProps:{min:1} }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Special Requests" 
                multiline 
                rows={3} 
                value={editForm.specialRequests || ''} 
                onChange={e => setEditForm({...editForm, specialRequests: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="inherit">Cancel</Button>
          <Button onClick={saveEditedBooking} variant="contained" color="primary" endIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}