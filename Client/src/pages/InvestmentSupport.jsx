import React from "react";

const steps = [
  {
    title: "Business Setup Guidance",
    desc: "Legal requirements, company registration, and business setup support.",
  },
  {
    title: "Local Partnerships",
    desc: "Connecting with local partners or developers.",
  },
  {
    title: "Regulatory Compliance",
    desc: "Assistance with regulatory compliance and ongoing business operations.",
  },
  {
    title: "Investment Opportunities",
    desc: "Overview of sectors open to foreign investment: tourism, real estate, hospitality, and more.",
  },
  {
    title: "Affiliation with Authorities/Partners",
    desc: "List of government bodies or licensed organizations we work with for facilitating foreign investments.",
  },
];

const authorities = [
  {
    name: "Ministry of Economic Development",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Emblem_of_Maldives.svg",
  },
  {
    name: "Maldives Immigration",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Emblem_of_Maldives.svg",
  },
  {
    name: "Maldives Monetary Authority",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Emblem_of_Maldives.svg",
  },
  {
    name: "Tourism Ministry",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Emblem_of_Maldives.svg",
  },
];

const InvestmentSupport = () => (
  <div className="min-h-screen bg-[#E7E9E5] flex flex-col">
    {/* Hero */}
    <div className="w-full bg-gradient-to-r from-[#005E84] to-[#075375] py-16 text-white text-center shadow-lg">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
        Foreign Investment Support
      </h1>
      <p className="text-lg sm:text-2xl max-w-2xl mx-auto">
        Comprehensive support for investors: business setup, compliance,
        partnerships, and opportunities in the Maldives.
      </p>
    </div>
    {/* Stepper */}
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-8 text-center">
          Investment Process
        </h2>
        <ol className="relative border-l-4 border-[#005E84] ml-4">
          {steps.map((step, idx) => (
            <li key={step.title} className="mb-12 ml-6">
              <div className="absolute w-6 h-6 bg-[#005E84] rounded-full -left-9 top-0 flex items-center justify-center text-white font-bold">
                {idx + 1}
              </div>
              <h3 className="text-xl font-semibold text-[#075375] mb-1">
                {step.title}
              </h3>
              <p className="text-[#0A435C] text-base">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>
      {/* Authorities/Partners */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-6 text-center">
          Key Authorities & Partners
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {authorities.map((auth, idx) => (
            <div
              key={auth.name}
              className="min-w-[220px] bg-white rounded-xl shadow p-6 flex flex-col items-center"
            >
              <img
                src={auth.logo}
                alt={auth.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-[#075375] font-semibold text-center">
                {auth.name}
              </span>
            </div>
          ))}
        </div>
      </section>
      {/* Contact */}
      <section className="text-center mt-20">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-4">
          Ready to Invest?
        </h2>
        <p className="text-lg text-[#075375] mb-6">
          Contact our investment consultants for a free consultation and
          discover the best opportunities in paradise.
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

export default InvestmentSupport;
