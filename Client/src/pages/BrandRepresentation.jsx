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

const brands = [
  {
    name: "Brand A",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+A",
    desc: "Luxury Skincare",
    category: "Beauty & Wellness",
  },
  {
    name: "Brand B",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+B",
    desc: "Wellness Products",
    category: "Health & Wellness",
  },
  {
    name: "Brand C",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+C",
    desc: "Tech Gadgets",
    category: "Technology",
  },
  {
    name: "Brand D",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+D",
    desc: "Travel Accessories",
    category: "Travel & Lifestyle",
  },
  {
    name: "Brand E",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+E",
    desc: "Eco-Friendly",
    category: "Sustainability",
  },
  {
    name: "Brand F",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+F",
    desc: "Fashion & Accessories",
    category: "Fashion",
  },
];

const channels = [
  {
    icon: "🏪",
    title: "Retail Outlets",
    desc: "Available in top stores across the Maldives, reaching local consumers and tourists alike.",
  },
  {
    icon: "🛒",
    title: "Online Stores",
    desc: "Shop our brands online for convenience and fast delivery throughout the Maldives.",
  },
  {
    icon: "🏨",
    title: "Hotel & Resort Partners",
    desc: "Exclusive partnerships with leading hospitality providers for premium brand exposure.",
  },
  {
    icon: "✈️",
    title: "Airport & Travel Hubs",
    desc: "Strategic placement in high-traffic travel locations for maximum international visibility.",
  },
];

const BrandRepresentation = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <style>{animationStyles}</style>

    {/* Modern Hero Section */}
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/travel-services/mike-swigunski-k9Zeq6EH_bk-unsplash.jpg"
          alt="Brand Representation"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20 animate-fade-in-up animate-delay-1">
            <span className="text-white font-medium text-sm">
              Brand Representation
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up animate-delay-2">
            International{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Brand Representation
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animate-delay-3">
            Bringing global brands to the Maldives. Official distribution,
            promotion, and partnership opportunities for international companies
            seeking market entry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-4">
            <button className="group bg-white text-gray-900 font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-gray-50 animate-pulse-slow">
              <span className="flex items-center">
                Partner With Us
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
            <button className="group border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
              View Brands
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Our Role Section */}
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Our Role
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-1">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Trusted Partner
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            As your trusted partner, we provide comprehensive brand
            representation services to successfully introduce and promote
            international brands in the Maldivian market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-left">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 w-16 h-16 flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🏢
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Official Distribution & Representation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Acting as the official distributor or representative for
                international brands in the Maldives, providing complete market
                entry solutions and ongoing support for brand growth.
              </p>
            </div>
          </div>

          <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-right">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 w-16 h-16 flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                🌍
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Market Introduction & Promotion
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Facilitating the introduction and promotion of global products
                to the Maldivian market through strategic marketing, local
                partnerships, and comprehensive brand positioning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Brands Section */}
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Featured Brands
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-1">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Brand Portfolio
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            Discover the international brands we proudly represent in the
            Maldives, showcasing logos and product categories across diverse
            industries.
          </p>
        </div>

        {/* Product Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up animate-delay-3">
          {[
            "Beauty & Skincare",
            "Health & Wellness",
            "Technology",
            "Travel & Lifestyle",
            "Fashion",
            "Sustainability",
          ].map((category, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-fade-in-up"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(index + 6) * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-white rounded-2xl p-4 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="w-full h-16 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-sm font-medium mb-4 text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                  {brand.category}
                </p>
                <p className="text-gray-600 leading-relaxed">{brand.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Distribution Channels Section */}
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Distribution Channels
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-1">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Distribution Network
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            Our extensive distribution network ensures your products reach
            customers through multiple platforms and touchpoints across the
            Maldives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {channels.map((channel, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {channel.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {channel.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{channel.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Platform Information */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 animate-fade-in-up animate-delay-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Platform Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Physical Retail",
                items: [
                  "Premium department stores in Malé",
                  "Specialty boutiques and concept stores",
                  "Pharmacy and wellness chains",
                  "Duty-free shops at Velana International Airport",
                ],
              },
              {
                title: "Digital & Online",
                items: [
                  "E-commerce platforms and marketplaces",
                  "Brand-specific online stores",
                  "Social media shopping integration",
                  "Mobile app distribution",
                ],
              },
              {
                title: "Hospitality Partners",
                items: [
                  "5-star resort boutiques and spas",
                  "Hotel gift shops and convenience stores",
                  "Resort wellness centers",
                  "Exclusive concierge services",
                ],
              },
              {
                title: "Travel & Transit",
                items: [
                  "Airport retail and duty-free",
                  "Seaplane terminal shops",
                  "Ferry terminal outlets",
                  "Tourist information centers",
                ],
              },
            ].map((platform, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 7) * 0.2}s` }}
              >
                <h4 className="text-lg font-semibold text-blue-600 mb-4">
                  {platform.title}
                </h4>
                <ul className="space-y-2">
                  {platform.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Partnership Opportunities Section */}
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Partnership Opportunities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up animate-delay-1">
            Partner{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              With Us
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            Information for international companies seeking professional brand
            representation and market entry solutions in the Maldives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* What We Offer */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-left">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center group-hover:text-blue-600 transition-colors">
                What We Offer Partners
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Complete Market Entry",
                    desc: "Full market research, regulatory compliance, and launch strategy development.",
                  },
                  {
                    title: "Exclusive Representation",
                    desc: "Official distributor status with exclusive territorial rights in the Maldives.",
                  },
                  {
                    title: "Marketing & Promotion",
                    desc: "Integrated marketing campaigns across digital and traditional channels.",
                  },
                  {
                    title: "Logistics & Supply Chain",
                    desc: "Complete import, warehousing, and distribution management.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start animate-fade-in-up"
                    style={{ animationDelay: `${(index + 3) * 0.2}s` }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1 mr-4"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ideal Partners */}
          <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in-right">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center group-hover:text-blue-600 transition-colors">
                Ideal Partner Profile
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Established International Brands",
                    desc: "Companies with proven track records and quality products seeking new markets.",
                  },
                  {
                    title: "Premium & Luxury Segments",
                    desc: "High-quality products that align with the Maldivian luxury tourism market.",
                  },
                  {
                    title: "Growth-Oriented Companies",
                    desc: "Businesses committed to long-term market development and partnership success.",
                  },
                  {
                    title: "Innovation Leaders",
                    desc: "Companies bringing unique, innovative products to the Maldivian market.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start animate-fade-in-up"
                    style={{ animationDelay: `${(index + 7) * 0.2}s` }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1 mr-4"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Partnership CTA Section */}
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-cyan-600/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20 animate-fade-in-up">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Ready to Partner
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight animate-fade-in-up animate-delay-1">
            Ready to Enter the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Maldivian Market?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animate-delay-2">
            Partner with us to bring your brand to the Maldives. Our experienced
            team will guide you through every step of market entry and brand
            establishment.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-delay-3">
            <a
              href="mailto:sales@fasmala.com"
              className="group bg-white text-blue-600 font-bold py-5 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-gray-50"
            >
              <span className="flex items-center">
                Contact Our Team
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
            </a>
            <button className="group border-2 border-white text-white font-bold py-5 px-10 rounded-full hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
              Download Brand Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default BrandRepresentation;
