import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Paper, Box, CircularProgress, Alert, Snackbar, Alert as MuiAlert,
  Tabs, Tab, Badge
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TabPanel from './TabPanel';
import RoomsTab from './RoomsTab';
import RoomInquiriesTab from './RoomInquiriesTab';
import RoomDialog from './RoomDialog';
import RoomProfileDialog from './RoomProfileDialog';
import { defaultMarkets } from './constants';

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
  const [uploadStatuses, setUploadStatuses] = useState([]);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          <RoomsTab
            rooms={rooms}
            hotels={hotels}
            onAddRoom={() => openDialog(null)}
            onEditRoom={openDialog}
            onDeleteRoom={handleDelete}
            onViewProfile={openRoomProfile}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <RoomInquiriesTab
            roomInquiries={roomInquiries}
            inquiriesLoading={inquiriesLoading}
            onInquiryAction={handleInquiryAction}
          />
        </TabPanel>

        <RoomDialog
          open={open}
          onClose={closeDialog}
          editing={editing}
          form={form}
          setForm={setForm}
          hotels={hotels}
          customMarkets={customMarkets}
          markets={markets}
          uploadStatuses={uploadStatuses}
          setUploadStatuses={setUploadStatuses}
          uploadProgress={uploadProgress}
          onSubmit={handleSubmit}
          onAddAvailability={addAvailability}
          onRemoveAvailability={removeAvailability}
          onAddPriceEntry={addPriceEntry}
          onAddPricePeriod={addPricePeriod}
          onRemovePricePeriod={removePricePeriod}
          onAddTransportation={addTransportation}
          onRemoveTransportation={removeTransportation}
          onAddCustomMarket={addCustomMarket}
          onRemoveCustomMarket={removeCustomMarket}
          onImageSelect={handleImageSelect}
        />

        <RoomProfileDialog
          open={openProfile}
          onClose={closeRoomProfile}
          selectedRoom={selectedRoom}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </LocalizationProvider>
  );
};

export default RoomManagement;
