import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const palette = {
  platinum: "#E7E9E5",
  ash_gray: "#B7C5C7",
  lapis_lazuli: "#005E84",
  indigo_dye: "#075375",
  indigo_dye2: "#0A435C"
};

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();
  const accountRef = useRef(null);
  // Close account dropdown on outside click
  useEffect(() => {
    if (!accountDropdown) return;
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountDropdown]);
  const handleSignOut = () => {
    if (logout) {
      logout();
    } else {
      // fallback: reload or redirect
      window.location.href = '/login';
    }
    setAccountDropdown(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to check active tab
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#B7C5C7] shadow-lg"
        : "bg-gradient-to-r from-[#E7E9E5]/80 via-[#B7C5C7]/60 to-[#E7E9E5]/80 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-16 w-auto mb-1" 
                src="/IsleKey Logo.jpg" 
                alt="Logo" 
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold" style={{ color: palette.lapis_lazuli }}>IsleKey Holidays</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* New navigation items */}
            <Link
              to="/"
              className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/about') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              About
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                className={`font-medium transition-colors hover:underline hover:brightness-125 flex items-center ${location.pathname.startsWith('/services') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
                style={{ color: palette.indigo_dye2 }}
              >
                Our Services
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesDropdown && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
                  <Link to="/services/service1" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={scrollToTop}>Service 1</Link>
                  <Link to="/services/service2" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={scrollToTop}>Service 2</Link>
                  <Link to="/services/service3" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={scrollToTop}>Service 3</Link>
                </div>
              )}
            </div>
            <Link
              to="/search"
              className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/search') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Resorts
            </Link>
            <Link
              to="/tours"
              className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/tours') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Tours
            </Link>
            <Link
              to="/activities"
              className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/activities') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Activities
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/contact') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Contact
            </Link>
            {/* Auth links */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/login') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
                  style={{ color: palette.lapis_lazuli }}
                  onClick={scrollToTop}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-300 ${
                    scrolled
                      ? "bg-[#E7E9E5] hover:bg-[#B7C5C7] text-[#005E84]"
                      : "bg-white/30 backdrop-blur-sm hover:bg-white/50 text-[#005E84] border border-white/30"
                  } hover:brightness-110 ${isActive('/register') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
                  onClick={scrollToTop}
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  className={`flex items-center space-x-2 font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/account') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
                  style={{ color: palette.lapis_lazuli }}
                  onClick={() => setAccountDropdown((v) => !v)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 text-[#005E84]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>{user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Account'}</span>
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accountDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-20">
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setAccountDropdown(false); scrollToTop(); }}>My Account</Link>
                    <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600" onClick={handleSignOut}>Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-indigo-700 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#B7C5C7] bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile menu items */}
            <Link to="/" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.indigo_dye2 }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Home</Link>
            <Link to="/about" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/about') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.indigo_dye2 }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>About</Link>
            {/* Services dropdown for mobile */}
            <div>
              <button
                className={`block w-full text-left px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 flex items-center ${location.pathname.startsWith('/services') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`}
                style={{ color: palette.indigo_dye2 }}
                onClick={() => setServicesDropdown(!servicesDropdown)}
              >
                Our Services
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesDropdown && (
                <div className="ml-4">
                  <Link to="/services/service1" className={`block px-3 py-2 text-sm hover:bg-gray-100 ${isActive('/services/service1') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Service 1</Link>
                  <Link to="/services/service2" className={`block px-3 py-2 text-sm hover:bg-gray-100 ${isActive('/services/service2') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Service 2</Link>
                  <Link to="/services/service3" className={`block px-3 py-2 text-sm hover:bg-gray-100 ${isActive('/services/service3') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Service 3</Link>
                </div>
              )}
            </div>
            <Link to="/search" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/search') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.indigo_dye2 }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Resorts</Link>
            <Link to="/tours" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/tours') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.indigo_dye2 }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Tours</Link>
            <Link to="/activities" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/activities') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.indigo_dye2 }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Activities</Link>
            <Link to="/contact" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 ${isActive('/contact') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.indigo_dye2 }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Contact</Link>
            {/* Auth links for mobile */}
            {!user ? (
              <>
                <Link to="/login" className={`block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 hover:bg-[#E7E9E5] ${isActive('/login') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.lapis_lazuli }} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Login</Link>
                <Link to="/register" className={`bg-[#E7E9E5] text-[#005E84] block px-3 py-2 rounded-md font-medium hover:bg-[#B7C5C7] mt-4 hover:brightness-110 ${isActive('/register') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>Register</Link>
              </>
            ) : (
              <div className="relative" ref={accountRef}>
                <button className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 hover:bg-[#E7E9E5] ${isActive('/account') ? 'border-b-2 border-[#005E84] text-[#005E84]' : ''}`} style={{ color: palette.lapis_lazuli }} onClick={() => setAccountDropdown((v) => !v)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 text-[#005E84]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <span>{user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Account'}</span>
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accountDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-20">
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setAccountDropdown(false); scrollToTop(); setIsMenuOpen(false); }}>My Account</Link>
                    <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600" onClick={handleSignOut}>Sign Out</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
