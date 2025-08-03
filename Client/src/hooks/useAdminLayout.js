import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const DRAWER_WIDTH = 240;

export const useAdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [layoutKey, setLayoutKey] = useState(0);

  // Force layout recalculation when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
    setLayoutKey(prev => prev + 1); // Force re-render
  }, [isMobile]);

  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      setMobileOpen(false);
      setLayoutKey(prev => prev + 1);
    };

    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getMainContentStyles = () => ({
    flexGrow: 1,
    p: 3,
    mt: '64px',
    ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
    width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
    backgroundColor: '#f5f5f5',
    minHeight: 'calc(100vh - 64px)',
    overflow: 'auto',
    transition: 'margin-left 0.225s cubic-bezier(0.0, 0, 0.2, 1), width 0.225s cubic-bezier(0.0, 0, 0.2, 1)'
  });

  const getAppBarStyles = () => ({
    width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
    ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
    bgcolor: '#1976d2',
    transition: 'margin-left 0.225s cubic-bezier(0.0, 0, 0.2, 1), width 0.225s cubic-bezier(0.0, 0, 0.2, 1)'
  });

  return {
    isMobile,
    mobileOpen,
    layoutKey,
    drawerWidth: DRAWER_WIDTH,
    handleDrawerToggle,
    getMainContentStyles,
    getAppBarStyles
  };
};
