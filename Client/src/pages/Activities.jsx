import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import ImageGallery from '../Components/ImageGallery';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const Activities = () => {
  const { isMobile, isTablet } = useDeviceType();
  const { state } = useLocation();
  const navigate = useNavigate();
  const searchTerm = state?.searchTerm || null;
  const titlePassed = state?.title || null;

  const [searchQuery, setSearchQuery] = useState('');
  const [activityType, setActivityType] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('1');

  // Example: handle booking (no backend, just UI)
  const handleBooking = () => {
    alert('Activity booked!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <header
          className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920')",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold drop-shadow-md">
              Maldives Activities & Experiences
            </h1>
            <p className="text-xs sm:text-sm mt-2 drop-shadow-md max-w-md px-4">
              Book unique activities and adventures for your Maldives holiday
            </p>
          </div>
        </header>

        {/* Booking Form */}
        <section className="mt-6 mb-8 bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/3"
          />
          <select
            value={activityType}
            onChange={e => setActivityType(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/4"
          >
            <option value="">All Types</option>
            <option value="water">Water Sports</option>
            <option value="excursion">Excursions</option>
            <option value="wellness">Wellness & Spa</option>
            <option value="dining">Dining Experiences</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/4"
          />
          <input
            type="number"
            min="1"
            value={guests}
            onChange={e => setGuests(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-1/6"
            placeholder="Guests"
          />
          <button
            onClick={handleBooking}
            className="bg-[#005E84] text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#075375] transition"
          >
            Book Activity
          </button>
        </section>

        {/* Activities List Section */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example activities - replace with your own data or fetch from API */}
            {[
              { id: 1, name: 'Snorkeling Adventure', type: 'water', description: 'Explore vibrant coral reefs and marine life.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
              { id: 2, name: 'Island Excursion', type: 'excursion', description: 'Visit local islands and experience Maldivian culture.', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80' },
              { id: 3, name: 'Spa & Wellness', type: 'wellness', description: 'Relax with a luxury spa treatment.', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80' },
              { id: 4, name: 'Sunset Dining', type: 'dining', description: 'Enjoy a romantic dinner by the beach.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80' },
            ]
              .filter(a => !activityType || a.type === activityType)
              .filter(a => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(activity => (
                <div key={activity.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                  <img src={activity.image} alt={activity.name} className="h-40 w-full object-cover rounded-lg mb-3" />
                  <h2 className="text-lg font-bold mb-1 text-[#005E84]">{activity.name}</h2>
                  <p className="text-sm text-gray-600 mb-2 text-center">{activity.description}</p>
                  <button
                    onClick={handleBooking}
                    className="bg-[#005E84] text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-[#075375] transition"
                  >
                    Book Now
                  </button>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Activities;
