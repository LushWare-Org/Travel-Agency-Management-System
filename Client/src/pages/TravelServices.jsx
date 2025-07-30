import React from "react";

const palette = {
  platinum: "#E7E9E5",
  ash_gray: "#B7C5C7",
  lapis_lazuli: "#005E84",
  indigo_dye: "#075375",
  indigo_dye2: "#0A435C",
};

const services = [
  {
    title: "Registered Resorts",
    icon: (
      <svg
        className="h-8 w-8 text-[#005E84]"
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
    desc: "A comprehensive list of registered and operational resorts in the Maldives.",
  },
  {
    title: "Registered Guesthouses",
    icon: (
      <svg
        className="h-8 w-8 text-[#075375]"
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
    desc: "Information on registered guesthouses across the Maldives.",
  },
  {
    title: "Liveaboards",
    icon: (
      <svg
        className="h-8 w-8 text-[#0A435C]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 19l9-7 9 7M9 21V9a3 3 0 016 0v12"
        />
      </svg>
    ),
    desc: "Details on registered liveaboards offering diving and cruising experiences.",
  },
  {
    title: "Maldivian Airlines",
    icon: (
      <svg
        className="h-8 w-8 text-[#B7C5C7]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.5 19.5L21.5 4.5M2.5 19.5l7-2.5m12-12l-2.5 7m-7 2.5l7-2.5"
        />
      </svg>
    ),
    desc: "The national airline providing domestic and international flights.",
  },
  {
    title: "MTCC (Maldives Transport and Contracting Company)",
    icon: (
      <svg
        className="h-8 w-8 text-[#005E84]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 13h18M5 10l7-7 7 7"
        />
      </svg>
    ),
    desc: "Information on public ferry services and transport links.",
  },
  {
    title: "Raajje Transport Link (RTL)",
    icon: (
      <svg
        className="h-8 w-8 text-[#075375]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 17V7a2 2 0 012-2h12a2 2 0 012 2v10M4 17h16"
        />
      </svg>
    ),
    desc: "Details on the integrated national public ferry network.",
  },
];

const TravelServices = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#E7E9E5] to-[#B7C5C7] flex flex-col">
    {/* Hero Section */}
    <div className="relative w-full h-64 sm:h-80 lg:h-[28rem] flex items-center justify-center overflow-hidden shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
        alt="Maldives Travel"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A435C]/80 to-[#005E84]/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Travel Services
        </h1>
        <p className="text-lg sm:text-2xl font-medium max-w-2xl mx-auto drop-shadow">
          Seamless travel planning, exclusive access to Maldives resorts,
          guesthouses, liveaboards, and more. Your journey to paradise starts
          here.
        </p>
      </div>
    </div>

    {/* Main Content */}
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A435C] mb-4">
          Our Concierge Services
        </h2>
        <p className="text-lg text-[#075375] mb-6">
          We offer personalized travel planning, expert advice, and full
          concierge support for your Maldives adventure. Whether you seek
          luxury, adventure, or relaxation, our team ensures a smooth and
          memorable experience.
        </p>
        <ul className="list-disc pl-6 text-[#005E84] text-base space-y-2">
          <li>
            Custom itinerary design for individuals, couples, families, and
            groups
          </li>
          <li>Exclusive resort and guesthouse bookings</li>
          <li>Liveaboard diving and cruising arrangements</li>
          <li>Domestic flights, ferries, and transfers</li>
          <li>24/7 support and local expertise</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A435C] mb-8">
          Tourism Facilities & Travel Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-[#E7E9E5] hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-[#075375] mb-2">
                {service.title}
              </h3>
              <p className="text-[#0A435C] text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A435C] mb-4">
          Ready to Plan Your Maldives Escape?
        </h2>
        <p className="text-lg text-[#075375] mb-6">
          Contact our travel experts for a free consultation and start your
          journey to paradise today.
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

export default TravelServices;
