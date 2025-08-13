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
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.islekeyholidays.com'}/api/activities/suggestions?${params.toString()}`);
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
        `${import.meta.env.VITE_API_URL || 'https://api.islekeyholidays.com'}/api/activities?${params.toString()}`,
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

        {/* Enhanced Filtering Section */}
        <div className="mt-6 mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Filter Header */}
          <div className="bg-gradient-to-r from-[#005E84] to-[#0A435C] px-6 py-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Find Your Perfect Activity
            </h2>
            <p className="text-blue-100 text-sm mt-1">Search and filter activities to match your preferences</p>
          </div>

          {/* Filter Form */}
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-end">
              {/* Search Input with Icon */}
              <div className="lg:col-span-5 relative">
                <label htmlFor="activity-search" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#005E84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Activities
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="activity-search"
                    type="text"
                    placeholder="Try 'diving', 'sunset cruise', 'snorkeling'..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 focus:border-[#005E84] focus:ring-2 focus:ring-[#005E84]/10 rounded-xl transition-all duration-200 outline-none text-sm placeholder-gray-400 bg-gray-50 focus:bg-white"
                    autoComplete="off"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Enhanced Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {suggestionLoading && (
                      <div className="px-4 py-3 text-gray-400 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#005E84] border-t-transparent"></div>
                        Loading suggestions...
                      </div>
                    )}
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 hover:bg-gradient-to-r hover:from-[#005E84]/5 hover:to-[#0A435C]/5 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all duration-150 flex items-center gap-2"
                        onMouseDown={() => handleSuggestionClick(s)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity Type Select */}
              <div className="lg:col-span-3">
                <label htmlFor="activity-type" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#005E84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Activity Type
                  </span>
                </label>
                <select
                  id="activity-type"
                  value={activityType}
                  onChange={e => setActivityType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#005E84] focus:ring-2 focus:ring-[#005E84]/10 rounded-xl transition-all duration-200 outline-none text-sm bg-gray-50 focus:bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="cruises">🚢 Cruises</option>
                  <option value="diving">🤿 Diving & Snorkeling</option>
                  <option value="island-tours">🏝️ Island Tours</option>
                  <option value="water-sports">🏄 Water Sports</option>
                  <option value="adventure">⛰️ Adventure</option>
                  <option value="cultural">🏛️ Cultural</option>
                  <option value="wellness">🧘 Wellness & Spa</option>
                </select>
              </div>

              {/* Guests Input */}
              <div className="lg:col-span-2">
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#005E84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Guests
                  </span>
                </label>
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#005E84] focus:ring-2 focus:ring-[#005E84]/10 rounded-xl transition-all duration-200 outline-none text-sm bg-gray-50 focus:bg-white"
                  placeholder="1"
                />
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-2 flex flex-col sm:flex-row gap-2 w-full">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#005E84] to-[#0A435C] text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-[#075375] hover:to-[#0d4a60] transition-all duration-200 flex items-center justify-center gap-2 text-sm min-w-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 bg-white text-gray-600 px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm min-w-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || activityType || (guests && guests !== '1')) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#005E84]/10 text-[#005E84] rounded-full text-xs font-medium">
                      Search: "{searchQuery}"
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-[#0A435C]"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {activityType && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#005E84]/10 text-[#005E84] rounded-full text-xs font-medium">
                      Type: {activityType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      <button
                        type="button"
                        onClick={() => setActivityType('')}
                        className="ml-1 hover:text-[#0A435C]"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {guests && guests !== '1' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#005E84]/10 text-[#005E84] rounded-full text-xs font-medium">
                      Guests: {guests}
                      <button
                        type="button"
                        onClick={() => setGuests('1')}
                        className="ml-1 hover:text-[#0A435C]"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

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
