// src/components/AgencyManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Collapse, TableContainer, Box, Chip, Select, MenuItem, Grid, DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon   from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios      from 'axios';

const AgencyManagement = () => {
  const [agencies, setAgencies]         = useState([]);
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [userLoading, setUserLoading]   = useState(true);
  const [error, setError]               = useState(null);
  const [userError, setUserError]       = useState(null);
  const [notification, setNotification] = useState({ open:false, message:'', severity:'success' });

  // Dialog state
  const [infoOpen, setInfoOpen]         = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [openRows, setOpenRows]         = useState({});
  const [userDetailsDialog, setUserDetailsDialog] = useState({ open: false, user: null, agency: null, loading: false });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null });

  useEffect(() => {
    fetchAgencies();
    fetchUsers();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/agency', { withCredentials:true });
      setAgencies(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Couldn’t load agencies. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const { data } = await axios.get('/users', { withCredentials: true });
      setUsers(data);
      setUserError(null);
    } catch (err) {
      setUserError('Couldn\'t load users. Try again.');
    } finally {
      setUserLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/agency/${id}`, { withCredentials:true });
      setAgencies(prev => prev.filter(a => a._id !== id));
      showNotification('Agency + its users removed 💥', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Delete failed 😭', 'error');
    }
  };

  const handleInfo = (agency) => {
    setSelectedAgency(agency);
    setInfoOpen(true);
  };
  const closeInfo = () => {
    setInfoOpen(false);
    setSelectedAgency(null);
  };

  const handleAgentInfoClick = async (user) => {
    setUserDetailsDialog(prev => ({ ...prev, open: true, loading: true }));
    try {
      const response = await axios.get(`/users/${user._id}/details`, { withCredentials: true });
      setUserDetailsDialog({
        open: true,
        user: response.data.user,
        agency: response.data.agency,
        loading: false
      });
    } catch (err) {
      showNotification('Failed to load user details', 'error');
      setUserDetailsDialog(prev => ({ ...prev, open: false, loading: false }));
    }
  };

  const closeUserDetails = () => {
    setUserDetailsDialog({ open: false, user: null, agency: null, loading: false });
  };

  const confirmDeleteUser = (userId) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      action: () => executeDeleteUser(userId)
    });
  };

  const executeDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`, { withCredentials: true });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      showNotification('User deleted successfully', 'success');
    } catch (err) {
      showNotification('Failed to delete user', 'error');
    }
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const confirmRoleChange = (userId, newRole, currentRole) => {
    setConfirmDialog({
      open: true,
      title: 'Change User Role',
      message: `Are you sure you want to change this user's role from "${currentRole}" to "${newRole}"?`,
      action: () => executeRoleChange(userId, newRole)
    });
  };

  const executeRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/users/${userId}/role`, { role: newRole }, { withCredentials: true });
      setUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, role: newRole } : user));
      showNotification('User role updated successfully', 'success');
    } catch (err) {
      showNotification('Failed to update user role', 'error');
    }
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const showNotification = (msg, sev) => {
    setNotification({ open:true, message:msg, severity:sev });
  };
  const closeNotification = () => {
    setNotification({ ...notification, open:false });
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '#1976d2';
      case 'pending': return '#2e7d32';
      case 'agent': return '#ed6c02';
      default: return '#757575';
    }
  };

  if (loading) return (
    <Paper sx={{ p:5, textAlign:'center' }}>
      <CircularProgress />
    </Paper>
  );
  if (error) return (
    <Paper sx={{ p:3 }}>
      <Alert severity="error">{error}</Alert>
    </Paper>
  );

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" gutterBottom>
        Agency & Agent Management
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Agency Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agencies.length ? agencies.map(a => {
              // Show all users for this agency, including all roles (admin, agent, pending, etc.)
              const agencyUsers = users.filter(u => String(u.agencyProfile) === String(a._id));
              return (
                <React.Fragment key={a._id}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => setOpenRows(prev => ({...prev, [a._id]: !prev[a._id]}))}>
                        {openRows[a._id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{a.agencyName}</TableCell>
                    <TableCell>{a.contactPerson}</TableCell>
                    <TableCell>{a.address?.city || '—'}</TableCell>
                    <TableCell>
                      <IconButton title="Info" onClick={() => handleInfo(a)}><InfoIcon /></IconButton>
                      <IconButton color="error" title="Delete" onClick={() => handleDelete(a._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                      <Collapse in={openRows[a._id]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="subtitle1" gutterBottom>Users</Typography>
                          {userLoading ? <CircularProgress size={20} /> : userError ? <Alert severity="error">{userError}</Alert> : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Role</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {agencyUsers.length ? agencyUsers.map(user => (
                                  <TableRow key={user._id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={user.role} 
                                        sx={{ 
                                          backgroundColor: getRoleColor(user.role),
                                          color: 'white',
                                          fontWeight: 'bold'
                                        }} 
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <IconButton 
                                        color="primary" 
                                        onClick={() => handleAgentInfoClick(user)}
                                        title="View Details"
                                      >
                                        <InfoIcon />
                                      </IconButton>
                                      <Select
                                        value={user.role}
                                        onChange={(e) => confirmRoleChange(user._id, e.target.value, user.role)}
                                        sx={{ width: 120, ml: 1 }}
                                      >
                                        <MenuItem value="agent">Agent</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                      </Select>
                                      <IconButton 
                                        color="error" 
                                        onClick={() => confirmDeleteUser(user._id)} 
                                        title="Delete"
                                        sx={{ ml: 1 }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                )) : (
                                  <TableRow>
                                    <TableCell colSpan={3} align="center">No users found</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No agencies found 😬</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog open={infoOpen} onClose={closeInfo} fullWidth maxWidth="sm">
        <DialogTitle>Agency Details</DialogTitle>
        <DialogContent dividers>
          {selectedAgency && (
            <>
              <Typography><strong>Username:</strong> {selectedAgency.username}</Typography>
              <Typography><strong>Agency Name:</strong> {selectedAgency.agencyName}</Typography>
              <Typography><strong>Corporate Name:</strong> {selectedAgency.corporateName || '—'}</Typography>
              <Typography><strong>Tax Reg. No:</strong> {selectedAgency.taxRegistrationNo}</Typography>
              <Typography><strong>Contact Person:</strong> {selectedAgency.contactPerson}</Typography>
              <Typography><strong>Address:</strong>
                {` ${selectedAgency.address.street}, ${selectedAgency.address.city}, ${selectedAgency.address.state}, ${selectedAgency.address.country}, ${selectedAgency.address.zipCode}`}
              </Typography>
              <Typography><strong>Phone:</strong> {selectedAgency.phoneNumber || '—'}</Typography>
              <Typography><strong>Mobile:</strong> {selectedAgency.mobilePhone || '—'}</Typography>
              <Typography><strong>Fax:</strong> {selectedAgency.fax || '—'}</Typography>
              <Typography><strong>Billing Email:</strong> {selectedAgency.billingEmail || '—'}</Typography>
              <Typography><strong>Remarks:</strong> {selectedAgency.remarks || '—'}</Typography>
              {/* add more fields as needed */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog
        open={userDetailsDialog.open}
        onClose={closeUserDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {userDetailsDialog.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : userDetailsDialog.user && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom>User Information</Typography>
              </Grid>
              <Grid item xs={12}><Typography variant="subtitle1" color="textSecondary">Email</Typography><Typography variant="body1">{userDetailsDialog.user.email}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle1" color="textSecondary">Role</Typography><Chip label={userDetailsDialog.user.role} sx={{ backgroundColor: getRoleColor(userDetailsDialog.user.role), color: 'white', fontWeight: 'bold' }} /></Grid>
              <Grid item xs={12}><Typography variant="subtitle1" color="textSecondary">Created At</Typography><Typography variant="body1">{new Date(userDetailsDialog.user.createdAt).toLocaleString()}</Typography></Grid>
              <Grid item xs={12}><Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>Agency Information</Typography></Grid>
              {userDetailsDialog.agency ? (
                <>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1" color="textSecondary">Agency Name</Typography><Typography variant="body1">{userDetailsDialog.agency.agencyName || '—'}</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1" color="textSecondary">Contact Person</Typography><Typography variant="body1">{userDetailsDialog.agency.contactPerson || '—'}</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1" color="textSecondary">Billing Email</Typography><Typography variant="body1">{userDetailsDialog.agency.billingEmail || '—'}</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1" color="textSecondary">Phone Number</Typography><Typography variant="body1">{userDetailsDialog.agency.phoneNumber || '—'}</Typography></Grid>
                  <Grid item xs={12} md={6}><Typography variant="subtitle1" color="textSecondary">Secondary Phone</Typography><Typography variant="body1">{userDetailsDialog.agency.phoneNumber2 || '—'}</Typography></Grid>
                </>
              ) : (
                <Grid item xs={12}><Typography variant="body1" color="textSecondary">No agency information available</Typography></Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUserDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent><DialogContentText>{confirmDialog.message}</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))} color="primary">Cancel</Button>
          <Button onClick={confirmDialog.action} color="error" variant="contained" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
      >
        <Alert onClose={closeNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AgencyManagement;
