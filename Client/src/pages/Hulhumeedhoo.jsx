import React, { useEffect } from "react";
import { Link } from "react-router-dom";

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

const Hulhumeedhoo = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7E9E5] via-[#B7C5C7] to-[#E7E9E5]">
      <style>{animationStyles}</style>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/island2.jpeg"
            alt="Hulhumeedhoo Island"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20 animate-fade-in-up animate-delay-1">
            <span className="text-white font-medium">Island Paradise</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 animate-fade-in-up animate-delay-2">
            🌴 Hulhumeedhoo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              The Island of Everything
            </span>
          </h1>

          <p className="text-2xl text-white/90 font-light mb-8 animate-fade-in-up animate-delay-3">
            One Island. Every Dream.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-4">
            <Link
              to="/contact"
              className="group bg-[#E7E9E5] text-[#075375] font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-[#B7C5C7]"
              onClick={scrollToTop}
            >
              <span className="flex items-center">
                Plan Your Visit
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
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium animate-fade-in-left">
                <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
                Welcome to Hulhumeedhoo
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#075375] animate-fade-in-left animate-delay-1">
                Where History, Culture, and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                  Natural Beauty
                </span>{" "}
                Meet
              </h2>

              <p className="text-xl text-[#0A435C] leading-relaxed animate-fade-in-left animate-delay-2">
                Hulhumeedhoo, the eastern jewel of Addu Atoll, is where history,
                culture, and natural beauty meet. Just a 12-minute speedboat
                ride from Gan International Airport—with direct flights from
                Malé and Colombo—the island is one of the most accessible yet
                authentic destinations in the southern Maldives.
              </p>

              <div className="grid grid-cols-2 gap-6 animate-fade-in-left animate-delay-3">
                <div className="text-center p-4 bg-white/50 rounded-2xl shadow-sm">
                  <div className="text-3xl font-bold text-[#005E84] mb-2">
                    12 min
                  </div>
                  <div className="text-[#0A435C]">From Airport</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-2xl shadow-sm">
                  <div className="text-3xl font-bold text-[#005E84] mb-2">
                    Direct
                  </div>
                  <div className="text-[#0A435C]">International Flights</div>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-right animate-delay-2">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl animate-float">
                <img
                  src="/island1.jpg"
                  alt="Hulhumeedhoo Beach"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl shadow-lg animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-gradient-to-br from-[#B7C5C7] to-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
              Endless Potential
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
              A Destination of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                Endless Potential
              </span>
            </h2>

            <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
              Hulhumeedhoo is shaping into one of the Maldives' most exciting
              mixed-tourism hubs, offering a rare balance of lifestyle,
              community, and investment opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Resorts & Guesthouses",
                description:
                  "Positioned between Canareef and South Palm resorts, with strong potential for guesthouses, boutique hotels, and eco-retreats.",
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
                emoji: "🏝️",
              },
              {
                title: "Holiday & Second Homes",
                description:
                  "A unique chance to own your own space in paradise, blending residential comfort with Maldivian island life.",
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ),
                emoji: "🏡",
              },
              {
                title: "Adventure & Leisure",
                description:
                  "Exceptional diving, snorkeling, water sports, and big-game fishing, alongside pristine beaches, lush lagoons, and freshwater ponds.",
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
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                emoji: "🌊",
              },
              {
                title: "Community Strength",
                description:
                  "One of the earliest settlements in the Maldives, rich in history and home to skilled professionals, entrepreneurs, and a welcoming island spirit.",
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                emoji: "👨‍👩‍👧‍👦",
              },
            ].map((opportunity, index) => (
              <div
                key={index}
                className="group bg-[#E7E9E5] rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-[#B7C5C7] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#0A435C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl p-4 w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {opportunity.icon}
                    </div>
                    <div className="text-4xl" aria-hidden="true">
                      {opportunity.emoji}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors">
                    {opportunity.title}
                  </h3>

                  <p className="text-[#0A435C] leading-relaxed">
                    {opportunity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Packages Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/travel-services/afrah-FylmOteiHWc-unsplash.jpg"
            alt="Beach Wedding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20 animate-fade-in-up">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Wedding Packages
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in-up animate-delay-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                💍 IsleKeyHolidays
              </span>
              <br />
              Signature Renewal Wedding Packages
            </h2>

            <p className="text-xl text-white/90 animate-fade-in-up animate-delay-2">
              Celebrate Love in Paradise
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/20 shadow-xl animate-fade-in-up animate-delay-3">
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Hulhumeedhoo isn't just a place to visit—it's a place to
                celebrate life's most cherished moments. IsleKeyHolidays brings
                you Signature Renewal Wedding Packages designed exclusively for
                this breathtaking island. Whether you envision a barefoot
                ceremony at sunset, a cultural-inspired Maldivian blessing, or
                an intimate lagoon-side vow renewal, every detail is tailored to
                create memories that last a lifetime.
              </p>

              <h3 className="text-2xl font-bold text-white mb-6 animate-fade-in-up animate-delay-3">
                ✨ Our Wedding Experiences Include:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in-up animate-delay-4">
                {[
                  "Ceremonies on pristine beaches, lagoons, or cultural heritage spots",
                  "Personalized décor and themes to match your dream style",
                  "Traditional Maldivian music, rituals, and blessings",
                  "Romantic private dining and honeymoon experiences",
                  "Professional photography & videography services",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <p className="text-white/90">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  to="/contact"
                  className="group inline-block bg-[#E7E9E5] text-[#075375] font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-[#B7C5C7]"
                  onClick={scrollToTop}
                >
                  <span className="flex items-center">
                    Plan Your Wedding
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-[#005E84] via-[#075375] to-[#0A435C] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20 animate-fade-in-up">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Hulhumeedhoo Awaits You
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fade-in-up animate-delay-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                🌺 Hulhumeedhoo
              </span>{" "}
              Awaits You
            </h2>

            <p className="text-xl text-white/90 mb-8 animate-fade-in-up animate-delay-2">
              From investment opportunities and second homes to unforgettable
              weddings and luxury holidays, Hulhumeedhoo is The Island of
              Everything.
            </p>

            <p className="text-xl font-semibold text-white/90 mb-12 animate-fade-in-up animate-delay-3">
              👉 Plan your journey, celebrate your love, or invest in your
              future – all in one island.
              <br />
              <span className="text-2xl font-bold text-white">
                Hulhumeedhoo – One Island. Every Dream.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-4">
              <Link
                to="/contact"
                className="group bg-[#E7E9E5] text-[#075375] font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-[#B7C5C7]"
                onClick={scrollToTop}
              >
                <span className="flex items-center">
                  Contact Us
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
                to="/real-estate"
                className="group border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-[#E7E9E5] hover:text-[#075375] transition-all transform hover:scale-105"
                onClick={scrollToTop}
              >
                Investment Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hulhumeedhoo;
