import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
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
                src="./IsleKey Logo.jpg" 
                alt="Logo" 
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold" style={{ color: palette.lapis_lazuli }}>IsleKey Holidays</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* Updated links with hover effect */}
            <Link
              to="/search"
              className="font-medium transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Resorts
            </Link>
            <Link
              to="/tours"
              className="font-medium transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Tours
            </Link>
            <span
              className="font-medium cursor-default transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
            >
              Activities
            </span>
            <Link
              to="/contact"
              className="font-medium transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
              onClick={scrollToTop}
            >
              Contact Us
            </Link>
            <Link
              to="/login"
              className="font-medium transition-colors hover:underline hover:brightness-125"
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
              } hover:brightness-110`}
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
        <div className="md:hidden bg-[#B7C5C7] bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Updated mobile links with hover effect */}
            <Link
              to="/search"
              className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
              onClick={() => { scrollToTop(); setIsMenuOpen(false); }}
            >
              Resorts
            </Link>
            <Link
              to="/tours"
              className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
              onClick={() => { scrollToTop(); setIsMenuOpen(false); }}
            >
              Tours
            </Link>
            <span
              className="block px-3 py-2 rounded-md font-medium cursor-default transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
            >
              Activities
            </span>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125"
              style={{ color: palette.indigo_dye2 }}
              onClick={() => { scrollToTop(); setIsMenuOpen(false); }}
            >
              Contact Us
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 hover:bg-[#E7E9E5]"
              style={{ color: palette.lapis_lazuli }}
              onClick={() => { scrollToTop(); setIsMenuOpen(false); }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#E7E9E5] text-[#005E84] block px-3 py-2 rounded-md font-medium hover:bg-[#B7C5C7] mt-4 hover:brightness-110"
              onClick={() => { scrollToTop(); setIsMenuOpen(false); }}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;
