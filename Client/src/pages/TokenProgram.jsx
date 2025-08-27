import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// Add custom CSS animations
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

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
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
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.8s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.8s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.8s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
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

  .animate-delay-5 {
    animation-delay: 1s;
  }

  .opacity-0 {
    opacity: 0;
  }

  .opacity-0.animate-fade-in-up,
  .opacity-0.animate-fade-in-left,
  .opacity-0.animate-fade-in-right,
  .opacity-0.animate-scale-in,
  .opacity-0.animate-slide-up {
    opacity: 1;
  }
`;

const TokenProgram = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7E9E5] via-[#B7C5C7] to-[#E7E9E5]">
      <style>{animationStyles}</style>

      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/travel-services/roberto-nickson-HQMyV8a_4_4-unsplash.jpg"
            alt="IsleKey Token Program"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10"></div>
        </div>

        <div className="absolute inset-0 bg-[url('/travel-services/roberto-nickson-HQMyV8a_4_4-unsplash.jpg')] bg-cover bg-center opacity-20 blur-md"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20 animate-fade-in-up animate-delay-1">
            <span className="text-white font-medium tracking-wider">
              BE PART OF THE MISSION
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 animate-fade-in-up animate-delay-2 tracking-tight">
            The IsleKey
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Token Program
            </span>
          </h1>

          <div className="w-24 h-1 bg-white/50 mx-auto mb-8 animate-fade-in-up animate-delay-3"></div>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 animate-fade-in-up animate-delay-3">
            Create transformation through travel
          </p>

          <div className="animate-bounce mt-12 animate-delay-5">
            <svg
              className="w-10 h-10 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-[#E7E9E5] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#B7C5C7]/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-[#B7C5C7]/30 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up">
              We invite you to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                make history
              </span>{" "}
              with us
            </h2>
            <div className="w-32 h-1 bg-[#005E84]/30 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <p className="text-xl text-[#0A435C] leading-relaxed animate-fade-in-left animate-delay-1">
                We invite our valued clients to do more than visit — we invite
                them to make history with us.
              </p>

              <p className="text-xl text-[#0A435C] leading-relaxed animate-fade-in-left animate-delay-2">
                Through the IsleKey Token Program, we regularly select a client
                (with the option to bring a partner) for a unique opportunity:
              </p>

              <div className="space-y-6 animate-fade-in-left animate-delay-3">
                <div className="flex items-center space-x-4 bg-white/80 p-6 rounded-2xl shadow-md border border-white/50 transform transition-all duration-500 hover:shadow-xl hover:translate-y-[-5px] hover:bg-white">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#005E84] to-[#0A435C] flex items-center justify-center text-white text-xl"></div>
                  <p className="text-lg text-[#0A435C] font-medium">
                    Visit Hulhudhoo / Meedhoo
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-white/80 p-6 rounded-2xl shadow-md border border-white/50 transform transition-all duration-500 hover:shadow-xl hover:translate-y-[-5px] hover:bg-white">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#005E84] to-[#0A435C] flex items-center justify-center text-white text-xl"></div>
                  <p className="text-lg text-[#0A435C] font-medium">
                    Witness the community and tourism projects your journey
                    helps support
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-white/80 p-6 rounded-2xl shadow-md border border-white/50 transform transition-all duration-500 hover:shadow-xl hover:translate-y-[-5px] hover:bg-white">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#005E84] to-[#0A435C] flex items-center justify-center text-white text-xl"></div>
                  <p className="text-lg text-[#0A435C] font-medium">
                    Enjoy a meaningful holiday with purpose and impact
                  </p>
                </div>
              </div>

              <div className="relative p-8 mt-10 bg-gradient-to-br from-[#005E84]/10 to-[#0A435C]/5 rounded-3xl border border-[#005E84]/20">
                <p className="text-xl font-medium text-[#005E84] animate-fade-in-left animate-delay-4">
                  This is your chance to be part of something bigger — where
                  your travels create transformation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-left animate-delay-5 pt-8">
                <Link
                  to="/contact?subject=Token%20Program%20Information"
                  className="group bg-gradient-to-r from-[#005E84] to-[#075375] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-102 hover:from-[#075375] hover:to-[#0A435C] flex items-center justify-center"
                  onClick={scrollToTop}
                >
                  <span className="flex items-center">
                    Learn More About the Program
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>

                <Link
                  to="/contact?subject=Token%20Program%20Nomination"
                  className="group bg-white text-[#005E84] font-bold py-4 px-8 rounded-xl border border-[#005E84]/30 hover:bg-[#005E84] hover:text-white transition-all transform hover:scale-102 flex items-center justify-center shadow-md hover:shadow-lg"
                  onClick={scrollToTop}
                >
                  Nominate Me for a Token Visit
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in-right animate-delay-3 order-1 lg:order-2">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/travel-services/mike-swigunski-k9Zeq6EH_bk-unsplash.jpg"
                  alt="Token Program Experience"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 transform transition-all duration-500 hover:bg-black/40">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Make an Impact
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      Your journey becomes part of a larger story — one that
                      transforms communities and creates lasting change for
                      generations to come.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-[#005E84] to-[#0A435C] rounded-2xl shadow-lg animate-pulse-slow -rotate-6"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg animate-float opacity-80"></div>
            </div>
          </div>

          <div className="relative mt-32 px-4 py-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#005E84]/10 to-[#0A435C]/10 rounded-3xl transform -rotate-1"></div>
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50"></div>
            <div className="relative z-10 text-center p-6">
              <h3 className="text-3xl font-bold text-[#075375] mb-4">
                Your Travel Journey With Purpose
              </h3>
              <p className="text-lg text-[#0A435C] max-w-3xl mx-auto">
                When you participate in the Token Program, you're not just
                having a vacation - you're creating positive change while
                experiencing authentic Maldivian culture and connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-[#B7C5C7]/50 via-white to-[#E7E9E5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#075375] mb-6 animate-fade-in-up">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005E84] to-[#0A435C]">
                Token Experience
              </span>
            </h2>
            <p className="text-xl text-[#0A435C] max-w-3xl mx-auto animate-fade-in-up animate-delay-1">
              What makes our program unique and transformative
            </p>
            <div className="w-32 h-1 bg-[#005E84]/30 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Authentic Connection",
                description:
                  "Engage directly with local communities and form meaningful relationships that transcend typical tourist experiences",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
                image: "/travel-services/husen-siraaj-fsNMGdyQTUY-unsplash.jpg",
              },
              {
                title: "Sustainable Impact",
                description:
                  "Witness firsthand how your participation contributes to community development and environmental conservation efforts",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                image:
                  "/travel-services/muhammadh-saamy-C56yG0sQ3q8-unsplash.jpg",
              },
              {
                title: "Exclusive Access",
                description:
                  "Experience parts of the Maldives that few travelers ever see, with personalized guidance and insider knowledge",
                icon: (
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                ),
                image: "/travel-services/afrah-FylmOteiHWc-unsplash.jpg",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-[#005E84] to-[#0A435C] w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg transform -translate-y-20 group-hover:-translate-y-10 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/contact?subject=Token%20Program%20Details"
              className="inline-flex items-center text-[#005E84] hover:text-[#075375] font-medium transition-colors"
              onClick={scrollToTop}
            >
              <span>Discover more about our program</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/travel-services/cmophoto-net-EmVKKf3wUZQ-unsplash.jpg"
            alt="Maldives Experience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#005E84]/60 to-black/80"></div>
        </div>

        <div className="absolute inset-0 bg-[#005E84]/20 mix-blend-overlay"></div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20 animate-fade-in-up">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              <span className="tracking-wider">JOIN OUR MISSION</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fade-in-up animate-delay-1 tracking-tight leading-tight">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Transform
              </span>{" "}
              Your Travel Experience?
            </h2>

            <p className="text-xl text-white/90 mb-12 animate-fade-in-up animate-delay-2 leading-relaxed">
              Join the IsleKey Token Program today and be part of a movement
              that combines luxury travel with meaningful impact that lasts for
              generations.
            </p>

            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mb-10 animate-fade-in-up animate-delay-2">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-white/90 italic">
                "This program changed my perspective on travel. I'm not just a
                tourist anymore - I'm part of something meaningful."
              </p>
              <div className="mt-4 text-sm text-white/70">
                — Previous Token Program Participant
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-3">
              <Link
                to="/contact?subject=Token%20Program%20Interest"
                className="group bg-white text-[#075375] font-bold py-5 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                onClick={scrollToTop}
              >
                <span className="flex items-center justify-center">
                  Apply Now
                </span>
              </Link>

              <Link
                to="/hulhumeedhoo"
                className="group border-2 border-white text-white font-bold py-5 px-10 rounded-xl hover:bg-white hover:text-[#075375] transition-all transform hover:scale-105"
                onClick={scrollToTop}
              >
                Explore Hulhumeedhoo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TokenProgram;
