import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Search, MapPin, Calendar, Users, Filter, DollarSign, RotateCcw, Clock, Star, Heart, Share2, ChevronDown } from 'lucide-react';

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

const ImageGallery = ({ searchQuery = '', passedCountry = '' }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toursRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const query = new URLSearchParams(location.search);
  const searchTerm = searchQuery || query.get('search') || '';
  const nights = query.get('nights') || '';
  const country = passedCountry || query.get('country') || '';
  const market = query.get('market') || '';
  const minPrice = query.get('minPrice') || '';
  const maxPrice = query.get('maxPrice') || '';
  // Use the currency stored in localStorage for consistency.
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  const [search, setSearch] = useState(searchTerm);
  const [searchNights, setSearchNights] = useState(nights);
  const [searchCountry, setSearchCountry] = useState(country);
  const [searchMarket, setSearchMarket] = useState(market);
  const [exchangeRates, setExchangeRates] = useState({});
  const [searchMinPrice, setSearchMinPrice] = useState(minPrice);
  const [searchMaxPrice, setSearchMaxPrice] = useState(maxPrice);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { isMobile, isTablet } = useDeviceType();

  // Convert price using selectedCurrency.
  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[selectedCurrency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[selectedCurrency]).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/tours');
        const fetchedTours = response.data;
        console.log('Fetched tours:', fetchedTours.length, fetchedTours); // Debug log
        setTours(fetchedTours);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tours:', err);
        setError('Failed to fetch tours. Please try again later.');
        setLoading(false);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
    fetchTours();
  }, []);

  useEffect(() => {
    setSearch(searchTerm);
    setSearchNights(nights);
    setSearchCountry(country);
    setSearchMarket(market);
    setSearchMinPrice(minPrice);
    setSearchMaxPrice(maxPrice);
  }, [searchTerm, nights, country, market, minPrice, maxPrice]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const marketMapping = {
    1: 'Indian',
    2: 'Chinese',
    3: 'Asian',
    4: 'Middle East',
    5: 'Russia and CIS',
    6: 'Rest of the World',
  };

  const marketMappingInverse = Object.fromEntries(
    Object.entries(marketMapping).map(([key, value]) => [value, Number(key)])
  );

  const localToUSD = (localPrice) => {
    if (!exchangeRates[selectedCurrency]) return localPrice;
    return localPrice / exchangeRates[selectedCurrency];
  };

  const filteredTours = tours.filter((tour) => {
    const searchNightsValue = searchNights ? parseInt(searchNights, 10) : null;
    const currentDate = new Date();
    const tourExpiryDate = new Date(tour.expiry_date);
    if (tourExpiryDate < currentDate) {
      return false;
    }
    const marketMatch =
      !searchMarket ||
      (Array.isArray(tour.markets) && tour.markets.includes(Number(searchMarket)));
    
    const minValUSD = searchMinPrice ? localToUSD(parseFloat(searchMinPrice)) : null;
    const maxValUSD = searchMaxPrice ? localToUSD(parseFloat(searchMaxPrice)) : null;
    const hasMatchingNights =
      !searchNightsValue ||
      (tour.nights && Object.keys(tour.nights).includes(searchNightsValue.toString()));
    
    return (
      (!search || tour.title.toLowerCase().includes(search.toLowerCase())) &&
      hasMatchingNights &&
      (!minValUSD || tour.price >= minValUSD) &&
      (!maxValUSD || tour.price <= maxValUSD) &&
      (!searchCountry || tour.country.toLowerCase().includes(searchCountry.toLowerCase())) &&
      marketMatch
    );
  });

  useEffect(() => {
    console.log('Filtered tours:', filteredTours.length, filteredTours);
  }, [filteredTours]);

  // Tours for dropdown 
  const dropdownTours = tours.filter((tour) => {
    const currentDate = new Date();
    const tourExpiryDate = new Date(tour.expiry_date);
    if (tourExpiryDate < currentDate) {
      return false;
    }
    return !search || tour.title.toLowerCase().includes(search.toLowerCase());
  });

  // Debug dropdown tours
  useEffect(() => {
    console.log('Dropdown tours:', dropdownTours.length, dropdownTours);
  }, [dropdownTours]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setIsDropdownOpen(false);
    if (toursRef.current) {
      toursRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleReset = () => {
    setSearch('');
    setSearchNights('');
    setSearchCountry('');
    setSearchMarket('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    setIsDropdownOpen(false);
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  const handleTourSelect = (tourTitle) => {
    setSearch(tourTitle);
    setIsDropdownOpen(false);
    if (toursRef.current) {
      toursRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-platinum-500">
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-lapis_lazuli-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-indigo_dye-400 font-medium text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading amazing tours...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-platinum-500">
        <motion.div 
          className="text-center p-8 bg-platinum-500 rounded-3xl shadow-xl max-w-md border border-platinum-400"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚠️
          </motion.div>
          <h3 className="text-xl font-semibold text-indigo_dye-500 mb-2">Oops! Something went wrong</h3>
          <p className="text-ash_gray-400">{error}</p>
        </motion.div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/1234567890`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-platinum-500 p-4 sm:p-6 lg:p-8">
      {/* Search Section */}
      <motion.div 
        className="bg-platinum-500 rounded-3xl shadow-xl p-6 sm:p-8 mb-8 border border-platinum-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo_dye-500 mb-2">
            Find Your Perfect Tour
          </h2>
          <p className="text-ash_gray-400 text-sm sm:text-base">Search and filter through our amazing tour packages</p>
        </motion.div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit}>
          <motion.div 
            className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-6 gap-4'} mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Search Input with Dropdown */}
            <div className={`${isMobile ? 'col-span-1' : 'md:col-span-2'} relative`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-ash_gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for packages..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-12 pr-4 py-3 border border-platinum-400 rounded-xl focus:ring-2 focus:ring-lapis_lazuli-500 focus:border-lapis_lazuli-500 transition-all duration-300 bg-platinum-500"
              />
              <AnimatePresence>
                {isDropdownOpen && dropdownTours.length > 0 && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 w-full mt-2 bg-platinum-500 border border-platinum-400 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                  >
                    <ul>
                      {dropdownTours.map((tour, index) => (
                        <motion.li
                          key={tour._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          className="px-4 py-3 text-sm hover:bg-ash_gray-500 hover:text-lapis_lazuli-500 cursor-pointer transition-all duration-200 border-b border-platinum-400 last:border-b-0"
                          onClick={() => handleTourSelect(tour.title)}
                        >
                          {tour.title}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nights */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-ash_gray-400" />
              </div>
              <input
                type="text"
                placeholder="Nights"
                value={searchNights}
                onChange={(e) => setSearchNights(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-platinum-400 rounded-xl focus:ring-2 focus:ring-lapis_lazuli-500 focus:border-lapis_lazuli-500 transition-all duration-300 bg-platinum-500"
              />
            </div>

            {/* Country */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-ash_gray-400" />
              </div>
              <input
                type="text"
                placeholder="Country of Travel"
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-platinum-400 rounded-xl focus:ring-2 focus:ring-lapis_lazuli-500 focus:border-lapis_lazuli-500 transition-all duration-300 bg-platinum-500"
              />
            </div>

            {/* Market/Region */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-ash_gray-400" />
              </div>
              <select
                value={searchMarket}
                onChange={(e) => setSearchMarket(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-platinum-400 rounded-xl focus:ring-2 focus:ring-lapis_lazuli-500 focus:border-lapis_lazuli-500 transition-all duration-300 appearance-none bg-platinum-500"
              >
                <option value="">Your Region</option>
                {Object.entries(marketMapping).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-ash_gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-lapis_lazuli-500 to-indigo_dye-500 text-platinum-500 px-6 py-3 rounded-xl hover:from-lapis_lazuli-600 hover:to-indigo_dye-600 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
            >
              <Search className="h-5 w-5" />
              <span>Search Tours</span>
            </motion.button>
          </motion.div>

          {/* Price Range Row */}
          <motion.div 
            className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-4'} mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Min Price */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-ash_gray-400" />
              </div>
              <input
                type="text"
                placeholder="Min Price"
                value={searchMinPrice}
                onChange={(e) => setSearchMinPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-platinum-400 rounded-xl focus:ring-2 focus:ring-lapis_lazuli-500 focus:border-lapis_lazuli-500 transition-all duration-300 bg-platinum-500"
              />
            </div>

            {/* Max Price */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-ash_gray-400" />
              </div>
              <input
                type="text"
                placeholder="Max Price"
                value={searchMaxPrice}
                onChange={(e) => setSearchMaxPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-platinum-400 rounded-xl focus:ring-2 focus:ring-lapis_lazuli-500 focus:border-lapis_lazuli-500 transition-all duration-300 bg-platinum-500"
              />
            </div>

            {/* Reset Button */}
            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-ash_gray-500 to-ash_gray-600 text-platinum-500 px-6 py-3 rounded-xl hover:from-ash_gray-600 hover:to-ash_gray-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset Filters</span>
            </motion.button>
          </motion.div>
        </form>

        {/* Quick Filters */}
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span className="text-sm text-ash_gray-400 mr-2 self-center">Quick filters:</span>
          {['Honeymoon', 'Family', 'Adventure', 'Luxury', 'Budget-Friendly'].map((filter, index) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm bg-ash_gray-500 text-lapis_lazuli-500 rounded-full hover:bg-lapis_lazuli-500 hover:text-platinum-500 transition-all duration-300 border border-platinum-400 font-medium"
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Tours Grid Section */}
      <motion.div 
        ref={toursRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {/* Section Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo_dye-500 mb-2">
            Available Tours ({filteredTours.length})
          </h2>
          <p className="text-ash_gray-400 text-sm sm:text-base">
            Discover amazing destinations and experiences
          </p>
        </motion.div>
        
        {/* Tours Grid - Activity Card Style */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour._id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/tours/${tour._id}`)}
            >
              <div className="rounded-3xl bg-platinum-500 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-platinum-400">
                <div className="relative h-64 sm:h-72">
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo_dye-500/70 to-transparent z-10" />
                  <motion.img
                    src={tour.tour_image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ scale: 1.05 }}
                  />
                  
                  {/* Featured Badge */}
                  {tour.featured && (
                    <motion.div 
                      className="absolute top-3 left-3 bg-lapis_lazuli-500 text-platinum-500 px-3 py-1 text-sm font-medium rounded-full z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      Featured
                    </motion.div>
                  )}

                  {/* Duration Badge */}
                  <motion.div 
                    className="absolute top-3 right-3 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ash_gray-500/90 text-platinum-500 backdrop-blur-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {tour.nights && typeof tour.nights === 'object' && Object.keys(tour.nights).length > 0
                        ? `${Object.keys(tour.nights)[0]} Days`
                        : 'N/A'}
                    </span>
                  </motion.div>

                  {/* Bottom Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <motion.h4 
                      className="font-bold text-xl text-platinum-500 line-clamp-2 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      {tour.title}
                    </motion.h4>
                    <motion.p 
                      className="text-platinum-400 text-sm flex items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <MapPin className="h-4 w-4 mr-1 text-platinum-500" />
                      {tour.country || 'Destination'}
                    </motion.p>
                  </div>
                </div>

                <motion.div 
                  className="p-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {/* Description */}
                  <p className="text-indigo_dye-400 text-sm mb-4 line-clamp-2">
                    {tour.short_description || tour.description || 'Discover amazing experiences and create unforgettable memories.'}
                  </p>
                  
                  {/* Duration Info */}
                  {tour.nights && typeof tour.nights === 'object' && Object.keys(tour.nights).length > 0 && (
                    <div className="flex items-center mb-3 text-ash_gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {Object.keys(tour.nights)[0]} Days / {Object.keys(tour.nights)[0]} Nights
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-platinum-400">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <span className="text-xl font-bold text-lapis_lazuli-500">
                          {selectedCurrency} {tour.price && !isNaN(tour.price) ? convertPrice(tour.price) : '0.00'}
                        </span>
                        <span className="text-sm text-ash_gray-400 ml-1">/person</span>
                      </div>
                      {tour.oldPrice && !isNaN(tour.oldPrice) && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-ash_gray-400 line-through">
                            {selectedCurrency} {convertPrice(tour.oldPrice)}
                          </span>
                          <span className="text-xs bg-lapis_lazuli-500 text-platinum-500 px-2 py-1 rounded-full font-medium">
                            SAVE {selectedCurrency} {convertPrice(tour.oldPrice - tour.price)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <motion.div 
                      className="bg-lapis_lazuli-500 hover:bg-lapis_lazuli-600 rounded-full px-4 py-2 transition-colors duration-300 flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-platinum-500 font-medium text-sm">View Details</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏝️
            </motion.div>
            <h3 className="text-xl font-semibold text-indigo_dye-500 mb-2">
              No tours found matching your criteria
            </h3>
            <p className="text-ash_gray-400 mb-6">
              Try adjusting your search filters to discover more amazing destinations
            </p>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-lapis_lazuli-500 to-indigo_dye-500 text-platinum-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageGallery;