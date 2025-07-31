import React from "react";

const services = [
  {
    title: "Resort Bookings",
    desc: "Exclusive access to registered and operational resorts across the Maldives, from luxury overwater villas to boutique island retreats.",
    icon: (
      <svg
        className="h-10 w-10 text-[#005E84] transition-transform duration-300 group-hover:scale-110"
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
    title: "Guesthouse Arrangements",
    desc: "Authentic local experiences with registered guesthouses offering comfortable accommodations and genuine Maldivian hospitality.",
    icon: (
      <svg
        className="h-10 w-10 text-[#075375] transition-transform duration-300 group-hover:scale-110"
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
    title: "Liveaboard Adventures",
    desc: "Diving and cruising experiences with registered liveaboards, exploring the best dive sites and marine life in the Maldives.",
    icon: (
      <svg
        className="h-10 w-10 text-[#B7C5C7] transition-transform duration-300 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
        />
      </svg>
    ),
  },
  {
    title: "Domestic Flights",
    desc: "Seamless domestic flight arrangements with Maldivian Airlines, connecting you to islands across the archipelago.",
    icon: (
      <svg
        className="h-10 w-10 text-[#005E84] transition-transform duration-300 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
        />
      </svg>
    ),
  },
  {
    title: "Ferry Services",
    desc: "Public ferry connections through MTCC and Raajje Transport Link, providing affordable island-to-island travel.",
    icon: (
      <svg
        className="h-10 w-10 text-[#075375] transition-transform duration-300 group-hover:scale-110"
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
    title: "Custom Itineraries",
    desc: "Personalized travel planning for individuals, couples, families, and groups, tailored to your preferences and budget.",
    icon: (
      <svg
        className="h-10 w-10 text-[#B7C5C7] transition-transform duration-300 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
];

const whyChoose = [
  {
    title: "Local Expertise",
    desc: "Deep knowledge of the Maldives, from hidden gems to popular destinations, ensuring authentic and memorable experiences.",
  },
  {
    title: "Reliable Partnerships",
    desc: "Strong relationships with registered resorts, guesthouses, and transport providers across the Maldives.",
  },
  {
    title: "Personalized Service",
    desc: "Tailored travel planning and 24/7 support, ensuring every detail of your Maldives adventure is perfect.",
  },
  {
    title: "Competitive Pricing",
    desc: "Access to exclusive rates and packages, providing value for money without compromising on quality.",
  },
];

const partners = [
  {
    name: "Maldivian Airlines",
    logo: "/partners/maldivian-airlines.png",
    desc: "National airline providing domestic and international flights across the Maldives archipelago.",
    category: "Transportation",
  },
  {
    name: "MTCC",
    logo: "/partners/mtcc.png",
    desc: "Maldives Transport and Contracting Company, offering reliable public ferry services.",
    category: "Transportation",
  },
  {
    name: "Four Seasons",
    logo: "/partners/four-seasons.webp",
    desc: "Exclusive partnerships with premium resorts offering overwater villas and world-class amenities.",
    category: "Accommodation",
  },
  {
    name: "Conrad Maldives",
    logo: "/partners/conrad-maldives.jpg",
    desc: "Authentic local accommodations providing genuine Maldivian hospitality experiences.",
    category: "Accommodation",
  },
];

const TravelServices = () => {
  // Auto-timer functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      const images = document.querySelectorAll('[id^="hero-image-"]');
      const currentActive = Array.from(images).findIndex((img) =>
        img.classList.contains("opacity-100")
      );
      const nextIndex =
        currentActive === images.length - 1 ? 0 : currentActive + 1;

      images[currentActive].classList.remove("opacity-100");
      images[currentActive].classList.add("opacity-0");
      images[nextIndex].classList.remove("opacity-0");
      images[nextIndex].classList.add("opacity-100");

      // Update dots
      const dots = document.querySelectorAll('[id^="hero-dot-"]');
      dots.forEach((dot, i) => {
        if (i === nextIndex) {
          dot.classList.remove("bg-white/50");
          dot.classList.add("bg-white", "scale-125");
        } else {
          dot.classList.remove("bg-white", "scale-125");
          dot.classList.add("bg-white/50");
        }
      });
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#E7E9E5] flex flex-col">
      {/* Interactive Hero Carousel */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden shadow-lg mb-12 animate-fade-in">
        {/* Image carousel */}
        <div className="relative w-full h-full">
          {[
            "/travel-services/husen-siraaj-fsNMGdyQTUY-unsplash.jpg",
            "/travel-services/roberto-nickson-HQMyV8a_4_4-unsplash.jpg",
            "/travel-services/muhammadh-saamy-C56yG0sQ3q8-unsplash.jpg",
            "/travel-services/cmophoto-net-EmVKKf3wUZQ-unsplash.jpg",
            "/travel-services/1 (2).jpg",
          ].map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === 0 ? "opacity-100" : "opacity-0"
              }`}
              id={`hero-image-${index}`}
            >
              <img
                src={image}
                alt={`Maldives Travel ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A435C]/80 to-[#005E84]/60" />
            </div>
          ))}
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-fade-in-delay">
              Maldives Travel Services
            </h1>
            <p className="text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow animate-fade-in-delay-2">
              Your trusted partner for seamless travel experiences in paradise,
              from resort bookings to authentic local adventures.
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => {
            const images = document.querySelectorAll('[id^="hero-image-"]');
            const currentActive = Array.from(images).findIndex((img) =>
              img.classList.contains("opacity-100")
            );
            const prevIndex =
              currentActive === 0 ? images.length - 1 : currentActive - 1;

            images[currentActive].classList.remove("opacity-100");
            images[currentActive].classList.add("opacity-0");
            images[prevIndex].classList.remove("opacity-0");
            images[prevIndex].classList.add("opacity-100");
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-20 group"
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => {
            const images = document.querySelectorAll('[id^="hero-image-"]');
            const currentActive = Array.from(images).findIndex((img) =>
              img.classList.contains("opacity-100")
            );
            const nextIndex =
              currentActive === images.length - 1 ? 0 : currentActive + 1;

            images[currentActive].classList.remove("opacity-100");
            images[currentActive].classList.add("opacity-0");
            images[nextIndex].classList.remove("opacity-0");
            images[nextIndex].classList.add("opacity-100");
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 z-20 group"
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              id={`hero-dot-${index}`}
              onClick={() => {
                const images = document.querySelectorAll('[id^="hero-image-"]');
                const dots = document.querySelectorAll('[id^="hero-dot-"]');

                images.forEach((img, i) => {
                  if (i === index) {
                    img.classList.remove("opacity-0");
                    img.classList.add("opacity-100");
                  } else {
                    img.classList.remove("opacity-100");
                    img.classList.add("opacity-0");
                  }
                });

                // Update dots
                dots.forEach((dot, i) => {
                  if (i === index) {
                    dot.classList.remove("bg-white/50");
                    dot.classList.add("bg-white", "scale-125");
                  } else {
                    dot.classList.remove("bg-white", "scale-125");
                    dot.classList.add("bg-white/50");
                  }
                });
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === 0
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            ></button>
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4 z-20">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Company Intro */}
      <section className="max-w-4xl mx-auto px-4 mb-12 text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-4 animate-fade-in-delay">
          About Our Travel Services
        </h2>
        <p className="text-[#075375] text-lg mb-4 animate-fade-in-delay-2">
          We are dedicated to making every visitor's experience in the Maldives
          seamless, memorable, and enriching. From personalized travel planning
          and resort bookings to guided excursions, airport transfers, and
          cultural experiences, we provide end-to-end support tailored to each
          traveler's preferences. Our local expertise, strong partnerships with
          leading hospitality providers, and commitment to excellent service
          ensure that our clients enjoy the best that the Maldives has to offer
          with ease and confidence.
        </p>
      </section>

      {/* Services Grid - Modern Design */}
      <section className="max-w-7xl mx-auto px-4 mb-16 animate-fade-in-up">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A435C] mb-4 animate-fade-in-delay">
            Our Travel Services
          </h2>
          <p className="text-[#075375] text-lg max-w-3xl mx-auto animate-fade-in-delay-2">
            Discover our comprehensive range of travel services designed to make
            your Maldives experience unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#075375]/5 rounded-3xl transform rotate-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up h-full border border-[#B7C5C7]/20 hover:border-[#005E84]/30">
                {/* Icon container with gradient background */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#005E84] to-[#075375] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-white">{service.icon}</div>
                  </div>
                  {/* Floating accent */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#B7C5C7] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#005E84] rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#075375] mb-4 group-hover:text-[#005E84] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[#0A435C] text-base leading-relaxed group-hover:text-[#075375] transition-colors duration-300">
                    {service.desc}
                  </p>

                  {/* Decorative line */}
                  <div className="w-16 h-1 bg-gradient-to-r from-[#005E84] to-[#075375] mx-auto mt-6 rounded-full group-hover:w-20 transition-all duration-300"></div>

                  {/* Learn more button */}
                  <button className="mt-6 px-6 py-2 bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-xl duration-300 opacity-0 group-hover:opacity-100">
                    Learn More
                  </button>
                </div>

                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/0 to-[#075375]/0 group-hover:from-[#005E84]/5 group-hover:to-[#075375]/5 transition-all duration-500 rounded-3xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-[#B7C5C7]/20 to-[#B7C5C7]/10 rounded-2xl px-8 py-4 border border-[#B7C5C7]/30">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#005E84] rounded-full animate-pulse"></div>
              <span className="text-[#075375] font-medium">
                All services included
              </span>
            </div>
            <div className="w-px h-6 bg-[#B7C5C7]"></div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-[#075375] rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <span className="text-[#075375] font-medium">24/7 support</span>
            </div>
            <div className="w-px h-6 bg-[#B7C5C7]"></div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-[#B7C5C7] rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <span className="text-[#075375] font-medium">
                Best rates guaranteed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 mb-16 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-8 text-center animate-fade-in-delay">
          Why Choose Us
        </h2>
        <div className="relative">
          {/* Background decorative element */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#075375]/5 rounded-3xl transform rotate-1"></div>

          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {whyChoose.map((item, index) => (
                <div
                  key={item.title}
                  className="group relative"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Number badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#005E84] to-[#075375] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="pl-8 pt-4">
                    <h3 className="text-xl font-bold text-[#075375] mb-3 group-hover:text-[#005E84] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[#0A435C] text-base leading-relaxed group-hover:text-[#075375] transition-colors duration-300">
                      {item.desc}
                    </p>

                    {/* Decorative line */}
                    <div className="w-16 h-1 bg-gradient-to-r from-[#005E84] to-[#075375] mt-4 rounded-full group-hover:w-20 transition-all duration-300"></div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/0 to-[#075375]/0 group-hover:from-[#005E84]/5 group-hover:to-[#075375]/5 transition-all duration-500 rounded-2xl"></div>
                </div>
              ))}
            </div>

            {/* Bottom accent */}
            <div className="mt-8 pt-8 border-t border-[#B7C5C7]/30">
              <div className="text-center">
                <p className="text-[#075375] text-lg font-medium">
                  Trusted by thousands of travelers worldwide
                </p>
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <div className="w-2 h-2 bg-[#005E84] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#075375] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#B7C5C7] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="max-w-6xl mx-auto px-4 mb-16 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#0A435C] mb-8 text-center animate-fade-in-delay">
          Our Trusted Partners
        </h2>
        <p className="text-[#075375] text-lg mb-8 text-center animate-fade-in-delay-2">
          We work with the best in the industry to provide you with exceptional
          travel experiences
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="group bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/5 to-[#075375]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Logo container with enhanced effects */}
              <div className="relative z-10 p-6 bg-gradient-to-br from-[#B7C5C7]/20 to-[#B7C5C7]/10 rounded-xl group-hover:from-[#B7C5C7]/40 group-hover:to-[#B7C5C7]/30 transition-all duration-500 border border-[#B7C5C7]/30 group-hover:border-[#005E84]/30">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-24 w-auto object-contain group-hover:scale-125 transition-all duration-500 filter group-hover:brightness-110 group-hover:contrast-110"
                />
              </div>

              {/* Partner name with glow effect */}
              <h3 className="text-base font-semibold text-[#075375] mt-4 text-center group-hover:text-[#005E84] transition-colors duration-300 group-hover:drop-shadow-lg">
                {partner.name}
              </h3>

              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#005E84]/0 to-[#075375]/0 group-hover:from-[#005E84]/10 group-hover:to-[#075375]/10 transition-all duration-500 rounded-xl" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-4 mb-20 animate-fade-in-up">
        <div className="relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div
                className="absolute top-10 left-10 w-32 h-32 border-2 border-[#005E84] rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
              <div
                className="absolute top-20 right-20 w-24 h-24 border-2 border-[#075375] rounded-full animate-spin"
                style={{
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              ></div>
              <div
                className="absolute bottom-10 left-1/3 w-20 h-20 border-2 border-[#B7C5C7] rounded-full animate-spin"
                style={{ animationDuration: "25s" }}
              ></div>
            </div>
          </div>

          <div className="relative">
            {/* Split layout design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Left side - Contact form style */}
              <div className="bg-gradient-to-br from-[#005E84] via-[#075375] to-[#0A435C] p-8 md:p-12 text-white">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Ready to Start Your Journey?
                    </h2>
                    <p className="text-lg opacity-90">
                      Get in touch with our travel experts and let us craft your
                      perfect Maldives experience
                    </p>
                  </div>

                  {/* Contact methods */}
                  <div className="space-y-6">
                    <div className="group">
                      <div className="flex items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
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
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Email Us</h3>
                          <p className="text-white/80 text-sm">
                            Get instant responses
                          </p>
                        </div>
                        <a
                          href="mailto:sales@fasmala.com"
                          className="px-4 py-2 bg-white/20 rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-300"
                        >
                          Send
                        </a>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            Call / WhatsApp
                          </h3>
                          <p className="text-white/80 text-sm">
                            24/7 support available
                          </p>
                        </div>
                        <a
                          href="tel:+9609387414"
                          className="px-4 py-2 bg-white/20 rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-300"
                        >
                          Call
                        </a>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
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
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            Visit Our Offices
                          </h3>
                          <p className="text-white/80 text-sm">
                            Meet our team in person
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-white/20 rounded-lg text-white font-medium hover:bg-white/30 transition-all duration-300">
                          Visit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex justify-center space-x-6 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        <span>Free Consultation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        <span>No Fees</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Office locations */}
              <div className="bg-white p-8 md:p-12">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#0A435C] mb-2">
                      Our Office Locations
                    </h3>
                    <p className="text-[#075375]">
                      Visit us at any of our branches
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <div className="relative p-6 bg-gradient-to-br from-[#B7C5C7]/10 to-[#B7C5C7]/5 rounded-2xl border border-[#B7C5C7]/20 hover:border-[#005E84]/30 transition-all duration-300">
                        <div className="absolute top-4 right-4 w-3 h-3 bg-[#005E84] rounded-full animate-pulse"></div>
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#005E84] rounded-lg flex items-center justify-center mr-4 mt-1">
                            <svg
                              className="w-5 h-5 text-white"
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
                          <div>
                            <h4 className="text-lg font-semibold text-[#075375] mb-2 group-hover:text-[#005E84] transition-colors duration-300">
                              Male' Branch
                            </h4>
                            <p className="text-[#0A435C] text-sm leading-relaxed">
                              M.Laalubaagu Irumatheebai,
                              <br />
                              Asurumaa Goalhi, Male'
                            </p>
                            <div className="mt-3 flex items-center text-[#075375] text-xs">
                              <svg
                                className="w-3 h-3 mr-1"
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
                    </div>

                    <div className="group">
                      <div className="relative p-6 bg-gradient-to-br from-[#B7C5C7]/10 to-[#B7C5C7]/5 rounded-2xl border border-[#B7C5C7]/20 hover:border-[#005E84]/30 transition-all duration-300">
                        <div
                          className="absolute top-4 right-4 w-3 h-3 bg-[#075375] rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#075375] rounded-lg flex items-center justify-center mr-4 mt-1">
                            <svg
                              className="w-5 h-5 text-white"
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
                          <div>
                            <h4 className="text-lg font-semibold text-[#075375] mb-2 group-hover:text-[#005E84] transition-colors duration-300">
                              Addu Branch
                            </h4>
                            <p className="text-[#0A435C] text-sm leading-relaxed">
                              Muiviludhoshougey, Haveeree Magu,
                              <br />
                              S. Hithadhoo, Addu City
                            </p>
                            <div className="mt-3 flex items-center text-[#075375] text-xs">
                              <svg
                                className="w-3 h-3 mr-1"
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
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="mt-8 text-center">
                    <p className="text-[#075375] text-sm font-medium">
                      Trusted by thousands of travelers worldwide
                    </p>
                    <div className="flex justify-center mt-3 space-x-1">
                      <div className="w-1 h-1 bg-[#005E84] rounded-full animate-pulse"></div>
                      <div
                        className="w-1 h-1 bg-[#075375] rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-[#B7C5C7] rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 0.8;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 1s ease-out;
        }

        .animate-zoom-in {
          animation: zoomIn 1.5s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 0.6s both;
        }

        .animate-fade-in-delay-3 {
          animation: fadeIn 1s ease-out 0.9s both;
        }

        .animate-fade-in-delay-4 {
          animation: fadeIn 1s ease-out 1.2s both;
        }
      `}</style>
    </div>
  );
};

export default TravelServices;
