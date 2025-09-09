import React, { useState } from 'react';
import {
  Paper, Typography, Box, IconButton, Chip, Button, Grid, Card, CardContent,
  Divider, Stack, Tooltip, Collapse, useTheme, useMediaQuery, Badge,
  ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableHead, 
  TableRow, TableContainer
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  KingBed as KingBedIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  DateRange as DateRangeIcon,
  Group as GroupIcon,
  ViewModule as ViewModuleIcon,
  TableChart as TableChartIcon,
  ContactMail as ContactMailIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';

const RoomInquiriesView = ({ inquiries, onAction }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const statusColor = (status) => ({
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error'
  }[status] || 'default');

  const getStatusColor = (status) => {
    const colorMap = {
      pending: theme.palette.warning?.main || '#ff9800',
      confirmed: theme.palette.success?.main || '#4caf50',
      cancelled: theme.palette.error?.main || '#f44336'
    };
    return colorMap[status] || theme.palette.grey?.[500] || '#9e9e9e';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric'
    });
  };

  const toggleExpand = (inquiryId) => {
    setExpandedCard(expandedCard === inquiryId ? null : inquiryId);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Card View Component
  const InquiryCard = ({ inquiry }) => {
    const isExpanded = expandedCard === inquiry._id;
    
    return (
      <Card 
        sx={{ 
          mb: 2, 
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)'
          },
          border: `1px solid ${theme.palette.divider}`,
          borderLeft: `4px solid ${getStatusColor(inquiry.status)}`
        }}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Header Row - Always Visible */}
          <Grid container spacing={2} alignItems="center">
            {/* Guest Name & Status */}
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  {inquiry.guestName}
                </Typography>
                <Chip
                  label={inquiry.status}
                  color={statusColor(inquiry.status)}
                  variant={inquiry.status === 'pending' ? 'outlined' : 'filled'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Grid>

            {/* Primary Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="action" fontSize="small" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                    {inquiry.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Primary Contact
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Hotel & Room */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HotelIcon color="action" fontSize="small" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                    {inquiry.hotel_name || 'Unknown Hotel'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {inquiry.room_name || 'Unknown Room'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
                {inquiry.status === 'pending' ? (
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Confirm Inquiry">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onAction(inquiry._id, 'confirmed')}
                        startIcon={<CheckCircleIcon />}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        Confirm
                      </Button>
                    </Tooltip>
                    <Tooltip title="Cancel Inquiry">
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => onAction(inquiry._id, 'cancelled')}
                        startIcon={<CancelIcon />}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        Cancel
                      </Button>
                    </Tooltip>
                  </Stack>
                ) : (
                  <Chip
                    label={inquiry.status.toUpperCase()}
                    color={statusColor(inquiry.status)}
                    variant="filled"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(inquiry._id)}
                  sx={{ 
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Expandable Content */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ContactMailIcon fontSize="small" />
                    Contact Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {inquiry.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {inquiry.phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Stay Details */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon fontSize="small" />
                    Stay Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Check-in:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(inquiry.check_in)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Check-out:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatDate(inquiry.check_out)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Guests:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {inquiry.guest_count}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Inquiry Actions */}
              <Grid item xs={12} sm={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Available Actions
                  </Typography>
                  {inquiry.status === 'pending' ? (
                    <Stack spacing={1}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onAction(inquiry._id, 'confirmed')}
                        fullWidth
                        size="small"
                      >
                        Confirm Inquiry
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => onAction(inquiry._id, 'cancelled')}
                        fullWidth
                        size="small"
                      >
                        Cancel Inquiry
                      </Button>
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Inquiry has been {inquiry.status}
                      </Typography>
                      <Chip
                        label={inquiry.status.toUpperCase()}
                        color={statusColor(inquiry.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // Compact Table View Component
  const CompactTable = () => (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Guest</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Hotel</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Dates</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Guests</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inquiries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No room inquiries found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            inquiries.map(inquiry => (
              <TableRow 
                key={inquiry._id}
                sx={{ 
                  '&:hover': { bgcolor: 'grey.50' },
                  borderLeft: `3px solid ${getStatusColor(inquiry.status)}`
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {inquiry.guestName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                      {inquiry.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {inquiry.phone || 'No phone'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                      {inquiry.hotel_name || 'Unknown Hotel'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {inquiry.room_name || 'Unknown Room'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDateShort(inquiry.check_in)} - {formatDateShort(inquiry.check_out)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {inquiry.guest_count}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={inquiry.status}
                    color={statusColor(inquiry.status)}
                    variant={inquiry.status === 'pending' ? 'outlined' : 'filled'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {inquiry.status === 'pending' ? (
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onAction(inquiry._id, 'confirmed')}
                        startIcon={<CheckCircleIcon />}
                        sx={{ minWidth: 80 }}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => onAction(inquiry._id, 'cancelled')}
                        startIcon={<CancelIcon />}
                        sx={{ minWidth: 80 }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  ) : (
                    <Chip
                      label={inquiry.status.toUpperCase()}
                      color={statusColor(inquiry.status)}
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Room Inquiries
          </Typography>
          <Badge badgeContent={inquiries.filter(i => i.status === 'pending').length} color="warning">
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Badge>
          <Badge badgeContent={inquiries.length} color="primary">
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Badge>
        </Box>
        
        {/* View Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          size="small"
          aria-label="view mode"
        >
          <ToggleButton value="cards" aria-label="card view">
            <ViewModuleIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}>
              Cards
            </Typography>
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <TableChartIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'inline' } }}>
              Table
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Content */}
      {inquiries.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: `2px dashed ${theme.palette.grey[300]}`
          }}
        >
          <QuestionAnswerIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No room inquiries found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customer inquiries will appear here when submitted
          </Typography>
        </Box>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <Box>
              {inquiries.map(inquiry => (
                <InquiryCard key={inquiry._id} inquiry={inquiry} />
              ))}
            </Box>
          ) : (
            <CompactTable />
          )}
        </>
      )}
    </Paper>
  );
};

export default RoomInquiriesView;
