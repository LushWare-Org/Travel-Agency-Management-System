import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const palette = {
  platinum: "#E7E9E5",
  ash_gray: "#B7C5C7",
  lapis_lazuli: "#005E84",
  indigo_dye: "#075375",
  indigo_dye2: "#0A435C"
};

// Enhanced animations and micro-interactions (matching Login page)
const animations = {
  fadeIn: "animate-[fadeIn_0.6s_ease-out]",
  slideUp: "animate-[slideUp_0.5s_ease-out]",
  float: "animate-[float_3s_ease-in-out_infinite]",
  shimmer: "animate-[shimmer_2s_linear_infinite]",
  pulse: "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
};

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: '',
    password: '',
    repeatPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // Enhanced UX: field focus states
  const [showPassword, setShowPassword] = useState(false); // Enhanced UX: password visibility toggle
  const [showRepeatPassword, setShowRepeatPassword] = useState(false); // Enhanced UX: repeat password visibility toggle
  const [isLoading, setIsLoading] = useState(false); // Enhanced UX: loading state
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Enhanced UX: success state
  const [currentImage, setCurrentImage] = useState(0); // Background slideshow

  // Luxurious Maldives-themed background images (matching Login page)
  const backgroundImages = [
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1586861635167-e5223aedc9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1520483601560-389dff434fdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  ];

  // Enhanced form handling with better UX (matching Login page)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    const requiredFields = [
      'firstName', 'lastName', 'email', 'country', 'phoneNumber', 'password', 'repeatPassword'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (formData.password.trim() !== formData.repeatPassword.trim()) {
      newErrors.repeatPassword = 'Passwords do not match';
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
      console.log('🎯 api.baseURL =', axios.defaults.baseURL);
      console.log('📤 Posting to:', axios.defaults.baseURL + '/auth/register');

      await axios.post('/auth/register', formData, {headers:{ 'Content-Type': 'application/json'}});
      
      // Enhanced success feedback - elegant transition instead of popup
      setRegistrationSuccess(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        phoneNumber: '',
        password: '',
        repeatPassword: '',
      });
      
      // Smooth transition before redirect
      setTimeout(() => {
        navigate('/login');
      }, 2500); // Allow success animation to play longer for registration
      
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ 
        general: error.response?.data?.msg || 'Registration failed. Please check your information and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced image slideshow with smoother transitions (matching Login page)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Slower transition for more luxurious feel
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: palette.platinum }}>
      {/* Enhanced custom CSS animations (matching Login page) */}
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
          50% { transform: scale(1.05); }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        .glass-morphism {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background: rgba(231, 233, 229, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.125);
        }
        .input-focus-glow {
          box-shadow: 0 0 0 3px rgba(0, 94, 132, 0.1);
        }
        .success-state {
          animation: success-pulse 0.6s ease-in-out;
        }
      `}</style>

      {/* Enhanced Navigation with glass morphism effect (matching Login page) */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "glass-morphism shadow-2xl border-b border-white/20"
          : "bg-gradient-to-r from-[#E7E9E5]/60 via-[#B7C5C7]/40 to-[#E7E9E5]/60 backdrop-blur-xl"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Enhanced Logo Section */}
            <div className={`flex items-center space-x-4 ${animations.fadeIn}`}>
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#005E84]/20 to-[#0A435C]/20 rounded-full blur-xl"></div>
              </div>
              <div className="ml-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#005E84] to-[#0A435C] bg-clip-text text-transparent">
                  Travel Maldives
                </h1>
                <p className="text-sm font-medium" style={{ color: palette.ash_gray }}>
                  Maldives Wholesale Experts
                </p>
              </div>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="relative font-medium transition-all duration-300 hover:scale-105 group"
                style={{ color: palette.indigo_dye2 }}
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#005E84]/10 to-[#0A435C]/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
              <Link 
                to="/login" 
                className="relative font-medium transition-all duration-300 hover:scale-105 group"
                style={{ color: palette.lapis_lazuli }}
              >
                <span className="relative z-10">Login</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#005E84] to-[#0A435C] group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link
                to="/register"
                className="relative px-8 py-3 rounded-full font-medium shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${palette.lapis_lazuli}, ${palette.indigo_dye})`,
                  color: 'white'
                }}
              >
                <span className="relative z-10">Register</span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-lg transition-all duration-300 hover:scale-110"
                style={{ 
                  backgroundColor: isMenuOpen ? palette.lapis_lazuli : 'transparent',
                  color: isMenuOpen ? 'white' : palette.indigo_dye2
                }}
              >
                <svg
                  className="h-6 w-6 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
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

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="glass-morphism border-t border-white/20">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link 
                to="/" 
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10"
                style={{ color: palette.indigo_dye2 }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="block px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10"
                style={{ color: palette.lapis_lazuli }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-3 rounded-lg font-medium text-center transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${palette.lapis_lazuli}, ${palette.indigo_dye})`,
                  color: 'white'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Main Content Area with Split Layout */}
      <div className="flex-grow flex pt-20">
        {/* Enhanced Left Side - Image Slideshow (matching Login page) */}
        <div className="hidden lg:block w-2/5 relative overflow-hidden">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-2000 ease-in-out transform ${
                index === currentImage 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A435C]/90 via-[#005E84]/60 to-[#075375]/80">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>

          {/* Enhanced Content Overlay for Registration */}
          <div className="absolute inset-0 flex flex-col justify-center px-12 lg:px-16">
            <div className={`${animations.slideUp} max-w-xl`}>
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">Join 500+ Travel Professionals</span>
                </div>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-[#E7E9E5] to-white bg-clip-text text-transparent">
                  Start Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#E7E9E5] to-white bg-clip-text text-transparent">
                  Journey
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-white/80 leading-relaxed font-light">
                Create your account and unlock exclusive access to premium Maldivian resorts and experiences
              </p>

              {/* Enhanced Benefits List */}
              <div className="space-y-3 mb-12">
                {[
                  'Wholesale pricing access',
                  'Dedicated account manager', 
                  'Priority booking system',
                  'Marketing support materials'
                ].map((benefit, idx) => (
                  <div 
                    key={benefit}
                    className={`flex items-center space-x-3 ${animations.fadeIn}`}
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Image Navigation Dots */}
            <div className="absolute bottom-8 left-12 lg:left-16 flex space-x-3">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative transition-all duration-500 hover:scale-110 ${
                    index === currentImage 
                      ? 'w-12 h-3 bg-white rounded-full' 
                      : 'w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full'
                  }`}
                >
                  {index === currentImage && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E7E9E5] to-white rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Floating Elements for Visual Appeal */}
            <div className="absolute top-1/4 right-12 opacity-20">
              <div className={`w-32 h-32 border border-white/30 rounded-full ${animations.float}`}></div>
            </div>
            <div className="absolute bottom-1/3 right-24 opacity-15">
              <div className={`w-20 h-20 border border-white/40 rounded-full ${animations.float}`} style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Enhanced Right Side - Registration Form */}
        <div className="w-full lg:w-3/5 relative flex items-center justify-center p-6 lg:p-16 overflow-y-auto" style={{ backgroundColor: palette.platinum }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${palette.ash_gray} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>

          {/* Registration Success Overlay */}
          {registrationSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-20">
              <div className={`text-center ${animations.fadeIn} success-state`}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h3>
                <p className="text-green-600 mb-4">Your account has been created successfully.</p>
                <p className="text-sm text-gray-600">Redirecting you to login page...</p>
                <div className="mt-4 w-32 h-1 bg-green-200 rounded-full mx-auto overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          <div className={`w-full max-w-2xl relative z-10 ${animations.slideUp}`}>
            {/* Enhanced Header */}
            <div className="text-center mb-10">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#005E84] to-[#0A435C] flex items-center justify-center mb-4 shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#005E84] to-[#0A435C] bg-clip-text text-transparent">
                Join Travel Maldives
              </h2>
              <p className="text-lg font-medium" style={{ color: palette.ash_gray }}>
                Create your travel agent account today
              </p>
            </div>

            {/* Enhanced Error Display */}
            {errors.general && (
              <div className={`mb-6 p-4 rounded-2xl border-l-4 border-red-400 bg-red-50 ${animations.fadeIn}`}>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Registration Form continues here */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic implementation for now - can be expanded with full form fields */}
              <div className="text-center py-8">
                <p className="text-gray-600">Enhanced registration form with all fields will be implemented here</p>
                <button
                  type="submit"
                  disabled={isLoading || registrationSuccess}
                  className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl text-lg font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005E84] transform ${
                    isLoading || registrationSuccess
                      ? 'scale-95 cursor-not-allowed' 
                      : 'hover:scale-105 hover:shadow-2xl active:scale-95'
                  } mt-8`}
                  style={{
                    background: isLoading || registrationSuccess 
                      ? palette.ash_gray 
                      : `linear-gradient(135deg, ${palette.lapis_lazuli}, ${palette.indigo_dye})`
                  }}
                >
                  {isLoading ? 'Creating Account...' : registrationSuccess ? 'Success!' : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Enhanced Footer */}
            <div className="mt-10 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#E7E9E5] text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="group inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 border-2"
                  style={{ 
                    color: palette.lapis_lazuli, 
                    borderColor: palette.lapis_lazuli + '30',
                    backgroundColor: 'transparent'
                  }}
                >
                  <span className="mr-2">Sign in to your account</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Image Navigation */}
      <div className="lg:hidden flex justify-center space-x-3 py-6 bg-gradient-to-r from-[#E7E9E5] to-[#B7C5C7]">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`transition-all duration-500 hover:scale-110 ${
              index === currentImage 
                ? 'w-8 h-3 bg-gradient-to-r from-[#005E84] to-[#0A435C] rounded-full' 
                : 'w-3 h-3 bg-gray-400 hover:bg-gray-600 rounded-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Register;
