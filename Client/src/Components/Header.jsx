import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const HotelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const AccountCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Header = ({ isAuthenticated, isAdmin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Hotels dropdown
  useEffect(() => {
    axios.get('/hotels', { withCredentials: true })
      .then(response => {
        const validHotels = (response?.data || []).filter(h => h && h._id && h.name);
        console.log('Fetched hotels:', validHotels); // Debug: Verify hotels
        setHotels(validHotels);
      })
      .catch(error => {
        console.error('Error fetching hotels for header search:', error);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (showSearchDropdown && !e.target.closest('.search-dropdown')) {
        console.log('Closing search dropdown due to outside click'); // Debug
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchDropdown]);

  // Menu items
  const menuItems = [
    ...(isAdmin ? [{ text: 'Admin Panel', path: '/admin', icon: null }] : []),
    { text: 'Contact Us', path: '/contact', icon: null },
  ];

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Submitting search with query:', searchQuery); // Debug
      setLoading(true);
      setDrawerOpen(false);
      setShowSearchDropdown(false);
      setTimeout(() => {
        navigate(`/search`, { state: { query: searchQuery } });
        setLoading(false);
      }, 1000);
    }
  };

  // Handle navigation with loading effect
  const handleNavigation = (path) => {
    if (location.pathname !== path) { // Only show loading if navigating to a different page
      setLoading(true);
      setDrawerOpen(false); 
      setProfileOpen(false);
      setShowSearchDropdown(false);
      setTimeout(() => {
        navigate(path);
        setLoading(false); 
      }, 1000); 
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await axios.post("/auth/logout", {}, { withCredentials: true });
        if (typeof onLogout === 'function') {
          onLogout();
        }
        setProfileOpen(false);
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand - Hidden on mobile */}
          <div className="hidden md:flex items-center">          <RouterLink to="/" className="flex items-center gap-3">
            <img 
              className="h-14 w-auto" 
              src="/Logo.png"  
              alt="Logo" 
            />
            <div>
              <h1 className="text-xl font-extrabold text-indigo-900 leading-tight">
                Yomaldives
              </h1>
              <p className="text-blue-800 text-sm">Maldives Wholesale Experts</p>
            </div>
          </RouterLink>
        </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 flex-1 justify-end mr-14">
            <button
              onClick={() => {
                handleNavigation('/search');
                setTimeout(() => {
                  const el = document.getElementById('property-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 1300); 
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors bg-transparent border-none"
              style={{ background: 'none', border: 'none' }}
            >
              Properties
            </button>
            <button
              onClick={() => handleNavigation('/tours')}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors bg-transparent border-none"
              style={{ background: 'none', border: 'none' }}
            >
              Tours
            </button>
            {menuItems.map((item) => (
              <button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                {item.icon && <span className="mr-2 text-indigo-500">{item.icon}</span>}
                {item.text}
              </button>
            ))}
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative search-dropdown">
              <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300">
                <input
                  type="text"
                  placeholder="Search hotels..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log('Search input changed:', e.target.value); // Debug
                    setShowSearchDropdown(true);
                  }}
                  onClick={() => {
                    console.log('Search input clicked'); // Debug
                    setShowSearchDropdown(true);
                  }}
                  className="px-3 py-1 border-none focus:outline-none text-gray-700 text-sm"
                />
                {selectedHotel && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-10 px-2 flex items-center text-gray-500 hover:text-gray-800"
                    onClick={() => {
                      setSelectedHotel(null);
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                      console.log('Cleared search input'); // Debug
                    }}
                  >
                    ×
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-indigo-50 px-3 py-2 text-indigo-600 hover:bg-indigo-100"
                >
                  <SearchIcon />
                </button>
              </div>
              {showSearchDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {hotels.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No hotels available</div>
                  ) : (
                    hotels
                      .filter(h =>
                        searchQuery === '' ? true : (h.name || '').toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(h => (
                        <div
                          key={h._id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                          onClick={() => {
                            setSelectedHotel(h);
                            setSearchQuery(h.name);
                            setShowSearchDropdown(false);
                            console.log('Selected hotel:', h.name); // Debug
                          }}
                        >
                          {h.name}
                        </div>
                      ))
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 focus:outline-none text-indigo-600"
              >
                <AccountCircleIcon />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-10">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-between w-full">
            <RouterLink to="/" className="flex items-center space-x-8">
              <HotelIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-lg font-extrabold text-indigo-900">Yomaldives</span>
            </RouterLink>
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50" onClick={() => setDrawerOpen(false)}>
          <div
            className="w-64 bg-white h-full shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <RouterLink to="/" className="flex items-center space-x-2" onClick={() => setDrawerOpen(false)}>
                <span className="text-xl font-extrabold text-indigo-900">Yomaldives</span>
              </RouterLink>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4 relative search-dropdown">
              <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300">
                <input
                  type="text"
                  placeholder="Search hotels..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log('Mobile search input changed:', e.target.value); // Debug
                    setShowSearchDropdown(true);
                  }}
                  onClick={() => {
                    console.log('Mobile search input clicked'); // Debug
                    setShowSearchDropdown(true);
                  }}
                  className="px-3 py-2 border-none flex-grow focus:outline-none text-gray-700 text-sm"
                />
                {selectedHotel && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-10 px-2 flex items-center text-gray-500 hover:text-gray-800"
                    onClick={() => {
                      setSelectedHotel(null);
                      setSearchQuery('');
                      setShowSearchDropdown(false);
                      console.log('Cleared mobile search input'); // Debug
                    }}
                  >
                    ×
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-indigo-50 px-3 py-2 text-indigo-600 hover:bg-indigo-100"
                >
                  <SearchIcon />
                </button>
              </div>
              {showSearchDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {hotels.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No hotels available</div>
                  ) : (
                    hotels
                      .filter(h =>
                        searchQuery === '' ? true : (h.name || '').toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(h => (
                        <div
                          key={h._id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                          onClick={() => {
                            setSelectedHotel(h);
                            setSearchQuery(h.name);
                            setShowSearchDropdown(false);
                            console.log('Selected hotel (mobile):', h.name); // Debug
                          }}
                        >
                          {h.name}
                        </div>
                      ))
                  )}
                </div>
              )}
            </form>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  {item.icon && <span className="mr-2 text-indigo-500">{item.icon}</span>}
                  {item.text}
                </button>
              ))}
              <button
                onClick={() => handleNavigation('/profile')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                My Profile
              </button>
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                My Bookings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;