import React from "react";

const brands = [
  {
    name: "Brand A",
    logo: "https://dummyimage.com/120x60/005E84/fff&text=Brand+A",
    desc: "Luxury Skincare",
  },
  {
    name: "Brand B",
    logo: "https://dummyimage.com/120x60/075375/fff&text=Brand+B",
    desc: "Wellness Products",
  },
  {
    name: "Brand C",
    logo: "https://dummyimage.com/120x60/0A435C/fff&text=Brand+C",
    desc: "Tech Gadgets",
  },
  {
    name: "Brand D",
    logo: "https://dummyimage.com/120x60/B7C5C7/fff&text=Brand+D",
    desc: "Travel Accessories",
  },
  {
    name: "Brand E",
    logo: "https://dummyimage.com/120x60/E7E9E5/005E84&text=Brand+E",
    desc: "Eco-Friendly",
  },
];

const process = [
  "Brand Onboarding",
  "Market Research",
  "Promotion & Distribution",
  "Growth & Support",
];

const channels = [
  {
    title: "Retail Outlets",
    desc: "Available in top stores across the Maldives.",
  },
  {
    title: "Online Stores",
    desc: "Shop our brands online for convenience and fast delivery.",
  },
  {
    title: "Hotel & Resort Partners",
    desc: "Exclusive partnerships with leading hospitality providers.",
  },
];

const BrandRepresentation = () => (
  <div className="min-h-screen bg-[#E7E9E5] flex flex-col">
    {/* Hero */}
    <div className="w-full bg-gradient-to-r from-[#005E84] to-[#075375] py-16 text-white text-center shadow-lg">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
        International Brand Representation
      </h1>
      <p className="text-lg sm:text-2xl max-w-2xl mx-auto">
        Bringing global brands to the Maldives. Official distribution,
        promotion, and partnership opportunities for international companies.
      </p>
    </div>
    {/* Masonry Brands Grid */}
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-8 text-center">
          Featured Brands
        </h2>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {brands.map((brand, idx) => (
            <div
              key={brand.name}
              className="break-inside-avoid bg-white rounded-xl shadow p-6 flex flex-col items-center mb-6"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-32 h-16 object-contain mb-2"
              />
              <span className="text-[#075375] font-semibold text-center">
                {brand.name}
              </span>
              <span className="text-[#0A435C] text-sm mb-2">{brand.desc}</span>
            </div>
          ))}
        </div>
      </section>
      {/* How We Help - Horizontal Process Bar */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-6 text-center">
          How We Help
        </h2>
        <div className="flex gap-6 justify-center items-center overflow-x-auto pb-4">
          {process.map((step, idx) => (
            <div key={step} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#005E84] flex items-center justify-center text-white font-bold mb-2">
                {idx + 1}
              </div>
              <span className="text-[#075375] font-semibold text-center w-32">
                {step}
              </span>
              {idx < process.length - 1 && (
                <div className="w-8 h-1 bg-[#B7C5C7] mx-2" />
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Distribution Channels */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-6 text-center">
          Distribution Channels
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {channels.map((ch, idx) => (
            <div
              key={ch.title}
              className="bg-white rounded-xl shadow p-6 w-72 flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold text-[#075375] mb-2">
                {ch.title}
              </h3>
              <p className="text-[#0A435C] text-base text-center">{ch.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Partnership CTA */}
      <section className="text-center mt-20">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-4">
          Partner With Us
        </h2>
        <p className="text-lg text-[#075375] mb-6">
          Contact our team to discuss brand representation and distribution
          opportunities in the Maldives.
        </p>
        <a
          href="mailto:sales@yomaldives.travel"
          className="inline-block bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          Contact Us
        </a>
      </section>
    </main>
  </div>
);

export default BrandRepresentation;
