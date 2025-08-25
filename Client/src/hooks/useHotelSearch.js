// src/hooks/useHotelSearch.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { safeAccess, INITIAL_PARAMS, getRoomPrice } from '../utils/searchUtils';

export const useHotelSearch = (location) => {
  const navigate = useNavigate();

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

  return {
    // State
    hotels,
    allRooms,
    loading,
    searchResults,
    globalPriceRange,
    searchParams,
    favorites,
    showFilters,
    countrySearch,
    showCountryDropdown,
    selectedCountry,
    destinationSearch,
    showDestinationDropdown,
    selectedDestination,
    dateRange,
    datePickerRef,
    
    // State setters
    setShowFilters,
    setCountrySearch,
    setShowCountryDropdown,
    setSelectedCountry,
    setDestinationSearch,
    setShowDestinationDropdown,
    setSelectedDestination,
    setDateRange,
    
    // Handlers
    handleInputChange,
    handleChildrenChange,
    handleChildAgeChange,
    handlePriceRangeChange,
    handleSearch,
    handleReset,
    handlePropertyClick,
    toggleFavorite,
    getAvailbleRooms,
    calculatePriceRangeStyles,
  };
};
