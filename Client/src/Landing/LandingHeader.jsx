import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useContext(AuthContext);

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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-blue-900 shadow-lg" : "bg-gradient-to-r indigo-1000 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-16 w-auto mb-1" 
                src="./IsleKey Logo.jpg" 
                alt="Logo" 
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white">IsleKey Holidays</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* Updated links */}
            <Link to="/search" className="text-white font-medium hover:text-blue-200 transition-colors" onClick={scrollToTop}>
              Resorts
            </Link>
            <Link to="/tours" className="text-white font-medium hover:text-blue-200 transition-colors" onClick={scrollToTop}>
              Tours
            </Link>
            <span className="text-white font-medium cursor-default">Activities</span>
            <Link to="/contact" className="text-white font-medium hover:text-blue-200 transition-colors" onClick={scrollToTop}>
              Contact Us
            </Link>
            <Link to="/login" className="text-blue-100 font-medium hover:text-blue-200 transition-colors" onClick={scrollToTop}>
              Login
            </Link>
            <Link 
              to="/register" 
              className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-300 ${
                scrolled ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
              }`}
              onClick={scrollToTop}
            >
              Register
            </Link>
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
        <div className="md:hidden bg-indigo-900 bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Updated mobile links */}
            <Link to="/search" className="text-white block px-3 py-2 rounded-md font-medium" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>
              Resorts
            </Link>
            <Link to="/tours" className="text-white block px-3 py-2 rounded-md font-medium" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>
              Tours
            </Link>
            <span className="text-white block px-3 py-2 rounded-md font-medium cursor-default">
              Activities
            </span>
            <Link to="/contact" className="text-white block px-3 py-2 rounded-md font-medium hover:text-blue-200" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>
              Contact Us
            </Link>
            <Link to="/login" className="text-blue-100 block px-3 py-2 rounded-md font-medium hover:text-white hover:bg-indigo-600" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>
              Login
            </Link>
            <Link to="/register" className="bg-blue-500 text-white block px-3 py-2 rounded-md font-medium hover:bg-blue-600 mt-4" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
