import React, { useState, useEffect } from 'react';import axios from 'axios';
import UploadProgress from '../Components/UploadProgress';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  ImageList,
  ImageListItem,
  Chip,
  Card,
  CardContent,
  Divider,
  Typography as TypographyComponent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

// Generic upload for array fields (gallery)
const handleImageUpload = async (e, key, formData, setFormData, setSnackbar, setUploadProgress, setUploadStatuses) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  // Initialize upload statuses 
  const initialStatuses = files.map(file => ({
    file,
    status: 'pending',
    url: null,
    error: null,
  }));
  setUploadStatuses(prev => [...prev, ...initialStatuses]);

  let successCount = 0;
  let completedCount = 0;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imgForm = new FormData();
      imgForm.append('image', file);

      // Update status to uploading
      setUploadStatuses(prev =>
        prev.map((s, idx) =>
          idx === prev.length - files.length + i ? { ...s, status: 'uploading' } : s
        )
      );

      try {
        const res = await fetch(
          'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
          { method: 'POST', body: imgForm }
        );
        const data = await res.json();

        if (data.data?.url) {
          // Update formData.gallery with the URL
          setFormData(prev => ({
            ...prev,
            [key]: [...prev[key], data.data.url],
          }));
          // Update upload status to success
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
        // Update upload status to error
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
  } catch (err) {
    console.error('Some images failed to upload:', err);
    setSnackbar({ open: true, message: 'Some images failed to upload', severity: 'error' });
  } finally {
    setTimeout(() => {
      setUploadProgress(0);
      // Clear pending/uploading/error statuses, keep only successful ones
      setUploadStatuses(prev => prev.filter(s => s.status === 'success'));
    }, 1000);
  }
};

// Upload for diningOptions.image
const handleDiningImageUpload = async (e, index, formData, setFormData, setSnackbar, setUploadProgress) => {
  const file = e.target.files[0];
  if (!file) return;

  const imgForm = new FormData();
  imgForm.append('image', file);

  try {
    setUploadProgress(0);
    const res = await fetch(
      'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
      { method: 'POST', body: imgForm }
    );
    const data = await res.json();

    if (data.data?.url) {
      setFormData(prev => {
        const opts = [...prev.dinningOptions];
        opts[index].image = data.data.url;
        return { ...prev, dinningOptions: opts };
      });
      setUploadProgress(100);
      setSnackbar({ open: true, message: 'Dining image uploaded successfully', severity: 'success' });
    } else {
      throw new Error('Upload failed');
    }
  } catch (err) {
    console.error('Dining image upload failed:', err);
    setFormData(prev => {
      const opts = [...prev.dinningOptions];
      opts[index].image = '';
      return { ...prev, dinningOptions: opts };
    });
    setSnackbar({ open: true, message: 'Dining image upload failed', severity: 'error' });
  } finally {
    setTimeout(() => setUploadProgress(0), 1000);
  }
};

