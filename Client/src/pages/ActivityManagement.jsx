import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Activities from './admin/Activities';
import ActivityBookings from './admin/ActivityBookings';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`activity-tabpanel-${index}`}
      aria-labelledby={`activity-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ActivityManagement = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="activity management tabs">
          <Tab label="Activities" id="activity-tab-0" aria-controls="activity-tabpanel-0" />
          <Tab label="Activity Bookings" id="activity-tab-1" aria-controls="activity-tabpanel-1" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Activities />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <ActivityBookings />
      </TabPanel>
    </Box>
  );
};

export default ActivityManagement;
