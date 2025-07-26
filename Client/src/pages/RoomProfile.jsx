import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  FaBed,
  FaRulerCombined,
  FaUsers,
  FaArrowLeft,
  FaBook,
  FaCheckCircle,
  FaShip,
  FaPlane,
  FaCar,
  FaPlaneDeparture,
} from 'react-icons/fa';
import Footer from '../Components/Footer';

// Helper: compute price including market surcharge
const getRoomPrice = (room, market) => {
  const surcharge = room.prices?.find(p => p.market === market)?.price || 0;
  return Number(room.basePrice || 0) + surcharge;
};

const getTransportIcon = (method) => {
  const lowerMethod = method.toLowerCase();
  if (lowerMethod.includes('boat') || lowerMethod.includes('ship')) return <FaShip className="text-lapis_lazuli" />;
  if (lowerMethod.includes('plane') && !lowerMethod.includes('domestic')) return <FaPlane className="text-lapis_lazuli" />;
  if (lowerMethod.includes('domestic flight')) return <FaPlaneDeparture className="text-lapis_lazuli" />;
  return <FaCar className="text-lapis_lazuli" />;
};

export default function EnhancedRoomProfile() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const previousRoute = location.state?.previousRoute || '/search';
  const selectedMarket = location.state?.selectedMarket || '';

  const [roomData, setRoomData] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [selectedMarketObj, setSelectedMarketObj] = useState(
    selectedMarket ? null : null // will set after markets load
  );
  const [marketSearch, setMarketSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const [perNightPrice, setPerNightPrice] = useState(0);
  const [availableMarkets, setAvailableMarkets] = useState([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.market-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data: room } = await axios.get(`/rooms/${roomId}`);
        const hotelId = typeof room.hotel === 'object' ? room.hotel._id : room.hotel;
        const { data: hotel } = await axios.get(`/hotels/${hotelId}`);

        const mealPlans = hotel.mealPlans || [];
        let cheapest = mealPlans.length
          ? mealPlans.reduce((min, p) => p.price < min.price ? p : min, mealPlans[0])
          : null;

        const computedPrice = getRoomPrice(room, selectedMarket);
        setRoomData({
          ...room,
          hotelId,
          hotelName: hotel.name,
          basePricePerNight: computedPrice,
          images: room.gallery,
          highlights: room.highlights || [],
          mealPlans
        });
        if (cheapest) setSelectedMealPlan(cheapest);
      } catch (err) {
        console.error(err);
        setError('Room not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, selectedMarket]);

  useEffect(() => {
    if (!roomData) return;

    const { checkIn, checkOut } = location.state || {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let periodPrice = 0;
    if (roomData?.pricePeriods?.length) {
      const applicablePeriod = roomData.pricePeriods
        .filter(period => {
          const start = new Date(period.startDate);
          const end = new Date(period.endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return start <= today && end >= today;
        })
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];

      if (applicablePeriod) {
        periodPrice = applicablePeriod.price;
      }
    }

    const market = selectedMarketObj?.name || selectedMarket;
    const surcharge = roomData?.prices?.find(p => p.market === market)?.price || 0;
    const finalPerNightPrice = Math.round(periodPrice + surcharge) * 100 / 100;

    setPerNightPrice(finalPerNightPrice);
  }, [roomData, location.state, selectedMarketObj, selectedMarket]);

  // Fetch all available markets from backend
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data } = await axios.get('/rooms/markets');
        setAvailableMarkets(data.map(m => ({ name: m })));
      } catch (err) {
        setAvailableMarkets([
          { name: 'India' },
          { name: 'China' },
          { name: 'Middle East' },
          { name: 'South East Asia' },
          { name: 'Asia' },
          { name: 'Europe' },
          { name: 'Russia & CIS' },
        ]);
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (selectedMarket && availableMarkets.length > 0) {
      const found = availableMarkets.find(m => m.name === selectedMarket);
      setSelectedMarketObj(found || null);
    }
  }, [selectedMarket, availableMarkets]);

  const handleBack = () => navigate(previousRoute);

  const handleBookNow = () => {
    if (!roomData) return;

    if (!selectedMarketObj?.name && !selectedMarket) {
      alert('Please select your market before booking');
      return;
    }

    const { checkIn, checkOut } = location.state || {};

    if (!checkIn || !checkOut) {
      alert('Please select both check-in and check-out dates before booking');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (!(checkInDate instanceof Date) || isNaN(checkInDate.getTime())) {
      alert('Invalid check-in date. Please select a valid date.');
      return;
    }

    if (!(checkOutDate instanceof Date) || isNaN(checkOutDate.getTime())) {
      alert('Invalid check-out date. Please select a valid date.');
      return;
    }

    if (checkInDate >= checkOutDate) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    navigate('/bookingRequest', {
      state: {
        roomId: roomData._id,
        hotelId: roomData.hotelId,
        roomName: roomData.roomName,
        hotelName: roomData.hotelName,
        basePricePerNight: perNightPrice,
        mealPlan: selectedMealPlan,
        market: selectedMarketObj?.name || selectedMarket,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        previousRoute: location.state?.previousRoute || '/search'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lapis_lazuli border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="text-center p-10 text-red-500 text-xl font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-poppins">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={handleBack}
          className="flex items-center text-indigo_dye hover:text-indigo_dye mb-6 transition duration-300"
        >
          <FaArrowLeft className="mr-2 text-lg" /> Back to {roomData.hotelName}
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{roomData.roomName}</h1>
          <p className="text-lg text-gray-600 mt-2">{roomData.hotelName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md">
              <div className="relative h-[500px]">
                <img
                  src={roomData.images[activeImage]}
                  alt={roomData.roomName}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {roomData.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        activeImage === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex p-4 gap-3 overflow-x-auto">
                {roomData.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`View ${idx + 1}`}
                    className={`h-24 w-36 object-cover cursor-pointer rounded-lg transition-all ${
                      activeImage === idx ? 'ring-2 ring-lapis_lazuli' : 'hover:ring-2 hover:ring-lapis_lazuli/60'
                    }`}
                    onClick={() => setActiveImage(idx)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Room</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {roomData.description}
              </p>
              {roomData.highlights.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Room Highlights
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roomData.highlights.map((hl, i) => (
                      <li key={i} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-3 text-lg" />
                        <span className="text-gray-700">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Room Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <FaRulerCombined className="text-lapis_lazuli mr-3 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">Room Size</p>
                    <p className="font-medium text-gray-800">{roomData.size} m²</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaBed className="text-lapis_lazuli mr-3 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">Bed Type</p>
                    <p className="font-medium text-gray-800">{roomData.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-lapis_lazuli mr-3 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">Occupancy</p>
                    <p className="font-medium text-gray-800">
                      {roomData.maxOccupancy.adults} Adults,{' '}
                      {roomData.maxOccupancy.children} Children
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {roomData.transportations && roomData.transportations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transportation</h2>
                <div className="flex flex-wrap gap-2">
                  {roomData.transportations.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#B7C5C733] text-indigo_dye px-4 py-2 rounded-lg text-sm">
                      {getTransportIcon(t.method)}
                      <span className="font-medium">
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}: {t.method}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomData.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Price Details</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-indigo_dye">
                    ${perNightPrice}
                  </span>
                  <span className="text-gray-600 ml-2 text-lg">per night</span>
                </div>
                {selectedMarketObj?.name && (
                  <div className="text-sm text-indigo_dye mt-1">
                    Price adjusted for {selectedMarketObj.name} market
                    {roomData.prices?.find(p => p.market === selectedMarketObj.name)?.price > 0 && (
                      <span className="ml-1">
                        (+${roomData.prices.find(p => p.market === selectedMarketObj.name).price} surcharge)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-4 market-dropdown">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Market <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full h-10 px-3 border ${!selectedMarketObj?.name && !selectedMarket ? 'border-red-300' : 'border-gray-300'} rounded-md`}
                    placeholder="Search market..."
                    value={marketSearch || (selectedMarketObj ? selectedMarketObj.name : '')}
                    onChange={e => {
                      setMarketSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onClick={() => setShowDropdown(prev => !prev)}
                  />
                  {selectedMarketObj && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-800"
                      onClick={() => {
                        setSelectedMarketObj(null);
                        setMarketSearch('');
                        setSelectedMarket('');
                      }}
                    >
                      ×
                    </button>
                  )}
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                      {availableMarkets
                        .filter(m =>
                          marketSearch === ''
                            ? true
                            : m.name.toLowerCase().includes(marketSearch.toLowerCase())
                        )
                        .map(m => (
                          <div
                            key={m.name}
                            className="px-4 py-2 hover:bg-[#B7C5C733] cursor-pointer"
                            onClick={() => {
                              setSelectedMarketObj(m);
                              setMarketSearch(m.name);
                              setSelectedMarket(m.name);
                              setShowDropdown(false);
                            }}
                          >
                            {m.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {!selectedMarketObj?.name && !selectedMarket && (
                  <p className="text-red-500 text-sm mt-1">Please select your market</p>
                )}
              </div>

               <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Plan
                </label>
                <select
                  className="w-full h-10 px-3 border border-gray-300 rounded-md"
                  value={selectedMealPlan?.planName || ''}
                  onChange={e => {
                    const plan = roomData.mealPlans.find(p => p.planName === e.target.value);
                    setSelectedMealPlan(plan);
                  }}
                >
                  {roomData.mealPlans.map(p => (
                    <option key={p.planName} value={p.planName}>
                      {p.planName} (+${p.price})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-indigo_dye hover:bg-[#0A435C] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
              >
                <FaBook className="text-lg" /> Book Now
              </button>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}