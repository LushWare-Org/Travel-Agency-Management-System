import React from "react";

const team = [
  {
    name: "Aminath Fathimath",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "Visionary leader with 10+ years in Maldivian hospitality and investment sectors."
  },
  {
    name: "Mohamed Zahir",
    role: "Head of Real Estate",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Expert in luxury property development and foreign investment regulations."
  },
  {
    name: "Sara Lee",
    role: "Investment Specialist",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    description: "Strategic advisor specializing in sustainable tourism investments."
  },
  {
    name: "Ivan Petrov",
    role: "Brand Partnerships",
    img: "https://randomuser.me/api/portraits/men/44.jpg",
    description: "Building bridges between international brands and Maldivian opportunities."
  },
];

const journey = [
  {
    year: "2015",
    title: "Foundation",
    event: "Company founded with a vision to bridge travel and investment in the Maldives, starting with boutique travel experiences."
  },
  {
    year: "2017",
    title: "Expansion", 
    event: "Expanded into real estate consultation and foreign investment support, establishing key partnerships with local developers."
  },
  {
    year: "2020",
    title: "Innovation",
    event: "Launched international brand representation services and digital transformation initiatives during global challenges."
  },
  {
    year: "2023",
    title: "Recognition",
    event: "Recognized as a leading multi-service consultancy in the Maldives, serving over 500 international clients."
  },
];

const values = [
  {
    icon: "🏝️",
    title: "Local Expertise",
    description: "Deep understanding of Maldivian culture, regulations, and opportunities."
  },
  {
    icon: "🤝",
    title: "Trust & Integrity", 
    description: "Building lasting relationships through transparent and ethical practices."
  },
  {
    icon: "🌟",
    title: "Excellence",
    description: "Delivering exceptional service that exceeds expectations every time."
  },
  {
    icon: "🚀",
    title: "Innovation",
    description: "Embracing new technologies and approaches to better serve our clients."
  }
];

const AboutUs = () => (
  <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <section className="relative bg-[#1e7ba8] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full opacity-25"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">About IsleKey Holidays</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-95">
          Your trusted gateway to the Maldives. We bridge travel, investment, and opportunity 
          in paradise, creating unforgettable experiences and lasting partnerships.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">Travel Excellence</span>
          <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">Real Estate</span>
          <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">Investment</span>
          <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">Brand Partnerships</span>
        </div>
      </div>
    </section>

    {/* Our Mission */}
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          To be the premier bridge between international opportunities and the Maldivian paradise, 
          delivering exceptional service in travel, real estate, investment, and brand partnerships 
          while maintaining the highest standards of integrity and local expertise.
        </p>
      </div>
    </section>

    {/* Our Values */}
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-50 rounded-xl p-8 h-full hover:bg-[#1e7ba8] hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-sm leading-relaxed opacity-80">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Meet Our Team */}
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
              <p className="text-[#1e7ba8] font-semibold mb-3 text-sm">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Our Journey */}
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">Our Journey</h2>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#1e7ba8]"></div>
          
          {journey.map((item, index) => (
            <div key={index} className="relative flex items-start mb-12 group">
              <div className="flex-shrink-0 w-16 h-16 bg-[#1e7ba8] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300 relative z-10">
                {item.year}
              </div>
              <div className="ml-8 flex-1">
                <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonial */}
    <section className="py-16 px-6 bg-[#1e7ba8] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl text-white/30 mb-6">"</div>
        <blockquote className="text-xl md:text-2xl font-light italic mb-8 leading-relaxed">
          With years of experience bridging travel, real estate, investment, and brand representation, 
          we are your trusted partner in unlocking the true potential of the Maldives.
        </blockquote>
        <div className="flex items-center justify-center">
          <div className="w-12 h-0.5 bg-white/50 mr-4"></div>
          <cite className="font-semibold not-italic">The IsleKey Holidays Team</cite>
          <div className="w-12 h-0.5 bg-white/50 ml-4"></div>
        </div>
      </div>
    </section>

    {/* Statistics */}
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-3xl font-bold text-[#1e7ba8] mb-2">500+</div>
            <div className="text-gray-600 font-medium">Happy Clients</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-3xl font-bold text-[#1e7ba8] mb-2">8+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-3xl font-bold text-[#1e7ba8] mb-2">100+</div>
            <div className="text-gray-600 font-medium">Properties Managed</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-3xl font-bold text-[#1e7ba8] mb-2">25+</div>
            <div className="text-gray-600 font-medium">Brand Partners</div>
          </div>
        </div>
      </div>
    </section>

    {/* Call to Action */}
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Let us help you discover the endless possibilities that await in the Maldives. 
          Contact us today to begin your adventure.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-[#1e7ba8] text-white font-semibold rounded-lg hover:bg-[#1a6b94] transition-colors duration-300 shadow-md hover:shadow-lg">
            Contact Us Today
          </button>
          <button className="px-8 py-3 border-2 border-[#1e7ba8] text-[#1e7ba8] font-semibold rounded-lg hover:bg-[#1e7ba8] hover:text-white transition-colors duration-300">
            View Our Services
          </button>
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;