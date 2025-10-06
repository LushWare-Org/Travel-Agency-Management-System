import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Hotel as HotelIcon,
  KingBed as RoomIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function BulkBooking() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '',
    checkOutTime: '',
    adults: 1,
    children: 0,
    mealPlan: 'All-Inclusive'
  });

  // Available rooms after date/time selection
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  
  // Client details for bulk booking
  const [clientDetails, setClientDetails] = useState([]);
  const [bulkClients, setBulkClients] = useState('');
  const [groupName, setGroupName] = useState('');

  const mealPlans = [
    'Room Only',
    'Bed & Breakfast',
    'Half Board',
    'Full Board',
    'All-Inclusive'
  ];

  const steps = [
    'Select Dates & Times',
    'Choose Available Rooms',
    'Add Client Details',
    'Review & Confirm'
  ];

  // Handle form data changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch available rooms based on selected dates
  const fetchAvailableRooms = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch available rooms from API
      const response = await axios.get('/rooms/available', {
        params: {
          checkIn: formData.checkInDate,
          checkOut: formData.checkOutDate,
          adults: formData.adults,
          children: formData.children
        },
        withCredentials: true
      });

      setAvailableRooms(response.data.data || []);
      setSelectedRooms([]); // Reset selected rooms
      
      if (response.data.data && response.data.data.length === 0) {
        setError('No rooms available for the selected dates');
      } else {
        setStep(1); // Move to room selection step
      }
    } catch (err) {
      console.error('Error fetching available rooms:', err);
      setError('Failed to fetch available rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle room selection
  const toggleRoomSelection = (room) => {
    setSelectedRooms(prev => {
      const isSelected = prev.some(r => r._id === room._id);
      if (isSelected) {
        return prev.filter(r => r._id !== room._id);
      } else {
        return [...prev, room];
      }
    });
  };

  // Process bulk clients text input
  const processBulkClients = () => {
    if (!bulkClients.trim()) {
      setError('Please enter client details');
      return;
    }

    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    try {
      const lines = bulkClients.split('\n').filter(line => line.trim());
      const clients = lines.map((line, index) => {
        const parts = line.split(',').map(p => p.trim());
        const name = parts[0] || '';
        const email = parts[1] || '';
        
        // Validate required fields
        if (!name || !email) {
          throw new Error(`Line ${index + 1}: Both name and email are required (format: Name, Email, Phone, Company)`);
        }
        
        return {
          id: Date.now() + index,
          name: name,
          email: email,
          phone: parts[2] || '',
          companyName: parts[3] || ''
        };
      });

      setClientDetails(clients);
      setError(null); // Clear any previous errors
      setStep(3); // Move to review step (step 3, not 2)
    } catch (error) {
      setError(error.message);
    }
  };

  // Create bulk booking
  const createBulkBookings = async () => {
    if (selectedRooms.length === 0 || clientDetails.length === 0 || !groupName.trim()) {
      setError('Please select rooms, add client details, and enter a group name');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const bookings = [];
      
      // Create booking data for each selected room and client combination
      for (let i = 0; i < selectedRooms.length && i < clientDetails.length; i++) {
        const room = selectedRooms[i];
        const client = clientDetails[i];
        
        const bookingData = {
          hotelId: room.hotelId || room.hotel._id,
          roomId: room._id,
          checkIn: formData.checkInDate,
          checkOut: formData.checkOutDate,
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime,
          adults: formData.adults,
          children: formData.children,
          mealPlan: formData.mealPlan,
          clientDetails: {
            name: client.name,
            email: client.email,
            phone: client.phone,
            companyName: client.companyName
          },
          status: 'Pending'
        };

        console.log(`Booking ${i + 1} - Room ID: ${room._id}, Room Name: ${room.roomName}`);

        bookings.push(bookingData);
      }

      // Create bulk booking via API
      const bulkBookingData = {
        groupName: groupName,
        checkIn: formData.checkInDate,
        checkOut: formData.checkOutDate,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        adults: formData.adults,
        children: formData.children,
        mealPlan: formData.mealPlan,
        bookings: bookings
      };

      console.log('Sending bulk booking data:', bulkBookingData);
      const response = await axios.post('/bulk-bookings', bulkBookingData, { withCredentials: true });
      
      setSuccess(`Successfully created bulk booking: ${groupName} (${response.data.totalBookings} bookings)`);
      setStep(0); // Reset to first step
      
      // Reset form
      setFormData({
        checkInDate: '',
        checkOutDate: '',
        checkInTime: '',
        checkOutTime: '',
        adults: 1,
        children: 0,
        mealPlan: 'All-Inclusive'
      });
      setAvailableRooms([]);
      setSelectedRooms([]);
      setClientDetails([]);
      setBulkClients('');
      setGroupName('');
      
    } catch (err) {
      console.error('Error creating bulk bookings:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.msg || 'Failed to create bulk bookings. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setStep(0);
    setFormData({
      checkInDate: '',
      checkOutDate: '',
      checkInTime: '',
      checkOutTime: '',
      adults: 1,
      children: 0,
      mealPlan: 'All-Inclusive'
    });
    setAvailableRooms([]);
    setSelectedRooms([]);
    setClientDetails([]);
    setBulkClients('');
    setGroupName('');
    setError(null);
    setSuccess(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Bulk Booking Form</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={resetForm}
          disabled={loading}
        >
          Reset Form
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={step} orientation="horizontal" sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 1: Select Dates & Times */}
      {step === 0 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Step 1: Select Dates & Times</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-in Date"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleFormChange('checkInDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-out Date"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleFormChange('checkOutDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-in Time"
                type="time"
                value={formData.checkInTime}
                onChange={(e) => handleFormChange('checkInTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Check-out Time"
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => handleFormChange('checkOutTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Adults"
                type="number"
                value={formData.adults}
                onChange={(e) => handleFormChange('adults', parseInt(e.target.value) || 1)}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Children"
                type="number"
                value={formData.children}
                onChange={(e) => handleFormChange('children', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Meal Plan</InputLabel>
                <Select
                  value={formData.mealPlan}
                  onChange={(e) => handleFormChange('mealPlan', e.target.value)}
                  label="Meal Plan"
                >
                  {mealPlans.map((plan) => (
                    <MenuItem key={plan} value={plan}>
                      {plan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={fetchAvailableRooms}
              disabled={loading || !formData.checkInDate || !formData.checkOutDate}
            >
              {loading ? <CircularProgress size={20} /> : 'Search Available Rooms'}
            </Button>
          </Box>
        </Card>
      )}

      {/* Step 2: Choose Available Rooms */}
      {step === 1 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Step 2: Choose Available Rooms</Typography>
          {availableRooms.length > 0 ? (
            <Grid container spacing={2}>
              {availableRooms.map((room) => (
                <Grid item xs={12} md={6} lg={4} key={room._id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedRooms.some(r => r._id === room._id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      '&:hover': { border: '2px solid #1976d2' }
                    }}
                    onClick={() => toggleRoomSelection(room)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <HotelIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {room.hotel?.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <RoomIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        <Typography variant="body1">
                          {room.roomName}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Capacity: {room.capacity} guests
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${room.price} / night
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Checkbox
                        checked={selectedRooms.some(r => r._id === room._id)}
                        onChange={() => toggleRoomSelection(room)}
                        color="primary"
                      />
                      <Typography variant="body2">
                        {selectedRooms.some(r => r._id === room._id) ? 'Selected' : 'Select Room'}
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No available rooms found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please try different dates or adjust your guest count
              </Typography>
            </Box>
          )}
          
          {selectedRooms.length > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Selected Rooms: {selectedRooms.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => setStep(2)}
                >
                  Continue to Client Details
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setStep(0)}
                >
                  Back to Dates
                </Button>
              </Box>
            </Box>
          )}
        </Card>
      )}

      {/* Step 3: Add Client Details */}
      {step === 2 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Step 3: Add Client Details</Typography>
          
          {/* Group Name Field */}
          <TextField
            fullWidth
            label="Group Name"
            placeholder="Enter group name (e.g., Corporate Retreat 2024)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mb: 3 }}
            required
            helperText="Enter a name for this bulk booking group"
          />
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Enter client details for each selected room. Format: Name, Email, Phone, Company (one per line)
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Client Details"
            placeholder="John Doe, john@email.com, +1234567890, Company Name&#10;Jane Smith, jane@email.com, +1234567891, Another Company"
            value={bulkClients}
            onChange={(e) => setBulkClients(e.target.value)}
            sx={{ mb: 3 }}
            helperText="Enter one client per line, separated by commas"
          />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setStep(1)}
            >
              Back to Rooms
            </Button>
            <Button
              variant="contained"
              onClick={processBulkClients}
              disabled={!bulkClients.trim() || !groupName.trim()}
            >
              Process Client Details
            </Button>
          </Box>
        </Card>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 3 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Step 4: Review & Confirm</Typography>
          
          {/* Booking Summary */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Booking Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography><strong>Group Name:</strong> {groupName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Check-in:</strong> {formData.checkInDate} {formData.checkInTime}</Typography>
                <Typography><strong>Check-out:</strong> {formData.checkOutDate} {formData.checkOutTime}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography><strong>Guests:</strong> {formData.adults} adults, {formData.children} children</Typography>
                <Typography><strong>Meal Plan:</strong> {formData.mealPlan}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Selected Rooms */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Selected Rooms ({selectedRooms.length})</Typography>
            <Grid container spacing={2}>
              {selectedRooms.map((room, index) => (
                <Grid item xs={12} md={6} key={room._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2">{room.hotel?.name}</Typography>
                      <Typography variant="body2">{room.roomName} - ${room.price}/night</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Client Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Client Details ({clientDetails.length})</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientDetails.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.companyName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setStep(2)}
            >
              Back to Client Details
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={createBulkBookings}
              disabled={loading || selectedRooms.length === 0 || clientDetails.length === 0}
            >
              {loading ? <CircularProgress size={20} /> : `Create ${selectedRooms.length} Bookings`}
            </Button>
          </Box>
        </Card>
      )}

      {/* Instructions */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.main', color: 'white', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Instructions:
        </Typography>
        <Typography variant="body2">
          • Step 1: Select check-in/out dates and times, then search for available rooms
          • Step 2: Choose rooms from the available options
          • Step 3: Add client details (one client per room selected)
          • Step 4: Review and confirm all bookings
        </Typography>
      </Box>
    </Paper>
  );
}
