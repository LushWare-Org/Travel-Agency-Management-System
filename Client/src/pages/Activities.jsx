import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ActivityCard from '../Components/ActivityCard';
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
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch activities from backend
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (activityType) params.append('type', activityType);
        // You can add more filters if needed
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/activities?${params.toString()}`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        if (data.success) {
          setActivities(data.data);
        } else {
          setError(data.error || 'Failed to fetch activities');
        }
      } catch (err) {
        setError('Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [searchQuery, activityType]);

  // Handle view details navigation
  const handleViewDetails = (activityId) => {
    setNavigating(true);
    // Small delay to show spinner, then navigate
    setTimeout(() => {
      navigate(`/activities/${activityId}`);
    }, 200);
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
            onClick={handleViewDetails}
            className="bg-[#005E84] text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#075375] transition"
          >
            View Details
          </button>
        </section>

        {/* Activities List Section */}
        <div className="mt-4 sm:mt-6 lg:mt-8 min-h-[300px]">
          {(loading || navigating) ? (
            <div className="flex justify-center items-center h-60">
              <div
                className="animate-spin rounded-full h-16 w-16 border-4 border-lapis_lazuli-500 border-t-indigo_dye-500 border-b-ash_gray-500 border-r-platinum-500 bg-platinum-500 shadow-lg"
                style={{
                  borderTopColor: '#0A435C', // indigo_dye 2
                  borderBottomColor: '#B7C5C7', // ash_gray
                  borderLeftColor: '#005E84', // lapis_lazuli
                  borderRightColor: '#E7E9E5', // platinum
                  backgroundColor: '#E7E9E5', // platinum
                }}
              ></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-ash_gray-400">No activities found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map(activity => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                  onClick={() => handleViewDetails(activity._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Activities;
