import React from "react";

const highlights = [
  {
    title: "Residential & Commercial Projects",
    desc: "Specializing in the development and management of homes, offices, and retail spaces across the Maldives.",
    icon: (
      <svg
        className="h-10 w-10 text-[#005E84]"
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
        className="h-10 w-10 text-[#075375]"
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
        className="h-10 w-10 text-[#B7C5C7]"
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

const RealEstate = () => (
  <div className="min-h-screen bg-[#E7E9E5] flex flex-col">
    {/* Hero */}
    <div className="relative w-full h-72 md:h-96 flex items-center justify-center overflow-hidden shadow-lg mb-12">
      <img
        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1400&q=80"
        alt="Maldives Construction"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A435C]/80 to-[#005E84]/60" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Maldives Real Estate & Construction
        </h1>
        <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow">
          Reliable, high-quality construction and real estate solutions for
          homes, businesses, and resorts across the Maldives.
        </p>
      </div>
    </div>

    {/* Company Intro */}
    <section className="max-w-4xl mx-auto px-4 mb-12 text-center">
      <h2 className="text-2xl font-bold text-[#0A435C] mb-4">
        About Our Real Estate & Construction Services
      </h2>
      <p className="text-[#075375] text-lg mb-4">
        We are a multifaceted Maldivian company specializing in residential,
        commercial, and resort construction, as well as property management and
        consultancy. Our team combines local expertise with global standards to
        deliver projects that are durable, efficient, and beautifully designed.
        From planning and project management to execution and finishing, we
        ensure every build meets the highest standards of safety and
        craftsmanship.
      </p>
    </section>

    {/* Business Highlights */}
    <section className="max-w-5xl mx-auto px-4 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold text-[#075375] mb-2">{f.title}</h3>
            <p className="text-[#0A435C] text-base">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="max-w-4xl mx-auto px-4 mb-16">
      <h2 className="text-2xl font-bold text-[#0A435C] mb-6 text-center">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {whyChoose.map((item) => (
          <div
            key={item.title}
            className="bg-[#B7C5C7]/30 rounded-xl shadow p-6"
          >
            <h3 className="text-lg font-semibold text-[#075375] mb-2">
              {item.title}
            </h3>
            <p className="text-[#0A435C] text-base">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Contact Section */}
    <section className="max-w-2xl mx-auto px-4 mb-20">
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-4">Contact Us</h2>
        <p className="text-[#075375] mb-6">
          Ready to start your next project or need expert advice? Reach out to
          our team for a free consultation.
        </p>
        <a
          href="mailto:sales@fasmala.com"
          className="inline-block bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          Email Us
        </a>
        <div className="mt-4 text-[#0A435C]">
          <div>
            Call / WhatsApp:{" "}
            <a
              href="tel:+9609387414"
              className="underline hover:text-[#005E84]"
            >
              +960 938-7414
            </a>
          </div>
          <div className="mt-1">
            Male' branch: M.Laalubaagu Irumatheebai, Asurumaa Goalhi, Male'
          </div>
          <div>
            Addu branch: Muiviludhoshougey, Haveeree Magu, S. Hithadhoo, Addu
            City
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default RealEstate;
