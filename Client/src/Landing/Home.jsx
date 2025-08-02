import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LandingHeader from "./LandingHeader";

// Add custom CSS animations
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.8s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.8s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.8s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-delay-1 {
    animation-delay: 0.2s;
  }

  .animate-delay-2 {
    animation-delay: 0.4s;
  }

  .animate-delay-3 {
    animation-delay: 0.6s;
  }

  .animate-delay-4 {
    animation-delay: 0.8s;
  }

  .animate-delay-5 {
    animation-delay: 1s;
  }

  .opacity-0 {
    opacity: 0;
  }

  .opacity-0.animate-fade-in-up,
  .opacity-0.animate-fade-in-left,
  .opacity-0.animate-fade-in-right,
  .opacity-0.animate-scale-in,
  .opacity-0.animate-slide-up {
    opacity: 1;
  }
`;

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modern hero slides with better imagery
  const heroSlides = [
    {
      image: "/travel-services/mike-swigunski-k9Zeq6EH_bk-unsplash.jpg",
      title: "Experience Paradise",
      subtitle: "Where luxury meets nature in perfect harmony",
      badge: "Premium Resorts",
    },
    {
      image: "/travel-services/husen-siraaj-fsNMGdyQTUY-unsplash.jpg",
      title: "Your Dream Escape",
      subtitle: "Curated experiences for every traveler",
      badge: "Exclusive Villas",
    },
    {
      image: "/travel-services/roberto-nickson-HQMyV8a_4_4-unsplash.jpg",
      title: "Discover the Maldives",
      subtitle: "Unforgettable moments await",
      badge: "Island Adventures",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <style>{animationStyles}</style>
      <LandingHeader />

      {/* Modern Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <img
              src={slide.image}
              alt={`Maldives resort ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20 animate-fade-in-up animate-delay-1">
                  <span className="text-white font-medium text-sm">
                    {slide.badge}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight animate-fade-in-up animate-delay-2">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light animate-fade-in-up animate-delay-3">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-4">
                  <Link
                    to="/explore"
                    className="group bg-white text-gray-900 font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-gray-50 animate-pulse-slow"
                    onClick={scrollToTop}
                  >
                    <span className="flex items-center">
                      Start Your Journey
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    to="/travel-services"
                    className="group border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
                    onClick={scrollToTop}
                  >
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Modern Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in-left">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                About Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 animate-fade-in-left animate-delay-1">
                Your Gateway to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Paradise
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-left animate-delay-2">
                We specialize in creating unforgettable experiences in the
                Maldives. From luxury resorts to exclusive villas, we bring your
                dream vacation to life.
              </p>
              <div className="grid grid-cols-2 gap-6 animate-fade-in-left animate-delay-3">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Happy Guests</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    50+
                  </div>
                  <div className="text-gray-600">Premium Resorts</div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-right animate-delay-2">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-float">
                <img
                  src="/travel-services/mike-swigunski-k9Zeq6EH_bk-unsplash.jpg"
                  alt="Luxury Maldives Resort"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Property Types
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-1">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Perfect Stay
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
              From overwater bungalows to beachfront villas, find your ideal
              accommodation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Overwater Villas",
                description:
                  "Luxurious accommodations suspended over crystal-clear waters",
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                features: ["Private deck", "Glass floor", "Ocean views"],
              },
              {
                title: "Beachfront Resorts",
                description:
                  "Direct access to pristine beaches and turquoise waters",
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
                features: ["Beach access", "Water sports", "Spa facilities"],
              },
              {
                title: "Island Retreats",
                description: "Exclusive private islands for ultimate seclusion",
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                features: [
                  "Private island",
                  "Butler service",
                  "Helicopter transfer",
                ],
              },
            ].map((property, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {property.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {property.description}
                  </p>
                  <ul className="space-y-2">
                    {property.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Navigation Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-1">
              Discover Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Expertise
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
              Comprehensive solutions tailored to your Maldives journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Travel Services",
                subtitle: "Luxury Travel Planning",
                description:
                  "Comprehensive travel planning and concierge services for your perfect Maldives experience",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                ),
                gradient: "from-blue-500 via-blue-600 to-cyan-500",
                link: "/travel-services",
                features: [
                  "Resort Bookings",
                  "Concierge Services",
                  "Activity Planning",
                ],
              },
              {
                title: "Real Estate",
                subtitle: "Property Investment",
                description:
                  "Expert guidance for real estate investment and development opportunities in the Maldives",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
                gradient: "from-green-500 via-emerald-500 to-teal-500",
                link: "/real-estate",
                features: [
                  "Property Consultation",
                  "Investment Guidance",
                  "Development Support",
                ],
              },
              {
                title: "Investment Support",
                subtitle: "Business Development",
                description:
                  "Complete foreign investment support and business setup services for the Maldives market",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                gradient: "from-purple-500 via-pink-500 to-rose-500",
                link: "/investment-support",
                features: [
                  "Business Setup",
                  "Regulatory Support",
                  "Partnership Network",
                ],
              },
              {
                title: "Brand Representation",
                subtitle: "Market Entry",
                description:
                  "Official distribution and representation services for international brands in the Maldives",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                ),
                gradient: "from-orange-500 via-red-500 to-pink-500",
                link: "/brand-representation",
                features: [
                  "Market Entry",
                  "Distribution Network",
                  "Brand Promotion",
                ],
              },
            ].map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
                onClick={scrollToTop}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`bg-gradient-to-br ${service.gradient} rounded-2xl p-4 w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {service.subtitle}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Explore Service
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-cyan-600/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20 animate-fade-in-up">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Get Started
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight animate-fade-in-up animate-delay-1">
              Ready to Experience{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Paradise?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animate-delay-2">
              Start planning your dream Maldives vacation today
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-delay-3">
              <Link
                to="/travel-services"
                className="group bg-white text-blue-600 font-bold py-5 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-gray-50"
                onClick={scrollToTop}
              >
                <span className="flex items-center">
                  Start Planning
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                to="/contact"
                className="group border-2 border-white text-white font-bold py-5 px-10 rounded-full hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                onClick={scrollToTop}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
