import React, { useState, useEffect } from 'react';
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

const Register = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      Swal.fire('Oops', 'Please fix the highlighted errors before submitting.', 'error');
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit your registration?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'Cancel'
    });

    if (!isConfirmed) {
      Swal.fire('Cancelled', 'Your registration was not submitted.', 'info');
      return;
    }

    try {
      console.log('🎯 api.baseURL =', axios.defaults.baseURL);
      console.log('📤 Posting to:', axios.defaults.baseURL + '/auth/register');

      await axios.post('/auth/register', formData, {headers:{ 'Content-Type': 'application/json'}});
      Swal.fire('Success', 'Registration submitted successfully!', 'success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        phoneNumber: '',
        password: '',
        repeatPassword: '',
      });
    } catch (error) {
      console.error('Registration failed:', error);
      Swal.fire(
        'Error',
        error.response?.data?.msg || 'Registration failed. Please try again.',
        'error'
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                <p className="text-sm" style={{ color: palette.ash_gray }}>Maldives Wholesale Experts</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="font-medium transition-colors hover:underline hover:brightness-125" style={{ color: palette.indigo_dye2 }}>
                Home
              </Link>
              <Link to="/login" className="font-medium transition-colors hover:underline hover:brightness-125" style={{ color: palette.lapis_lazuli }}>
                Login
              </Link>
              <Link to="/register" className={`px-6 py-2 rounded-full font-medium shadow-md transition-all duration-300 ${
                scrolled
                  ? "bg-[#E7E9E5] hover:bg-[#B7C5C7] text-[#005E84]"
                  : "bg-white/30 backdrop-blur-sm hover:bg-white/50 text-[#005E84] border border-white/30"
              } hover:brightness-110`}>
                Register
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-indigo-700 focus:outline-none"
              >
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
              <Link to="/" className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125" style={{ color: palette.indigo_dye2 }}>
                Home
              </Link>
              <Link to="/login" className="block px-3 py-2 rounded-md font-medium transition-colors hover:underline hover:brightness-125 hover:bg-[#E7E9E5]" style={{ color: palette.lapis_lazuli }}>
                Login
              </Link>
              <Link to="/register" className="bg-[#E7E9E5] text-[#005E84] block px-3 py-2 rounded-md font-medium hover:bg-[#B7C5C7] mt-4 hover:brightness-110">
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ backgroundColor: palette.platinum }}>
          <div className="bg-gradient-to-r from-[#0A435C]/80 to-[#B7C5C7]/50 py-6 px-6">
            <h1 className="text-2xl font-bold" style={{ color: palette.platinum }}>Customer Registration</h1>
            <p className="text-base" style={{ color: palette.ash_gray }}>Please fill in your details to create an account</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-4 pb-2 border-b border-gray-200">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
            </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Access Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeat Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="repeatPassword"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.repeatPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.repeatPassword && <p className="text-red-500 text-xs mt-1">{errors.repeatPassword}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#005E84] to-[#0A435C] text-white font-semibold rounded-lg hover:from-[#075375] hover:to-[#005E84] focus:outline-none focus:ring-2 focus:ring-[#005E84] focus:ring-offset-2 transition-all shadow-md"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;