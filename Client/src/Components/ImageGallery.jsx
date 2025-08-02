import React, { useState, useEffect, useRef } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Search, MapPin, Calendar, Users, Filter, DollarSign, RotateCcw, Clock, Star, Heart, Share2 } from 'lucide-react';

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
      <div className="flex justify-center items-center min-h-screen bg-[#E7E9E5]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#005E84] border-t-transparent"></div>
          <p className="text-[#B7C5C7] font-medium">Loading amazing tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#E7E9E5]">
        <div className="text-center p-8 bg-[#E7E9E5] rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-[#0A435C] mb-2">Oops! Something went wrong</h3>
          <p className="text-[#B7C5C7]">{error}</p>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/1234567890`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '65vh', padding: '20px 30px', backgroundColor: '#E7E9E5' }}>
      {/* Search Section */}
      <div className="bg-[#E7E9E5] rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 md:mb-10 border border-[#B7C5C7]">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#005E84] to-[#075375] bg-clip-text text-transparent mb-2">
            Find Your Perfect Tour
          </h2>
          <p className="text-[#B7C5C7] text-sm">Search and filter through our amazing tour packages</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit}>
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-6 gap-4'} mb-6`}>
            {/* Search Input with Dropdown */}
            <div className={`${isMobile ? 'col-span-1' : 'md:col-span-2'} relative`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
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
                className="w-full pl-10 pr-4 py-3 border border-[#B7C5C7] rounded-lg focus:ring-[#005E84] focus:border-[#005E84] transition-colors"
              />
              {isDropdownOpen && dropdownTours.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-[#B7C5C7] rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <ul>
                    {dropdownTours.map((tour) => (
                      <li
                        key={tour._id}
                        className="px-4 py-2 text-sm hover:bg-[#E7E9E5] hover:text-[#005E84] cursor-pointer transition-colors"
                        onClick={() => handleTourSelect(tour.title)}
                      >
                        {tour.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Nights */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Nights"
                value={searchNights}
                onChange={(e) => setSearchNights(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#B7C5C7] rounded-lg focus:ring-[#005E84] focus:border-[#005E84] transition-colors"
              />
            </div>

            {/* Country */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Country of Travel"
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#B7C5C7] rounded-lg focus:ring-[#005E84] focus:border-[#005E84] transition-colors"
              />
            </div>

            {/* Market/Region */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={searchMarket}
                onChange={(e) => setSearchMarket(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-[#B7C5C7] rounded-lg focus:ring-[#005E84] focus:border-[#005E84] transition-colors appearance-none bg-white"
              >
                <option value="">Your Region</option>
                {Object.entries(marketMapping).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#005E84] to-[#075375] text-white px-6 py-3 rounded-lg hover:from-[#005E84] hover:to-[#0A435C] transition-all font-semibold flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Tours</span>
            </button>
          </div>

          {/* Price Range Row */}
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-4'} mb-6`}>
            {/* Min Price */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Min Price"
                value={searchMinPrice}
                onChange={(e) => setSearchMinPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#B7C5C7] rounded-lg focus:ring-[#005E84] focus:border-[#005E84] transition-colors"
              />
            </div>

            {/* Max Price */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Max Price"
                value={searchMaxPrice}
                onChange={(e) => setSearchMaxPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#B7C5C7] rounded-lg focus:ring-[#005E84] focus:border-[#005E84] transition-colors"
              />
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="bg-gradient-to-r from-[#B7C5C7] to-[#657d81] text-white px-6 py-3 rounded-lg hover:from-[#657d81] hover:to-[#657d81] transition-all font-semibold flex items-center justify-center space-x-2"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </form>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-[#B7C5C7] mr-2">Quick filters:</span>
          {['Honeymoon', 'Family', 'Adventure', 'Luxury', 'Budget-Friendly'].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 text-xs bg-[#E7E9E5] text-[#005E84] rounded-full hover:bg-[#B7C5C7] transition-colors border border-[#B7C5C7]"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid Section - Original Container */}
      <div ref={toursRef}>
        {/* Section Header - Original Style */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: '#0A435C',
              fontSize: '24px',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              mb: 1
            }}
          >
            Available Tours ({filteredTours.length})
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#B7C5C7',
              fontSize: '14px'
            }}
          >
            Discover amazing destinations and experiences
          </Typography>
        </Box>
        
        {/* Tours Grid - Keep Original Layout */}
        <Grid container spacing={5}>
          {filteredTours.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <div className="group">
                <Card
                  sx={{
                    borderRadius: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.15)',
                      borderColor: 'rgba(99, 102, 241, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        width: '100%',
                        paddingTop: '100%', 
                        backgroundImage: `url(${item.tour_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                      onClick={() => navigate(`/tours/${item._id}`)}
                    />
                    
                    {/* Modern Duration Badge - Original Style */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        padding: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '14px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {item.nights && typeof item.nights === 'object' && Object.keys(item.nights).length > 0
                          ? `${Object.keys(item.nights)[0]} Days/${Object.keys(item.nights)[0]} Nights`
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ 
                    backgroundColor: '#fff', 
                    padding: '24px',
                    background: 'linear-gradient(145deg, #E7E9E5 0%, #EDEEEB 100%)',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Title with Modern Typography */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} sx={{ minHeight: '60px' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '20px',
                          color: '#0A435C',
                          lineHeight: 1.3,
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                    
                    {/* Price Section - Original Style with Modern Look */}
                    <Box mb={3}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#0A435C',
                          fontWeight: 700,
                          fontSize: '18px',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
                        }}
                        gutterBottom
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <span style={{ color: '#005E84' }}>
                          {selectedCurrency} {item.price && !isNaN(item.price) ? convertPrice(item.price) : ''}
                        </span>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                          {item.oldPrice && !isNaN(item.oldPrice) && (
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ 
                                textDecoration: 'line-through', 
                                color: '#B7C5C7',
                                fontSize: '14px'
                              }}
                            >
                              {selectedCurrency} {convertPrice(item.oldPrice)}
                            </Typography>
                          )}
                          {item.oldPrice && !isNaN(item.oldPrice) && (
                            <Typography 
                              component="span" 
                              variant="body2" 
                              sx={{
                                color: '#fff',
                                background: 'linear-gradient(135deg, #075375 0%, #0A435C 100%)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                textTransform: 'uppercase'
                              }}
                            >
                              SAVE {selectedCurrency} {convertPrice(item.oldPrice - item.price)}
                            </Typography>
                          )}
                        </Box>
                      </Typography>
                    </Box>
                    
                    {/* Action Buttons - Original Style with Modern Look */}
                    <Box display="flex" gap={2} mt="auto" sx={{ pt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        sx={{
                          borderColor: '#005E84',
                          color: '#005E84',
                          padding: '10px 20px',
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '14px',
                          border: '2px solid #005E84',
                          '&:hover': {
                            backgroundColor: '#005E84',
                            color: '#fff',
                            borderColor: '#005E84',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 16px rgba(0, 94, 132, 0.3)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                        onClick={handleWhatsAppClick}
                      >
                        Chat
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #005E84 0%, #075375 100%)',
                          color: '#fff',
                          padding: '10px 0',
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(0, 94, 132, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #005E84 0%, #0A435C 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(0, 94, 132, 0.4)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => navigate(`/tours/${item._id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Empty State - Original Style */}
        {filteredTours.length === 0 && (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={8}
            textAlign="center"
          >
            <Typography variant="h6" color="text.secondary" mb={2}>
              No tours found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Try adjusting your search filters
            </Typography>
            <Button
              onClick={handleReset}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #005E84 0%, #075375 100%)',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              Clear all filters
            </Button>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default ImageGallery;