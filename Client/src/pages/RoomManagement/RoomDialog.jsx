import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Grid,
  Button, Select, MenuItem, InputLabel, FormControl, Chip, ImageList, ImageListItem,
  Typography, IconButton, Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Close as CloseIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import UploadProgress from '../../Components/UploadProgress';
import { transportationOptions } from './constants';

const RoomDialog = ({
  open,
  onClose,
  editing,
  form,
  setForm,
  hotels,
  customMarkets,
  markets,
  uploadStatuses,
  setUploadStatuses,
  uploadProgress,
  onSubmit,
  onAddAvailability,
  onRemoveAvailability,
  onAddPriceEntry,
  onAddPricePeriod,
  onRemovePricePeriod,
  onAddTransportation,
  onRemoveTransportation,
  onAddCustomMarket,
  onRemoveCustomMarket,
  onImageSelect
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
              <Button variant="outlined" onClick={onAddCustomMarket}>
                Add Market
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {customMarkets.map((m, i) => (
                <Chip
                  key={i}
                  label={m}
                  onDelete={() => onRemoveCustomMarket(i)}
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
              <Button variant="outlined" onClick={onAddPriceEntry}>
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
                  onDelete={() => onRemovePricePeriod(i)}
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
                    <Button onClick={onAddPricePeriod}>Add</Button>
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
                  <Button onClick={onAddAvailability}>Add</Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
            <Box sx={{ mt: 1 }}>
              {form.availabilityCalendar.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography>{`${r.startDate.toLocaleDateString()} - ${r.endDate.toLocaleDateString()}`}</Typography>
                  <IconButton size="small" color="error" onClick={() => onRemoveAvailability(i)}>
                    <CloseIcon />
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
                  onDelete={() => onRemoveTransportation(i)}
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
                  onClick={onAddTransportation}
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
                onChange={onImageSelect}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          {editing ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomDialog;
