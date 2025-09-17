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

// Enhanced animations and micro-interactions
const animations = {
  fadeIn: "animate-[fadeIn_0.6s_ease-out]",
  slideUp: "animate-[slideUp_0.5s_ease-out]",
  float: "animate-[float_3s_ease-in-out_infinite]",
  shimmer: "animate-[shimmer_2s_linear_infinite]",
  pulse: "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
};

const Login = ({ setIsAuthenticated }) => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // Enhanced UX: password visibility toggle
  const [focusedField, setFocusedField] = useState(null); // Enhanced UX: field focus states
  const [loginSuccess, setLoginSuccess] = useState(false); // Enhanced UX: success state

  // Luxurious Maldives-themed background images with higher quality
  const backgroundImages = [
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1586861635167-e5223aedc9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1520483601560-389dff434fdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  ];

  // Enhanced image slideshow with smoother transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Slower transition for more luxurious feel
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Enhanced form handling with better UX
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear errors as user types for better UX
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
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
      // Enhanced error display - no intrusive popup
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

      // Enhanced success feedback - elegant transition instead of popup
      setLoginSuccess(true);

      try {
        const userResponse = await axios.get('/users/me');
        setUser(userResponse.data);
        
        // Smooth transition before redirect
        setTimeout(() => {
          // Handle post-login redirect
          const bookingIntent = location.state?.bookingIntent;
          const from = location.state?.from;

          // Check if user is admin and redirect accordingly
          if (userResponse.data.role === 'admin') {
            console.log('Admin user detected, redirecting to /admin');
            navigate('/admin');
            return;
          }

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
        }, 1500); // Allow success animation to play

      } catch (userError) {
        console.error('Failed to fetch user data after login:', userError);
        // Enhanced error handling - subtle notification
        setErrors({ general: 'Logged in but user data could not be loaded. Please refresh.' });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle pending status
      if (err.response?.status === 403 && err.response?.data?.status === 'pending') {
        setErrors({ 
          general: 'Your account is pending approval. You will be notified once approved.' 
        });
      } else {
        setErrors({ 
          general: err.response?.data?.msg || 'Login failed. Please check your credentials and try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Custom CSS Animations (matching Register page) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes success-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        /* Hide browser's password reveal button */
        input[type="password"]::-ms-reveal { display: none; }
        input[type="password"]::-webkit-credentials-auto-fill-button { display: none; }
      `}</style>



      {/* Dynamic Background Slideshow (matching Register page) */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        {/* Enhanced overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-teal-800/60 to-blue-800/70" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Login Success Overlay */}
      {loginSuccess && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center animate-[success-pulse_1s_ease-in-out]">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-white/80">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      {/* Main Content - Split Screen Layout */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Information */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className={`mb-8 ${animations.float}`}>
              <img
                src="/IsleKey Logo.jpg"
                alt="IsleKey Holidays"
                className="h-24 w-auto mx-auto mb-6 rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.target.src = "/Logo.png";
                }}
              />
            </div>
            <h1 className={`text-4xl font-bold mb-6 ${animations.fadeIn}`}>
              Welcome Back
            </h1>
            <p className={`text-xl text-blue-100 mb-8 leading-relaxed ${animations.slideUp}`}>
              Sign in to your travel agent portal and continue creating amazing experiences 
              for your clients in the beautiful Maldives.
            </p>
            
            {/* Enhanced Booking Intent Message */}
            {location.state?.bookingIntent && (
              <div className={`mb-8 p-4 rounded-xl bg-blue-400/20 border border-blue-300/30 ${animations.fadeIn}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 mt-0.5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-blue-200">
                      Complete Your Booking
                    </p>
                    <p className="text-sm mt-1 text-blue-100">
                      Please login to continue with your{' '}
                      {location.state.bookingIntent.type === 'hotel' && 'hotel reservation'}
                      {location.state.bookingIntent.type === 'activity' && 'activity booking'}
                      {location.state.bookingIntent.type === 'tour' && 'tour inquiry'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`grid grid-cols-1 gap-4 ${animations.slideUp}`}>
              <div className="flex items-center space-x-3 text-blue-100">
                <div className="w-8 h-8 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Exclusive Access to Properties</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <div className="w-8 h-8 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Real-time Booking Management</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <div className="w-8 h-8 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Dedicated Partner Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 ${animations.slideUp}`}>
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-100">Sign in to your travel agent portal</p>
              </div>

              {/* Enhanced Error Display */}
              {errors.general && (
                <div className="mb-6 bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm">
                  {errors.general}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-100">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      autoComplete="username"
                      className={`w-full px-4 py-3 bg-white/10 border ${
                        errors.email 
                          ? 'border-red-400/50 focus:border-red-400' 
                          : focusedField === 'email'
                            ? 'border-blue-400 focus:border-blue-400'
                            : 'border-white/20 focus:border-blue-400'
                      } rounded-xl text-white placeholder-blue-200/60 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400/20`}
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-300 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-100">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      autoComplete="current-password"
                      className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                        errors.password 
                          ? 'border-red-400/50 focus:border-red-400' 
                          : focusedField === 'password'
                            ? 'border-blue-400 focus:border-blue-400'
                            : 'border-white/20 focus:border-blue-400'
                      } rounded-xl text-white placeholder-blue-200/60 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400/20`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-200 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-300 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-white/30 rounded bg-white/10"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-100">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors duration-200">
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                    isLoading
                      ? 'bg-blue-400/50 cursor-not-allowed text-blue-100'
                      : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                  } focus:outline-none focus:ring-4 focus:ring-blue-400/20`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing you in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-blue-100">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-300 hover:text-blue-200 font-medium transition-colors duration-200 hover:underline"
                    >
                      Create account here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;