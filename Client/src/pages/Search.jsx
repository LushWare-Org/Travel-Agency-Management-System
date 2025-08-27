// src/pages/Search.jsx
import React, { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HotelCard from '../Components/HotelCard';
import Footer from '../Components/Footer';
import { countries } from '../assets/nationalities';

// Safe object property access helper
const safeAccess = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, part) => (acc && acc[part] ? acc[part] : null), obj);
};

// INITIAL SEARCH PARAMETERS
const INITIAL_PARAMS = {
  destination: '',
  checkIn: null,
  checkOut: null,
  nationality: '',
  mealPlan: '',
  rooms: 1,
  adults: 2,
  children: 0,
  childrenAges: [],
  priceRange: [0, 0],
  starRating: 0,
  sortBy: 'price_low',
};

// Update room price calculation
const getRoomPrice = (room, nationality) => {
  if (!room) return 0;
  const surcharge = safeAccess(room, 'prices')?.find(p => p?.country === nationality)?.price || 0;
  return Number(room.basePrice || 0) + surcharge;
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [hotels, setHotels] = useState([]);          // raw hotels list
  const [allRooms, setAllRooms] = useState([]);      // raw rooms list
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [globalPriceRange, setGlobalPriceRange] = useState([0, 0]);
  const [searchParams, setSearchParams] = useState(INITIAL_PARAMS);
  const [favorites, setFavorites] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  // New state for destination dropdown
  const [destinationSearch, setDestinationSearch] = useState('');
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const datePickerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (showCountryDropdown && !e.target.closest('.nationality-dropdown')) {
        setShowCountryDropdown(false);
      }
      if (showDestinationDropdown && !e.target.closest('.destination-dropdown')) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.addEventListener('mousedown', handleClickOutside);
  }, [showCountryDropdown, showDestinationDropdown]);

  // Initial fetch of hotels + rooms
  useEffect(() => {
    // Check for query parameter in URL
    const query = new URLSearchParams(location.search).get('query');
    
    if (query) {
      setSearchParams(prev => ({
        ...prev,
        destination: query
      }));
      setDestinationSearch(query);
    }
    
    // Check for location state (from header search)
    if (location.state?.query) {
      setSearchParams(prev => ({
        ...prev,
        destination: location.state.query
      }));
      setDestinationSearch(location.state.query);
    }

    Promise.all([
      axios.get('/hotels', { withCredentials: true }),
      axios.get('/rooms', { withCredentials: true }),
    ])
      .then(([hotelsRes, roomsRes]) => {
        const validHotels = (hotelsRes?.data || []).filter(h => h && h._id);
        const validRooms = (roomsRes?.data || []).filter(r => r && (typeof r.hotel === 'object' ? r.hotel?._id : r.hotel));
        
        setHotels(validHotels);
        setAllRooms(validRooms);

        // compute initial global price bounds (no nationality)
        const prices = validRooms.map(r => getRoomPrice(r, ''));
        const validPrices = prices.filter(p => isFinite(p) && !isNaN(p) && p > 0);
        const minP = Math.floor(Math.min(...validPrices)) || 0;
        const maxP = Math.ceil(Math.max(...validPrices)) || 1000;
        setGlobalPriceRange([minP, maxP]);
        setSearchParams(sp => ({ ...sp, priceRange: [minP, maxP] }));

        // initial results: all hotels with their rooms
        const enriched = validHotels.map(h => {
          const hotelRooms = validRooms.filter(r => {
            if (!r || !h || !h._id) return false;
            const hotelId = typeof r.hotel === 'object' ? safeAccess(r, 'hotel._id') : r.hotel;
            return hotelId === h._id;
          });
          return { ...h, rooms: hotelRooms };
        });
        
        // Apply initial filtering if query exists
        const searchTerm = query || location.state?.query || '';
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const filtered = enriched.filter(h => h && (h.name || '').toLowerCase().includes(q));
          console.log(`Found ${filtered.length} hotels matching "${q}"`);
          setSearchResults(filtered);
        } else {
          setSearchResults(enriched);
        }
      })
      .catch(err => {
        console.error('Load error', err);
        alert('Could not load Resorts.');
      })
      .finally(() => setLoading(false));
  }, [location]);

  // Recompute global bounds & re-run search when nationality changes
  useEffect(() => {
    if (!allRooms.length) return;
    
    const nat = searchParams.nationality;
    const prices = allRooms.map(r => getRoomPrice(r, nat));
    const validPrices = prices.filter(p => isFinite(p) && !isNaN(p) && p > 0);
    
    if (validPrices.length) {
      const minP = Math.floor(Math.min(...validPrices));
      const maxP = Math.ceil(Math.max(...validPrices));
      setGlobalPriceRange([minP, maxP]);
      setSearchParams(sp => ({ ...sp, priceRange: [minP, maxP] }));
      handleSearch();
    }
  }, [searchParams.nationality, allRooms]);

  // Calculate price range slider styles
  const calculatePriceRangeStyles = () => {
    // Handle edge case where global range is zero or undefined
    if (!globalPriceRange || 
        globalPriceRange[0] === undefined || 
        globalPriceRange[1] === undefined ||
        globalPriceRange[1] <= globalPriceRange[0]) {
      return { width: '100%', marginLeft: '0%' };
    }

    const totalRange = globalPriceRange[1] - globalPriceRange[0];
    const selectedRange = searchParams.priceRange[1] - searchParams.priceRange[0];
    const leftOffset = searchParams.priceRange[0] - globalPriceRange[0];
    
    // Calculate percentages with safety checks
    const widthPct = Math.min(100, Math.max(0, (selectedRange / totalRange) * 100));
    const leftPct = Math.min(100, Math.max(0, (leftOffset / totalRange) * 100));
    
    return {
      width: `${widthPct}%`,
      marginLeft: `${leftPct}%`
    };
  };

  // Update a simple param
  const handleInputChange = (key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (
      (searchParams.checkIn && searchParams.checkOut) &&
      (
        !dateRange[0] ||
        !dateRange[1] ||
        (dateRange[0] && searchParams.checkIn.getTime() !== dateRange[0].getTime()) ||
        (dateRange[1] && searchParams.checkOut.getTime() !== dateRange[1].getTime())
      )
    ) {
      setDateRange([
        searchParams.checkIn || null,
        searchParams.checkOut || null
      ]);
    }
    if (!searchParams.checkIn && !searchParams.checkOut && (dateRange[0] || dateRange[1])) {
      setDateRange([null, null]);
    }
  }, [searchParams.checkIn, searchParams.checkOut]);

  const handleChildrenChange = value => {
    const count = parseInt(value, 10) || 0;
    setSearchParams(prev => ({
      ...prev,
      children: count,
      childrenAges: Array(count).fill(0),
    }));
  };

  const handleChildAgeChange = (idx, value) => {
    const ages = [...searchParams.childrenAges];
    ages[idx] = Number(value);
    setSearchParams(prev => ({ ...prev, childrenAges: ages }));
  };

  const handlePriceRangeChange = (min, max) => {
    if (min > max) min = max;
    min = Math.max(globalPriceRange[0], Math.min(globalPriceRange[1], min));
    max = Math.max(globalPriceRange[0], Math.min(globalPriceRange[1], max));
    setSearchParams(prev => ({ ...prev, priceRange: [min, max] }));
  };

  // Main search + filter + sort
  const handleSearch = async () => {
    console.log("Searching with parameters:", searchParams);
    
    const {
      destination,
      checkIn,
      checkOut,
      nationality,
      mealPlan,
      rooms,
      adults,
      children,
      priceRange,
      starRating,
      sortBy,
    } = searchParams;

    setLoading(true);
    
    try {
      if (checkIn && checkOut) {
        // Validate dates
        if (checkIn >= checkOut) {
          alert("Check-out date must be after check-in date");
          setLoading(false);
          return;
        }
        
        // Get hotels first to apply hotel-level filters
        let filteredHotels = (hotels || []).filter(h => {
          if (!h || !h._id) return false;
          if (destination && !String(h.name || '').toLowerCase().includes(destination.toLowerCase())) return false;
          if (mealPlan && h.mealPlans) {
            const hasPlan = (h.mealPlans || []).some(p =>
              String(p?.planName || p?.name || '').toLowerCase() === mealPlan.toLowerCase()
            );
            if (!hasPlan) return false;
          }
          if (starRating && Number(h.starRating || 0) < starRating) return false;
          return true;
        });

        // Get available rooms from API for each hotel
        const availableHotels = await Promise.all(
          filteredHotels.map(async (hotel) => {
            if (!hotel || !hotel._id) return null;
            
            try {
              const response = await axios.get(`/rooms/availability`, {
                params: {
                  hotelId: hotel._id,
                  checkIn: checkIn.toISOString(),
                  checkOut: checkOut.toISOString(),
                  nationality: nationality,
                },
              });
              
              // Apply room-level filters
              let validRooms = (response?.data || []).filter(r => r && r._id);
              
              // Apply occupancy filter
              validRooms = validRooms.filter(r => {
                if (!r || !r.maxOccupancy) return false;
                return (Number(r.maxOccupancy?.adults || 0) >= adults && 
                      Number(r.maxOccupancy?.children || 0) >= children);
              });
              
              // Apply price filter
              validRooms = validRooms.map(r => ({
                ...r,
                computedPrice: getRoomPrice(r, nationality),
              }));
              
              if (priceRange[0] !== globalPriceRange[0] || priceRange[1] !== globalPriceRange[1]) {
                validRooms = validRooms.filter(r =>
                  r.computedPrice >= priceRange[0] && r.computedPrice <= priceRange[1]
                );
              }
              
              // Check rooms count
              if (rooms !== INITIAL_PARAMS.rooms && validRooms.length < rooms) {
                validRooms = [];
              }
              
              return {
                ...hotel,
                rooms: validRooms,
                _lowest: validRooms.length
                  ? Math.min(...validRooms.map(r => r.computedPrice))
                  : Infinity,
              };
            } catch (error) {
              console.error(`Error fetching rooms for hotel ${hotel._id}:`, error);
              return null;
            }
          })
        );
        
        // Filter hotels with available rooms and remove nulls
        let enriched = availableHotels.filter(h => h && h.rooms && h.rooms.length > 0);
        
        // Sort hotels with null checks
        enriched.sort((a, b) => {
          if (!a || !b) return 0;
          try {
            switch (sortBy) {
              case 'price_low': return (a._lowest || 0) - (b._lowest || 0);
              case 'price_high': return (b._lowest || 0) - (a._lowest || 0);
              case 'rating': return Number(b?.starRating || 0) - Number(a?.starRating || 0);
              case 'popularity': return (b?.reviews?.length || 0) - (a?.reviews?.length || 0);
              case 'availability': return (b?.rooms?.length || 0) - (a?.rooms?.length || 0);
              default: return 0;
            }
          } catch (error) {
            console.error("Error sorting hotels:", error);
            return 0;
          }
        });
        
        setSearchResults(enriched);
      } else {
        // Use existing client-side filtering if dates are not provided
        let enriched = (hotels || []).map(h => {
          if (!h || !h._id) return null;
          
          // enrich each room with computedPrice
          const hotelRooms = (allRooms || [])
            .filter(r => {
              if (!r || !h || !h._id) return false;
              const hotelId = typeof r.hotel === 'object' ? safeAccess(r, 'hotel._id') : r.hotel;
              return hotelId === h._id;
            })
            .map(r => ({
              ...r,
              computedPrice: getRoomPrice(r, nationality),
            }));
            
          return { ...h, rooms: hotelRooms };
        }).filter(h => h); // Remove null results

        // filter by hotel-level
        enriched = enriched.filter(h => {
          if (destination && !(h.name || "").toLowerCase().includes(destination.toLowerCase())) return false;
          if (mealPlan && h.mealPlans) {
            const hasPlan = (h.mealPlans || []).some(p =>
              (p.planName || p.name || '').toLowerCase() === mealPlan.toLowerCase()
            );
            if (!hasPlan) return false;
          }
          if (starRating && Number(h.starRating || 0) < starRating) return false;
          return true;
        });

        // Room-level filters
        enriched = enriched
          .map(h => {
            let valid = [...h.rooms];
            
            if (adults !== INITIAL_PARAMS.adults || children !== INITIAL_PARAMS.children) {
              valid = valid.filter(r => {
                if (!r || !r.maxOccupancy) return false;
                return (r.maxOccupancy.adults >= adults && 
                      r.maxOccupancy.children >= children);
              });
            }
            
            if (rooms !== INITIAL_PARAMS.rooms && valid.length < rooms) {
              valid = [];
            }
            
            // price filter
            if (
              priceRange[0] !== globalPriceRange[0] ||
              priceRange[1] !== globalPriceRange[1]
            ) {
              valid = valid.filter(r =>
                r.computedPrice >= priceRange[0] && r.computedPrice <= priceRange[1]
              );
            }
            
            return { ...h, rooms: valid };
          })
          .filter(h => h.rooms.length > 0);

        // compute sorting key
        enriched = enriched.map(h => ({
          ...h,
          _lowest: h.rooms.length
            ? Math.min(...h.rooms.map(r => r.computedPrice))
            : Infinity,
        }));

        // sort
        enriched.sort((a, b) => {
          try {
            switch (sortBy) {
              case 'price_low': return a._lowest - b._lowest;
              case 'price_high': return b._lowest - a._lowest;
              case 'rating': return Number(b.starRating || 0) - Number(a.starRating || 0);
              case 'popularity': return (b.reviews?.length || 0) - (a.reviews?.length || 0);
              case 'availability': return (b.rooms.length || 0) - (a.rooms.length || 0);
              default: return 0;
            }
          } catch (error) {
            console.error("Error sorting hotels:", error);
            return 0;
          }
        });

        setSearchResults(enriched);
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({ ...INITIAL_PARAMS, priceRange: [...globalPriceRange] });
    setDestinationSearch('');
    setSelectedDestination(null);
    const enriched = hotels.map(h => {
      const hotelRooms = allRooms.filter(r => {
        const hid = typeof r.hotel === 'object' ? r.hotel._id : r.hotel;
        return hid === h._id;
      });
      return { ...h, rooms: hotelRooms };
    });
    
    setSearchResults(enriched);
    setShowFilters(false);
  };

  const handlePropertyClick = id => {
    const hotel = searchResults.find(h => h._id === id);
    if (!hotel) return;

    navigate(`/hotels/${id}`, {
      state: {
        filteredRooms: hotel.rooms,
        previousRoute: location.pathname + location.search,
        selectedNationality: searchParams.nationality,
        nationality: searchParams.nationality,
        checkInDate: searchParams.checkIn,
        checkoutDate: searchParams.checkOut,
      },
    });
  };

  const getAvailbleRooms = id => {
    const hotel = searchResults.find(h => h._id === id);
    return hotel ? hotel.rooms : [];
  };

  const toggleFavorite = id => setFavorites(f => ({ ...f, [id]: !f[id] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-platinum via-ash_gray to-platinum flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-lapis_lazuli/20 border-t-lapis_lazuli rounded-full mx-auto mb-4"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-lapis_lazuli" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lapis_lazuli font-medium text-lg"
          >
            Discovering your perfect getaway...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-platinum via-white to-ash_gray/30"
    >
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23005E84' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <main className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
          {/* Hero Banner */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-gradient-to-r from-indigo_dye_2 via-lapis_lazuli to-indigo_dye bg-cover bg-center h-40 sm:h-48 lg:h-72 shadow-2xl rounded-3xl overflow-hidden mb-8 sm:mb-12"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(10,67,92,0.85), rgba(0,94,132,0.85)), url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920')",
              backgroundBlendMode: 'overlay'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative flex flex-col items-center justify-center h-full text-white text-center px-6"
            >
              <div className="space-y-2 sm:space-y-4">
                <motion.h1 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight"
                >
                  <span className="bg-gradient-to-r from-white to-platinum bg-clip-text text-transparent">
                    Discover Paradise
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed"
                >
                  Find your perfect Maldives getaway with exclusive B2B rates and luxury accommodations
                </motion.p>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-8 opacity-20"
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.header>

          {/* Search Form */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-platinum to-ash_gray/50 p-1">
                <div className="bg-white rounded-3xl p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    
                    {/* Destination */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="lg:col-span-2"
                    >
                      <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                        🏝️ Hotel / Resort Name
                      </label>
                      <div className="relative destination-dropdown group">
                        <input
                          type="text"
                          className="w-full h-12 sm:h-14 pl-4 pr-12 text-base text-gray-700 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300 placeholder-gray-400"
                          placeholder="Search paradise destinations..."
                          value={destinationSearch}
                          onChange={e => {
                            setDestinationSearch(e.target.value);
                            setShowDestinationDropdown(true);
                            handleInputChange('destination', e.target.value);
                          }}
                          onClick={() => setShowDestinationDropdown(true)}
                        />
                        <div className="absolute inset-y-0 right-0 px-4 flex items-center">
                          <svg className="h-5 w-5 text-lapis_lazuli" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        
                        {selectedDestination && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="button"
                            className="absolute inset-y-0 right-10 px-2 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => {
                              setSelectedDestination(null);
                              setDestinationSearch('');
                              handleInputChange('destination', '');
                            }}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                        )}
                        
                        <AnimatePresence>
                          {showDestinationDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                            >
                              {hotels
                                .filter(h =>
                                  destinationSearch === ''
                                    ? true
                                    : (h.name || '').toLowerCase().includes(destinationSearch.toLowerCase())
                                )
                                .map(h => (
                                  <motion.div
                                    key={h._id}
                                    whileHover={{ backgroundColor: "#B7C5C7", x: 4 }}
                                    className="px-4 py-3 hover:bg-ash_gray cursor-pointer text-base transition-colors border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                      setSelectedDestination(h);
                                      setDestinationSearch(h.name);
                                      handleInputChange('destination', h.name);
                                      setShowDestinationDropdown(false);
                                    }}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lapis_lazuli">🏨</span>
                                      <span className="text-gray-700">{h.name}</span>
                                    </div>
                                  </motion.div>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Check-in & Check-out */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                          📅 Check-in Date
                        </label>
                        <div className="relative">
                          <div
                            className="relative bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer h-12 sm:h-14 group"
                            onClick={() => datePickerRef.current?.setOpen(true)}
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lapis_lazuli group-hover:text-indigo_dye transition-colors">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              value={
                                dateRange[0]
                                  ? dateRange[0].toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : ""
                              }
                              readOnly
                              placeholder="Select arrival"
                              className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none cursor-pointer text-base placeholder-gray-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                          📅 Check-out Date
                        </label>
                        <div className="relative">
                          <div
                            className="relative bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer h-12 sm:h-14 group"
                            onClick={() => datePickerRef.current?.setOpen(true)}
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lapis_lazuli group-hover:text-indigo_dye transition-colors">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              value={
                                dateRange[1]
                                  ? dateRange[1].toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : ""
                              }
                              readOnly
                              placeholder="Select departure"
                              className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none cursor-pointer text-base placeholder-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <DatePicker
                      selectsRange
                      startDate={dateRange[0]}
                      endDate={dateRange[1]}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        setDateRange([start, end]);
                        handleInputChange('checkIn', start || null);
                        handleInputChange('checkOut', end || null);
                        if (start && end) {
                          setTimeout(() => {
                            datePickerRef.current?.setOpen(false);
                          }, 100);
                        }
                      }}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      popperPlacement="bottom-start"
                      popperModifiers={[
                        { name: "offset", options: { offset: [0, 8] } },
                        { name: "preventOverflow", options: { rootBoundary: "viewport", tether: true, altAxis: true, padding: 8 } },
                        { name: "flip", options: { fallbackPlacements: ["top", "bottom", "left", "right"] } },
                      ]}
                      ref={datePickerRef}
                      className="absolute opacity-0 pointer-events-none"
                      shouldCloseOnSelect={false}
                      selectsStart
                      monthsShown={1}
                    />

                    {/* Nationality */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                        🌍 Nationality
                      </label>
                      <div className="relative nationality-dropdown group">
                        <input
                          type="text"
                          className="w-full h-12 sm:h-14 pl-4 pr-12 text-base text-gray-700 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300 placeholder-gray-400"
                          placeholder="Select your country..."
                          value={countrySearch}
                          onChange={e => {
                            setCountrySearch(e.target.value);
                            setShowCountryDropdown(true);
                          }}
                          onClick={() => setShowCountryDropdown(true)}
                        />
                        <div className="absolute inset-y-0 right-0 px-4 flex items-center">
                          <svg className="h-5 w-5 text-lapis_lazuli" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {selectedCountry && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            type="button"
                            className="absolute inset-y-0 right-10 px-2 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => {
                              setSelectedCountry(null);
                              setCountrySearch('');
                              handleInputChange('nationality', '');
                            }}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                        )}

                        <AnimatePresence>
                          {showCountryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                            >
                              {countries
                                .filter(c =>
                                  countrySearch === ''
                                    ? true
                                    : c.name.toLowerCase().includes(countrySearch.toLowerCase())
                                )
                                .map(c => (
                                  <motion.div
                                    key={c.name}
                                    whileHover={{ backgroundColor: "#B7C5C7", x: 4 }}
                                    className="px-4 py-3 hover:bg-ash_gray cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setCountrySearch(c.flag + ' ' + c.name);
                                      handleInputChange('nationality', c.name);
                                      setShowCountryDropdown(false);
                                    }}
                                  >
                                    <span className="text-lg">{c.flag}</span>
                                    <span className="text-gray-700 font-medium">{c.name}</span>
                                  </motion.div>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Guest Details */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                      {/* Meal Plan */}
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                          🍽️ Meal Plan
                        </label>
                        <select
                          className="w-full h-12 sm:h-14 pl-4 pr-10 text-base text-gray-700 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300 cursor-pointer"
                          value={searchParams.mealPlan}
                          onChange={e => handleInputChange('mealPlan', e.target.value)}
                        >
                          <option value="">All Meal Plans</option>
                          <option value="Full Board">Full Board</option>
                          <option value="Half Board">Half Board</option>
                          <option value="All-Inclusive">All-Inclusive</option>
                        </select>
                      </div>

                      {/* Rooms */}
                      <div>
                        <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                          🏠 Rooms
                        </label>
                        <div className="flex items-center h-12 sm:h-14 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl overflow-hidden">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-full flex items-center justify-center text-lapis_lazuli hover:bg-ash_gray/50 transition-colors"
                            onClick={() => handleInputChange('rooms', Math.max(1, searchParams.rooms - 1))}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </motion.button>
                          <div className="flex-1 text-center text-base font-semibold text-gray-700">
                            {searchParams.rooms}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-full flex items-center justify-center text-lapis_lazuli hover:bg-ash_gray/50 transition-colors"
                            onClick={() => handleInputChange('rooms', searchParams.rooms + 1)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      {/* Adults */}
                      <div>
                        <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                          👥 Adults
                        </label>
                        <div className="flex items-center h-12 sm:h-14 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl overflow-hidden">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-full flex items-center justify-center text-lapis_lazuli hover:bg-ash_gray/50 transition-colors"
                            onClick={() => handleInputChange('adults', Math.max(1, searchParams.adults - 1))}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </motion.button>
                          <div className="flex-1 text-center text-base font-semibold text-gray-700">
                            {searchParams.adults}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-full flex items-center justify-center text-lapis_lazuli hover:bg-ash_gray/50 transition-colors"
                            onClick={() => handleInputChange('adults', searchParams.adults + 1)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Children */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-indigo_dye_2 mb-2">
                          👶 Children (0-17 years)
                        </label>
                        <div className="flex items-center h-12 sm:h-14 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl overflow-hidden max-w-xs">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-full flex items-center justify-center text-lapis_lazuli hover:bg-ash_gray/50 transition-colors"
                            onClick={() => handleChildrenChange(Math.max(0, searchParams.children - 1))}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </motion.button>
                          <div className="flex-1 text-center text-base font-semibold text-gray-700">
                            {searchParams.children}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-full flex items-center justify-center text-lapis_lazuli hover:bg-ash_gray/50 transition-colors"
                            onClick={() => handleChildrenChange(searchParams.children + 1)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      {/* Children Ages */}
                      <AnimatePresence>
                        {searchParams.children > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-r from-ash_gray/20 to-platinum/30 rounded-xl p-4 border border-ash_gray/30"
                          >
                            <label className="block text-sm font-semibold text-indigo_dye_2 mb-3">
                              Children Ages
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {searchParams.childrenAges.map((age, i) => (
                                <motion.select
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="w-full h-10 sm:h-12 pl-3 pr-8 text-sm text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300"
                                  value={age}
                                  onChange={e => handleChildAgeChange(i, e.target.value)}
                                >
                                  {[...Array(18).keys()].map(n => (
                                    <option key={n} value={n}>{n} {n === 1 ? 'year' : 'years'}</option>
                                  ))}
                                </motion.select>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-ash_gray/30"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowFilters(f => !f)}
                      className="flex items-center justify-center text-lapis_lazuli font-semibold text-sm hover:text-indigo_dye transition-colors group"
                    >
                      <motion.svg 
                        animate={{ rotate: showFilters ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </motion.svg>
                      {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                    </motion.button>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                        className="px-6 py-3 text-sm font-semibold text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Reset Filters
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSearch}
                        className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-lapis_lazuli to-indigo_dye rounded-xl shadow-lg hover:shadow-xl hover:from-indigo_dye hover:to-indigo_dye_2 transition-all duration-300 transform"
                      >
                        <span className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Search Paradise</span>
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo_dye_2 to-lapis_lazuli p-1">
                    <div className="bg-white rounded-3xl p-6 sm:p-8">
                      <motion.h3
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl sm:text-2xl font-bold text-indigo_dye_2 mb-6 flex items-center"
                      >
                        <span className="mr-3">🎯</span>
                        Advanced Filters
                      </motion.h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Price Range */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="lg:col-span-2"
                        >
                          <label className="block text-sm font-semibold text-indigo_dye_2 mb-4">
                            💰 Price Range (${searchParams.priceRange[0]} – ${searchParams.priceRange[1]})
                          </label>
                          
                          <div className="relative mb-6">
                            <div className="h-3 bg-gradient-to-r from-ash_gray/50 to-ash_gray rounded-full">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: calculatePriceRangeStyles().width }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="h-3 bg-gradient-to-r from-lapis_lazuli to-indigo_dye rounded-full shadow-sm"
                                style={{ marginLeft: calculatePriceRangeStyles().marginLeft }}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">Minimum Price</label>
                              <input
                                type="number"
                                className="w-full h-12 px-4 text-base text-gray-700 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300"
                                value={searchParams.priceRange[0]}
                                onChange={e => {
                                  const value = parseInt(e.target.value) || globalPriceRange[0];
                                  handlePriceRangeChange(value, searchParams.priceRange[1]);
                                }}
                                min={globalPriceRange[0]}
                                max={searchParams.priceRange[1] - 1}
                              />
                              <span className="text-xs text-gray-500 mt-1 block">Min: ${globalPriceRange[0]}</span>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">Maximum Price</label>
                              <input
                                type="number"
                                className="w-full h-12 px-4 text-base text-gray-700 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300"
                                value={searchParams.priceRange[1]}
                                onChange={e => {
                                  const value = parseInt(e.target.value) || globalPriceRange[1];
                                  handlePriceRangeChange(searchParams.priceRange[0], value);
                                }}
                                min={searchParams.priceRange[0] + 1}
                                max={globalPriceRange[1]}
                              />
                              <span className="text-xs text-gray-500 mt-1 block">Max: ${globalPriceRange[1]}</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Sort By */}
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-sm font-semibold text-indigo_dye_2 mb-4">
                            📊 Sort Results By
                          </label>
                          <select
                            className="w-full h-12 px-4 text-base text-gray-700 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli/50 focus:border-lapis_lazuli transition-all duration-300 cursor-pointer"
                            value={searchParams.sortBy}
                            onChange={e => handleInputChange('sortBy', e.target.value)}
                          >
                            <option value="price_low">💸 Price: Low to High</option>
                            <option value="price_high">💰 Price: High to Low</option>
                            <option value="rating">⭐ Highest Rating</option>
                            <option value="popularity">🔥 Most Popular</option>
                            <option value="availability">🏨 Best Availability</option>
                          </select>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 sm:mt-12"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-platinum to-ash_gray/50 p-1">
                <div className="bg-white rounded-3xl p-6 sm:p-8">
                  {/* Results Header */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-ash_gray/30"
                  >
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-indigo_dye_2 mb-2 flex items-center">
                        <span className="mr-3">🏝️</span>
                        Available Paradise Resorts
                      </h3>
                      <p className="text-gray-600">Discover your perfect tropical getaway</p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="bg-gradient-to-r from-lapis_lazuli to-indigo_dye text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mt-4 sm:mt-0"
                    >
                      {searchResults.length} resort{searchResults.length !== 1 ? 's' : ''} found
                    </motion.div>
                  </motion.div>

                  {/* Results Content */}
                  {searchResults.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-center py-16"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="inline-block"
                        >
                          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-ash_gray/20 to-platinum/40 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-lapis_lazuli/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </motion.div>
                        
                        <h4 className="text-xl sm:text-2xl font-bold text-indigo_dye_2 mb-3">
                          No paradise found... yet!
                        </h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                          Try adjusting your search criteria or explore different destinations to find your perfect tropical escape.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowFilters(true)}
                          className="bg-gradient-to-r from-lapis_lazuli to-indigo_dye text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform"
                        >
                          Adjust Search Filters
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                      {searchResults.map((property, index) => (
                        <motion.div
                          key={property._id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 0.9 + (index * 0.1), 
                            duration: 0.5,
                            ease: "easeOut"
                          }}
                          whileHover={{ y: -5 }}
                          className="group"
                        >
                          <HotelCard
                            hotel={property}
                            availbleNoOfRooms={property.rooms.length}
                            onClick={() => handlePropertyClick(property._id)}
                            onFavoriteToggle={() => toggleFavorite(property._id)}
                            isFavorite={Boolean(favorites[property._id])}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Custom Calendar Styles */}
          <style jsx global>{`
            .react-datepicker {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              border: 2px solid #E7E9E5;
              border-radius: 1rem;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              width: 320px;
              z-index: 1000;
              background-color: white;
              overflow: hidden;
            }
            
            .react-datepicker__header {
              background: linear-gradient(135deg, #005E84, #075375);
              color: white;
              border-top-left-radius: 1rem;
              border-top-right-radius: 1rem;
              padding: 1rem;
              border-bottom: none;
            }
            
            .react-datepicker__current-month,
            .react-datepicker__day-name {
              color: white;
              font-weight: 700;
              font-size: 0.875rem;
            }
            
            .react-datepicker__day-names {
              border-bottom: 1px solid rgba(255,255,255,0.2);
              padding-bottom: 0.5rem;
              margin-bottom: 0.5rem;
            }
            
            .react-datepicker__day {
              color: #374151;
              border-radius: 0.5rem;
              transition: all 0.2s ease;
              width: 36px;
              height: 36px;
              line-height: 36px;
              font-size: 0.875rem;
              font-weight: 500;
              margin: 0.125rem;
            }
            
            .react-datepicker__day:hover {
              background: linear-gradient(135deg, #B7C5C7, #E7E9E5);
              color: #005E84;
              transform: scale(1.1);
            }
            
            .react-datepicker__day--selected,
            .react-datepicker__day--in-range,
            .react-datepicker__day--in-selecting-range {
              background: linear-gradient(135deg, #B7C5C7, #E7E9E5);
              color: #005E84;
              font-weight: 700;
            }
            
            .react-datepicker__day--range-start,
            .react-datepicker__day--range-end {
              background: linear-gradient(135deg, #005E84, #075375) !important;
              color: white !important;
              font-weight: 700;
              transform: scale(1.1);
            }
            
            .react-datepicker__day--range-start:hover,
            .react-datepicker__day--range-end:hover {
              background: linear-gradient(135deg, #075375, #0A435C) !important;
              transform: scale(1.15);
            }
            
            .react-datepicker__navigation {
              top: 1.25rem;
            }
            
            .react-datepicker__navigation-icon::before {
              border-color: white;
              border-width: 2px 2px 0 0;
              width: 7px;
              height: 7px;
            }
            
            .react-datepicker__triangle {
              display: none;
            }
            
            .react-datepicker-popper {
              z-index: 1000;
            }
            
            .react-datepicker__month-container {
              width: 100%;
            }
            
            .react-datepicker__month {
              padding: 1rem;
            }
            
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </main>
      </div>
    </motion.div>
  );
};

export default Search;