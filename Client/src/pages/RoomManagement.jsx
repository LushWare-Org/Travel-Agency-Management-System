import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Grid,
  CircularProgress, Snackbar, Alert, IconButton, Select, MenuItem, InputLabel,
  FormControl, Chip, ImageList, ImageListItem, Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { Tabs, Tab, Card, CardContent, CardActions, Divider, Badge } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  KingBed as KingBedIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import UploadProgress from '../Components/UploadProgress';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Predefined markets
const defaultMarkets = [
  'India',
  'China',
  'Middle East',
  'South East Asia',
  'Asia',
  'Europe',
  'Russia & CIS',
];

const RoomManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatuses, setUploadStatuses] = useState([]); // Track upload status for each image
  const [customMarkets, setCustomMarkets] = useState([]); 
  const [activeTab, setActiveTab] = useState(0);
  const [roomInquiries, setRoomInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false); 

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const [form, setForm] = useState({
    hotelId: '',
    roomName: '',
    roomType: '',
    description: '',
    size: '',
    bedType: '',
    maxAdults: '',
    maxChildren: '',
    amenities: [],
    amenityInput: '',
    basePrice: '',
    availabilityCalendar: [],
    availStart: null,
    availEnd: null,
    gallery: [],
    prices: [],
    priceMarketInput: '',
    priceValueInput: '',
    pricePeriods: [],
    pricePeriodStart: null,
    pricePeriodEnd: null,
    pricePeriodValue: '',
    transportations: [],
    newTransportType: '',
    newTransportMethod: '',
    newMarketInput: '',
  });

  const transportationOptions = [
    {
      type: 'arrival',
      methods: ['Speedboat Transfer', 'Seaplane Transfer', 'Private Transfer', 'Shared Transfer', 'Domestic Flight']
    },
    {
      type: 'departure',
      methods: ['Speedboat Transfer', 'Seaplane Transfer', 'Private Transfer', 'Shared Transfer', 'Domestic Flight']
    }
  ];

  const markets = [...defaultMarkets, ...customMarkets];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [hRes, rRes] = await Promise.all([
          axios.get('/hotels', { withCredentials: true }),
          axios.get('/rooms', { withCredentials: true })
        ]);
        setHotels(hRes.data);
        setRooms(rRes.data);
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError('Failed to load room data. Please try refreshing the page.');
        setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchRoomInquiries = async () => {
    try {
      setInquiriesLoading(true);
      const response = await axios.get('/inquiries?inquiry_type=room', { withCredentials: true });
      setRoomInquiries(response.data);
    } catch (err) {
      console.error('Error fetching room inquiries:', err);
      setSnackbar({ open: true, message: 'Failed to load room inquiries', severity: 'error' });
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchRoomInquiries();
    }
  }, [activeTab]);

  const resetForm = () => setForm({
    hotelId: '',
    roomName: '',
    roomType: '',
    description: '',
    size: '',
    bedType: '',
    maxAdults: '',
    maxChildren: '',
    amenities: [],
    amenityInput: '',
    basePrice: '',
    availabilityCalendar: [],
    availStart: null,
    availEnd: null,
    gallery: [],
    prices: [],
    priceMarketInput: '',
    priceValueInput: '',
    pricePeriods: [],
    pricePeriodStart: null,
    pricePeriodEnd: null,
    pricePeriodValue: '',
    transportations: [],
    newTransportType: '',
    newTransportMethod: '',
    newMarketInput: '',
  });

  const openDialog = room => {
    if (room) {
      setEditing(room);
      setForm({
        hotelId: room.hotel?._id || room.hotel || '',
        roomName: room.roomName || '',
        roomType: room.roomType || '',
        description: room.description || '',
        size: room.size || '',
        bedType: room.bedType || '',
        maxAdults: room.maxOccupancy?.adults || '',
        maxChildren: room.maxOccupancy?.children || '',
        amenities: room.amenities || [],
        amenityInput: '',
        basePrice: room.basePrice || '',
        availabilityCalendar: (room.availabilityCalendar || []).map(r => ({
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate)
        })),
        availStart: null,
        availEnd: null,
        gallery: room.gallery || [],
        prices: (room.prices || []).map(p => ({
          market: p.market || '',
          price: p.price || 0
        })),
        priceMarketInput: '',
        priceValueInput: '',
        pricePeriods: (room.pricePeriods || []).map(p => ({
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
          price: p.price || 0
        })),
        pricePeriodStart: null,
        pricePeriodEnd: null,
        pricePeriodValue: '',
        transportations: room.transportations || [],
        newTransportType: '',
        newTransportMethod: '',
        newMarketInput: '',
      });
      setUploadStatuses((room.gallery || []).map(url => ({ file: null, status: 'success', url, error: null })));
    } else {
      setEditing(null);
      resetForm();
      setUploadStatuses([]);
    }
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    resetForm();
    setUploadStatuses([]);
  };

  const addAvailability = () => {
    if (form.availStart && form.availEnd) {
      setForm(f => ({
        ...f,
        availabilityCalendar: [...f.availabilityCalendar, { startDate: f.availStart, endDate: f.availEnd }],
        availStart: null,
        availEnd: null
      }));
    }
  };

  const removeAvailability = idx => {
    setForm(f => ({
      ...f,
      availabilityCalendar: f.availabilityCalendar.filter((_, i) => i !== idx)
    }));
  };

  const addPriceEntry = () => {
    if (form.priceMarketInput && form.priceValueInput) {
      const marketName = form.priceMarketInput.trim();
      const price = Number(form.priceValueInput);
      if (marketName && !isNaN(price)) {
        const existingIndex = form.prices.findIndex(p => p.market === marketName);
        if (existingIndex >= 0) {
          const updatedPrices = [...form.prices];
          updatedPrices[existingIndex] = { market: marketName, price };
          setForm(f => ({
            ...f,
            prices: updatedPrices,
            priceMarketInput: '',
            priceValueInput: ''
          }));
        } else {
          setForm(f => ({
            ...f,
            prices: [...f.prices, { market: marketName, price }],
            priceMarketInput: '',
            priceValueInput: ''
          }));
        }
      }
    }
  };

  const addPricePeriod = () => {
    if (form.pricePeriodStart && form.pricePeriodEnd && form.pricePeriodValue) {
      setForm(f => ({
        ...f,
        pricePeriods: [
          ...f.pricePeriods,
          {
            startDate: f.pricePeriodStart,
            endDate: f.pricePeriodEnd,
            price: Number(form.pricePeriodValue)
          },
        ],
        pricePeriodStart: null,
        pricePeriodEnd: null,
        pricePeriodValue: ''
      }));
    }
  };

  const removePricePeriod = idx => {
    setForm(f => ({
      ...f,
      pricePeriods: f.pricePeriods.filter((_, i) => i !== idx)
    }));
  };

  const addTransportation = () => {
    if (form.newTransportType && form.newTransportMethod) {
      setForm(f => ({
        ...f,
        transportations: [
          ...f.transportations,
          { type: f.newTransportType, method: f.newTransportMethod }
        ],
        newTransportType: '',
        newTransportMethod: ''
      }));
    }
  };

  const removeTransportation = idx => {
    setForm(f => ({
      ...f,
      transportations: f.transportations.filter((_, i) => i !== idx)
    }));
  };

  const addCustomMarket = () => {
    const newMarket = form.newMarketInput.trim();
    if (newMarket && !markets.includes(newMarket)) {
      setCustomMarkets(prev => [...prev, newMarket]);
      setForm(f => ({ ...f, newMarketInput: '' }));
      setSnackbar({ open: true, message: 'Market added', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Invalid or duplicate market name', severity: 'error' });
    }
  };

  const removeCustomMarket = idx => {
    setCustomMarkets(prev => prev.filter((_, i) => i !== idx));
    setForm(f => ({
      ...f,
      prices: f.prices.filter(p => p.market !== customMarkets[idx])
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      hotel: form.hotelId,
      roomName: form.roomName,
      roomType: form.roomType,
      description: form.description,
      size: Number(form.size) || 0,
      bedType: form.bedType,
      maxOccupancy: {
        adults: Number(form.maxAdults) || 0,
        children: Number(form.maxChildren) || 0
      },
      amenities: form.amenities,
      basePrice: Number(form.basePrice) || 0,
      availabilityCalendar: form.availabilityCalendar.map(r => ({
        startDate: r.startDate,
        endDate: r.endDate
      })),
      gallery: form.gallery,
      prices: form.prices.map(p => ({
        market: p.market,
        price: p.price
      })),
      pricePeriods: form.pricePeriods.map(p => ({
        startDate: p.startDate,
        endDate: p.endDate,
        price: p.price
      })),
      transportations: form.transportations
    };
    try {
      let res;
      if (editing) {
        res = await axios.put(`/rooms/${editing._id}`, payload, { withCredentials: true });
        setRooms(rs => rs.map(r => (r._id === editing._id ? res.data : r)));
        setSnackbar({ open: true, message: 'Room updated', severity: 'success' });
      } else {
        res = await axios.post('/rooms', payload, { withCredentials: true });
        setRooms(rs => [res.data, ...rs]);
        setSnackbar({ open: true, message: 'Room added', severity: 'success' });
      }
      closeDialog();
    } catch (err) {
      console.error('Error saving room:', err);
      setSnackbar({ open: true, message: 'Save failed', severity: 'error' });
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await axios.delete(`/rooms/${id}`, { withCredentials: true });
      setRooms(rs => rs.filter(r => r._id !== id));
      setSnackbar({ open: true, message: 'Room deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const openRoomProfile = room => {
    setSelectedRoom(room);
    setOpenProfile(true);
  };

  const closeRoomProfile = () => setOpenProfile(false);

  const handleInquiryAction = async (inquiryId, action) => {
    try {
      await axios.put(`/api/inquiries/${inquiryId}`, { status: action }, { withCredentials: true });
      setRoomInquiries(prev => prev.map(inquiry => 
        inquiry._id === inquiryId ? { ...inquiry, status: action } : inquiry
      ));
      setSnackbar({ open: true, message: `Inquiry ${action} successfully`, severity: 'success' });
    } catch (err) {
      console.error(`Error ${action}ing inquiry:`, err);
      setSnackbar({ open: true, message: `Failed to ${action} inquiry`, severity: 'error' });
    }
  };

  const handleImageUpload = async (e, key, setForm, setSnackbar, setUploadProgress, setUploadStatuses) => {
    const files = [...e.target.files];
    if (!files.length) return;

    const initialStatuses = files.map(file => ({
      file,
      status: 'pending',
      url: null,
      error: null,
    }));
    setUploadStatuses(prev => [...prev, ...initialStatuses]);

    let successCount = 0;
    let completedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      setUploadStatuses(prev =>
        prev.map((s, idx) =>
          idx === prev.length - files.length + i ? { ...s, status: 'uploading' } : s
        )
      );

      try {
        const res = await fetch(
          'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
          { method: 'POST', body: formData }
        );
        const data = await res.json();

        if (data.data?.url) {
          setForm(prev => ({
            ...prev,
            [key]: [...prev[key], data.data.url],
          }));
          setUploadStatuses(prev =>
            prev.map((s, idx) =>
              idx === prev.length - files.length + i
                ? { ...s, status: 'success', url: data.data.url }
                : s
            )
          );
          successCount++;
          completedCount++;
          setUploadProgress((completedCount / files.length) * 100);
          setSnackbar({
            open: true,
            message: `Image ${successCount} of ${files.length} uploaded`,
            severity: 'success',
          });
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setUploadStatuses(prev =>
          prev.map((s, idx) =>
            idx === prev.length - files.length + i
              ? { ...s, status: 'error', error: `Failed to upload ${file.name}` }
              : s
          )
        );
        completedCount++;
        setUploadProgress((completedCount / files.length) * 100);
        setSnackbar({
          open: true,
          message: `Failed to upload image ${file.name}`,
          severity: 'error',
        });
      }
    }

    if (successCount === 0 && completedCount > 0) {
      setSnackbar({ open: true, message: 'No images were uploaded', severity: 'error' });
    }

    setTimeout(() => {
      setUploadProgress(0);
      setUploadStatuses(prev => prev.filter(s => s.status === 'success'));
    }, 1000);
  };

  const handleImageSelect = (e) => {
    handleImageUpload(e, 'gallery', setForm, setSnackbar, setUploadProgress, setUploadStatuses);
  };

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Room Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Rooms" />
          <Tab 
            label={
              <Badge badgeContent={roomInquiries.filter(i => i.status === 'pending').length} color="primary">
                Room Inquiries
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialog(null)} sx={{ mb: 2 }}>
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
                        <IconButton onClick={() => openDialog(r)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(r._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                        <Button onClick={() => openRoomProfile(r)}>
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
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mt: 3 }}>
          {inquiriesLoading ? (
            <Box textAlign="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
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
                  {roomInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography color="textSecondary">No room inquiries found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    roomInquiries.map(inquiry => (
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
                                  onClick={() => handleInquiryAction(inquiry._id, 'confirmed')}
                                  title="Confirm Inquiry"
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleInquiryAction(inquiry._id, 'cancelled')}
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
          )}
        </Box>
      </TabPanel>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Edit Room' : 'Add Room'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                value={hotels.find(h => h._id === form.hotelId) || null}
                onChange={(event, newValue) => {
                  setForm(f => ({ ...f, hotelId: newValue?._id || '' }));
                }}
                options={hotels}
                getOptionLabel={option => option.name || ''}
                renderInput={params => (
                  <TextField {...params} label="Hotel" fullWidth placeholder="Search for a hotel..." />
                )}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Room Name"
                fullWidth
                value={form.roomName}
                onChange={e => setForm(f => ({ ...f, roomName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Room Type"
                fullWidth
                value={form.roomType}
                onChange={e => setForm(f => ({ ...f, roomType: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size (sqm)"
                type="number"
                fullWidth
                value={form.size}
                onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Bed Type"
                fullWidth
                value={form.bedType}
                onChange={e => setForm(f => ({ ...f, bedType: e.target.value }))}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Adults"
                type="number"
                fullWidth
                value={form.maxAdults}
                onChange={e => setForm(f => ({ ...f, maxAdults: e.target.value }))}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Children"
                type="number"
                fullWidth
                value={form.maxChildren}
                onChange={e => setForm(f => ({ ...f, maxChildren: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {form.amenities.map((a, i) => (
                  <Chip
                    key={i}
                    label={a}
                    onDelete={() => setForm(f => ({ ...f, amenities: f.amenities.filter((_, idx) => idx !== i) }))}
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="Add amenity"
                  value={form.amenityInput}
                  onChange={e => setForm(f => ({ ...f, amenityInput: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && form.amenityInput.trim()) {
                      setForm(f => ({
                        ...f,
                        amenities: [...f.amenities, f.amenityInput.trim()],
                        amenityInput: '',
                      }));
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Manage Markets</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="New market name"
                  value={form.newMarketInput}
                  onChange={e => setForm(f => ({ ...f, newMarketInput: e.target.value }))}
                  sx={{ width: 200 }}
                />
                <Button variant="outlined" onClick={addCustomMarket}>
                  Add Market
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {customMarkets.map((m, i) => (
                  <Chip
                    key={i}
                    label={m}
                    onDelete={() => removeCustomMarket(i)}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Additional Market Prices</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 1 }}>
                {form.prices.map((p, i) => (
                  <Chip
                    key={i}
                    label={`${p.market}: $${p.price}`}
                    onDelete={() => setForm(f => ({ ...f, prices: f.prices.filter((_, idx) => idx !== i) }))}
                  />
                ))}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Market</InputLabel>
                  <Select
                    value={form.priceMarketInput}
                    label="Market"
                    onChange={e => setForm(f => ({ ...f, priceMarketInput: e.target.value }))}
                  >
                    {markets.map(m => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="number"
                  placeholder="Price"
                  value={form.priceValueInput}
                  onChange={e => setForm(f => ({ ...f, priceValueInput: e.target.value }))}
                  sx={{ width: 80 }}
                />
                <Button variant="outlined" onClick={addPriceEntry}>
                  Add
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Price Periods</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {form.pricePeriods.map((p, i) => (
                  <Chip
                    key={i}
                    label={`${p.startDate.toLocaleDateString()} - ${p.endDate.toLocaleDateString()}: $${p.price}`}
                    onDelete={() => removePricePeriod(i)}
                  />
                ))}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={4}>
                      <DatePicker
                        label="Period Start"
                        value={form.pricePeriodStart}
                        onChange={date => setForm(f => ({ ...f, pricePeriodStart: date }))}
                        renderInput={params => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <DatePicker
                        label="Period End"
                        value={form.pricePeriodEnd}
                        onChange={date => setForm(f => ({ ...f, pricePeriodEnd: date }))}
                        renderInput={params => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        value={form.pricePeriodValue}
                        onChange={e => setForm(f => ({ ...f, pricePeriodValue: e.target.value }))}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={addPricePeriod}>Add</Button>
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>Availability</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={5}>
                    <DatePicker
                      label="Start"
                      value={form.availStart}
                      onChange={date => setForm(f => ({ ...f, availStart: date }))}
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <DatePicker
                      label="End"
                      value={form.availEnd}
                      onChange={date => setForm(f => ({ ...f, availEnd: date }))}
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button onClick={addAvailability}>Add</Button>
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Box sx={{ mt: 1 }}>
                {form.availabilityCalendar.map((r, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography>{`${r.startDate.toLocaleDateString()} - ${r.endDate.toLocaleDateString()}`}</Typography>
                    <IconButton size="small" color="error" onClick={() => removeAvailability(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Transportation
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {form.transportations.map((t, i) => (
                  <Chip
                    key={i}
                    label={`${t.type.charAt(0).toUpperCase() + t.type.slice(1)}: ${t.method}`}
                    onDelete={() => removeTransportation(i)}
                  />
                ))}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Transport Type</InputLabel>
                    <Select
                      value={form.newTransportType}
                      label="Transport Type"
                      onChange={e => setForm(f => ({ ...f, newTransportType: e.target.value, newTransportMethod: '' }))}
                    >
                      <MenuItem value="arrival">Arrival Transfer</MenuItem>
                      <MenuItem value="departure">Departure Transfer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Transportation Method</InputLabel>
                    <Select
                      value={form.newTransportMethod}
                      label="Transportation Method"
                      onChange={e => setForm(f => ({ ...f, newTransportMethod: e.target.value }))}
                      disabled={!form.newTransportType}
                    >
                      {form.newTransportType ? (
                        transportationOptions
                          .find(opt => opt.type === form.newTransportType)
                          ?.methods.map(method => (
                            <MenuItem key={method} value={method}>
                              {method}
                            </MenuItem>
                          ))
                      ) : (
                        <MenuItem value="" disabled>
                          Select a transport type first
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    onClick={addTransportation}
                    disabled={!form.newTransportType || !form.newTransportMethod}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Gallery</Typography>
              <Button variant="contained" component="label">
                Upload
                <input
                  type="file"
                  hidden
                  onChange={handleImageSelect}
                  multiple
                  accept="image/*"
                />
              </Button>
              <ImageList cols={3} rowHeight={120} sx={{ mt: 1 }}>
                {uploadStatuses.map((status, i) => (
                  <ImageListItem key={i}>
                    {status.status === 'success' && typeof status.url === 'string' && (
                      <img src={status.url} alt="Room" loading="lazy" />
                    )}
                    {(status.status === 'pending' || status.status === 'uploading') && (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                        }}
                      >
                        <CircularProgress size={24} />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {status.status === 'pending' ? 'Pending' : 'Uploading'}
                        </Typography>
                      </Box>
                    )}
                    {status.status === 'error' && (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: 'error.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          flexDirection: 'column',
                        }}
                      >
                        <ErrorIcon color="error" />
                        <Typography variant="caption" color="error">
                          {status.error || 'Failed'}
                        </Typography>
                      </Box>
                    )}
                    {(status.status === 'pending' || status.status === 'uploading' || status.status === 'error') && (
                      <IconButton
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 4, right: 4 }}
                        onClick={() => setUploadStatuses(prev => prev.filter((_, idx) => idx !== i))}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    {status.status === 'success' && (
                      <IconButton
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 4, right: 4 }}
                        onClick={() =>
                          setForm(f => ({
                            ...f,
                            gallery: f.gallery.filter((_, idx) => idx !== i),
                          }))
                        }
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ImageListItem>
                ))}
              </ImageList>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <UploadProgress progress={uploadProgress} />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProfile} onClose={closeRoomProfile} fullWidth maxWidth="md">
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
          <Button onClick={closeRoomProfile}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RoomManagement;