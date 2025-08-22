// src/pages/Search.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import HotelCard from '../Components/HotelCard';
import Footer from '../Components/Footer';
import { countries } from '../assets/nationalities';
import { 
  Search as SearchIcon, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Bed,
  RotateCcw,
  ChevronDown,
  Waves,
  Palmtree,
  Plane
} from 'lucide-react';

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
  const shouldReduceMotion = useReducedMotion();

  // Performance optimization: Memoize animation variants
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: shouldReduceMotion ? 0.1 : 0.6 }
  }), [shouldReduceMotion]);

  const fadeInVariants = useMemo(() => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.1 : 0.5 }
  }), [shouldReduceMotion]);

  const staggerVariants = useMemo(() => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.1 : 0.6, ease: "easeOut" }
  }), [shouldReduceMotion]);

  // Animation variants for performance optimization
  const animations = useMemo(() => ({
    form: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    input: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
    },
    container: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.05 }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }
  }), []);

  const simpleAnimations = useMemo(() => ({
    form: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    input: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  }), []);

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

  // Optimized handlers with useCallback to prevent unnecessary re-renders
  const handleInputChange = useCallback((key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleChildrenChange = useCallback((value) => {
    const count = parseInt(value, 10) || 0;
    setSearchParams(prev => ({
      ...prev,
      children: count,
      childrenAges: Array(count).fill(0),
    }));
  }, []);

  const handleChildAgeChange = useCallback((idx, value) => {
    const ages = [...searchParams.childrenAges];
    ages[idx] = Number(value);
    setSearchParams(prev => ({ ...prev, childrenAges: ages }));
  }, [searchParams.childrenAges]);

  const handlePriceRangeChange = useCallback((min, max) => {
    if (min > max) min = max;
    min = Math.max(globalPriceRange[0], Math.min(globalPriceRange[1], min));
    max = Math.max(globalPriceRange[0], Math.min(globalPriceRange[1], max));
    setSearchParams(prev => ({ ...prev, priceRange: [min, max] }));
  }, [globalPriceRange]);

  const toggleFavorite = useCallback((id) => {
    setFavorites(f => ({ ...f, [id]: !f[id] }));
  }, []);

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

  if (loading) {
    return (
      <motion.div 
        {...pageVariants}
        className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-platinum to-ash_gray/30"
        style={{ willChange: 'auto' }}
      >
        <motion.div
          animate={{ rotate: shouldReduceMotion ? 0 : 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-lapis_lazuli/30 border-t-lapis_lazuli rounded-full animate-spin"></div>
          <motion.div
            animate={{ scale: shouldReduceMotion ? 1 : [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Waves className="w-6 h-6 text-lapis_lazuli" />
          </motion.div>
        </motion.div>
        <motion.p
          {...fadeInVariants}
          transition={{ delay: 0.3 }}
          className="mt-4 text-indigo_dye font-medium"
        >
          Finding your perfect paradise...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      {...pageVariants}
      className="min-h-screen bg-gradient-to-br from-platinum via-white to-ash_gray/20 scroll-smooth"
      style={{ 
        willChange: 'auto',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Enhanced smooth scrolling styles */}
      <style jsx>{`
        * {
          scroll-behavior: smooth;
        }
        
        html {
          scroll-behavior: smooth;
          overflow-x: hidden;
        }
        
        body {
          overflow-x: hidden;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Optimize scroll performance */
        .scroll-container {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
          contain: layout style paint;
        }
        
        /* Enhanced scroll smoothness */
        .scroll-smooth {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Optimize animations for scroll performance */
        .motion-optimized {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Reduce animation complexity on lower-end devices */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        /* Performance optimizations for mobile */
        @media (max-width: 768px) {
          .motion-item {
            will-change: auto;
          }
          
          * {
            transform: translateZ(0);
          }
        }
      `}</style>
      
      <div className="scroll-container">
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1400px] mx-auto">
          {/* Hero Banner - Optimized */}
          <motion.header
            {...staggerVariants}
            transition={{ delay: 0.1, duration: shouldReduceMotion ? 0.1 : 0.8, ease: "easeOut" }}
            className="relative bg-cover bg-center h-40 sm:h-48 lg:h-72 shadow-2xl rounded-3xl overflow-hidden mb-6 sm:mb-8 lg:mb-12"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(0,94,132,0.8), rgba(7,83,117,0.6)), url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920')",
              willChange: 'auto'
            }}
          >
            {/* Simplified Floating Elements - Reduced for performance */}
            {!shouldReduceMotion && (
              <>
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute top-4 right-4 opacity-20"
                >
                  <Palmtree className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    x: [0, 10, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute top-6 left-6 opacity-20"
                >
                  <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
              </>
            )}

            <div className="flex flex-col items-center justify-center h-full text-white text-center px-4 relative z-10">
              <motion.h1 
                {...fadeInVariants}
                transition={{ delay: 0.2, duration: shouldReduceMotion ? 0.1 : 0.8 }}
                className="text-2xl sm:text-3xl lg:text-5xl font-bold drop-shadow-lg mb-2 sm:mb-4"
              >
                Discover Your Paradise
              </motion.h1>
              <motion.p 
                {...fadeInVariants}
                transition={{ delay: 0.3, duration: shouldReduceMotion ? 0.1 : 0.8 }}
                className="text-sm sm:text-base lg:text-lg drop-shadow-md max-w-2xl px-4 leading-relaxed"
              >
                Find your perfect Maldives getaway with exclusive B2B rates and unmatched luxury
              </motion.p>
              
              {/* Simplified Decorative Wave */}
              {!shouldReduceMotion && (
                <motion.div
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                >
                  <Waves className="w-8 h-8 text-white opacity-30" />
                </motion.div>
              )}
            </div>
          </motion.header>

          {/* Search Form - Optimized */}
          <motion.div
            variants={shouldReduceMotion ? simpleAnimations.form : animations.form}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: shouldReduceMotion ? 0.1 : 0.8 }}
          >
            <Box sx={{ 
              mt: { xs: 2, sm: 4, lg: 6 },
              mx: 'auto',
              maxWidth: '100%',
              width: '100%'
            }}>
              <Card elevation={0} sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(231,233,229,0.95) 0%, rgba(255,255,255,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(183,197,199,0.3)',
                boxShadow: '0 20px 40px rgba(0,94,132,0.1)'
              }}>
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
                  <motion.div
                    {...fadeInVariants}
                    transition={{ delay: 0.3 }}
                    className="flex items-center mb-6"
                  >
                    <SearchIcon className="w-6 h-6 text-lapis_lazuli mr-3" />
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      color: '#005E84',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}>
                      Find Your Perfect Resort
                    </Typography>
                  </motion.div>

                  <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
                    {/* Destination - Simplified Animation */}
                    <Grid item xs={12} md={6} lg={4}>
                      <motion.div
                        {...fadeInVariants}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          Hotel / Resort Name
                        </label>
                        <div className="relative destination-dropdown">
                          <input
                            type="text"
                            className="w-full h-12 sm:h-14 pl-4 pr-10 text-base text-gray-700 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300 hover:bg-white/90"
                            placeholder="Enter hotel or resort name..."
                            value={destinationSearch}
                            onChange={e => {
                              setDestinationSearch(e.target.value);
                              setShowDestinationDropdown(true);
                              handleInputChange('destination', e.target.value);
                            }}
                            onClick={() => setShowDestinationDropdown(true)}
                          />
                          {/* Clear button */}
                          {selectedDestination && (
                            <motion.button
                              {...fadeInVariants}
                              whileHover={!shouldReduceMotion ? { scale: 1.1 } : {}}
                              whileTap={!shouldReduceMotion ? { scale: 0.9 } : {}}
                              type="button"
                              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-800"
                              onClick={() => {
                                setSelectedDestination(null);
                                setDestinationSearch('');
                                handleInputChange('destination', '');
                              }}
                            >
                              ×
                            </motion.button>
                          )}
                          <AnimatePresence>
                            {showDestinationDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
                                className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                              >
                                {hotels
                                  .filter(h =>
                                    destinationSearch === ''
                                      ? true
                                      : (h.name || '').toLowerCase().includes(destinationSearch.toLowerCase())
                                  )
                                  .map((h, index) => (
                                    <motion.div
                                      key={h._id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: shouldReduceMotion ? 0 : index * 0.02 }}
                                      className="px-4 py-3 hover:bg-ash_gray/30 cursor-pointer text-base border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                                      onClick={() => {
                                        setSelectedDestination(h);
                                        setDestinationSearch(h.name);
                                        handleInputChange('destination', h.name);
                                        setShowDestinationDropdown(false);
                                      }}
                                    >
                                      <div className="font-medium text-indigo_dye">{h.name}</div>
                                      <div className="text-sm text-gray-500">{h.location}</div>
                                    </motion.div>
                                  ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </Grid>

                    {/* Check-in & Check-out */}
                    <Grid item xs={12} sm={6} lg={4}>
                      <motion.div
                        variants={shouldReduceMotion ? simpleAnimations.input : animations.input}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          Check-in Date
                        </label>
                        <div className="relative w-full">
                          <motion.div
                            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="relative bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border-2 border-gray-200 hover:border-lapis_lazuli hover:bg-white/90 transition-all duration-300 cursor-pointer w-full"
                            onClick={() => datePickerRef.current?.setOpen(true)}
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lapis_lazuli">
                              <Calendar className="h-5 w-5" />
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
                              placeholder="Select check-in date"
                              className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-700 focus:outline-none rounded-xl cursor-pointer text-base placeholder-gray-400"
                            />
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
                        </div>
                      </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={4}>
                      <motion.div
                        variants={shouldReduceMotion ? simpleAnimations.input : animations.input}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.6 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          Check-out Date
                        </label>
                        <div className="relative w-full">
                          <motion.div
                            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="relative bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border-2 border-gray-200 hover:border-lapis_lazuli hover:bg-white/90 transition-all duration-300 cursor-pointer w-full"
                            onClick={() => datePickerRef.current?.setOpen(true)}
                          >
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lapis_lazuli">
                              <Calendar className="h-5 w-5" />
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
                              placeholder="Select check-out date"
                              className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-700 focus:outline-none rounded-xl cursor-pointer text-base placeholder-gray-400"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    </Grid>

                  {/* Enhanced Custom Calendar Styles */}
                  <style jsx global>{`
                    .react-datepicker {
                      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                      border: none;
                      border-radius: 1rem;
                      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                      width: 280px;
                      z-index: 1000;
                      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(231,233,229,0.95) 100%);
                      backdrop-filter: blur(20px);
                      overflow: hidden;
                    }
                    @media (min-width: 640px) {
                      .react-datepicker {
                        width: 320px;
                      }
                    }
                    @media (min-width: 768px) {
                      .react-datepicker {
                        width: 350px;
                      }
                    }
                    .react-datepicker__header {
                      background: linear-gradient(135deg, #005E84 0%, #075375 100%);
                      color: white;
                      border-top-left-radius: 1rem;
                      border-top-right-radius: 1rem;
                      padding: 1rem;
                      border-bottom: none;
                      position: relative;
                    }
                    .react-datepicker__header::before {
                      content: '';
                      position: absolute;
                      bottom: -10px;
                      left: 0;
                      right: 0;
                      height: 10px;
                      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%);
                    }
                    .react-datepicker__current-month,
                    .react-datepicker__day-name {
                      color: white;
                      font-weight: 700;
                      font-size: 0.875rem;
                      margin-bottom: 0.5rem;
                    }
                    .react-datepicker__day-names {
                      border-bottom: 1px solid rgba(255,255,255,0.2);
                      padding-bottom: 0.5rem;
                      margin-bottom: 0.5rem;
                    }
                    .react-datepicker__day-name {
                      color: rgba(255,255,255,0.9);
                      font-size: 0.75rem;
                      font-weight: 600;
                    }
                    .react-datepicker__month {
                      padding: 1rem;
                      background: rgba(255,255,255,0.95);
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
                    @media (min-width: 640px) {
                      .react-datepicker__day {
                        width: 40px;
                        height: 40px;
                        line-height: 40px;
                        font-size: 0.875rem;
                      }
                    }
                    .react-datepicker__day:hover {
                      background: linear-gradient(135deg, #B7C5C7 0%, #E7E9E5 100%);
                      color: #005E84;
                      transform: scale(1.05);
                      box-shadow: 0 4px 12px rgba(0,94,132,0.2);
                    }
                    .react-datepicker__day--selected,
                    .react-datepicker__day--in-range,
                    .react-datepicker__day--in-selecting-range {
                      background: linear-gradient(135deg, #B7C5C7 0%, #E7E9E5 100%);
                      color: #005E84;
                      font-weight: 600;
                      box-shadow: 0 2px 8px rgba(0,94,132,0.2);
                    }
                    .react-datepicker__day--range-start,
                    .react-datepicker__day--range-end {
                      background: linear-gradient(135deg, #005E84 0%, #075375 100%) !important;
                      color: white !important;
                      font-weight: 700 !important;
                      box-shadow: 0 4px 16px rgba(0,94,132,0.4) !important;
                      transform: scale(1.1);
                    }
                    .react-datepicker__day--range-start:hover,
                    .react-datepicker__day--range-end:hover {
                      background: linear-gradient(135deg, #075375 0%, #0A435C 100%) !important;
                      transform: scale(1.15) !important;
                    }
                    .react-datepicker__day--outside-month {
                      color: #9CA3AF;
                    }
                    .react-datepicker__day--disabled {
                      color: #E5E7EB;
                      background: none;
                    }
                    .react-datepicker__navigation {
                      background: rgba(255,255,255,0.2);
                      border-radius: 50%;
                      width: 32px;
                      height: 32px;
                      line-height: 32px;
                      top: 1.2rem;
                      border: none;
                      transition: all 0.2s ease;
                    }
                    .react-datepicker__navigation:hover {
                      background: rgba(255,255,255,0.3);
                      transform: scale(1.1);
                    }
                    .react-datepicker__navigation-icon::before {
                      border-color: white;
                      border-width: 2px 2px 0 0;
                      width: 8px;
                      height: 8px;
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
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                    .scrollbar-hide {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                    /* Additional animations */
                    .react-datepicker__day--keyboard-selected {
                      background: linear-gradient(135deg, #B7C5C7 0%, #E7E9E5 100%);
                      color: #005E84;
                    }
                    .react-datepicker__week {
                      display: flex;
                      justify-content: space-around;
                    }
                  `}</style>

                    {/* Nationality */}
                    <Grid item xs={12} sm={6} lg={4}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <Users className="w-4 h-4 mr-2" />
                          Nationality
                        </label>
                        <div className="relative nationality-dropdown">
                          <input
                            type="text"
                            className="w-full h-12 sm:h-14 pl-4 pr-10 text-base text-gray-700 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300 hover:bg-white/90"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={e => {
                              setCountrySearch(e.target.value);
                              setShowCountryDropdown(true);
                            }}
                            onClick={() => setShowCountryDropdown(true)}
                          />

                          {/* Clear button */}
                          {selectedCountry && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-800"
                              onClick={() => {
                                setSelectedCountry(null);
                                setCountrySearch('');
                                handleInputChange('nationality', '');
                              }}
                            >
                              ×
                            </motion.button>
                          )}

                          <AnimatePresence>
                            {showCountryDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                              >
                                {countries
                                  .filter(c =>
                                    countrySearch === ''
                                      ? true
                                      : c.name.toLowerCase().includes(countrySearch.toLowerCase())
                                  )
                                  .map((c, index) => (
                                    <motion.div
                                      key={c.name}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.03 }}
                                      className="px-4 py-3 hover:bg-ash_gray/30 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                                      onClick={() => {
                                        setSelectedCountry(c);
                                        setCountrySearch(c.flag + ' ' + c.name);
                                        handleInputChange('nationality', c.name);
                                        setShowCountryDropdown(false);
                                      }}
                                    >
                                      <span className="text-base">{c.flag} {c.name}</span>
                                    </motion.div>
                                  ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </Grid>

                    {/* Meal Plan */}
                    <Grid item xs={12} sm={6} lg={3}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Meal Plan
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-12 sm:h-14 pl-4 pr-10 text-base text-gray-700 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300 hover:bg-white/90 appearance-none cursor-pointer"
                            value={searchParams.mealPlan}
                            onChange={e => handleInputChange('mealPlan', e.target.value)}
                          >
                            <option value="">All Meal Plans</option>
                            <option value="Full Board">Full Board</option>
                            <option value="Half Board">Half Board</option>
                            <option value="All-Inclusive">All-Inclusive</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </motion.div>
                    </Grid>

                    {/* Rooms */}
                    <Grid item xs={6} sm={6} lg={3}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <Bed className="w-4 h-4 mr-2" />
                          Rooms
                        </label>
                        <div className="flex items-center h-12 sm:h-14 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/90">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-lapis_lazuli hover:text-white transition-colors duration-200"
                            onClick={() => handleInputChange('rooms', Math.max(1, searchParams.rooms - 1))}
                          >
                            −
                          </motion.button>
                          <div className="flex-1 text-center text-base font-semibold text-indigo_dye">
                            {searchParams.rooms}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-lapis_lazuli hover:text-white transition-colors duration-200"
                            onClick={() => handleInputChange('rooms', searchParams.rooms + 1)}
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.div>
                    </Grid>

                    {/* Adults */}
                    <Grid item xs={6} sm={6} lg={3}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <Users className="w-4 h-4 mr-2" />
                          Adults
                        </label>
                        <div className="flex items-center h-12 sm:h-14 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/90">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-lapis_lazuli hover:text-white transition-colors duration-200"
                            onClick={() => handleInputChange('adults', Math.max(1, searchParams.adults - 1))}
                          >
                            −
                          </motion.button>
                          <div className="flex-1 text-center text-base font-semibold text-indigo_dye">
                            {searchParams.adults}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-lapis_lazuli hover:text-white transition-colors duration-200"
                            onClick={() => handleInputChange('adults', searchParams.adults + 1)}
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.div>
                    </Grid>

                    {/* Children */}
                    <Grid item xs={6} sm={6} lg={3}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-indigo_dye mb-2">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H9m4.5 0H15a.5.5 0 00.5.5v1a.5.5 0 00-.5.5h-1.5m-7 6.5A2.5 2.5 0 004.5 17v-2.5A2.5 2.5 0 007 12h10a2.5 2.5 0 012.5 2.5V17a2.5 2.5 0 01-2.5 2.5H7z" />
                          </svg>
                          Children
                        </label>
                        <div className="flex items-center h-12 sm:h-14 bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/90">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-lapis_lazuli hover:text-white transition-colors duration-200"
                            onClick={() => handleChildrenChange(Math.max(0, searchParams.children - 1))}
                          >
                            −
                          </motion.button>
                          <div className="flex-1 text-center text-base font-semibold text-indigo_dye">
                            {searchParams.children}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-lapis_lazuli hover:text-white transition-colors duration-200"
                            onClick={() => handleChildrenChange(searchParams.children + 1)}
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.div>
                    </Grid>

                    {/* Children Ages */}
                    {searchParams.children > 0 && (
                      <Grid item xs={12}>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-4 p-4 sm:p-6 bg-gradient-to-r from-ash_gray/20 to-platinum/30 rounded-2xl border border-ash_gray/30"
                        >
                          <label className="flex items-center text-sm font-semibold text-indigo_dye mb-4">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Children Ages
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                            {searchParams.childrenAges.map((age, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <div className="relative">
                                  <select
                                    className="w-full h-12 pl-3 pr-8 text-sm text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300 hover:bg-white appearance-none cursor-pointer"
                                    value={age}
                                    onChange={e => handleChildAgeChange(i, e.target.value)}
                                  >
                                    {[...Array(18).keys()].map(n => (
                                      <option key={n} value={n}>{n} {n === 1 ? 'year' : 'years'}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </Grid>
                    )}
                  </Grid>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' }, 
                      justifyContent: 'space-between', 
                      alignItems: { xs: 'stretch', sm: 'center' }, 
                      gap: { xs: 3, sm: 0 }, 
                      mt: { xs: 4, sm: 6 }, 
                      mb: { xs: 2, sm: 3 } 
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(f => !f)}
                        className="flex items-center justify-center sm:justify-start text-lapis_lazuli font-semibold text-base hover:text-indigo_dye transition-colors duration-200 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-lapis_lazuli/20 hover:bg-white/80"
                      >
                        <Filter className="h-5 w-5 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                      </motion.button>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleReset}
                          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white shadow-lg border border-gray-200 transition-all duration-200"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,94,132,0.3)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSearch}
                          className="flex items-center justify-center w-full sm:w-auto px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-lapis_lazuli to-indigo_dye rounded-xl shadow-xl hover:from-indigo_dye hover:to-indigo_dye2 transition-all duration-300"
                        >
                          <SearchIcon className="h-5 w-5 mr-2" />
                          Search Resorts
                        </motion.button>
                      </div>
                    </Box>
                  </motion.div>

                  {/* Advanced Filters */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          duration: shouldReduceMotion ? 0.2 : 0.5, 
                          ease: "easeInOut",
                          height: { type: "spring", stiffness: 300, damping: 30 }
                        }}
                      >
                        <Box sx={{ 
                          mt: { xs: 4, sm: 6 }, 
                          mb: { xs: 4, sm: 6 }, 
                          pt: { xs: 4, sm: 6 },
                          borderTop: '2px solid rgba(183,197,199,0.3)',
                          background: 'linear-gradient(135deg, rgba(231,233,229,0.3) 0%, rgba(255,255,255,0.5) 100%)',
                          borderRadius: 3,
                          p: { xs: 3, sm: 4 }
                        }}>
                          <motion.div
                            variants={shouldReduceMotion ? simpleAnimations.input : animations.input}
                            transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
                            className="flex items-center mb-6"
                          >
                            <Filter className="w-6 h-6 text-lapis_lazuli mr-3" />
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              color: '#005E84',
                              fontSize: { xs: '1.1rem', sm: '1.4rem' }
                            }}>
                              Advanced Filters
                            </Typography>
                          </motion.div>
                          <Grid container spacing={{ xs: 3, sm: 4, md: 4 }}>
                            {/* Price Range */}
                            <Grid item xs={12} md={8}>
                              <motion.div
                                variants={shouldReduceMotion ? simpleAnimations.input : animations.input}
                                transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                              >
                                <label className="flex items-center text-sm font-semibold text-indigo_dye mb-4">
                                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                  Price Range (${searchParams.priceRange[0]} – ${searchParams.priceRange[1]})
                                </label>
                                <div className="relative">
                                  <div className="h-3 bg-gradient-to-r from-ash_gray/40 to-ash_gray/60 rounded-full w-full shadow-inner">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: calculatePriceRangeStyles().width }}
                                      transition={{ 
                                        delay: shouldReduceMotion ? 0 : 0.5, 
                                        duration: shouldReduceMotion ? 0.2 : 0.8,
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30
                                      }}
                                      className="h-3 bg-gradient-to-r from-lapis_lazuli to-indigo_dye rounded-full shadow-lg"
                                      style={{ 
                                        marginLeft: calculatePriceRangeStyles().marginLeft,
                                        willChange: 'width, margin-left'
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-4 justify-between mt-4">
                                  <motion.div 
                                    variants={shouldReduceMotion ? simpleAnimations.input : animations.input}
                                    transition={{ delay: shouldReduceMotion ? 0 : 0.6 }}
                                    className="w-full"
                                  >
                                    <input
                                      type="number"
                                      className="w-full h-12 sm:h-14 px-4 text-base text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300"
                                      value={searchParams.priceRange[0]}
                                      onChange={e => {
                                        const value = parseInt(e.target.value) || globalPriceRange[0];
                                        handlePriceRangeChange(value, searchParams.priceRange[1]);
                                      }}
                                      min={globalPriceRange[0]}
                                      max={searchParams.priceRange[1] - 1}
                                    />
                                    <span className="text-xs text-gray-500 mt-1 block">Min: ${globalPriceRange[0]}</span>
                                  </motion.div>
                                  <motion.div 
                                    variants={shouldReduceMotion ? simpleAnimations.input : animations.input}
                                    transition={{ delay: shouldReduceMotion ? 0 : 0.6 }}
                                    className="w-full"
                                  >
                                    <input
                                      type="number"
                                      className="w-full h-12 sm:h-14 px-4 text-base text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300"
                                      value={searchParams.priceRange[1]}
                                      onChange={e => {
                                        const value = parseInt(e.target.value) || globalPriceRange[1];
                                        handlePriceRangeChange(searchParams.priceRange[0], value);
                                      }}
                                      min={searchParams.priceRange[0] + 1}
                                      max={globalPriceRange[1]}
                                    />
                                    <span className="text-xs text-gray-500 mt-1 block">Max: ${globalPriceRange[1]}</span>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </Grid>

                            {/* Sort By */}
                            <Grid item xs={12} md={4}>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                <label className="flex items-center text-sm font-semibold text-indigo_dye mb-4">
                                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                  </svg>
                                  Sort By
                                </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 sm:h-14 pl-4 pr-10 text-base text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lapis_lazuli focus:border-lapis_lazuli transition-all duration-300 appearance-none cursor-pointer"
                                    value={searchParams.sortBy}
                                    onChange={e => handleInputChange('sortBy', e.target.value)}
                                  >
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Highest Rating</option>
                                    <option value="popularity">Most Popular</option>
                                    <option value="availability">Availability</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                </div>
                              </motion.div>
                            </Grid>
                          </Grid>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </Box>
          </motion.div>

                {/* Results Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Box id="property-section" sx={{ mb: { xs: 6, sm: 8, md: 12, lg: 16 } }}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-12 bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-ash_gray/30"
                    >
                      <div className="flex items-center mb-4 sm:mb-0">
                        <Waves className="w-6 h-6 text-lapis_lazuli mr-3" />
                        <div>
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo_dye">
                            Available Resorts
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">Discover your perfect getaway</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-lapis_lazuli to-indigo_dye text-white px-4 py-2 rounded-full shadow-lg"
                      >
                        <span className="font-bold text-base sm:text-lg">
                          {searchResults.length} resort{searchResults.length !== 1 ? 's' : ''} found
                        </span>
                      </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {searchResults.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                          className="bg-gradient-to-br from-white to-platinum/50 rounded-3xl shadow-xl p-6 sm:p-12 text-center border border-ash_gray/30 backdrop-blur-sm"
                        >
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                          >
                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-ash_gray/30 to-platinum rounded-full flex items-center justify-center">
                              <SearchIcon className="w-12 h-12 text-lapis_lazuli" />
                            </div>
                          </motion.div>
                          <motion.h4 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl sm:text-2xl font-bold text-indigo_dye mb-3"
                          >
                            No resorts match your search criteria
                          </motion.h4>
                          <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-base text-gray-600 mb-6 max-w-md mx-auto leading-relaxed"
                          >
                            Try adjusting your filters or search for a different hotel/resort name to discover amazing destinations
                          </motion.p>
                          <motion.button
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,94,132,0.3)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => setShowFilters(true)}
                            className="bg-gradient-to-r from-lapis_lazuli to-indigo_dye text-white px-8 py-3 text-base font-bold rounded-xl shadow-xl hover:from-indigo_dye hover:to-indigo_dye2 transition-all duration-300 flex items-center mx-auto"
                          >
                            <Filter className="w-5 h-5 mr-2" />
                            Modify Search
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={shouldReduceMotion ? simpleAnimations.container : animations.container}
                          initial="hidden"
                          animate="visible"
                          transition={{ 
                            duration: shouldReduceMotion ? 0.2 : 0.6,
                            staggerChildren: shouldReduceMotion ? 0 : 0.05,
                            delayChildren: shouldReduceMotion ? 0 : 0.1
                          }}
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                          style={{ willChange: 'contents' }}
                        >
                          {searchResults.map((p, index) => (
                            <motion.div
                              key={p._id}
                              variants={shouldReduceMotion ? simpleAnimations.item : animations.item}
                              transition={{ 
                                delay: shouldReduceMotion ? 0 : Math.min(index * 0.03, 0.5),
                                duration: shouldReduceMotion ? 0.1 : 0.4,
                                ease: "easeOut",
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                              }}
                              className="flex w-full"
                              style={{ willChange: 'transform, opacity' }}
                            >
                              <HotelCard
                                hotel={p}
                                availbleNoOfRooms={p.rooms.length}
                                onClick={() => handlePropertyClick(p._id)}
                                onFavoriteToggle={() => toggleFavorite(p._id)}
                                isFavorite={Boolean(favorites[p._id])}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </motion.div>
        </main>
      </div>
      
    </motion.div>
  );
};

export default Search;