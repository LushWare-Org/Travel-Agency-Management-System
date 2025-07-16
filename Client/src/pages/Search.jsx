// src/pages/Search.jsx
import React, { useState, useEffect, useRef } from 'react';
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
import Header from '../Components/Header';
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

const Search = ({ sidebarOpen }) => {
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
        alert('Could not load properties.');
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

  const toggleFavorite = id => setFavorites(f => ({ ...f, [id]: !f[id] }));  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-16'} pl-0`}>
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-16'} pl-0`}>
        <Header isAuthenticated={true} isAdmin={false} />
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1400px] mx-auto">
          {/* Banner */}
          <header
            className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920')"
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold drop-shadow-md">Discover Paradise</h1>
              <p className="text-xs sm:text-sm mt-2 drop-shadow-md max-w-md px-4">
                Find your perfect Maldives getaway with exclusive B2B rates
              </p>
            </div>
          </header>

          {/* Search Form */}
          <Box sx={{ 
            mt: { xs: 2, sm: 4, lg: 6 },
            mx: 'auto',
            maxWidth: '100%',
            width: '100%'
          }}>
            <Card elevation={5} sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(255,255,255,0.98)'
            }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                  {/* Destination */}
                  <Grid item xs={12} md={6} lg={4}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel / Resort Name</label>
                    <div className="relative destination-dropdown">
                      <input
                        type="text"
                        className="w-full h-10 sm:h-12 pl-3 pr-10 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter hotel or resort name"
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
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-800"
                          onClick={() => {
                            setSelectedDestination(null);
                            setDestinationSearch('');
                            handleInputChange('destination', '');
                          }}
                        >
                          ×
                        </button>
                      )}
                      {showDestinationDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {hotels
                            .filter(h =>
                              destinationSearch === ''
                                ? true
                                : (h.name || '').toLowerCase().includes(destinationSearch.toLowerCase())
                            )
                            .map(h => (
                              <div
                                key={h._id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm sm:text-base"
                                onClick={() => {
                                  setSelectedDestination(h);
                                  setDestinationSearch(h.name);
                                  handleInputChange('destination', h.name);
                                  setShowDestinationDropdown(false);
                                }}
                              >
                                {h.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </Grid>

                  {/* Check-in */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                    <div className="relative w-full">
                      <div
                        className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer w-full"
                        onClick={() => datePickerRef.current?.setOpen(true)}
                      >
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                          <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
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
                          placeholder="Select check-in date"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg cursor-pointer text-xs sm:text-base"
                        />
                      </div>
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
                  </Grid>

                  <Grid item xs={12} sm={6} lg={4}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                    <div className="relative w-full">
                      <div
                        className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer w-full"
                        onClick={() => datePickerRef.current?.setOpen(true)}
                      >
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                          <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
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
                          placeholder="Select check-out date"
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg cursor-pointer text-xs sm:text-base"
                        />
                      </div>
                    </div>
                  </Grid>

                  {/* Custom calendar style*/}
                  <style jsx global>{`
                    .react-datepicker {
                      font-family: 'Inter', sans-serif;
                      border: 1px solid #e5e7eb;
                      border-radius: 0.5rem;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                      width: 260px;
                      z-index: 1000;
                      background-color: white;
                    }
                    @media (min-width: 640px) {
                      .react-datepicker {
                        width: 280px;
                      }
                    }
                    @media (min-width: 768px) {
                      .react-datepicker {
                        width: 300px;
                      }
                    }
                    .react-datepicker__header {
                      background-color: #2563eb;
                      color: white;
                      border-top-left-radius: 0.5rem;
                      border-top-right-radius: 0.5rem;
                      padding: 0.5rem;
                    }
                    .react-datepicker__current-month,
                    .react-datepicker__day-name {
                      color: white;
                      font-weight: 600;
                      font-size: 0.7rem;
                    }
                    @media (min-width: 640px) {
                      .react-datepicker__current-month,
                      .react-datepicker__day-name {
                        font-size: 0.75rem;
                      }
                    }
                    @media (min-width: 768px) {
                      .react-datepicker__current-month,
                      .react-datepicker__day-name {
                        font-size: 0.875rem;
                      }
                    }
                    .react-datepicker__day {
                      color: #1f2937;
                      border-radius: 0.375rem;
                      transition: all 0.2s;
                      width: 30px;
                      height: 30px;
                      line-height: 30px;
                      font-size: 0.7rem;
                    }
                    @media (min-width: 640px) {
                      .react-datepicker__day {
                        width: 32px;
                        height: 32px;
                        line-height: 32px;
                        font-size: 0.75rem;
                      }
                    }
                    @media (min-width: 768px) {
                      .react-datepicker__day {
                        width: 36px;
                        height: 36px;
                        line-height: 36px;
                        font-size: 0.875rem;
                      }
                    }
                    .react-datepicker__day:hover {
                      background-color: #dbeafe;
                      color: #2563eb;
                    }
                    .react-datepicker__day--selected,
                    .react-datepicker__day--in-range,
                    .react-datepicker__day--in-selecting-range {
                      background-color: #dbeafe;
                      color: #2563eb;
                    }
                    .react-datepicker__day--range-start,
                    .react-datepicker__day--range-end {
                      background-color: #2563eb !important;
                      color: white !important;
                    }
                    .react-datepicker__day--range-start:hover,
                    .react-datepicker__day--range-end:hover {
                      background-color: #1e40af !important;
                    }
                    .react-datepicker__day--outside-month {
                      color: #d1d5db;
                    }
                    .react-datepicker__day--disabled {
                      color: #d1d5db;
                      cursor: not-allowed;
                    }
                    .react-datepicker__navigation-icon::before {
                      border-color: white;
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
                  `}</style>

                  {/* Nationality */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <div className="relative nationality-dropdown">
                      <input
                        type="text"
                        className="w-full h-12 pl-3 pr-10 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-800"
                          onClick={() => {
                            setSelectedCountry(null);
                            setCountrySearch('');
                            handleInputChange('nationality', '');
                          }}
                        >
                          ×
                        </button>
                      )}

                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {countries
                            .filter(c =>
                              countrySearch === ''
                                ? true
                                : c.name.toLowerCase().includes(countrySearch.toLowerCase())
                            )
                            .map(c => (
                              <div
                                key={c.name}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setCountrySearch(c.flag + ' ' + c.name);
                                  handleInputChange('nationality', c.name);
                                  setShowCountryDropdown(false);
                                }}
                              >
                                {c.flag} {c.name}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </Grid>

                  {/* Meal Plan */}
                  <Grid item xs={12} sm={6} lg={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                    <select
                      className="w-full h-10 sm:h-12 pl-3 pr-10 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchParams.mealPlan}
                      onChange={e => handleInputChange('mealPlan', e.target.value)}
                    >
                      <option value="">All Meal Plans</option>
                      <option value="Full Board">Full Board</option>
                      <option value="Half Board">Half Board</option>
                      <option value="All-Inclusive">All-Inclusive</option>
                    </select>
                  </Grid>

                  {/* Rooms */}
                  <Grid item xs={6} sm={6} lg={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                    <div className="flex items-center h-10 sm:h-12 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="w-8 sm:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => handleInputChange('rooms', Math.max(1, searchParams.rooms - 1))}
                      >−</button>
                      <div className="flex-1 text-center text-sm sm:text-base font-medium">
                        {searchParams.rooms}
                      </div>
                      <button
                        className="w-8 sm:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => handleInputChange('rooms', searchParams.rooms + 1)}
                      >+</button>
                    </div>
                  </Grid>

                  {/* Adults */}
                  <Grid item xs={6} sm={6} lg={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                    <div className="flex items-center h-10 sm:h-12 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="w-8 sm:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => handleInputChange('adults', Math.max(1, searchParams.adults - 1))}
                      >−</button>
                      <div className="flex-1 text-center text-sm sm:text-base font-medium">
                        {searchParams.adults}
                      </div>
                      <button
                        className="w-8 sm:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => handleInputChange('adults', searchParams.adults + 1)}
                      >+</button>
                    </div>
                  </Grid>

                  {/* Children */}
                  <Grid item xs={6} sm={6} lg={3}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                    <div className="flex items-center h-10 sm:h-12 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        className="w-8 sm:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => handleChildrenChange(Math.max(0, searchParams.children - 1))}
                      >−</button>
                      <div className="flex-1 text-center text-sm sm:text-base font-medium">
                        {searchParams.children}
                      </div>
                      <button
                        className="w-8 sm:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => handleChildrenChange(searchParams.children + 1)}
                      >+</button>
                    </div>
                  </Grid>

                  {/* Children Ages */}
                  {searchParams.children > 0 && (
                    <Grid item xs={12}>
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Children Ages</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                          {searchParams.childrenAges.map((age, i) => (
                            <select
                              key={i}
                              className="w-full h-10 sm:h-12 pl-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={age}
                              onChange={e => handleChildAgeChange(i, e.target.value)}
                            >
                              {[...Array(18).keys()].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'year' : 'years'}</option>
                              ))}
                            </select>
                          ))}
                        </div>
                      </div>
                    </Grid>
                  )}
                </Grid>

                  {/* Buttons */}                    
                  <Box sx={{ 
  display: 'flex', 
  flexDirection: { xs: 'column', sm: 'row' }, 
  justifyContent: 'space-between', 
  alignItems: { xs: 'stretch', sm: 'center' }, 
  gap: { xs: 2, sm: 0 }, 
  mt: { xs: 3, sm: 4 }, 
  mb: { xs: 4, sm: 5 } 
}}>
  <button
    onClick={() => setShowFilters(f => !f)}
    className="flex items-center justify-center sm:justify-start text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
    {showFilters ? 'Hide Filters' : 'Show Filters'}
  </button>
  <div className="flex flex-col sm:flex-row gap-2">
    <button
      onClick={handleReset}
      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      Reset
    </button>
    <button
      onClick={handleSearch}
      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
    >
      Search Properties
    </button>
  </div>
</Box>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <Box sx={{ 
                      mt: { xs: 3, sm: 4 }, 
                      mb: { xs: 4, sm: 6 }, 
                      pt: { xs: 3, sm: 4 },
                      borderTop: '1px solid #e5e7eb' 
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}>
                      Advanced Filters
                    </Typography>
                    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                      {/* Price Range */}
                      <Grid item xs={12} md={8}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                          Price Range (${searchParams.priceRange[0]} – ${searchParams.priceRange[1]})
                        </label>
                        <div className="h-2 bg-gray-200 rounded-full w-full">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={calculatePriceRangeStyles()}
                          />
                        </div>
                        <div className="flex gap-3 sm:gap-4 justify-between mt-2 sm:mt-3">
                          <div className="w-full">
                            <input
                              type="number"
                              className="w-full h-10 sm:h-12 px-3 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
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
                          <div className="w-full">
                            <input
                              type="number"
                              className="w-full h-10 sm:h-12 px-3 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-lg"
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
                      </Grid>

                      {/* Sort By */}
                      <Grid item xs={12} md={4}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                          className="w-full h-10 sm:h-12 pl-3 pr-10 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={searchParams.sortBy}
                          onChange={e => handleInputChange('sortBy', e.target.value)}
                        >
                          <option value="price_low">Price: Low to High</option>
                          <option value="price_high">Price: High to Low</option>
                          <option value="rating">Highest Rating</option>
                          <option value="popularity">Most Popular</option>
                          <option value="availability">Availability</option>
                        </select>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Results */}
                <Box id="property-section" sx={{ mb: { xs: 4, sm: 6, md: 8, lg: 12 } }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
                      Available Properties
                    </h3>
                    <span className="text-indigo-600 font-medium text-sm sm:text-base">
                      {searchResults.length} properties found
                    </span>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 text-center border border-gray-200">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        No properties match your search criteria
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        Try adjusting your filters or search for a different hotel/resort name
                      </p>
                      <button
                        onClick={() => setShowFilters(true)}
                        className="bg-indigo-600 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                      >
                        Modify Search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      {searchResults.map(p => (
                        <div key={p._id} className="flex w-full">
                          <HotelCard
                            hotel={p}
                            availbleNoOfRooms={p.rooms.length}
                            onClick={() => handlePropertyClick(p._id)}
                            onFavoriteToggle={() => toggleFavorite(p._id)}
                            isFavorite={Boolean(favorites[p._id])}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Search;