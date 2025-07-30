import React from "react";

const supportServices = [
  {
    title: "Business Setup",
    description: "Complete company registration and legal compliance support",
    features: ["Company registration", "Legal documentation", "License applications"]
  },
  {
    title: "Local Partnerships",
    description: "Connect with verified local partners and business networks",
    features: ["Partner matching", "Due diligence", "Network introductions"]
  },
  {
    title: "Regulatory Support",
    description: "Navigate government requirements and maintain compliance",
    features: ["Permit assistance", "Compliance monitoring", "Regulatory updates"]
  },
  {
    title: "Ongoing Operations",
    description: "Continuous support for business growth and operations",
    features: ["Business consulting", "Market intelligence", "Strategic planning"]
  }
];

const investmentSectors = [
  {
    sector: "Tourism & Hospitality",
    opportunities: ["Resort Development", "Boutique Hotels", "Tourism Services"],
    growth: "High potential in luxury tourism"
  },
  {
    sector: "Real Estate",
    opportunities: ["Residential Projects", "Commercial Spaces", "Mixed Developments"],
    growth: "Growing demand for quality developments"
  },
  {
    sector: "Infrastructure",
    opportunities: ["Hospitality Services", "Recreational Facilities", "Marine Services"],
    growth: "Supporting tourism ecosystem expansion"
  },
  {
    sector: "Technology",
    opportunities: ["Fintech Solutions", "Digital Services", "Renewable Energy"],
    growth: "Emerging sector with government backing"
  }
];

const processSteps = [
  { title: "Consultation", description: "Understand your investment goals and market fit" },
  { title: "Analysis", description: "Market research and feasibility assessment" },
  { title: "Setup", description: "Legal registration and compliance procedures" },
  { title: "Partnership", description: "Connect with local partners and networks" },
  { title: "Launch", description: "Business implementation and operational support" },
  { title: "Growth", description: "Ongoing support and expansion strategies" }
];

const keyAuthorities = [
  {
    name: "Ministry of Economic Development",
    role: "Investment approvals and business licensing"
  },
  {
    name: "Maldives Immigration",
    role: "Investor visas and residency permits"
  },
  {
    name: "Maldives Monetary Authority",
    role: "Financial regulations and banking compliance"
  },
  {
    name: "Ministry of Tourism",
    role: "Tourism sector licenses and permits"
  }
];

const InvestmentSupport = () => (
  <div className="min-h-screen bg-white">
    {/* Header */}
    <section className="bg-[#1e7ba8] text-white py-32">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-light mb-12">Foreign Investment Support</h1>
        <p className="text-2xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
          Professional guidance for successful investment in the Maldives. 
          From setup to operations, we ensure your investment succeeds.
        </p>
      </div>
    </section>

    {/* Services Overview */}
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">Our Services</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            End-to-end support for foreign investors entering the Maldivian market
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {supportServices.map((service, index) => (
            <div key={index} className="text-center p-8">
              <h3 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">{service.title}</h3>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">{service.description}</p>
              <ul className="text-base md:text-lg text-gray-500 space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-[#1e7ba8] rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Investment Sectors */}
    <section className="py-32 px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">Investment Sectors</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Key sectors open to foreign investment with strong growth potential
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {investmentSectors.map((sector, index) => (
            <div key={index} className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-medium text-gray-800 mb-8">{sector.sector}</h3>
              <div className="mb-8">
                <div className="flex flex-wrap gap-4 mb-6">
                  {sector.opportunities.map((opp, idx) => (
                    <span key={idx} className="px-6 py-3 bg-[#1e7ba8]/10 text-[#1e7ba8] text-base md:text-lg rounded-full">
                      {opp}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{sector.growth}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">How We Work</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A structured approach to ensure your investment success
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center p-8">
              <div className="w-20 h-20 bg-[#1e7ba8] text-white rounded-full flex items-center justify-center text-xl font-medium mx-auto mb-8">
                {index + 1}
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-6">{step.title}</h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Authorities */}
    <section className="py-32 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">Key Authorities</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Government bodies we work with to facilitate your investment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {keyAuthorities.map((authority, index) => (
            <div key={index} className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-6">{authority.name}</h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{authority.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-32 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="p-8">
            <div className="text-5xl md:text-6xl font-light text-[#1e7ba8] mb-6">$50M+</div>
            <div className="text-lg md:text-xl text-gray-600">Investments Facilitated</div>
          </div>
          <div className="p-8">
            <div className="text-5xl md:text-6xl font-light text-[#1e7ba8] mb-6">200+</div>
            <div className="text-lg md:text-xl text-gray-600">Investors Served</div>
          </div>
          <div className="p-8">
            <div className="text-5xl md:text-6xl font-light text-[#1e7ba8] mb-6">95%</div>
            <div className="text-lg md:text-xl text-gray-600">Success Rate</div>
          </div>
          <div className="p-8">
            <div className="text-5xl md:text-6xl font-light text-[#1e7ba8] mb-6">15+</div>
            <div className="text-lg md:text-xl text-gray-600">Government Partners</div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-32 px-8 bg-[#1e7ba8] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-12">Ready to Invest?</h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-16 max-w-3xl mx-auto leading-relaxed">
          Schedule a consultation to discuss your investment opportunities in the Maldives.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="mailto:sales@yomaldives.travel"
            className="px-12 py-6 bg-white text-[#1e7ba8] text-lg md:text-xl font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Schedule Consultation
          </a>
          <button className="px-12 py-6 border-2 border-white text-white text-lg md:text-xl font-medium rounded-lg hover:bg-white hover:text-[#1e7ba8] transition-colors">
            Download Guide
          </button>
        </div>
      </div>
    </section>
  </div>
);

export default InvestmentSupport;