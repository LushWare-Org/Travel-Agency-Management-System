import React, { useState, useEffect } from 'react';
import AllTours from '../Components/AllTours';
import AddTour from '../Components/AddTour';
import TourInquiries from '../Components/TourInquiries';
import TourBookingManagement from './TourBookingManagement';
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
  const [activeTab, setActiveTab] = useState('all-tours');
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tour Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your tours, add new destinations, and handle inquiries</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('all-tours')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'all-tours'
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Tours
            </button>
            <button
              onClick={() => handleTabChange('add-tour')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'add-tour'
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add New Tour
            </button>
            <button
              onClick={() => handleTabChange('booking-management')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'booking-management'
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tour Bookings
            </button>
            <button
              onClick={() => handleTabChange('inquiries')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tour Inquiries
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'all-tours' && <AllTours />}
            {activeTab === 'add-tour' && <AddTour />}
            {activeTab === 'booking-management' && <TourBookingManagement />}
            {activeTab === 'inquiries' && <TourInquiries />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourManagement;