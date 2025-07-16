import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import AllTours from '../Components/AllTours';
import AddTour from '../Components/AddTour';
import TourInquiries from '../Components/TourInquiries';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const TourManagement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: isMobile ? '16px' : isTablet ? '24px' : '32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const contentWrapperStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  };

  const headerStyle = {
    marginBottom: isMobile ? '20px' : '32px',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em',
  };

  const subtitleStyle = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#64748b',
    fontWeight: '400',
    margin: '0',
  };

  const tabContainerStyle = {
    background: '#ffffff',
    borderRadius: isMobile ? '12px' : '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  };

  const customTabBarStyle = {
    margin: '0',
    padding: isMobile ? '16px 16px 0 16px' : '24px 24px 0 24px',
    background: '#ffffff',
    borderBottom: 'none',
    display: 'flex',
    justifyContent: 'center',
  };

  const tabPaneStyle = {
    padding: isMobile ? '20px 16px' : isTablet ? '24px' : '32px 24px',
    minHeight: '60vh',
    background: '#ffffff',
  };

  const customStyles = `
    .modern-tabs .ant-tabs-nav {
      display: flex !important;
      justify-content: center !important;
    }

    .modern-tabs .ant-tabs-nav-list {
      display: flex !important;
      justify-content: center !important;
    }

    .modern-tabs .ant-tabs-tab {
      position: relative;
      padding: ${isMobile ? '12px 24px' : '14px 32px'} !important;
      margin: 0 6px !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 10px !important;
      background: #ffffff !important;
      transition: all 0.3s ease !important;
      font-weight: 600 !important;
      font-size: ${isMobile ? '14px' : '16px'} !important;
      color: #475569 !important;
      min-width: ${isMobile ? '100px' : '140px'} !important;
      text-align: center !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    }

    .modern-tabs .ant-tabs-tab:hover {
      background: #f8fafc !important;
      border-color: #3b82f6 !important;
      color: #1e293b !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
    }

    .modern-tabs .ant-tabs-tab-active {
      background: #3b82f6 !important;
      border-color: #3b82f6 !important;
      color: #ffffff !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
    }

    .modern-tabs .ant-tabs-tab-active:hover {
      background: #2563eb !important;
      border-color: #2563eb !important;
      color: #ffffff !important;
    }

    .modern-tabs .ant-tabs-tab .ant-tabs-tab-btn {
      color: inherit !important;
    }

    .modern-tabs .ant-tabs-ink-bar {
      display: none !important;
    }

    .modern-tabs .ant-tabs-content-holder {
      border-top: 1px solid #e2e8f0;
    }

    .modern-tabs .ant-tabs-tabpane {
      outline: none !important;
    }

    .modern-tabs .ant-tabs-nav::before {
      display: none !important;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div style={containerStyle}>
        <div style={contentWrapperStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Tour Management</h1>
            <p style={subtitleStyle}>Manage your tours, add new destinations, and handle inquiries</p>
          </div>
          
          <div style={tabContainerStyle}>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              tabBarStyle={customTabBarStyle}
              size="large"
              className="modern-tabs"
              tabBarGutter={12}
              centered
              items={[
                {
                  key: '1',
                  label: 'All Tours',
                  children: <div style={tabPaneStyle}><AllTours /></div>,
                },
                {
                  key: '2',
                  label: 'Add New Tour',
                  children: <div style={tabPaneStyle}><AddTour /></div>,
                },
                {
                  key: '4',
                  label: 'Tour Inquiries',
                  children: <div style={tabPaneStyle}><TourInquiries /></div>,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TourManagement;