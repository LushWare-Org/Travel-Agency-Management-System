import React, { useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageGallery from '../Components/ImageGallery';
import Navigation from '../Components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Filter } from 'lucide-react';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const Tours = ({ sidebarOpen }) => {
  const { isMobile, isTablet } = useDeviceType();
  const { state } = useLocation();
  const navigate = useNavigate();
  const searchTerm = state?.searchTerm || null;
  const titlePassed = state?.title || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-16'} pl-0`}>
        {/* Navigation */}
        <Navigation 
          onLogout={() => navigate('/login')} 
        />

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1400px] mx-auto">
          {/* Header */}
          <header
            className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920')",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold drop-shadow-md">
                Maldives Tour Packages
              </h1>
              <p className="text-xs sm:text-sm mt-2 drop-shadow-md max-w-md px-4">
                Discover paradise with our exclusive tour packages and unforgettable experiences
              </p>
            </div>
          </header>

          {/* Tours Gallery Section */}
          <div className="mt-4 sm:mt-6 lg:mt-8">
            <ImageGallery searchQuery={searchTerm} passedCountry={titlePassed} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Tours;
