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

const supportServices = [
  {
    title: "Business Setup",
    description: "Complete company registration and legal compliance support",
    features: [
      "Company registration",
      "Legal documentation",
      "License applications",
    ],
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
  },
  {
    title: "Local Partnerships",
    description: "Connect with verified local partners and business networks",
    features: ["Partner matching", "Due diligence", "Network introductions"],
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
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75"
        />
      </svg>
    ),
  },
  {
    title: "Regulatory Support",
    description: "Navigate government requirements and maintain compliance",
    features: [
      "Permit assistance",
      "Compliance monitoring",
      "Regulatory updates",
    ],
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Ongoing Operations",
    description: "Continuous support for business growth and operations",
    features: [
      "Business consulting",
      "Market intelligence",
      "Strategic planning",
    ],
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
  },
];

const investmentSectors = [
  {
    sector: "Tourism & Hospitality",
    opportunities: [
      "Resort Development",
      "Boutique Hotels",
      "Tourism Services",
    ],
    growth: "High potential in luxury tourism",
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
  },
  {
    sector: "Real Estate",
    opportunities: [
      "Residential Projects",
      "Commercial Spaces",
      "Mixed Developments",
    ],
    growth: "Growing demand for quality developments",
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
  },
  {
    sector: "Infrastructure",
    opportunities: [
      "Hospitality Services",
      "Recreational Facilities",
      "Marine Services",
    ],
    growth: "Supporting tourism ecosystem expansion",
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
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    sector: "Technology",
    opportunities: [
      "Fintech Solutions",
      "Digital Services",
      "Renewable Energy",
    ],
    growth: "Emerging sector with government backing",
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
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const processSteps = [
  {
    title: "Consultation",
    description: "Understand your investment goals and market fit",
  },
  {
    title: "Analysis",
    description: "Market research and feasibility assessment",
  },
  {
    title: "Setup",
    description: "Legal registration and compliance procedures",
  },
  {
    title: "Partnership",
    description: "Connect with local partners and networks",
  },
  {
    title: "Launch",
    description: "Business implementation and operational support",
  },
  { title: "Growth", description: "Ongoing support and expansion strategies" },
];

const keyAuthorities = [
  {
    name: "Ministry of Economic Development",
    role: "Investment approvals and business licensing",
    logo: "🏛️",
  },
  {
    name: "Maldives Immigration",
    role: "Investor visas and residency permits",
    logo: "🛂",
  },
  {
    name: "Maldives Monetary Authority",
    role: "Financial regulations and banking compliance",
    logo: "🏦",
  },
  {
    name: "Ministry of Tourism",
    role: "Tourism sector licenses and permits",
    logo: "🏖️",
  },
];

const InvestmentSupport = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#E7E9E5] via-[#B7C5C7] to-[#E7E9E5]">
    <style>{animationStyles}</style>

    {/* Modern Hero Section */}
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/travel-services/mike-swigunski-k9Zeq6EH_bk-unsplash.jpg"
          alt="Maldives Investment"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-[#B7C5C7]/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-[#B7C5C7]/30 animate-fade-in-up animate-delay-1">
            <span className="text-[#E7E9E5] font-medium text-sm">
              Investment Support
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up animate-delay-2">
            Foreign Investment Support
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animate-delay-3">
            Professional guidance for successful investment in the Maldives.
            From setup to operations, we ensure your investment succeeds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-4">
            <button className="group bg-[#E7E9E5] text-[#075375] font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-[#B7C5C7] animate-pulse-slow">
              <span className="flex items-center">
                Start Your Investment
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
              Download Guide
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

    {/* Modern Services Section */}
    <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#B7C5C7]/50 to-[#E7E9E5]/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
            Complete{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
              Investment Support
            </span>
          </h2>
          <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            End-to-end support for foreign investors entering the Maldivian
            market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportServices.map((service, index) => (
            <div
              key={index}
              className="group relative bg-[#E7E9E5] rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-[#B7C5C7] h-full overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#0A435C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[#0A435C] leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[#0A435C]">
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

    {/* Modern Investment Sectors Section */}
    <section className="py-24 bg-gradient-to-br from-[#B7C5C7] to-[#E7E9E5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
            Investment Sectors
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
            Key{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
              Sectors
            </span>
          </h2>
          <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            Key sectors open to foreign investment with strong growth potential
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {investmentSectors.map((sector, index) => (
            <div
              key={index}
              className="group relative bg-[#E7E9E5] rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-[#B7C5C7] overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#0A435C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {sector.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#075375] mb-6 group-hover:text-[#005E84] transition-colors">
                  {sector.sector}
                </h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {sector.opportunities.map((opp, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-[#005E84]/20 text-[#075375] text-sm rounded-full font-medium"
                    >
                      {opp}
                    </span>
                  ))}
                </div>
                <p className="text-[#0A435C] leading-relaxed">
                  {sector.growth}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Modern Process Section */}
    <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
            Our Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
            How We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
              Work
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            A structured approach to ensure your investment success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 0.2}s` }}
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[#0A435C] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Modern Authorities Section */}
    <section className="py-24 bg-gradient-to-br from-[#B7C5C7] to-[#E7E9E5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-[#005E84]/20 text-[#075375] rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#075375] rounded-full mr-2"></span>
            Key Authorities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
            Government{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
              Partners
            </span>
          </h2>
          <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
            Government bodies we work with to facilitate your investment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keyAuthorities.map((authority, index) => (
            <div
              key={index}
              className="group relative bg-[#E7E9E5] rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-[#B7C5C7] overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 0.2}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#0A435C]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {authority.logo}
                </div>
                <h3 className="text-2xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors">
                  {authority.name}
                </h3>
                <p className="text-[#0A435C] leading-relaxed">
                  {authority.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Modern Stats Section */}
    <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
              Success
            </span>
          </h2>
          <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-1">
            Trusted by hundreds of investors worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "$50M+", label: "Investments Facilitated" },
            { number: "200+", label: "Investors Served" },
            { number: "95%", label: "Success Rate" },
            { number: "15+", label: "Government Partners" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 animate-fade-in-up"
              style={{ animationDelay: `${(index + 2) * 0.2}s` }}
            >
              <div className="text-5xl md:text-6xl font-bold text-[#005E84] mb-4 animate-pulse-slow">
                {stat.number}
              </div>
              <div className="text-[#0A435C] font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Modern CTA Section */}
    <section className="py-24 bg-gradient-to-br from-[#005E84] via-[#075375] to-[#0A435C] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#005E84]/50 to-[#0A435C]/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-[#E7E9E5]/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-[#E7E9E5]/30 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#E7E9E5] rounded-full mr-2"></span>
            Ready to Invest
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#E7E9E5] mb-8 leading-tight animate-fade-in-up animate-delay-1">
            Ready for Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B7C5C7] to-[#E7E9E5]">
              Investment Journey?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-[#E7E9E5]/90 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animate-delay-2">
            Schedule a consultation to discuss your investment opportunities in
            the Maldives.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-delay-3">
            <a
              href="mailto:sales@fasmala.com"
              className="group bg-[#E7E9E5] text-[#075375] font-bold py-5 px-10 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 hover:bg-[#B7C5C7]"
            >
              <span className="flex items-center">
                Schedule Consultation
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
            <button className="group border-2 border-[#E7E9E5] text-[#E7E9E5] font-bold py-5 px-10 rounded-full hover:bg-[#E7E9E5] hover:text-[#075375] transition-all transform hover:scale-105">
              Download Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default InvestmentSupport;
