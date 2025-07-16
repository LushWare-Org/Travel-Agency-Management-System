import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Box,
  Chip,
  Button,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';

const ContactManagement = () => {
  // state
  const [submissions, setSubmissions]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [replyModalOpen, setReplyModalOpen]   = useState(false);
  const [selected, setSelected]               = useState(null);
  const [replyText, setReplyText]             = useState('');
  const [notification, setNotification]       = useState({ open:false, message:'', severity:'success' });

  // 1️⃣ Load from backend
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/contacts', { withCredentials: true });
        setSubmissions(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2️⃣ Mark as Read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `/contacts/${id}`,
        { status: 'Read' },
        { withCredentials: true }
      );
      setSubmissions(subs =>
        subs.map(s => s._id === id ? { ...s, status: 'Read' } : s)
      );
      showNotification('Marked as Read', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Could not mark as read', 'error');
    }
  };

  // 3️⃣ Open & close reply dialog
  const handleOpenReply  = (sub) => { setSelected(sub); setReplyText(''); setReplyModalOpen(true); };
  const handleCloseReply = ()  => { setSelected(null); setReplyModalOpen(false); };

  // 4️⃣ Send Reply
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await axios.post(
        `/contacts/${selected._id}/sendEmail`,
        { response: replyText },
        { withCredentials: true }
      );
  
      // 2️⃣ Persist to DB
      const { data: updated } = await axios.put(
        `/contacts/${selected._id}`,
        { status: 'Replied', response: replyText },
        { withCredentials: true }
      );

      setSubmissions(subs =>
        subs.map(s =>
          s._id === selected._id
            ? { ...s, status: 'Replied', reply: replyText }
            : s
        )
      );
      showNotification('Reply sent', 'success');
      handleCloseReply();
    } catch (err) {
      console.error(err);
      showNotification('Failed to send reply', 'error');
    }
  };

  // helpers
  const truncate = (msg, n=50) =>
    msg.length > n ? msg.slice(0,n) + '…' : msg;

  const statusColor = (st) =>
    st === 'Read' ? 'success' :
    st === 'Replied' ? 'primary' :
    'warning';

  const showNotification = (msg, sev) =>
    setNotification({ open:true, message:msg, severity:sev });

  const closeNotification = () =>
    setNotification({ ...notification, open:false });

  // render
  return (
    <Paper sx={{ p:3, m:2 }}>
      <Typography variant="h5" gutterBottom>
        Contact Submissions
      </Typography>

      {loading ? (
        <Box sx={{ p:3, textAlign:'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map(sub => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{sub.phone || '—'}</TableCell>
                  <TableCell>{sub.subject}</TableCell>
                  <TableCell>{truncate(sub.message)}</TableCell>
                  <TableCell>
                    {new Date(sub.submittedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={sub.status} color={statusColor(sub.status)} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {sub.status === 'Unread' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleMarkAsRead(sub._id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenReply(sub)}
                      >
                        Reply
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyModalOpen} onClose={handleCloseReply}>
        <DialogTitle>Reply to {selected?.name}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" mb={2}>
            <strong>Original Message:</strong> {selected?.message}
          </Typography>
          <Typography variant="body2" mb={2}>
            <strong>Previous Reply</strong> {selected?.response || '—'}
          </Typography>
          <TextField
            label="Your Reply"
            multiline
            fullWidth
            minRows={3}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReply}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!replyText.trim()}
            onClick={handleSendReply}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
      >
        <Alert severity={notification.severity} onClose={closeNotification}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ContactManagement;
