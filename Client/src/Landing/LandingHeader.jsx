import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const palette = {
  platinum: "#E7E9E5",
  ash_gray: "#B7C5C7",
  lapis_lazuli: "#005E84",
  indigo_dye: "#075375",
  indigo_dye2: "#0A435C",
};

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const servicesDropdownTimeout = useRef(null);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountDropdown]);
  const handleSignOut = () => {
    if (logout) {
      logout();
    } else {
      // fallback: reload or redirect
      window.location.href = "/login";
    }
    setAccountDropdown(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to check active tab - now supports nested routes
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Helper to check if we're in resorts/hotels section
  const isInResortsSection = () => {
    return (
      location.pathname.startsWith("/search") ||
      location.pathname.startsWith("/hotels")
    );
  };

  // Helper to check if we're in a services section
  const isInServicesSection = () => {
    return location.pathname.match(
      /\/(travel-services|real-estate|investment-support|brand-representation)/
    );
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "bg-gradient-to-r from-[#B7C5C7]/95 via-[#E7E9E5]/95 to-[#B7C5C7]/95 backdrop-blur-lg shadow-xl border-b border-[#005E84]/20"
          : "bg-gradient-to-r from-[#E7E9E5]/90 via-[#B7C5C7]/70 to-[#E7E9E5]/90 backdrop-blur-md shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#005E84] to-[#075375] rounded-full opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-300"></div>
              <img
                className="relative h-14 w-14 rounded-full shadow-lg ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300 transform hover:scale-105"
                src="/IsleKey Logo.jpg"
                alt="IsleKey Holidays Logo"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-[#005E84] to-[#075375] bg-clip-text text-transparent hover:from-[#075375] hover:to-[#0A435C] transition-all duration-300"
              >
                IsleKey Holidays
              </h1>
              <p
                className="text-sm font-medium tracking-wide transition-colors duration-300"
                style={{ color: palette.indigo_dye }}
              >
                Your Gateway to Paradise
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {/* New navigation items */}
            <Link
              to="/"
              className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                isActive("/")
                  ? "text-[#005E84] font-semibold"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={scrollToTop}
            >
              <span className="relative z-10">Home</span>
              <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                isActive("/") ? "w-8" : "w-0 group-hover:w-8"
              }`} />
            </Link>
            <Link
              to="/about-us"
              className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                isActive("/about-us")
                  ? "text-[#005E84] font-semibold"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={scrollToTop}
            >
              <span className="relative z-10">About Us</span>
              <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                isActive("/about-us") ? "w-8" : "w-0 group-hover:w-8"
              }`} />
            </Link>
            <div
              className="relative"
              onMouseEnter={() => {
                if (servicesDropdownTimeout.current) {
                  clearTimeout(servicesDropdownTimeout.current);
                  servicesDropdownTimeout.current = null;
                }
                setServicesDropdown(true);
              }}
              onMouseLeave={() => {
                servicesDropdownTimeout.current = setTimeout(() => {
                  setServicesDropdown(false);
                }, 150);
              }}
            >
              <button
                className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group flex items-center ${
                  isInServicesSection()
                    ? "text-[#005E84] font-semibold"
                    : "text-[#0A435C] hover:text-[#005E84]"
                }`}
                type="button"
              >
                <span className="relative z-10">Our Services</span>
                <svg
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ${servicesDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                  isInServicesSection() ? "w-8" : "w-0 group-hover:w-8"
                }`} />
              </button>
              {servicesDropdown && (
                <div
                  className="absolute left-0 mt-3 w-64 bg-gradient-to-br from-[#E7E9E5]/95 via-white/95 to-[#B7C5C7]/95 backdrop-blur-lg rounded-xl shadow-xl border border-[#005E84]/20 overflow-hidden animate-slideUp"
                  style={{
                    animation: 'slideUp 0.3s ease-out'
                  }}
                  onMouseEnter={() => {
                    if (servicesDropdownTimeout.current) {
                      clearTimeout(servicesDropdownTimeout.current);
                      servicesDropdownTimeout.current = null;
                    }
                    setServicesDropdown(true);
                  }}
                  onMouseLeave={() => {
                    servicesDropdownTimeout.current = setTimeout(() => {
                      setServicesDropdown(false);
                    }, 150);
                  }}
                >
                  <div className="py-2">
                    <Link
                      to="/travel-services"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] border-l-4 border-transparent hover:border-[#005E84] transform hover:translate-x-1 ${
                        isActive("/travel-services")
                          ? "bg-[#E1F5FE] text-[#005E84] border-[#005E84]"
                          : ""
                      }`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">✈️</span>
                        <span>Travel Services</span>
                      </div>
                    </Link>
                    <Link
                      to="/real-estate"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] border-l-4 border-transparent hover:border-[#005E84] transform hover:translate-x-1 ${
                        isActive("/real-estate")
                          ? "bg-[#E1F5FE] text-[#005E84] border-[#005E84]"
                          : ""
                      }`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🏡</span>
                        <span>Real Estate</span>
                      </div>
                    </Link>
                    <Link
                      to="/investment-support"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] border-l-4 border-transparent hover:border-[#005E84] transform hover:translate-x-1 ${
                        isActive("/investment-support")
                          ? "bg-[#E1F5FE] text-[#005E84] border-[#005E84]"
                          : ""
                      }`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">💼</span>
                        <span>Investment Support</span>
                      </div>
                    </Link>
                    <Link
                      to="/brand-representation"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] border-l-4 border-transparent hover:border-[#005E84] transform hover:translate-x-1 ${
                        isActive("/brand-representation")
                          ? "bg-[#E1F5FE] text-[#005E84] border-[#005E84]"
                          : ""
                      }`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🏢</span>
                        <span>Brand Representation</span>
                      </div>
                    </Link>
                    <Link
                      to="/hulhumeedhoo"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] border-l-4 border-transparent hover:border-[#005E84] transform hover:translate-x-1 ${
                        isActive("/hulhumeedhoo")
                          ? "bg-[#E1F5FE] text-[#005E84] border-[#005E84]"
                          : ""
                      }`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🏝️</span>
                        <span>Hulhumeedhoo Island</span>
                      </div>
                    </Link>
                    <Link
                      to="/token-program"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] border-l-4 border-transparent hover:border-[#005E84] transform hover:translate-x-1 ${
                        isActive("/token-program")
                          ? "bg-[#E1F5FE] text-[#005E84] border-[#005E84]"
                          : ""
                      }`}
                      onClick={scrollToTop}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🪙</span>
                        <span>Token Program</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/search"
              className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                isInResortsSection()
                  ? "text-[#005E84] font-semibold"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={scrollToTop}
            >
              <span className="relative z-10">Resorts</span>
              <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                isInResortsSection() ? "w-8" : "w-0 group-hover:w-8"
              }`} />
            </Link>
            <Link
              to="/tours"
              className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                isActive("/tours")
                  ? "text-[#005E84] font-semibold"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={scrollToTop}
            >
              <span className="relative z-10">Tours</span>
              <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                isActive("/tours") ? "w-8" : "w-0 group-hover:w-8"
              }`} />
            </Link>
            <Link
              to="/activities"
              className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                isActive("/activities")
                  ? "text-[#005E84] font-semibold"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={scrollToTop}
            >
              <span className="relative z-10">Activities</span>
              <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                isActive("/activities") ? "w-8" : "w-0 group-hover:w-8"
              }`} />
            </Link>
            <Link
              to="/contact"
              className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                isActive("/contact")
                  ? "text-[#005E84] font-semibold"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={scrollToTop}
            >
              <span className="relative z-10">Contact</span>
              <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                isActive("/contact") ? "w-8" : "w-0 group-hover:w-8"
              }`} />
            </Link>
            {/* Auth links */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`relative px-4 py-3 font-medium transition-all duration-300 rounded-lg hover:bg-white/20 group ${
                    isActive("/login")
                      ? "text-[#005E84] font-semibold"
                      : "text-[#005E84] hover:text-[#075375]"
                  }`}
                  onClick={scrollToTop}
                >
                  <span className="relative z-10">Login</span>
                  <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#005E84] to-[#075375] transition-all duration-300 ease-out ${
                    isActive("/login") ? "w-8" : "w-0 group-hover:w-8"
                  }`} />
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    scrolled
                      ? "bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white"
                      : "bg-white/90 backdrop-blur-sm hover:bg-white text-[#005E84] border border-white/50 hover:border-white"
                  } ${
                    isActive("/register")
                      ? "ring-2 ring-[#005E84] ring-opacity-50"
                      : ""
                  }`}
                  onClick={scrollToTop}
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  className={`flex items-center space-x-3 px-4 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 hover:shadow-lg ${
                    isActive("/account")
                      ? "ring-2 ring-[#005E84] ring-opacity-50"
                      : ""
                  }`}
                  onClick={() => setAccountDropdown((v) => !v)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#005E84] to-[#075375] flex items-center justify-center text-white font-semibold shadow-md">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="text-[#0A435C] hidden sm:block">
                    {user
                      ? `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim() || user.email
                      : "Account"}
                  </span>
                  <svg
                    className={`h-4 w-4 text-[#0A435C] transition-transform duration-300 ${accountDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {accountDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-gradient-to-br from-[#E7E9E5]/95 via-white/95 to-[#B7C5C7]/95 backdrop-blur-lg rounded-xl shadow-xl border border-[#005E84]/20 overflow-hidden animate-slideUp z-20">
                    <div className="py-2">
                      <Link
                        to="/account"
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] transition-all duration-200 transform hover:translate-x-1"
                        onClick={() => {
                          setAccountDropdown(false);
                          scrollToTop();
                        }}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Account</span>
                      </Link>
                      <button
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:translate-x-1"
                        onClick={handleSignOut}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block h-0.5 w-6 bg-[#0A435C] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 w-6 bg-[#0A435C] transition-all duration-300 mt-1.5 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-6 bg-[#0A435C] transition-all duration-300 mt-1.5 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#B7C5C7]/95 via-[#E7E9E5]/95 to-[#B7C5C7]/95 backdrop-blur-lg border-t border-[#005E84]/20 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Mobile menu items */}
            <Link
              to="/"
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center ${
                isActive("/")
                  ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center ${
                isActive("/about-us")
                  ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}
            >
              About Us
            </Link>
            {/* Services dropdown for mobile */}
            <div>
              <button
                className={`flex w-full items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                  isInServicesSection()
                    ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                    : "text-[#0A435C] hover:text-[#005E84]"
                }`}
                onClick={() => setServicesDropdown(!servicesDropdown)}
              >
                <span>Our Services</span>
                <svg
                  className={`h-5 w-5 transition-transform duration-300 ${servicesDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {servicesDropdown && (
                <div className="mt-2 ml-4 space-y-2">
                  <Link
                    to="/travel-services"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                      isActive("/travel-services")
                        ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                        : "text-[#0A435C]"
                    }`}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      setServicesDropdown(false);
                    }}
                  >
                    <span className="text-lg">✈️</span>
                    <span>Travel Services</span>
                  </Link>
                  <Link
                    to="/real-estate"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                      isActive("/real-estate")
                        ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                        : "text-[#0A435C]"
                    }`}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      setServicesDropdown(false);
                    }}
                  >
                    <span className="text-lg">🏡</span>
                    <span>Real Estate</span>
                  </Link>
                  <Link
                    to="/investment-support"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                      isActive("/investment-support")
                        ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                        : "text-[#0A435C]"
                    }`}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      setServicesDropdown(false);
                    }}
                  >
                    <span className="text-lg">💼</span>
                    <span>Investment Support</span>
                  </Link>
                  <Link
                    to="/brand-representation"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                      isActive("/brand-representation")
                        ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                        : "text-[#0A435C]"
                    }`}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      setServicesDropdown(false);
                    }}
                  >
                    <span className="text-lg">🏢</span>
                    <span>Brand Representation</span>
                  </Link>
                  <Link
                    to="/hulhumeedhoo"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                      isActive("/hulhumeedhoo")
                        ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                        : "text-[#0A435C]"
                    }`}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      setServicesDropdown(false);
                    }}
                  >
                    <span className="text-lg">🏝️</span>
                    <span>Hulhumeedhoo Island</span>
                  </Link>
                  <Link
                    to="/token-program"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] hover:shadow-md transform hover:translate-x-1 min-h-[44px] ${
                      isActive("/token-program")
                        ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                        : "text-[#0A435C]"
                    }`}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                      setServicesDropdown(false);
                    }}
                  >
                    <span className="text-lg">🪙</span>
                    <span>Token Program</span>
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/search"
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center ${
                isInResortsSection()
                  ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}
            >
              Resorts
            </Link>
            <Link
              to="/tours"
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center ${
                isActive("/tours")
                  ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}
            >
              Tours
            </Link>
            <Link
              to="/activities"
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center ${
                isActive("/activities")
                  ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}
            >
              Activities
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center ${
                isActive("/contact")
                  ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                  : "text-[#0A435C] hover:text-[#005E84]"
              }`}
              onClick={() => {
                scrollToTop();
                setIsMenuOpen(false);
              }}
            >
              Contact
            </Link>
            {/* Auth links for mobile */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:shadow-md transform hover:translate-x-1 min-h-[44px] flex items-center mt-2 ${
                    isActive("/login")
                      ? "bg-gradient-to-r from-[#E1F5FE] to-white text-[#005E84] font-semibold shadow-md"
                      : "text-[#005E84] hover:text-[#075375]"
                  }`}
                  onClick={() => {
                    scrollToTop();
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-4 min-h-[44px] flex items-center justify-center bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white shadow-lg ${
                    isActive("/register")
                      ? "ring-2 ring-[#005E84] ring-opacity-50"
                      : ""
                  }`}
                  onClick={() => {
                    scrollToTop();
                    setIsMenuOpen(false);
                  }}
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative mt-2" ref={accountRef}>
                <button
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 hover:shadow-lg w-full min-h-[44px] ${
                    isActive("/account")
                      ? "ring-2 ring-[#005E84] ring-opacity-50"
                      : ""
                  }`}
                  onClick={() => setAccountDropdown((v) => !v)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#005E84] to-[#075375] flex items-center justify-center text-white font-semibold shadow-md">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <span className="text-[#0A435C] flex-1 text-left">
                    {user
                      ? `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim() || user.email
                      : "Account"}
                  </span>
                  <svg
                    className={`h-4 w-4 text-[#0A435C] transition-transform duration-300 ${accountDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {accountDropdown && (
                  <div className="mt-3 w-full bg-gradient-to-br from-[#E7E9E5]/95 via-white/95 to-[#B7C5C7]/95 backdrop-blur-lg rounded-xl shadow-xl border border-[#005E84]/20 overflow-hidden animate-slideUp">
                    <div className="py-2">
                      <Link
                        to="/account"
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gradient-to-r hover:from-[#E1F5FE] hover:to-white hover:text-[#005E84] transition-all duration-200 transform hover:translate-x-1 min-h-[44px]"
                        onClick={() => {
                          setAccountDropdown(false);
                          scrollToTop();
                          setIsMenuOpen(false);
                        }}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Account</span>
                      </Link>
                      <button
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:translate-x-1 min-h-[44px]"
                        onClick={handleSignOut}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
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
