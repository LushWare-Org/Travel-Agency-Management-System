// Components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Icons
const BookingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
  </svg>
);

const OfferIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const ToursIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);



const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const navItems = [
    { icon: <SearchIcon />, text: 'Search Properties', path: '/search' },
    { icon: <ToursIcon />, text: 'Tours', path: '/tours' },
    { icon: <OfferIcon />, text: 'Special Offers', path: '/special-offers' },
    { icon: <ProfileIcon />, text: 'My Profile', path: '/profile' },
  ];

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      setLoading(true);
      setTimeout(() => {
        navigate(path);
        setLoading(false);
      }, 1000);
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white transition-all duration-300 ease-in-out shadow-lg
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-600 sticky top-0 bg-indigo-900">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
            <h1 className="text-xl font-extrabold tracking-tight">Yomaldives</h1>
          </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-300 mx-auto" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-indigo-200 hover:text-white focus:outline-none"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center ${
              sidebarOpen ? 'space-x-4 px-4' : 'justify-center'
            } py-3 rounded-xl ${
              location.pathname === item.path ? 'bg-indigo-600/80' : 'hover:bg-indigo-600/50'
            } transition-colors cursor-pointer`}
          >
            {item.icon}
            {sidebarOpen && <span className="text-sm font-medium">{item.text}</span>}
          </div>
        ))}
      </div>
      {sidebarOpen && (
        <div className="absolute bottom-0 w-full py-4 px-4 border-t border-indigo-600 bg-indigo-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
              AT
            </div>
            <div>
              <p className="text-sm font-medium">Agent Travel</p>
              <p className="text-xs text-indigo-200">Premier Partner</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;