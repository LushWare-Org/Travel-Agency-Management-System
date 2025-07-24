import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from './LandingHeader';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Customer-focused hero slides
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Discover Your Dream Maldives Holiday",
      subtitle: "Luxury resorts, private villas, and unforgettable experiences"
    },
    {
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Book Direct. Save More.",
      subtitle: "Best rates, instant confirmation, and personal service"
    },
    {
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Escape to Paradise",
      subtitle: "Curated stays for couples, families, and solo travelers"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E7E9E5]">
      <LandingHeader />

      {/* Hero Section */}
      <div className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-[#0A435C] opacity-40"></div>
            <img src={slide.image} alt={`Maldives resort ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-[#B7C5C7] mb-8">{slide.subtitle}</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/explore" className="bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105" onClick={scrollToTop}>
                  Explore Stays
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
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-[#005E84] w-6' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-br from-[#B7C5C7] to-[#E7E9E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#005E84] opacity-20 rounded-full blur-xl"></div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#B7C5C7] opacity-20 rounded-full blur-xl"></div>
              <img src="https://i.postimg.cc/j2mDcCVX/maldives-784666-1280.jpg" alt="Luxury Maldives resort" className="rounded-lg shadow-2xl object-cover w-full h-full z-10 relative" />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block">
                <p className="text-sm font-medium text-[#005E84] tracking-wide uppercase mb-1">Maldives Holidays</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0A435C]">
                  Your Journey to <span className="text-[#005E84]">Paradise</span>
                </h2>
                <div className="h-1 w-20 bg-[#005E84] mt-4"></div>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-[#075375] mb-4">
                  Welcome to your Maldives holiday portal. We connect you with the finest resorts, villas, and island escapes for every traveler.
                </p>
                <p className="text-lg text-[#075375] mb-4">
                  Enjoy direct booking, best price guarantee, and personalized service for your dream vacation.
                </p>
                <p className="text-lg text-[#075375] mb-4">
                  Choose from over 200+ handpicked properties and let us help you create unforgettable memories in paradise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 bg-gradient-to-b from-[#E7E9E5] to-[#B7C5C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#005E84] sm:text-4xl">
              Find Your Perfect Stay
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-[#075375]">
              Explore our curated selection of Maldives accommodations
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Luxury Hotels */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-b-4 border-[#005E84] transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] text-white p-4 rounded-full inline-flex w-16 h-16 items-center justify-center mb-6">
                {/* ...existing code for icon... */}
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#005E84] mb-2">Luxury Hotels</h3>
              <p className="text-[#075375]">World-class amenities, fine dining, and exceptional service for a truly indulgent stay.</p>
            </div>
            {/* Private Villas */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-b-4 border-[#005E84] transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] text-white p-4 rounded-full inline-flex w-16 h-16 items-center justify-center mb-6">
                {/* ...existing code for icon... */}
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#005E84] mb-2">Private Villas</h3>
              <p className="text-[#075375]">Overwater and beachfront villas for privacy, romance, and personalized experiences.</p>
            </div>
            {/* Island Resorts */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border-b-4 border-[#005E84] transform hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] text-white p-4 rounded-full inline-flex w-16 h-16 items-center justify-center mb-6">
                {/* ...existing code for icon... */}
                <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#005E84] mb-2">Island Resorts</h3>
              <p className="text-[#075375]">Full-island experiences with authentic Maldivian culture and marine adventures.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-[#075375] text-xl mb-6">Browse our complete portfolio and start planning your Maldives escape</p>
            <Link to="/explore" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-[#005E84] to-[#0A435C] hover:from-[#075375] hover:to-[#005E84] transform hover:scale-105 transition-all" onClick={scrollToTop}>
              Explore Stays
              <svg className="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-[#005E84] to-[#0A435C] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready for your Maldives adventure?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-[#B7C5C7]">
            Book direct for the best rates and exclusive offers
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/explore" className="bg-white text-[#005E84] font-bold py-4 px-10 rounded-full shadow-xl hover:bg-[#B7C5C7] transform hover:scale-105 transition-all" onClick={scrollToTop}>
              Start Exploring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;