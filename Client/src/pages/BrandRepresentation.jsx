import React from "react";

const brands = [
  {
    name: "Brand A",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+A",
    desc: "Luxury Skincare",
    category: "Beauty & Wellness"
  },
  {
    name: "Brand B", 
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+B",
    desc: "Wellness Products",
    category: "Health & Wellness"
  },
  {
    name: "Brand C",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+C",
    desc: "Tech Gadgets",
    category: "Technology"
  },
  {
    name: "Brand D",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+D",
    desc: "Travel Accessories",
    category: "Travel & Lifestyle"
  },
  {
    name: "Brand E",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+E",
    desc: "Eco-Friendly",
    category: "Sustainability"
  },
  {
    name: "Brand F",
    logo: "https://dummyimage.com/120x60/1e7ba8/fff&text=Brand+F",
    desc: "Fashion & Accessories",
    category: "Fashion"
  },
];

const channels = [
  {
    icon: "🏪",
    title: "Retail Outlets",
    desc: "Available in top stores across the Maldives, reaching local consumers and tourists alike."
  },
  {
    icon: "🛒",
    title: "Online Stores", 
    desc: "Shop our brands online for convenience and fast delivery throughout the Maldives."
  },
  {
    icon: "🏨",
    title: "Hotel & Resort Partners",
    desc: "Exclusive partnerships with leading hospitality providers for premium brand exposure."
  },
  {
    icon: "✈️",
    title: "Airport & Travel Hubs",
    desc: "Strategic placement in high-traffic travel locations for maximum international visibility."
  },
];

const BrandRepresentation = () => (
  <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <section className="relative bg-[#1e7ba8] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full opacity-25"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">International Brand Representation</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed opacity-95">
          Bringing global brands to the Maldives. Official distribution, promotion, 
          and partnership opportunities for international companies seeking market entry.
        </p>
      </div>
    </section>

    {/* Our Role */}
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Role</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            As your trusted partner, we provide comprehensive brand representation services 
            to successfully introduce and promote international brands in the Maldivian market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-[#1e7ba8] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
              🏢
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Official Distribution & Representation</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Acting as the official distributor or representative for international brands in the Maldives, 
              providing complete market entry solutions and ongoing support for brand growth.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-[#1e7ba8] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
              🌍
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Market Introduction & Promotion</h3>
            <p className="text-gray-600 leading-relaxed text-center">
              Facilitating the introduction and promotion of global products to the Maldivian market 
              through strategic marketing, local partnerships, and comprehensive brand positioning.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Brands */}
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Brands</h2>
          <p className="text-lg text-gray-600">
            Discover the international brands we proudly represent in the Maldives, 
            showcasing logos and product categories across diverse industries.
          </p>
        </div>
        
        {/* Product Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="px-4 py-2 bg-[#1e7ba8] text-white rounded-full text-sm font-medium">Beauty & Skincare</span>
          <span className="px-4 py-2 bg-[#1e7ba8] text-white rounded-full text-sm font-medium">Health & Wellness</span>
          <span className="px-4 py-2 bg-[#1e7ba8] text-white rounded-full text-sm font-medium">Technology</span>
          <span className="px-4 py-2 bg-[#1e7ba8] text-white rounded-full text-sm font-medium">Travel & Lifestyle</span>
          <span className="px-4 py-2 bg-[#1e7ba8] text-white rounded-full text-sm font-medium">Fashion</span>
          <span className="px-4 py-2 bg-[#1e7ba8] text-white rounded-full text-sm font-medium">Sustainability</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-[#1e7ba8] hover:text-white group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
              <div className="bg-white rounded-lg p-4 mb-4 group-hover:bg-white/10 transition-colors duration-300">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-full h-16 object-contain"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">{brand.name}</h3>
              <p className="text-sm font-medium mb-2 opacity-75 bg-[#1e7ba8]/10 group-hover:bg-white/20 px-3 py-1 rounded-full inline-block transition-colors duration-300">
                {brand.category}
              </p>
              <p className="text-sm opacity-80 leading-relaxed">{brand.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Distribution Channels */}
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Distribution Channels</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our extensive distribution network ensures your products reach customers through 
            multiple platforms and touchpoints across the Maldives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {channels.map((channel, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center hover:bg-[#1e7ba8] hover:text-white group transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {channel.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{channel.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{channel.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Platform Information */}
        <div className="bg-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Platform Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-[#1e7ba8] mb-3">Physical Retail</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Premium department stores in Malé</li>
                <li>• Specialty boutiques and concept stores</li>
                <li>• Pharmacy and wellness chains</li>
                <li>• Duty-free shops at Velana International Airport</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#1e7ba8] mb-3">Digital & Online</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• E-commerce platforms and marketplaces</li>
                <li>• Brand-specific online stores</li>
                <li>• Social media shopping integration</li>
                <li>• Mobile app distribution</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#1e7ba8] mb-3">Hospitality Partners</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 5-star resort boutiques and spas</li>
                <li>• Hotel gift shops and convenience stores</li>
                <li>• Resort wellness centers</li>
                <li>• Exclusive concierge services</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#1e7ba8] mb-3">Travel & Transit</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Airport retail and duty-free</li>
                <li>• Seaplane terminal shops</li>
                <li>• Ferry terminal outlets</li>
                <li>• Tourist information centers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Partnership Opportunities */}
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Partnership Opportunities</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Information for international companies seeking professional 
            brand representation and market entry solutions in the Maldives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* What We Offer */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What We Offer Partners</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Complete Market Entry</h4>
                  <p className="text-gray-600 text-sm">Full market research, regulatory compliance, and launch strategy development.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Exclusive Representation</h4>
                  <p className="text-gray-600 text-sm">Official distributor status with exclusive territorial rights in the Maldives.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Marketing & Promotion</h4>
                  <p className="text-gray-600 text-sm">Integrated marketing campaigns across digital and traditional channels.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Logistics & Supply Chain</h4>
                  <p className="text-gray-600 text-sm">Complete import, warehousing, and distribution management.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Partners */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ideal Partner Profile</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Established International Brands</h4>
                  <p className="text-gray-600 text-sm">Companies with proven track records and quality products seeking new markets.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Premium & Luxury Segments</h4>
                  <p className="text-gray-600 text-sm">High-quality products that align with the Maldivian luxury tourism market.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Growth-Oriented Companies</h4>
                  <p className="text-gray-600 text-sm">Businesses committed to long-term market development and partnership success.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-[#1e7ba8] rounded-full flex-shrink-0 mt-1 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Innovation Leaders</h4>
                  <p className="text-gray-600 text-sm">Companies bringing unique, innovative products to the Maldivian market.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Partnership CTA */}
    <section className="py-16 px-6 bg-[#1e7ba8] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Enter the Maldivian Market?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
          Partner with us to bring your brand to the Maldives. Our experienced team will guide you 
          through every step of market entry and brand establishment.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:sales@yomaldives.travel"
            className="inline-block px-8 py-3 bg-white text-[#1e7ba8] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Contact Our Team
          </a>
          <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#1e7ba8] transition-colors duration-300">
            Download Brand Guide
          </button>
        </div>
      </div>
    </section>
  </div>
);

export default BrandRepresentation;