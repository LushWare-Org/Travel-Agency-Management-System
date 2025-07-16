import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const UploadProgress = ({ progress }) => {
  return (
    <Box 
      sx={{ 
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        maxWidth: 600,
        bgcolor: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 9999
      }}
    >
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
          height: 8,
          borderRadius: 4,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: '#4f46e5',
          },
          backgroundColor: '#e5e7eb'
        }}
      />
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
        {Math.round(progress)}% Uploaded
      </Typography>
    </Box>
  );
};

export default UploadProgress;
