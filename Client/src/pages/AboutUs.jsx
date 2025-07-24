import React from "react";

const team = [
  {
    name: "Aminath Fathimath",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Mohamed Zahir",
    role: "Head of Real Estate",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sara Lee",
    role: "Investment Specialist",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Ivan Petrov",
    role: "Brand Partnerships",
    img: "https://randomuser.me/api/portraits/men/44.jpg",
  },
];

const journey = [
  {
    year: "2015",
    event:
      "Company founded with a vision to bridge travel and investment in the Maldives.",
  },
  {
    year: "2017",
    event:
      "Expanded into real estate consultation and foreign investment support.",
  },
  {
    year: "2020",
    event: "Launched international brand representation services.",
  },
  {
    year: "2023",
    event: "Recognized as a leading multi-service consultancy in the Maldives.",
  },
];

const AboutUs = () => (
  <div className="min-h-screen bg-[#E7E9E5] flex flex-col">
    {/* Mission/Vision Banner */}
    <div className="w-full bg-gradient-to-r from-[#005E84] to-[#075375] py-16 text-white text-center shadow-lg">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About Us</h1>
      <p className="text-lg sm:text-2xl max-w-2xl mx-auto">
        We are dedicated to connecting travelers, investors, and brands with the
        best of the Maldives. Our mission is to deliver excellence, trust, and
        innovation in every service.
      </p>
    </div>
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
      {/* Team Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-8 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-[#B7C5C7]"
              />
              <span className="text-[#075375] font-semibold text-lg">
                {member.name}
              </span>
              <span className="text-[#0A435C] text-sm mb-2">{member.role}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Our Journey Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-6 text-center">
          Our Journey
        </h2>
        <ol className="relative border-l-4 border-[#005E84] ml-4 max-w-2xl mx-auto">
          {journey.map((item, idx) => (
            <li key={item.year} className="mb-12 ml-6">
              <div className="absolute w-6 h-6 bg-[#005E84] rounded-full -left-9 top-0 flex items-center justify-center text-white font-bold">
                {item.year}
              </div>
              <h3 className="text-lg font-semibold text-[#075375] mb-1">
                {item.event}
              </h3>
            </li>
          ))}
        </ol>
      </section>
      {/* Quote/Testimonial */}
      <section className="text-center mt-20">
        <blockquote className="italic text-[#075375] text-xl max-w-2xl mx-auto mb-6">
          “With years of experience bridging travel, real estate, investment,
          and brand representation, we are your trusted partner in the
          Maldives.”
        </blockquote>
        <span className="text-[#0A435C] font-semibold">
          — The IsleKey Holidays Team
        </span>
      </section>
    </main>
  </div>
);

export default AboutUs;