// Upload for diningOptions.menu (image)
const handleDiningMenuUpload = async (e, index, formData, setFormData, setSnackbar, setUploadProgress) => {
  const file = e.target.files[0];
  if (!file) return;

  const imgForm = new FormData();
  imgForm.append('image', file);

  try {
    setUploadProgress(0);
    const res = await fetch(
      'https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39',
      { method: 'POST', body: imgForm }
    );
    const data = await res.json();

    if (data.data?.url) {
      setFormData(prev => {
        const opts = [...prev.dinningOptions];
        opts[index].menu = data.data.url;
        return { ...prev, dinningOptions: opts };
      });
      setUploadProgress(100);
      setSnackbar({ open: true, message: 'Menu image uploaded successfully', severity: 'success' });
    } else {
      throw new Error('Upload failed');
    }
  } catch (err) {
    console.error('Dining menu upload failed:', err);
    setFormData(prev => {
      const opts = [...prev.dinningOptions];
      opts[index].menu = '';
      return { ...prev, dinningOptions: opts };
    });
    setSnackbar({ open: true, message: 'Menu upload failed', severity: 'error' });
  } finally {
    setTimeout(() => setUploadProgress(0), 1000);
  }
};

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    starRating: '',
    descriptionShort: '',
    description: '',
    contactDetails: { phone: '', email: '', website: '' },
    amenities: [],
    amenityInput: '',
    mealPlans: [],
    mealName: '',
    mealDesc: '',
    mealPrice: '',
    dinningOptions: [],
    gallery: [],
    liveAvailability: '',
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileHotel, setProfileHotel] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatuses, setUploadStatuses] = useState([]); // Track upload status for each image

  // Fetch existing hotels
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/hotels', { withCredentials: true });
        setHotels(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load hotels');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openDialog = hotel => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name,
        location: hotel.location,
        starRating: hotel.starRating,
        descriptionShort: hotel.descriptionShort || '',
        description: hotel.description || '',
        contactDetails: hotel.contactDetails,
        amenities: hotel.amenities,
        amenityInput: '',
        mealPlans: hotel.mealPlans.map(m => ({ ...m })),
        mealName: '',
        mealDesc: '',
        mealPrice: '',
        dinningOptions: hotel.dinningOptions.map(d => ({ ...d })),
        gallery: hotel.gallery || [],
        liveAvailability: hotel.liveAvailability || '',
      });
      setUploadStatuses(hotel.gallery.map(url => ({ file: null, status: 'success', url, error: null })));
    } else {
      setEditingHotel(null);
      setFormData({
        name: '',
        location: '',
        starRating: '',
        descriptionShort: '',
        description: '',
        contactDetails: { phone: '', email: '', website: '' },
        amenities: [],
        amenityInput: '',
        mealPlans: [],
        mealName: '',
        mealDesc: '',
        mealPrice: '',
        dinningOptions: [],
        gallery: [],
        liveAvailability: '',
      });
      setUploadStatuses([]);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setUploadStatuses([]);
  };

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      location: formData.location,
      starRating: Number(formData.starRating),
      descriptionShort: formData.descriptionShort,
      description: formData.description,
      contactDetails: formData.contactDetails,
      amenities: formData.amenities,
      mealPlans: formData.mealPlans,
      dinningOptions: formData.dinningOptions,
      gallery: formData.gallery,
      liveAvailability: formData.liveAvailability,
    };
    try {
      let res;
      if (editingHotel) {
        res = await axios.put(`/hotels/${editingHotel._id}`, payload, { withCredentials: true });
        setHotels(hs => hs.map(h => (h._id === editingHotel._id ? res.data : h)));
        setSnackbar({ open: true, message: 'Hotel updated', severity: 'success' });
      } else {
        res = await axios.post('/hotels', payload, { withCredentials: true });
        setHotels(hs => [res.data, ...hs]);
        setSnackbar({ open: true, message: 'Hotel added', severity: 'success' });
      }
      closeDialog();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Save failed', severity: 'error' });
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await axios.delete(`/hotels/${id}`, { withCredentials: true });
      setHotels(hs => hs.filter(h => h._id !== id));
      setSnackbar({ open: true, message: 'Hotel deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const openProfile = hotel => {
    setProfileHotel(hotel);
    setProfileOpen(true);
  };

  const closeProfile = () => setProfileOpen(false);

  if (loading) return <Box textAlign="center" p={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Hotel Management</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialog(null)} sx={{ mb: 2 }}>
        Add Hotel
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map(hotel => (
              <TableRow key={hotel._id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openDialog(hotel)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(hotel._id)} color="error"><DeleteIcon /></IconButton>
                  <Button variant="outlined" sx={{ ml: 1 }} onClick={() => openProfile(hotel)}>Profile</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add Hotel'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Basic Info */}
            <Grid item xs={6}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Star Rating"
                type="number"
                fullWidth
                value={formData.starRating}
                onChange={e => setFormData(f => ({ ...f, starRating: e.target.value }))}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Short Description"
                fullWidth
                value={formData.descriptionShort}
                onChange={e => setFormData(f => ({ ...f, descriptionShort: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Full Description"
                multiline
                rows={3}
                fullWidth
                value={formData.description}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              />
            </Grid>
            {/* Contact */}
            <Grid item xs={4}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.contactDetails.phone}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    contactDetails: { ...f.contactDetails, phone: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Email"
                fullWidth
                value={formData.contactDetails.email}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    contactDetails: { ...f.contactDetails, email: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Website"
                fullWidth
                value={formData.contactDetails.website}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    contactDetails: { ...f.contactDetails, website: e.target.value },
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Live Inventory URL"
                fullWidth
                value={formData.liveAvailability}
                onChange={e => setFormData(f => ({ ...f, liveAvailability: e.target.value }))}
                placeholder="https://inventory.example.com"
              />
            </Grid>
            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Amenities</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {formData.amenities.map((a, i) => (
                  <Chip
                    key={i}
                    label={a}
                    sx={{ backgroundColor: '#E7E9E5', color: '#0A435C' }}
                    onDelete={() =>
                      setFormData(f => ({
                        ...f,
                        amenities: f.amenities.filter((_, idx) => idx !== i),
                      }))
                    }
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="Add amenity"
                  value={formData.amenityInput}
                  onChange={e => setFormData(f => ({ ...f, amenityInput: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && formData.amenityInput.trim()) {
                      setFormData(f => ({
                        ...f,
                        amenities: [...f.amenities, f.amenityInput.trim()],
                        amenityInput: '',
                      }));
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (formData.amenityInput.trim()) {
                      setFormData(f => ({
                        ...f,
                        amenities: [...f.amenities, f.amenityInput.trim()],
                        amenityInput: '',
                      }));
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            {/* Meal Plans */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Meal Plans</Typography>
              {formData.mealPlans.map((m, i) => (
                <Grid container spacing={1} alignItems="center" key={i} sx={{ mb: 1 }}>
                  <Grid item xs={3}>
                    <TextField
                      label="Plan Name"
                      fullWidth
                      value={m.planName}
                      onChange={e => {
                        const list = [...formData.mealPlans];
                        list[i].planName = e.target.value;
                        setFormData(f => ({ ...f, mealPlans: list }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      label="Description"
                      fullWidth
                      value={m.description}
                      onChange={e => {
                        const list = [...formData.mealPlans];
                        list[i].description = e.target.value;
                        setFormData(f => ({ ...f, mealPlans: list }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      value={m.price}
                      onChange={e => {
                        const list = [...formData.mealPlans];
                        list[i].price = Number(e.target.value);
                        setFormData(f => ({ ...f, mealPlans: list }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setFormData(f => ({
                          ...f,
                          mealPlans: f.mealPlans.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                onClick={() =>
                  setFormData(f => ({
                    ...f,
                    mealPlans: [...f.mealPlans, { planName: '', description: '', price: 0 }],
                  }))
                }
              >
                Add Meal Plan
              </Button>
            </Grid>
            {/* Dining Options */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Dining Options</Typography>
              {formData.dinningOptions.map((opt, i) => (
                <Grid container spacing={1} alignItems="center" key={i} sx={{ mb: 1 }}>
                  <Grid item xs={3}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={opt.optionName}
                      onChange={e => {
                        const list = [...formData.dinningOptions];
                        list[i].optionName = e.target.value;
                        setFormData(f => ({ ...f, dinningOptions: list }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Description"
                      fullWidth
                      value={opt.description}
                      onChange={e => {
                        const list = [...formData.dinningOptions];
                        list[i].description = e.target.value;
                        setFormData(f => ({ ...f, dinningOptions: list }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {typeof opt.image === 'string' && opt.image && (
                      <img
                        src={opt.image}
                        alt="opt"
                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <UploadProgress progress={uploadProgress} />
                      </Box>
                    )}
                    <Button variant="outlined" component="label" fullWidth>
                      {typeof opt.image === 'string' && opt.image ? 'Change Image' : 'Upload Image'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={e =>
                          handleDiningImageUpload(e, i, formData, setFormData, setSnackbar, setUploadProgress)
                        }
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    {typeof opt.menu === 'string' && opt.menu && (
                      <img
                        src={opt.menu}
                        alt="menu"
                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <UploadProgress progress={uploadProgress} />
                      </Box>
                    )}
                    <Button variant="outlined" component="label" fullWidth>
                      {typeof opt.menu === 'string' && opt.menu ? 'Change Menu' : 'Upload Menu'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={e =>
                          handleDiningMenuUpload(e, i, formData, setFormData, setSnackbar, setUploadProgress)
                        }
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setFormData(f => ({
                          ...f,
                          dinningOptions: f.dinningOptions.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                onClick={() =>
                  setFormData(f => ({
                    ...f,
                    dinningOptions: [
                      ...f.dinningOptions,
                      { optionName: '', description: '', image: '', menu: '' },
                    ],
                  }))
                }
              >
                Add Option
              </Button>
            </Grid>
            {/* Gallery */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Gallery</Typography>
              <Button variant="contained" component="label">
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={e =>
                    handleImageUpload(
                      e,
                      'gallery',
                      formData,
                      setFormData,
                      setSnackbar,
                      setUploadProgress,
                      setUploadStatuses
                    )
                  }
                />
              </Button>
              <ImageList cols={3} rowHeight={120} sx={{ mt: 1 }}>
                {uploadStatuses.map((status, idx) => (
                  <ImageListItem key={idx}>
                    {status.status === 'success' && typeof status.url === 'string' && (
                      <img src={status.url} alt="gallery" loading="lazy" />
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
                        <TypographyComponent variant="caption" sx={{ ml: 1 }}>
                          {status.status === 'pending' ? 'Pending' : 'Uploading'}
                        </TypographyComponent>
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
                        <TypographyComponent variant="caption" color="error">
                          {status.error || 'Failed'}
                        </TypographyComponent>
                      </Box>
                    )}
                    {(status.status === 'pending' || status.status === 'uploading' || status.status === 'error') && (
                      <IconButton
                        size="small"
                        color="error"
                        sx={{ position: 'absolute', top: 4, right: 4 }}
                        onClick={() =>
                          setUploadStatuses(prev => prev.filter((_, i) => i !== idx))
                        }
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
                          setFormData(f => ({
                            ...f,
                            gallery: f.gallery.filter((_, i) => i !== idx),
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
          <Button variant="contained" onClick={handleSave}>
            {editingHotel ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onClose={closeProfile} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Hotel Profile: {profileHotel?.name}</Typography>
          <IconButton onClick={closeProfile}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Left Column: Basic Info */}
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ p: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>General Information</Typography>
                  <Typography><strong>Name:</strong> {profileHotel?.name}</Typography>
                  <Typography><strong>Location:</strong> {profileHotel?.location}</Typography>
                  <Typography><strong>Rating:</strong> {profileHotel?.starRating} ⭐</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>Contact Details</Typography>
                  <Typography><strong>Phone:</strong> {profileHotel?.contactDetails.phone || '—'}</Typography>
                  <Typography><strong>Email:</strong> {profileHotel?.contactDetails.email || '—'}</Typography>
                  <Typography><strong>Website:</strong> {profileHotel?.contactDetails.website || '—'}</Typography>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Description</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profileHotel?.description || '—'}
                  </Typography>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Short Description</Typography>
                  <Typography variant="body2">{profileHotel?.descriptionShort || '—'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Amenities, Meal Plans, Dining, Gallery */}
            <Grid item xs={12} md={8}>
              <Card elevation={2} sx={{ p: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Amenities</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profileHotel?.amenities.map((a, i) => (
                      <Chip key={i} label={a} sx={{ backgroundColor: '#E7E9E5', color: '#0A435C' }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Meal Plans</Typography>
                  <Grid container spacing={2}>
                    {profileHotel?.mealPlans.map((m, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box>
                          <Typography variant="subtitle2">{m.planName}</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>{m.description}</Typography>
                          <Typography variant="body2"><strong>Price:</strong> ${m.price}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Dining Options</Typography>
                  <Grid container spacing={2}>
                    {profileHotel?.dinningOptions.map((d, i) => (
                      <Grid item xs={12} sm={6} key={i}>
                        <Box>
                          <Typography variant="subtitle2">{d.optionName}</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>{d.description}</Typography>
                          <Grid container spacing={1}>
                            {d.image && (
                              <Grid item>
                                <img
                                  src={d.image}
                                  alt="dining"
                                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
                                />
                              </Grid>
                            )}
                            {d.menu && (
                              <Grid item>
                                  <img
                                    src={d.menu}
                                    alt="menu"
                                    style={{ width: 'auto', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Gallery</Typography>
                  <ImageList cols={3} rowHeight={140} gap={8}>
                    {profileHotel?.gallery.map((url, i) => (
                      <ImageListItem key={i}>
                        <img src={url} alt="gallery" loading="lazy" style={{ borderRadius: '4px' }} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default HotelManagement;