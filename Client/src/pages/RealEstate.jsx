import React from "react";

// Custom CSS animations
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
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
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
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.6s ease-out;
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
`;

const highlights = [
  {
    title: "Residential & Commercial Projects",
    desc: "Specializing in the development and management of homes, offices, and retail spaces across the Maldives.",
    icon: (
      <svg
        className="h-10 w-10 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 21h18M3 21v-2a2 2 0 012-2h14a2 2 0 012 2v2"
        />
      </svg>
    ),
  },
  {
    title: "Resort & Hospitality Construction",
    desc: "Delivering high-quality resort and hospitality projects, from concept to completion, with a focus on modern design and durability.",
    icon: (
      <svg
        className="h-10 w-10 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 21V13h8v8M12 3l9 9-1.5 1.5M21 12.5V21a2 2 0 01-2 2H5a2 2 0 01-2-2v-8.5M3 12.5L12 3"
        />
      </svg>
    ),
  },
  {
    title: "Project Management & Consultancy",
    desc: "Comprehensive project management, planning, and consultancy services to ensure timely, on-budget, and high-standard delivery.",
    icon: (
      <svg
        className="h-10 w-10 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
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
];

const whyChoose = [
  {
    title: "Diverse Expertise",
    desc: "From residential and commercial to resort development, we bring a wide range of construction and real estate services under one trusted name.",
  },
  {
    title: "Reliable Service",
    desc: "We are committed to delivering consistent, high-quality results, ensuring satisfaction and peace of mind for every client.",
  },
  {
    title: "Local Knowledge, Global Standards",
    desc: "With deep roots in the Maldives and a modern approach, we blend local insights with international best practices.",
  },
  {
    title: "Customer-Centric Approach",
    desc: "Your needs come first. We tailor our services to your goals, offering personalized support and transparent communication.",
  },
];

const RealEstate = () => {
  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-[#E7E9E5] via-[#B7C5C7] to-[#E7E9E5]">
        {/* Hero Section - Parallax Style */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background with parallax effect */}
          <div className="absolute inset-0">
            <img
              src="/travel-services/afrah-FylmOteiHWc-unsplash.jpg"
              alt="Maldives Travel"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
          </div>

          {/* Floating content */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-[#075375]/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#B7C5C7]/30 animate-scale-in">
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up animate-delay-1">
                Maldives Real Estate & Construction
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-2">
                Reliable, high-quality construction and real estate solutions
                for homes, businesses, and resorts across the Maldives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-3">
                <button className="px-8 py-4 bg-[#E7E9E5] text-[#075375] font-bold rounded-full hover:bg-[#B7C5C7] transition-all transform hover:scale-105 shadow-lg animate-float">
                  Start Your Project
                </button>
                <button className="px-8 py-4 border-2 border-[#E7E9E5] text-[#E7E9E5] font-bold rounded-full hover:bg-[#E7E9E5] hover:text-[#075375] transition-all transform hover:scale-105 animate-float animate-delay-1">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#E7E9E5] rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#E7E9E5] rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Company Intro - Split Layout */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0A435C] mb-8 animate-fade-in-up animate-delay-1">
                  Building Dreams, Creating Reality
                </h2>
                <p className="text-lg text-[#075375] leading-relaxed mb-8 animate-fade-in-up animate-delay-2">
                  We are a multifaceted Maldivian company specializing in
                  residential, commercial, and resort construction, as well as
                  property management and consultancy. Our team combines local
                  expertise with global standards to deliver projects that are
                  durable, efficient, and beautifully designed.
                </p>
                <div className="grid grid-cols-2 gap-6 animate-fade-in-up animate-delay-3">
                  <div className="text-center animate-pulse-slow">
                    <div className="text-3xl font-bold text-[#005E84] mb-2">
                      150+
                    </div>
                    <div className="text-sm text-[#075375]">
                      Projects Completed
                    </div>
                  </div>
                  <div className="text-center animate-pulse-slow animate-delay-1">
                    <div className="text-3xl font-bold text-[#005E84] mb-2">
                      10+
                    </div>
                    <div className="text-sm text-[#075375]">
                      Years Experience
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative animate-slide-in-right">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/travel-services/husen-siraaj-fsNMGdyQTUY-unsplash.jpg"
                    alt="Maldives Travel 1"
                    className="rounded-2xl shadow-xl animate-scale-in animate-delay-1 hover:scale-105 transition-transform duration-300"
                  />
                  <img
                    src="/travel-services/roberto-nickson-HQMyV8a_4_4-unsplash.jpg"
                    alt="Maldives Travel 2"
                    className="rounded-2xl shadow-xl mt-8 animate-scale-in animate-delay-2 hover:scale-105 transition-transform duration-300"
                  />
                  <img
                    src="/travel-services/muhammadh-saamy-C56yG0sQ3q8-unsplash.jpg"
                    alt="Maldives Travel 3"
                    className="rounded-2xl shadow-xl animate-scale-in animate-delay-3 hover:scale-105 transition-transform duration-300"
                  />
                  <img
                    src="/travel-services/cmophoto-net-EmVKKf3wUZQ-unsplash.jpg"
                    alt="Maldives Travel 4"
                    className="rounded-2xl shadow-xl mt-8 animate-scale-in animate-delay-4 hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services - Masonry Layout */}
        <section className="py-20 px-4 bg-[#E7E9E5]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up animate-delay-1">
                Our Construction Services
              </h2>
              <p className="text-xl text-[#075375] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
                Discover our comprehensive range of construction and real estate
                services designed to bring your vision to life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map((service, index) => (
                <div
                  key={service.title}
                  className={`group relative animate-fade-in-up ${
                    index === 1 ? "md:translate-y-8" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="bg-gradient-to-br from-[#005E84] to-[#075375] rounded-3xl p-8 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-[#E7E9E5] rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-[#E7E9E5] rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="mb-6">{service.icon}</div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-[#B7C5C7] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[#E7E9E5]/90 leading-relaxed mb-6">
                        {service.desc}
                      </p>
                      <button className="px-6 py-3 bg-[#B7C5C7]/20 backdrop-blur-sm rounded-xl text-[#E7E9E5] font-semibold hover:bg-[#B7C5C7]/30 transition-all transform hover:scale-105">
                        Learn More →
                      </button>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B7C5C7]/20 to-[#E7E9E5]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Timeline Design */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#F8FAFC] to-[#E7E9E5]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A435C] mb-6 animate-fade-in-up animate-delay-1">
                Why Choose Us
              </h2>
              <p className="text-xl text-[#075375] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
                We combine expertise, reliability, and innovation to deliver
                exceptional results
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#005E84] to-[#075375]"></div>

              <div className="space-y-12">
                {whyChoose.map((item, index) => (
                  <div
                    key={item.title}
                    className={`relative flex items-center animate-fade-in-up ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                    style={{ animationDelay: `${index * 0.3}s` }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#005E84] rounded-full border-4 border-white shadow-lg z-10"></div>

                    {/* Content */}
                    <div
                      className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}
                    >
                      <div className="bg-[#E7E9E5] rounded-2xl p-8 shadow-xl border border-[#B7C5C7]">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#005E84] to-[#075375] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                            {index + 1}
                          </div>
                          <h3 className="text-2xl font-bold text-[#075375]">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-[#0A435C] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Card Stack Design */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0A435C] mb-6 animate-fade-in-up animate-delay-1">
                Ready to Build Your Dream?
              </h2>
              <p className="text-xl text-[#075375] max-w-3xl mx-auto animate-fade-in-up animate-delay-2">
                Get in touch with our construction experts and let us bring your
                vision to life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Card 1 */}
              <div className="bg-gradient-to-br from-[#005E84] to-[#075375] rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all shadow-xl animate-scale-in animate-delay-1">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Email Us</h3>
                <p className="text-white/80 mb-6">
                  Get instant responses from our team
                </p>
                <a
                  href="mailto:sales@fasmala.com"
                  className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all"
                >
                  Send Email
                </a>
              </div>

              {/* Contact Card 2 */}
              <div className="bg-gradient-to-br from-[#075375] to-[#0A435C] rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all shadow-xl animate-scale-in animate-delay-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Call / WhatsApp</h3>
                <p className="text-white/80 mb-6">24/7 support available</p>
                <a
                  href="tel:+9609387414"
                  className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all"
                >
                  Call Now
                </a>
              </div>

              {/* Contact Card 3 */}
              <div className="bg-gradient-to-br from-[#0A435C] to-[#005E84] rounded-3xl p-8 text-white text-center transform hover:scale-105 transition-all shadow-xl animate-scale-in animate-delay-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
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
                <h3 className="text-2xl font-bold mb-4">Visit Our Offices</h3>
                <p className="text-white/80 mb-6">Meet our team in person</p>
                <button className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all">
                  Get Directions
                </button>
              </div>
            </div>

            {/* Office Locations */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#005E84] rounded-full flex items-center justify-center mr-4">
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
                  <h3 className="text-2xl font-bold text-[#075375]">
                    Male' Branch
                  </h3>
                </div>
                <p className="text-[#0A435C] text-lg mb-4">
                  M.Laalubaagu Irumatheebai,
                  <br />
                  Asurumaa Goalhi, Male'
                </p>
                <div className="flex items-center text-[#075375]">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mon-Fri: 9AM-6PM
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#075375] rounded-full flex items-center justify-center mr-4">
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
                  <h3 className="text-2xl font-bold text-[#075375]">
                    Addu Branch
                  </h3>
                </div>
                <p className="text-[#0A435C] text-lg mb-4">
                  Muiviludhoshougey, Haveeree Magu,
                  <br />
                  S. Hithadhoo, Addu City
                </p>
                <div className="flex items-center text-[#075375]">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mon-Fri: 9AM-6PM
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RealEstate;
