import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField,  FormControl, InputLabel, Select, MenuItem, Grid, IconButton,
  Snackbar, Alert, Chip, Avatar, FormControlLabel, Checkbox,
  CircularProgress, Autocomplete
} from '@mui/material';
import UploadProgress from '../Components/UploadProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const defaultMarkets = [
    'India',
    'China',
    'Middle East',
    'South East Asia',
    'Asia',
    'Europe',
    'Russia & CIS',
  ];
  const [customMarkets, setCustomMarkets] = useState([]);
  const markets = [...defaultMarkets, ...customMarkets];

  const [formData, setFormData] = useState({
    description: '',
    discountType: 'percentage',
    discountValues: [], 
    imageURL: '',
    conditions: {
      minNights: '',
      bookingWindow: { start: null, end: null },
      stayPeriod: { start: null, end: null },
      bookingVolume: '',
      minStayDays: '',
      minBookings: '',
      isDefault: false,
      seasonalMonths: []
    },
    applicableHotels: [],
    active: true,
    validFrom: null,
    validTo: null,
    eligibleAgents: [],
    usedAgents: [],
    discountMarketInput: '',
    discountValueInput: '',
    discountTypeInput: 'percentage',
  });

  // Load discounts, hotels, and agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dRes, hRes, aRes] = await Promise.all([
          axios.get('/discounts', { withCredentials: true }),
          axios.get('/hotels', { withCredentials: true }),
          axios.get('/users', { withCredentials: true })
        ]);
        setDiscounts(dRes.data);
        setHotels(hRes.data);
        setAgents(aRes.data);
      } catch (err) {
        console.error('Error fetching discount data:', err);
        setError('Failed to load discount data. Please try refreshing the page.');
        setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dialog controls
  const openNew = () => {
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      description: '',
      discountType: 'percentage',
      discountValues: [], 
      imageURL: '',
      conditions: {
        minNights: '',
        bookingWindow: { start: null, end: null },
        stayPeriod: { start: null, end: null },
        bookingVolume: '',
        minStayDays: '',
        minBookings: '',
        isDefault: false,
        seasonalMonths: []
      },
      applicableHotels: [],
      active: true,
      validFrom: null,
      validTo: null,
      eligibleAgents: [],
      usedAgents: [],
      discountMarketInput: '',
      discountValueInput: '',
      discountTypeInput: 'percentage',
      newMarketInput: ''
    });
    setOpen(true);
  };
  const closeDialog = () => setOpen(false);

  // Delete discount
  const handleDelete = async id => {
    try {
      await axios.delete(`/discounts/${id}`, { withCredentials: true });
      setDiscounts(ds => ds.filter(d => d._id !== id));
      setSnackbar({ open: true, message: 'Deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  // Edit discount
  const handleEdit = d => {
    setEditMode(true);
    setCurrentId(d._id);
    setFormData({
      description: d.description || '',
      discountType: d.discountType,
      discountValues: d.discountValues || [],
      imageURL: d.imageURL || '',
      conditions: {
        minNights: d.conditions.minNights || '',
        bookingWindow: {
          start: d.conditions.bookingWindow?.start ? new Date(d.conditions.bookingWindow.start) : null,
          end: d.conditions.bookingWindow?.end ? new Date(d.conditions.bookingWindow.end) : null
        },
        stayPeriod: {
          start: d.conditions.stayPeriod?.start ? new Date(d.conditions.stayPeriod.start) : null,
          end: d.conditions.stayPeriod?.end ? new Date(d.conditions.stayPeriod.end) : null
        },
        bookingVolume: d.conditions.bookingVolume || '',
        minStayDays: d.conditions.minStayDays || '',
        minBookings: d.conditions.minBookings || '',
        isDefault: d.conditions.isDefault || false,
        seasonalMonths: d.conditions.seasonalMonths || []
      },
      applicableHotels: d.applicableHotels || [],
      active: d.active,
      validFrom: d.validFrom ? new Date(d.validFrom) : null,
      validTo: d.validTo ? new Date(d.validTo) : null,
      eligibleAgents: d.eligibleAgents || [],
      usedAgents: d.usedAgents || [],
      discountMarketInput: '',
      discountValueInput: '',
      discountTypeInput: 'percentage',
    });
    setOpen(true);
  };

  // Field changes
  const handleChange = e => {
    const { name, value } = e.target;
    if ([
      'description', 'discountType', 'active',
      'discountMarketInput', 'discountValueInput', 'discountTypeInput'
    ].includes(name)) {
      setFormData(f => ({ ...f, [name]: value }));
    } else if ([
      'minNights', 'bookingVolume', 'minStayDays', 'minBookings'
    ].includes(name)) {
      setFormData(f => ({
        ...f,
        conditions: { ...f.conditions, [name]: value }
      }));
    }
  };

  const handleDateChange = (field, sub, date) => {
    if (field === 'validFrom' || field === 'validTo') {
      setFormData(f => ({ ...f, [field]: date }));
    } else {
      setFormData(f => ({
        ...f,
        conditions: {
          ...f.conditions,
          [field]: { ...f.conditions[field], [sub]: date }
        }
      }));
    }
  };

  // Snackbar controls
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  async function uploadToImgbb(file) {
    const imgForm = new FormData();
    imgForm.append('image', file);
    
    setUploadProgress(30);
    
    try {
      const res = await fetch(
        'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
        { method: 'POST', body: imgForm }
      );
      
      setUploadProgress(70);
      const data = await res.json();
      
      setUploadProgress(100);
      return data.data.url;
    } catch (err) {
      console.error('Upload failed:', err);
      showError('Failed to upload image. Please try again.');
      throw err;
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadToImgbb(file);
      setFormData(prev => ({ ...prev, imageURL: url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  // Handle image select
  const handleImageSelect = (e) => {
    handleImageUpload(e);
  };

  // Update form fields based on discount type
  const handleDiscountTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      discountType: type,
      conditions: {
        minNights: '',
        bookingWindow: { start: null, end: null },
        stayPeriod: { start: null, end: null },
        bookingVolume: '',
        minStayDays: type === 'transportation' ? 5 : '',
        minBookings: type === 'exclusive' ? 25 : '',
        isDefault: type === 'libert',
        seasonalMonths: type === 'seasonal' ? [] : []
      },
      eligibleAgents: type === 'exclusive' ? prev.eligibleAgents : [],
      usedAgents: type === 'exclusive' ? prev.usedAgents : []
    }));
  };

  // Add/Update a market discount entry
  const addDiscountValueEntry = () => {
    if (formData.discountMarketInput && formData.discountValueInput) {
      const marketName = formData.discountMarketInput.trim();
      const value = Number(formData.discountValueInput);
      const type = formData.discountType === 'percentage' ? 'percentage' : 'fixed';
      if (marketName && !isNaN(value)) {
        const existingIndex = formData.discountValues.findIndex(p => p.market === marketName);
        if (existingIndex >= 0) {
          const updated = [...formData.discountValues];
          updated[existingIndex] = { market: marketName, value, type };
          setFormData(f => ({
            ...f,
            discountValues: updated,
            discountMarketInput: '',
            discountValueInput: ''
          }));
        } else {
          setFormData(f => ({
            ...f,
            discountValues: [...f.discountValues, { market: marketName, value, type }],
            discountMarketInput: '',
            discountValueInput: ''
          }));
        }
      }
    }
  };

  // Submit form
  const handleSubmit = async () => {
    // Validation
    if (!formData.description || !formData.discountType) {
      setSnackbar({ open: true, message: 'Description and type are required', severity: 'error' });
      return;
    }
    if (!formData.discountValues || formData.discountValues.length === 0) {
      setSnackbar({ open: true, message: 'At least one market discount value is required', severity: 'error' });
      return;
    }
    if (formData.discountType === 'transportation' && !formData.conditions.minStayDays) {
      setSnackbar({ open: true, message: 'Minimum stay days required for transportation offer', severity: 'error' });
      return;
    }
    if (formData.discountType === 'exclusive' && !formData.conditions.minBookings) {
      setSnackbar({ open: true, message: 'Minimum bookings required for exclusive offer', severity: 'error' });
      return;
    }
    if (formData.discountType === 'seasonal' && !formData.conditions.seasonalMonths.length) {
      setSnackbar({ open: true, message: 'At least one seasonal month required for seasonal offer', severity: 'error' });
      return;
    }

    const payload = {
      description: formData.description,
      discountType: formData.discountType,
      discountValues: formData.discountValues,
      imageURL: formData.imageURL,
      conditions: {
        minNights: Number(formData.conditions.minNights) || undefined,
        bookingWindow: {
          start: formData.conditions.bookingWindow.start,
          end: formData.conditions.bookingWindow.end
        },
        stayPeriod: {
          start: formData.conditions.stayPeriod.start,
          end: formData.conditions.stayPeriod.end
        },
        bookingVolume: Number(formData.conditions.bookingVolume) || undefined,
        minStayDays: Number(formData.conditions.minStayDays) || undefined,
        minBookings: Number(formData.conditions.minBookings) || undefined,
        isDefault: formData.conditions.isDefault || false,
        seasonalMonths: formData.conditions.seasonalMonths || []
      },
      applicableHotels: formData.applicableHotels,
      active: formData.active,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      eligibleAgents: formData.eligibleAgents,
      usedAgents: formData.usedAgents
    };

    try {
      let res;
      if (editMode) {
        res = await axios.put(`/discounts/${currentId}`, payload, { withCredentials: true });
        setDiscounts(ds => ds.map(d => d._id === currentId ? res.data : d));
        setSnackbar({ open: true, message: 'Updated', severity: 'success' });
      } else {
        res = await axios.post('/discounts', payload, { withCredentials: true });
        setDiscounts(ds => [res.data, ...ds]);
        setSnackbar({ open: true, message: 'Created', severity: 'success' });
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        setSnackbar({ open: true, message: err.response.data.errors.join(', '), severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Save failed', severity: 'error' });
      }
    }
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
      <Box p={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4">Discounts</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
            Add Discount
          </Button>
        </Box>

        {/* Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Hotels</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">No discounts found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map(d => (
                    <TableRow key={d._id}>
                      <TableCell>
                        {d.imageURL && d.imageURL.trim() !== '' && d.imageURL.trim().toLowerCase() !== 'null' && d.imageURL.trim().toLowerCase() !== 'undefined' ? (
                          <Avatar src={d.imageURL} variant="rounded" />
                        ) : (
                          <ImageIcon color="disabled" fontSize="large" />
                        )}
                      </TableCell>
                      <TableCell>{d.description}</TableCell>
                      <TableCell>{d.discountType}</TableCell>
                      <TableCell>
                        {/* Show only the first added market discount value, if any */}
                        {Array.isArray(d.discountValues) && d.discountValues.length > 0 ? (
                          <span>
                            {d.discountValues[0].market}: {d.discountValues[0].type === 'percentage' ? d.discountValues[0].value + '%' : '$' + d.discountValues[0].value}
                          </span>
                        ) : (
                          <span style={{ color: '#aaa' }}>N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {(d.applicableHotels || [])
                          .map(id => hotels.find(h => h._id === id)?.name)
                          .filter(Boolean)
                          .join(', ') || 'All'}
                      </TableCell>
                      <TableCell>
                        <Chip label={d.active ? 'Yes' : 'No'}
                              color={d.active ? 'success' : 'default'} />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(d)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(d._id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
          <DialogTitle>{editMode ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Description */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {/* Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    onChange={(e) => handleDiscountTypeChange(e.target.value)}
                  >
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="seasonal">Seasonal</MenuItem>
                    <MenuItem value="exclusive">Exclusive Agent</MenuItem>
                    <MenuItem value="transportation">Transportation Offer</MenuItem>
                    <MenuItem value="libert">Libert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                    Manage Markets
                  </Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        size="small"
                        placeholder="New market name"
                        value={formData.newMarketInput || ''}
                        onChange={e => setFormData(f => ({ ...f, newMarketInput: e.target.value }))}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Button variant="outlined" fullWidth onClick={() => {
                        const newMarket = (formData.newMarketInput || '').trim();
                        if (newMarket && !markets.includes(newMarket)) {
                          setCustomMarkets(prev => [...prev, newMarket]);
                          setFormData(f => ({ ...f, newMarketInput: '' }));
                          setSnackbar({ open: true, message: 'Market added', severity: 'success' });
                        } else {
                          setSnackbar({ open: true, message: 'Invalid or duplicate market name', severity: 'error' });
                        }
                      }}>
                        Add Market
                      </Button>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}>
                    {customMarkets.map((m, i) => (
                      <Chip
                        key={i}
                        label={m}
                        onDelete={() => {
                          setCustomMarkets(prev => prev.filter((_, idx) => idx !== i));
                          setFormData(f => ({
                            ...f,
                            discountValues: f.discountValues.filter(p => p.market !== m)
                          }));
                        }}
                      />
                    ))}
                  </Box>
                  <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Market</InputLabel>
                        <Select
                          name="discountMarketInput"
                          value={formData.discountMarketInput}
                          label="Market"
                          onChange={handleChange}
                        >
                          {markets.map(m => (
                            <MenuItem key={m} value={m}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <TextField
                        name="discountValueInput"
                        size="small"
                        type="number"
                        placeholder="Discount value"
                        value={formData.discountValueInput}
                        onChange={handleChange}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={addDiscountValueEntry}
                        disabled={
                          !formData.discountMarketInput ||
                          !formData.discountValueInput ||
                          isNaN(Number(formData.discountValueInput))
                        }
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 1 }}>
                    {formData.discountValues.map((p, i) => (
                      <Chip
                        key={i}
                        label={`${p.market}: ${p.type === 'percentage' ? p.value + '%' : '$' + p.value}`}
                        onDelete={() => setFormData(f => ({ ...f, discountValues: f.discountValues.filter((_, idx) => idx !== i) }))}
                      />
                    ))}
                  </Box>
                  {/* Set for all markets section */}
                  <Grid container spacing={1} alignItems="center" sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" sx={{ color: 'green', minWidth: 200, fontWeight: 500 }}>
                        Set Same Discount for All Markets
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <TextField
                        name="allMarketsValueInput"
                        size="small"
                        type="number"
                        placeholder="Discount value for all"
                        value={formData.allMarketsValueInput || ''}
                        onChange={e => setFormData(f => ({ ...f, allMarketsValueInput: e.target.value }))}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => {
                          const value = Number(formData.allMarketsValueInput);
                          if (!formData.allMarketsValueInput || isNaN(value)) return;
                          const type = formData.discountType === 'percentage' ? 'percentage' : 'fixed';
                          setFormData(f => ({
                            ...f,
                            discountValues: markets.map(m => ({ market: m, value, type })),
                            allMarketsValueInput: ''
                          }));
                        }}
                        disabled={!formData.allMarketsValueInput || isNaN(Number(formData.allMarketsValueInput))}
                      >
                        Set for All Markets
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {/* Image Upload */}
              <Grid item xs={12} sm={8} container alignItems="center" spacing={1}>
                <Grid item>
                  <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleImageSelect} />
                  </Button>
                </Grid>
                {formData.imageURL && (
                  <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={formData.imageURL} variant="rounded" sx={{ width: 56, height: 56, mr: 1 }} />
                    <IconButton
                      aria-label="Remove image"
                      size="small"
                      onClick={() => setFormData(f => ({ ...f, imageURL: '' }))}
                      sx={{ ml: 0.5 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
              {/* Hotels */}
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" sx={{ color: 'Green', fontWeight: 500, mb: 1 }}>
                  Select hotels for which this offer applies. Leave empty to allow for any hotel.
                </Typography>
                <Autocomplete
                  multiple
                  options={hotels}
                  getOptionLabel={(option) => option.name}
                  value={hotels.filter(h => formData.applicableHotels.includes(h._id))}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      applicableHotels: newValue.map(h => h._id)
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hotels"
                      placeholder="Search hotels..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {option.name}
                      </Box>
                    </li>
                  )}
                />
              </Grid>
              {/* Min Nights */}
              <Grid item xs={12}>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="minNights"
                  label="Min Nights"
                  type="number"
                  fullWidth
                  value={formData.conditions.minNights}
                  onChange={handleChange}
                />
              </Grid>
              {/* Booking Window */}
              <Grid item xs={6} sm={3}>
                <DatePicker
                  label="Booking Start"
                  value={formData.conditions.bookingWindow.start}
                  onChange={(newValue) => handleDateChange('bookingWindow', 'start', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DatePicker
                  label="Booking End"
                  value={formData.conditions.bookingWindow.end}
                  onChange={(newValue) => handleDateChange('bookingWindow', 'end', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {/* Stay Period */}
              <Grid item xs={6} sm={3}>
                <DatePicker
                  label="Stay Start"
                  value={formData.conditions.stayPeriod.start}
                  onChange={(newValue) => handleDateChange('stayPeriod', 'start', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <DatePicker
                  label="Stay End"
                  value={formData.conditions.stayPeriod.end}
                  onChange={(newValue) => handleDateChange('stayPeriod', 'end', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {/* Active */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Active</InputLabel>
                  <Select
                    name="active"
                    value={formData.active}
                    onChange={handleChange}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Type-specific conditions */}
              {formData.discountType === 'transportation' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="minStayDays"
                    label="Minimum Stay Days"
                    type="number"
                    fullWidth
                    value={formData.conditions.minStayDays}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, minStayDays: e.target.value }
                    }))}
                    required
                  />
                </Grid>
              )}
              {formData.discountType === 'exclusive' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="minBookings"
                    label="Minimum Bookings Required"
                    type="number"
                    fullWidth
                    value={formData.conditions.minBookings}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, minBookings: e.target.value }
                    }))}
                    required
                  />
                </Grid>
              )}
              {formData.discountType === 'seasonal' && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Seasonal Months</InputLabel>
                    <Select
                      multiple
                      value={formData.conditions.seasonalMonths}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, seasonalMonths: e.target.value }
                      }))}
                      renderValue={(selected) => selected.map(month => {
                        const date = new Date(2000, month - 1, 1);
                        return date.toLocaleString('default', { month: 'long' });
                      }).join(', ')}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <MenuItem key={month} value={month}>
                          {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {formData.discountType === 'libert' && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.conditions.isDefault}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          conditions: { ...prev.conditions, isDefault: e.target.checked }
                        }))}
                      />
                    }
                    label="Show when no other offers are available"
                  />
                </Grid>
              )}
              {formData.discountType === 'exclusive' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={agents}
                      getOptionLabel={(option) => `${option.name || ''} (${option.email})`}
                      value={agents.filter(a => formData.eligibleAgents.includes(a._id))}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          eligibleAgents: newValue.map(a => a._id)
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Eligible Agents"
                          placeholder="Search agents..."
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {option.name || ''} ({option.email})
                          </Box>
                        </li>
                      )}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={agents}
                      getOptionLabel={(option) => `${option.name || ''} (${option.email})`}
                      value={agents.filter(a => formData.usedAgents.includes(a._id))}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          usedAgents: newValue.map(a => a._id)
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Used Agents"
                          placeholder="Search agents..."
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {option.name || ''} ({option.email})
                          </Box>
                        </li>
                      )}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Selected agents will be able to use this exclusive offer. Below, you can also view and remove agents who have already used the offer ("Used Agents"). Remove an agent from the used list to allow them to use the offer again.
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Image Upload Progress */}
        {uploadProgress > 0 && (
          <Box sx={{ 
            width: '100%', 
            position: 'fixed',
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 9999
          }}>
            <UploadProgress progress={uploadProgress} />
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}