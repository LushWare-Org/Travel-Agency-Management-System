import React from "react";

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
      transfor      <section className="py-24 bg-gradient-to-br from-[#E7E9E5] to-[#B7C5C7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#B7C5C7] text-[#005E84] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-[#005E84] rounded-full mr-2"></span>
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
              Travel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                Services
              </span>
            </h2>
            <p className="text-xl text-[#075375] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">-30px);
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

const TravelServices = () => {
  React.useEffect(() => {
    const interval = setInterval(() => {
      const images = document.querySelectorAll('[id^="hero-image-"]');
      const currentActive = Array.from(images).findIndex((img) =>
        img.classList.contains("opacity-100")
      );
      const nextIndex =
        currentActive === images.length - 1 ? 0 : currentActive + 1;

      images[currentActive].classList.remove("opacity-100");
      images[currentActive].classList.add("opacity-0");
      images[nextIndex].classList.remove("opacity-0");
      images[nextIndex].classList.add("opacity-100");

      const dots = document.querySelectorAll('[id^="hero-dot-"]');
      dots.forEach((dot, i) => {
        if (i === nextIndex) {
          dot.classList.remove("bg-[#E7E9E5]/50");
          dot.classList.add("bg-[#E7E9E5]", "scale-125");
        } else {
          dot.classList.remove("bg-[#E7E9E5]", "scale-125");
          dot.classList.add("bg-[#E7E9E5]/50");
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7E9E5] via-[#B7C5C7] to-[#E7E9E5]">
      <style>{animationStyles}</style>

      {/* Modern Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            id="hero-image-0"
            src="/travel-services/husen-siraaj-fsNMGdyQTUY-unsplash.jpg"
            alt="Maldives Travel"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out opacity-100"
          />
          <img
            id="hero-image-1"
            src="/travel-services/roberto-nickson-HQMyV8a_4_4-unsplash.jpg"
            alt="Maldives Travel"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out opacity-0"
          />
          <img
            id="hero-image-2"
            src="/travel-services/muhammadh-saamy-C56yG0sQ3q8-unsplash.jpg"
            alt="Maldives Travel"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out opacity-0"
          />
          <img
            id="hero-image-3"
            src="/travel-services/cmophoto-net-EmVKKf3wUZQ-unsplash.jpg"
            alt="Maldives Travel"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out opacity-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <div className="inline-block bg-[#B7C5C7]/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-[#B7C5C7]/30 animate-fade-in-up animate-delay-1">
              <span className="text-[#E7E9E5] font-medium text-sm">
                Travel Services
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up animate-delay-2">
              Luxury Travel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#E7E9E5]/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animate-delay-3">
              Experience the Maldives like never before with our premium travel
              planning and concierge services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-4">
              <button className="group bg-[#E7E9E5] text-[#075375] font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-[#B7C5C7] animate-pulse-slow">
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
              </button>
              <button className="group border-2 border-[#E7E9E5] text-[#E7E9E5] font-bold py-4 px-8 rounded-full hover:bg-[#E7E9E5] hover:text-[#075375] transition-all transform hover:scale-105">
                View Packages
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div
            id="hero-dot-0"
            className="w-3 h-3 bg-[#E7E9E5] rounded-full scale-125 transition-all duration-300"
          ></div>
          <div
            id="hero-dot-1"
            className="w-3 h-3 bg-[#E7E9E5]/50 rounded-full transition-all duration-300"
          ></div>
          <div
            id="hero-dot-2"
            className="w-3 h-3 bg-[#E7E9E5]/50 rounded-full transition-all duration-300"
          ></div>
          <div
            id="hero-dot-3"
            className="w-3 h-3 bg-[#E7E9E5]/50 rounded-full transition-all duration-300"
          ></div>
        </div>
      </div>

      {/* Company Intro Section */}
      <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-[#B7C5C7] text-[#005E84] rounded-full text-sm font-medium animate-fade-in-left">
                <span className="w-2 h-2 bg-[#005E84] rounded-full mr-2"></span>
                About Our Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#075375] animate-fade-in-left animate-delay-1">
                Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                  Travel Partner
                </span>
              </h2>
              <p className="text-xl text-[#075375] leading-relaxed animate-fade-in-left animate-delay-2">
                We specialize in creating unforgettable Maldives experiences.
                From luxury resort bookings to personalized itineraries, we
                ensure every detail of your journey is perfect.
              </p>
              <div className="grid grid-cols-2 gap-6 animate-fade-in-left animate-delay-3">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#005E84] mb-2">
                    1000+
                  </div>
                  <div className="text-[#075375]">Happy Travelers</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#005E84] mb-2">
                    50+
                  </div>
                  <div className="text-[#075375]">Premium Resorts</div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-right animate-delay-2">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-float">
                <img
                  src="/travel-services/1 (2).jpg"
                  alt="Luxury Maldives Resort"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl shadow-lg animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Travel Services Section */}
      <section className="py-24 bg-gradient-to-br from-[#B7C5C7] to-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
              Premium{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                Travel Services
              </span>
            </h2>
            <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
              Comprehensive travel solutions tailored to your preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Resort Bookings",
                description:
                  "Exclusive access to the finest Maldives resorts with best rates guaranteed",
                icon: "🏖️",
                features: ["Luxury resorts", "Best rates", "Exclusive access"],
              },
              {
                title: "Concierge Services",
                description:
                  "Personalized assistance for every aspect of your journey",
                icon: "👑",
                features: [
                  "24/7 support",
                  "Personal concierge",
                  "Custom planning",
                ],
              },
              {
                title: "Transportation",
                description:
                  "Seamless transfers including seaplane and speedboat arrangements",
                icon: "✈️",
                features: [
                  "Seaplane transfers",
                  "Speedboat service",
                  "Airport pickup",
                ],
              },
              {
                title: "Activity Planning",
                description:
                  "Curated experiences from diving to spa treatments",
                icon: "🤿",
                features: ["Water sports", "Spa packages", "Cultural tours"],
              },
              {
                title: "Dining Reservations",
                description:
                  "Access to exclusive restaurants and dining experiences",
                icon: "🍽️",
                features: [
                  "Fine dining",
                  "Private dining",
                  "Special occasions",
                ],
              },
              {
                title: "Travel Insurance",
                description: "Comprehensive coverage for worry-free travel",
                icon: "🛡️",
                features: [
                  "Full coverage",
                  "Medical protection",
                  "Trip cancellation",
                ],
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group bg-[#E7E9E5] rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-[#B7C5C7] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#0A435C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#0A435C] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-[#0A435C]"
                      >
                        <div className="w-2 h-2 bg-[#075375] rounded-full mr-3"></div>
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

      {/* Why Choose Us Section */}
      <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-[#B7C5C7] text-[#005E84] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-[#005E84] rounded-full mr-2"></span>
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                Difference
              </span>
            </h2>
            <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
              What sets us apart in creating exceptional Maldives experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Expert Knowledge",
                description:
                  "Deep understanding of Maldives resorts and local culture",
              },
              {
                number: "02",
                title: "Personalized Service",
                description:
                  "Tailored experiences designed around your preferences",
              },
              {
                number: "03",
                title: "Best Value",
                description:
                  "Exclusive rates and packages not available elsewhere",
              },
              {
                number: "04",
                title: "24/7 Support",
                description:
                  "Round-the-clock assistance throughout your journey",
              },
              {
                number: "05",
                title: "Quality Assurance",
                description: "Handpicked partners and verified accommodations",
              },
              {
                number: "06",
                title: "Seamless Experience",
                description: "From planning to return, we handle every detail",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#0A435C] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-24 bg-gradient-to-br from-[#B7C5C7] to-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
              Our Partners
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
              Trusted{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                Partners
              </span>
            </h2>
            <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
              Working with the best in the Maldives tourism industry
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[
              {
                name: "Maldivian Airlines",
                logo: "/partners/maldivian-airlines.png",
              },
              { name: "MTCC", logo: "/partners/mtcc.png" },
              { name: "Four Seasons", logo: "/partners/four-seasons.webp" },
              {
                name: "Conrad Maldives",
                logo: "/partners/conrad-maldives.jpg",
              },
            ].map((partner, index) => (
              <div
                key={index}
                className="group bg-[#E7E9E5] rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-[#B7C5C7] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="relative">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="w-full h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium animate-fade-in-left">
                <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
                Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#075375] animate-fade-in-left animate-delay-1">
                Start Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                  Journey
                </span>
              </h2>
              <p className="text-xl text-[#0A435C] leading-relaxed animate-fade-in-left animate-delay-2">
                Ready to plan your dream Maldives vacation? Our travel experts
                are here to help you create the perfect experience.
              </p>

              <div className="space-y-6 animate-fade-in-left animate-delay-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#075375]">Call Us</h3>
                    <p className="text-[#0A435C]">+960 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#075375]">Email Us</h3>
                    <p className="text-[#0A435C]">info@fasmala.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#075375]">Visit Us</h3>
                    <p className="text-[#0A435C]">Malé, Maldives</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-right animate-delay-2">
              <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-3xl p-8 text-white shadow-2xl animate-float">
                <h3 className="text-2xl font-bold mb-6">Quick Contact Form</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  ></textarea>
                  <button className="w-full bg-[#E7E9E5] text-[#075375] font-bold py-3 px-6 rounded-xl hover:bg-[#B7C5C7] transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelServices;
