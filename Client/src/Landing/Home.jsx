import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LandingHeader from './LandingHeader';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Exclusive Maldives Properties",
      subtitle: "Premium access for travel agents"
    },
    {
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Boost Your Agency Revenue",
      subtitle: "Partner with top-rated resorts and villas"
    },
    {
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Special Agent Commissions",
      subtitle: "Maximize your profits with our competitive rates"
    }
  ];

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroSlides.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <div className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <img src={slide.image} alt={`Maldives resort ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">{slide.subtitle}</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105" onClick={scrollToTop}>
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-blue-400 w-6' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      </div>
      
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-xl"></div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-teal-400 opacity-20 rounded-full blur-xl"></div>
              <img src="https://i.postimg.cc/j2mDcCVX/maldives-784666-1280.jpg" alt="Luxury Maldives resort" className="rounded-lg shadow-2xl object-cover w-full h-full z-10 relative" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block">
                <p className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-1">Exclusively For Travel Agents</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Your Gateway to <span className="text-blue-800">Paradise</span>
                </h2>
                <div className="h-1 w-20 bg-blue-600 mt-4"></div>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-gray-600 mb-4">
                  Welcome to the premier Maldives Property Reservation Portal exclusively for travel agents. We connect travel professionals with the finest resorts and accommodations across the Maldives.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  Our platform provides you with direct access to competitive rates, instant booking confirmations, and higher commission structures than standard booking channels.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  With over 200+ carefully selected properties and a dedicated support team, we help travel agents deliver exceptional Maldives experiences while maximizing their business potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-blue-800 sm:text-4xl">
              Exclusive Benefits for Travel Agents
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-900">
              Join our network and access premium Maldives properties with special agent rates
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-b-4 border-blue-500 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-full inline-flex w-16 h-16 items-center justify-center mb-6">
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-800 mb-2">Higher Commissions</h3>
              <p className="text-gray-800">Earn up to 20% commission on luxury bookings, significantly higher than standard rates.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-b-4 border-blue-500 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-full inline-flex w-16 h-16 items-center justify-center mb-6">
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-800 mb-2">Simplified Booking</h3>
              <p className="text-gray-800">Our streamlined platform lets you complete bookings in minutes, not hours.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-b-4 border-blue-500 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-full inline-flex w-16 h-16 items-center justify-center mb-6">
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-800 mb-2">Instant Confirmation</h3>
              <p className="text-gray-800">Real-time availability and instant booking confirmations for all properties.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">DISCOVER PARADISE</span>
            <h2 className="text-3xl font-extrabold text-blue-800 sm:text-4xl">
              Types of Properties Available
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-800">
              Discover our range of exclusive Maldives accommodations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group overflow-hidden">
              <div className="h-96 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Luxury hotel in Maldives" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Luxury Hotels</h3>
                <p className="text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Premium hotel properties with world-class amenities, fine dining restaurants, and exceptional service standards.
                </p>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <div className="h-96 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Private villa in Maldives" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Private Villas</h3>
                <p className="text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Exclusive overwater and beachfront villas offering privacy, personal butler service, and customized experiences.
                </p>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <div className="h-96 rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1505881502353-a1986add3762?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Island resort in Maldives" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Island Resorts</h3>
                <p className="text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Full-island experiences combining luxury accommodations with authentic Maldivian culture and marine adventures.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-indigo-900 text-xl mb-6">Access our complete portfolio with exclusive travel agent rates</p>           
            <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-blue-800 hover:from-indigo-900 hover:to-blue-600 transform hover:scale-105 transition-all" onClick={scrollToTop}>
              Register as an Agent
              <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-r from-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to elevate your travel agency?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Join hundreds of successful travel agents already using our platform
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/register" className="bg-white text-indigo-600 font-bold py-4 px-10 rounded-full shadow-xl hover:bg-blue-50 transform hover:scale-105 transition-all" onClick={scrollToTop}>
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;