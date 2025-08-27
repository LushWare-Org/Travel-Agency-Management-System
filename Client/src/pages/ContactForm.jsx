import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../Components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState({
    header: false,
    contactForm: false,
    contactInfo: false,
    faq: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        header: document.getElementById('contact-header'),
        contactForm: document.getElementById('contact-form'),
        contactInfo: document.getElementById('contact-info'),
        faq: document.getElementById('contact-faq')
      };

      for (const [key, section] of Object.entries(sections)) {
        if (section) {
          const rect = section.getBoundingClientRect();
          const isInViewport = rect.top <= window.innerHeight * 0.75;
          
          setIsVisible(prev => ({
            ...prev,
            [key]: isInViewport
          }));
        }
      }
    };

    setTimeout(() => {
      setIsVisible(prev => ({
        ...prev,
        header: true
      }));
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.phone = 'Phone number is invalid (10 digits required)';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      // 🚀 Send to backend
      await axios.post(
        '/contacts',
        { ...formData },
        { withCredentials: true }
      );

      // success!
      setSubmitted(true);
      setFormData({ name:'', email:'', phone:'', subject:'', message:'' });

      // auto‑hide the thank‑you banner
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Submit error:', err.response || err);
      setErrors({ form: err.response?.data?.msg || 'Failed to send. Try again 😢' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="px-4 md:px-8 py-6 md:py-10 max-w-3xl md:max-w-7xl mx-auto">
          {/* Header */}
          <header
            id="contact-header"
            className={`bg-cover bg-center h-64 md:h-80 shadow-lg rounded-2xl ${
              isVisible.header ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(10, 67, 92, 0.5), rgba(10, 67, 92, 0.5)), url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920')",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
              <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-md">Contact Us</h1>
              <p className="text-xs md:text-sm mt-1 md:mt-2 drop-shadow-md max-w-sm md:max-w-md">
                Have questions, suggestions, or need assistance? We're here to help you find your perfect match.
              </p>
            </div>
          </header>

          {/* Contact Form and Info */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10 mt-6 md:mt-10">
            <div 
              id="contact-form" 
              className={`lg:w-2/3`}
            >
              <div className="bg-gray-100 rounded-2xl shadow-md p-4 md:p-8 border border-primary_blue">
                <h2 className="text-xl md:text-2xl font-bold text-dark_teal_blue mb-4 md:mb-6">Send us a Message</h2>
                
                {submitted && (
                  <div className="bg-primary_blue border border-hover_blue text-white px-3 md:px-4 py-2 md:py-3 rounded relative mb-4 md:mb-6 text-xs md:text-sm" role="alert">
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm md:text-base text-dark_teal_blue mb-1 md:mb-2 font-medium">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_blue transition-all text-sm md:text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm md:text-base text-dark_teal_blue mb-1 md:mb-2 font-medium">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_blue transition-all text-sm md:text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm md:text-base text-dark_teal_blue mb-1 md:mb-2 font-medium">Phone Number</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_blue transition-all text-sm md:text-base ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm md:text-base text-dark_teal_blue mb-1 md:mb-2 font-medium">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_blue transition-all text-sm md:text-base ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select a subject</option>
                        <option value="Account Issues">Account Issues</option>
                        <option value="Payment Questions">Payment Questions</option>
                        <option value="Profile Verification">Profile Verification</option>
                        <option value="Success Story">Success Story</option>
                        <option value="Feature Suggestion">Feature Suggestion</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-4 md:mb-6">
                    <label htmlFor="message" className="block text-sm md:text-base text-dark_teal_blue mb-1 md:mb-2 font-medium">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4 md:rows-5"
                      className={`w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary_blue transition-all text-sm md:text-base ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 md:px-6 py-2 md:py-3 bg-primary_blue text-white rounded-lg hover:bg-hover_blue shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-sm md:text-base`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
            
            <div 
              id="contact-info" 
              className={`lg:w-1/3`}
            >
              <div className="bg-gray-100 rounded-2xl shadow-md p-8 border border-primary_blue">
                <h2 className="text-2xl font-bold text-dark_teal_blue mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary_blue rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark_teal_blue">Phone</h3>
                      <p className="text-dark_teal_blue"> +123 456 7890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary_blue rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark_teal_blue">Email</h3>
                      <p className="text-dark_teal_blue">contact@dummyemail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary_blue rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark_teal_blue">Address</h3>
                      <p className="text-dark_teal_blue">123 Dummy Street,</p>
                      <p className="text-dark_teal_blue">Faketown, Country</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
};

export default Contact;