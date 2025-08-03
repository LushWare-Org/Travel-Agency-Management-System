import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const palette = {
  platinum: "#E7E9E5",
  ash_gray: "#B7C5C7",
  lapis_lazuli: "#005E84",
  indigo_dye: "#075375",
  indigo_dye2: "#0A435C"
};

const Login = ({ setIsAuthenticated }) => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-1.2.1&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-1.2.1&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586861635167-e5223aedc9b0?ixlib=rb-1.2.1&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520483601560-389dff434fdf?ixlib=rb-1.2.1&auto=format&fit=crop'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire('Oops', 'Please fix the highlighted errors before submitting.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (typeof setIsAuthenticated === 'function') {
        setIsAuthenticated(true);
      }

      Swal.fire('Success', response.data.msg || 'Login successful!', 'success');

      try {
        const userResponse = await axios.get('/users/me');
        setUser(userResponse.data);
        
        // Handle post-login redirect
        const bookingIntent = location.state?.bookingIntent;
        const from = location.state?.from;

        if (bookingIntent) {
          // Redirect to the booking page with the saved data
          switch (bookingIntent.type) {
            case 'hotel':
              navigate('/bookingRequest', { state: bookingIntent.data });
              break;
            case 'activity':
              navigate(`/activities/${bookingIntent.data.activityId}/booking`, {
                state: {
                  selectedDate: bookingIntent.data.selectedDate,
                  guests: bookingIntent.data.guests,
                  bookingType: bookingIntent.data.bookingType // Preserve the booking type
                }
              });
              break;
            case 'tour':
              // For tours, redirect back to the tour details page and auto-open inquiry form
              navigate(bookingIntent.returnTo, {
                state: { openInquiry: true, tourBookingData: bookingIntent.data }
              });
              break;
            case 'tour-booking':
              // For tour booking, redirect back to the tour details page
              // (future booking form will be implemented here)
              navigate(bookingIntent.returnTo, {
                state: { proceedToBooking: true, tourBookingData: bookingIntent.data }
              });
              break;
            default:
              navigate(from?.pathname || '/');
          }
        } else if (from?.pathname) {
          // Regular redirect after authentication
          navigate(from.pathname + (from.search || ''), { replace: true });
        } else {
          navigate('/'); // Default redirect to home page
        }
      } catch (userError) {
        console.error('Failed to fetch user data after login:', userError);
        Swal.fire('Warning', 'Logged in but user data could not be loaded. Please refresh.', 'warning');
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle pending status
      if (err.response?.status === 403 && err.response?.data?.status === 'pending') {
        Swal.fire({
          title: 'Account Pending',
          text: err.response.data.msg,
          icon: 'info',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire('Error', err.response?.data?.msg || 'Login failed. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: palette.platinum }}>
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
                <p className="text-[palette.ash_gray] text-sm" style={{ color: palette.ash_gray }}>Maldives Wholesale Experts</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="font-medium transition-colors hover:underline hover:brightness-125" style={{ color: palette.indigo_dye2 }}>
                Home
              </Link>
              <Link to="/login" className="font-medium transition-colors hover:underline hover:brightness-125" style={{ color: palette.lapis_lazuli }}>
                Login
              </Link>
              <Link
                to="/register"
                className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-300 ${
                  scrolled
                    ? "bg-[#E7E9E5] hover:bg-[#B7C5C7] text-[#005E84]"
                    : "bg-white/30 backdrop-blur-sm hover:bg-white/50 text-[#005E84] border border-white/30"
                } hover:brightness-110`}
              >
                Register
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-indigo-700 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
              <Link to="/" className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125" style={{ color: palette.indigo_dye2 }}>
                Home
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 hover:bg-[#E7E9E5]"
                style={{ color: palette.lapis_lazuli }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#E7E9E5] text-[#005E84] block px-3 py-2 rounded-md font-medium hover:bg-[#B7C5C7] mt-4 hover:brightness-110"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="flex-grow flex">
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A435C]/80 to-[#B7C5C7]/50 flex flex-col justify-center px-12">
            <h1 className="text-4xl font-bold" style={{ color: palette.platinum }}>Welcome to Maldives Reservation Portal</h1>
            <p className="text-xl mb-8" style={{ color: palette.ash_gray }}>Access exclusive properties and manage bookings for your clients</p>
            <div className="absolute bottom-8 left-12 flex space-x-3">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImage ? 'bg-white scale-110 w-8' : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-12" style={{ backgroundColor: palette.platinum }}>
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold" style={{ color: palette.indigo_dye2 }}>Welcome back</h2>
              <p className="mt-2" style={{ color: palette.ash_gray }}>Sign in to your travel agent account</p>
              {/* Show booking intent message if user was trying to make a booking */}
              {location.state?.bookingIntent && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Almost there!</span> Please login to complete your{' '}
                    {location.state.bookingIntent.type === 'hotel' && 'hotel booking'}
                    {location.state.bookingIntent.type === 'activity' && 'activity booking'}
                    {location.state.bookingIntent.type === 'tour' && 'tour inquiry'}
                    {location.state.bookingIntent.data?.tourName && ` for ${location.state.bookingIntent.data.tourName}`}
                    {location.state.bookingIntent.data?.activityTitle && ` for ${location.state.bookingIntent.data.activityTitle}`}
                    {location.state.bookingIntent.data?.hotelName && ` at ${location.state.bookingIntent.data.hotelName}`}
                    .
                  </p>
                </div>
              )}
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#005E84] to-[#0A435C] hover:from-[#075375] hover:to-[#005E84] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005E84] transform transition-all duration-300 hover:scale-105 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: palette.ash_gray }}>
                Don't have an account?{' '}
                <Link to="/register" className="font-medium" style={{ color: palette.lapis_lazuli }}>
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex justify-center space-x-2 py-4">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImage ? 'bg-indigo-600 scale-110' : 'bg-indigo-300 hover:bg-indigo-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Login;