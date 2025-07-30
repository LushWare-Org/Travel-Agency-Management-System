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
  // const [date, setDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState(null);
  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  // Debounce for suggestions
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestionLoading(true);
    const handler = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.append('search', searchQuery);
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/activities/suggestions?${params.toString()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSuggestionLoading(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch activities from backend
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      // Only append type if not empty
      if (activityType && activityType !== '') params.append('type', activityType);
      // if (date) params.append('date', date);
      if (guests && guests !== '') params.append('guests', guests);
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

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, []);

  // Handle view details navigation
  const handleViewDetails = (activityId) => {
    setNavigating(true);
    setTimeout(() => {
      navigate(`/activities/${activityId}`);
    }, 200);
  };


  // Handle search/filter submit
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    // fetchActivities(); // Remove this line, fetching is handled by useEffect
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActivityType('');
    setGuests(''); // Set to empty string so it doesn't filter by guests
    setShowSuggestions(false);
    // fetchActivities(); // Remove this line, fetching is handled by useEffect
  };

  // Fetch activities when any filter changes
  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line
  }, [activityType, searchQuery, guests]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    fetchActivities();
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
        <form onSubmit={handleSearch} className="mt-6 mb-8 bg-white rounded-xl shadow p-6 flex flex-col gap-4 sm:flex-row sm:gap-6 items-stretch relative">
          {/* Search input */}
          <div className="w-full sm:w-[38%] relative flex flex-col">
            <label htmlFor="activity-search" className="sr-only">Search activities</label>
            <input
              id="activity-search"
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="border border-gray-300 focus:border-[#005E84] focus:ring-2 focus:ring-[#005E84]/20 rounded-lg px-3 py-2 w-full transition-all duration-150 outline-none text-sm h-11"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-48 overflow-y-auto">
                {suggestionLoading && (
                  <li className="px-3 py-2 text-gray-400">Loading...</li>
                )}
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Activity type select */}
          <div className="w-full sm:w-[22%] flex flex-col">
            <label htmlFor="activity-type" className="sr-only">Activity type</label>
            <select
              id="activity-type"
              value={activityType}
              onChange={e => setActivityType(e.target.value)}
              className="border border-gray-300 focus:border-[#005E84] focus:ring-2 focus:ring-[#005E84]/20 rounded-lg px-3 py-2 w-full transition-all duration-150 outline-none text-sm h-11 bg-white"
            >
              <option value="">All Types</option>
              <option value="cruises">Cruises</option>
              <option value="diving">Diving</option>
              <option value="island-tours">Island Tours</option>
              <option value="water-sports">Water Sports</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
          {/* Guests input */}
          <div className="w-full sm:w-[16%] flex flex-col">
            <label htmlFor="guests" className="sr-only">Guests</label>
            <input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={e => setGuests(e.target.value)}
              className="border border-gray-300 focus:border-[#005E84] focus:ring-2 focus:ring-[#005E84]/20 rounded-lg px-3 py-2 w-full transition-all duration-150 outline-none text-sm h-11"
              placeholder="Guests"
            />
          </div>
          {/* Search and Reset buttons */}
          <div className="w-full sm:w-[24%] flex flex-row gap-2 items-center justify-between sm:justify-end">
            <button
              type="submit"
              className="bg-[#005E84] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#075375] transition-all duration-150 h-11 w-full sm:w-auto text-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all duration-150 h-11 w-full sm:w-auto text-sm border border-gray-300"
            >
              Reset
            </button>
          </div>
        </form>

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
