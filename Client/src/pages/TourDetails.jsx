import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, IconButton } from '@mui/material';
import TourImages from '../Components/TourImages';
import Itinerary from '../Components/Itinerary';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InquiryForm from '../Components/InquiryForm';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Clock, Calendar, DollarSign, Users, Star, MapPin, Check, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../Components/Footer';

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

const ImageGalleryPopup = ({ images, title, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 text-white z-10 bg-black bg-opacity-50 rounded-lg px-4 py-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-80">{currentImageIndex + 1} of {images.length}</p>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-colors duration-200"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-3 transition-colors duration-200"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="max-w-5xl max-h-full flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt={`${title} ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2 max-w-md overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TourDetails = ({ sidebarOpen }) => {
  const { tourId } = useParams(); 
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState({});
  
  // Image popup states
  const [destinationPopup, setDestinationPopup] = useState(false);
  const [activityPopup, setActivityPopup] = useState(false);
  const [hotelPopup, setHotelPopup] = useState(false);

  const { isMobile, isTablet } = useDeviceType();

  // Use the currency from localStorage consistently.
  const selectedCurrency = localStorage.getItem('selectedCurrency') || 'USD';

  // Food category map remains unchanged.
  const foodCategoryMap = {
    0: 'Half Board',
    1: 'Full Board',
    2: 'All Inclusive'
  };

  // New state for selections.
  const [selectedNightsKey, setSelectedNightsKey] = useState(null);
  const [selectedNightsOption, setSelectedNightsOption] = useState(null);
  // IMPORTANT: Only select a food category if its boolean value is true.
  const [selectedFoodCategory, setSelectedFoodCategory] = useState(null);

  // Price conversion function using selectedCurrency.
  const convertPrice = (priceInUSD) => {
    if (!exchangeRates[selectedCurrency]) return priceInUSD.toLocaleString();
    return (priceInUSD * exchangeRates[selectedCurrency]).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/9609969974`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(`/tours/${tourId}`); 
        console.log(response);
        setTour(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour details:', error);
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
    window.scrollTo(0, 0);
    fetchTourDetails();
  }, [tourId]); 

  useEffect(() => {
    if (tour) {
      // Initialize nights selection if available.
      if (tour.nights && typeof tour.nights === 'object') {
        const nightsKeys = Object.keys(tour.nights);
        if (nightsKeys.length > 0) {
          setSelectedNightsKey(nightsKeys[0]);
          const firstOptions = tour.nights[nightsKeys[0]];
          const optionKeys = Object.keys(firstOptions);
          if (optionKeys.length > 0) {
            setSelectedNightsOption(optionKeys[0]);
          }
        }
      }
      // Initialize food category selection only with those having boolean true.
      if (tour.food_category && typeof tour.food_category === 'object') {
        const availableFoodKeys = Object.keys(tour.food_category).filter(
          key => tour.food_category[key][2] === true
        );
        if (availableFoodKeys.length > 0) {
          setSelectedFoodCategory(availableFoodKeys[0]);
        }
      }
    }
  }, [tour]);

  // Compute days and nights.
  const nightsCount = selectedNightsKey ? parseInt(selectedNightsKey) : 0;
  const daysCount = nightsCount + 1;

  const personCount = tour ? tour.person_count : 1;

  // Compute total price based on selections.
  const basePrice = tour ? tour.price : 0;
  const oldBasePrice = tour ? tour.oldPrice : 0;
  const nightsAddPrice = (selectedNightsKey && selectedNightsOption && tour && tour.nights[selectedNightsKey])
    ? tour.nights[selectedNightsKey][selectedNightsOption].add_price
    : 0;
  const foodAddPrice = (selectedFoodCategory && tour && tour.food_category)
    ? tour.food_category[selectedFoodCategory][0] * nightsCount * personCount
    : 0;
  const totalPrice = basePrice + nightsAddPrice + foodAddPrice;

  const nightsOldPrice = (selectedNightsKey && selectedNightsOption && tour && tour.nights[selectedNightsKey])
    ? tour.nights[selectedNightsKey][selectedNightsOption].old_add_price
    : 0;
  const foodOldPrice = (selectedFoodCategory && tour && tour.food_category)
    ? tour.food_category[selectedFoodCategory][1] * nightsCount * personCount
    : 0;
  const finalOldPrice = oldBasePrice + nightsOldPrice + foodOldPrice;


  const [openDialog, setOpenDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className={`transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-16'} pl-0`}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005E84] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tour details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className={`transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-16'} pl-0`}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour not found</h2>
              <Button
                onClick={() => navigate('/tours')}
                className="bg-[#005E84] hover:bg-[#075375] text-white px-6 py-2 rounded-lg"
              >
                Back to Tours
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handler to open inquiry dialog.
  const handleOpenDialog = () => setOpenDialog(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'sm:pl-64' : 'sm:pl-16'} pl-0`}>
        {/* Navigation removed */}

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1400px] mx-auto">
          {/* Header Section with Tour Title */}
          <header
            className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden mb-4 sm:mb-6 lg:mb-8"
            style={{
              backgroundImage: tour.tour_image 
                ? `linear-gradient(to bottom, rgba(10, 67, 92, 0.5), rgba(10, 67, 92, 0.5)), url(${tour.tour_image})`
                : "linear-gradient(to bottom, rgba(10, 67, 92, 0.5), rgba(10, 67, 92, 0.5)), url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920')"
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold drop-shadow-md mb-2">
                {tour.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center bg-[#005E84]/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[#005E84]" />
                  {daysCount} Days / {nightsCount} Nights
                </div>
                <div className="flex items-center bg-[#B7C5C7]/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[#B7C5C7]" />
                  For {personCount} Person(s)
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Column - Package Options and Images */}
            <div className="xl:col-span-3 space-y-6">
              {/* Package Selection Cards */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-[#005E84]" />
                  Customize Your Package
                </h2>

                {/* Nights Selection */}
                {tour.nights && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Duration</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.keys(tour.nights).map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedNightsKey(key);
                            setSelectedNightsOption(Object.keys(tour.nights[key])[0]);
                          }}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedNightsKey === key
                              ? 'border-[#005E84] bg-[#B7C5C7]/20 text-[#005E84]'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="font-semibold">{key} Nights</div>
                          <div className="text-sm text-gray-500">{parseInt(key) + 1} Days</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Package Options */}
                {selectedNightsKey && tour.nights[selectedNightsKey] && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Package Options</h3>
                    <div className="space-y-3">
                      {Object.keys(tour.nights[selectedNightsKey]).map((optKey) => (
                        <button
                          key={optKey}
                          onClick={() => setSelectedNightsOption(optKey)}
                          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedNightsOption === optKey
                              ? 'border-[#005E84] bg-[#B7C5C7]/20 text-[#005E84]'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="font-medium">
                            {tour.nights[selectedNightsKey][optKey].option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Food Category Selection */}
                {tour.food_category && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Meal Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.keys(tour.food_category)
                        .filter(key => tour.food_category[key][2] === true)
                        .map((key) => (
                          <button
                            key={key}
                            onClick={() => setSelectedFoodCategory(key)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              selectedFoodCategory === key
                                ? 'border-[#075375] bg-[#B7C5C7]/20 text-[#075375]'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="font-medium">{foodCategoryMap[key]}</div>
                          </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Package Includes */}
                {tour.facilities && tour.facilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Package Includes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tour.facilities.map((facility, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image Gallery Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-[#0A435C]" />
                  Tour Gallery
                </h2>

                {/* Image Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Destinations Preview */}
                  {tour.destination_images && tour.destination_images.length > 0 && (
                    <div className="relative group cursor-pointer" onClick={() => setDestinationPopup(true)}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg h-48">
                        <img
                          src={tour.destination_images[0]}
                          alt="Destinations"
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
                        
                        {/* View Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Label */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-bold text-lg">Destinations</p>
                          <p className="text-sm opacity-90">{tour.destination_images.length} Photos</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activities Preview */}
                  {tour.activity_images && tour.activity_images.length > 0 && (
                    <div className="relative group cursor-pointer" onClick={() => setActivityPopup(true)}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg h-48">
                        <img
                          src={tour.activity_images[0]}
                          alt="Activities"
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
                        
                        {/* View Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Label */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-bold text-lg">Activities</p>
                          <p className="text-sm opacity-90">{tour.activity_images.length} Photos</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hotels Preview */}
                  {tour.hotel_images && tour.hotel_images.length > 0 && (
                    <div className="relative group cursor-pointer" onClick={() => setHotelPopup(true)}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg h-48">
                        <img
                          src={tour.hotel_images[0]}
                          alt="Hotels"
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
                        
                        {/* View Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Label */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="font-bold text-lg">Hotels</p>
                          <p className="text-sm opacity-90">{tour.hotel_images.length} Photos</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-[#005E84]" />
                  Tour Itinerary
                </h2>
                <Itinerary selectedNightsKey={selectedNightsKey} />
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Price Card */}
                <div className="bg-gradient-to-br from-[#005E84] to-[#075375] rounded-xl shadow-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Total Price</h3>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {selectedCurrency} {convertPrice(totalPrice)}
                  </div>
                  {finalOldPrice > totalPrice && (
                    <div className="text-[#B7C5C7] line-through text-lg mb-2">
                      {selectedCurrency} {convertPrice(finalOldPrice)}
                    </div>
                  )}
                  <div className="text-[#B7C5C7] text-sm">
                    For {personCount} Person(s)
                  </div>
                </div>

                {/* Tour Details Cards */}
                <div className="space-y-4">
                  {/* Duration Card */}
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#005E84]">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-[#005E84] mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">Duration</div>
                        <div className="text-gray-600">{daysCount} Days / {nightsCount} Nights</div>
                      </div>
                    </div>
                  </div>

                  {/* Valid Period Card */}
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#B7C5C7]">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-[#B7C5C7] mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">Valid Period</div>
                        <div className="text-gray-600 text-sm">
                          {new Date(tour.valid_from).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} - {new Date(tour.valid_to).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expiry Card */}
                  <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#0A435C]">
                    <div className="flex items-center">
                      <CalendarMonthIcon className="w-5 h-5 text-[#0A435C] mr-3" />
                      <div>
                        <div className="font-semibold text-gray-800">Expires On</div>
                        <div className="text-gray-600">
                          {new Date(tour.expiry_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleOpenDialog}
                    className="w-full bg-gradient-to-r from-[#005E84] to-[#075375] hover:from-[#075375] hover:to-[#0A435C] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <SendIcon className="w-5 h-5 mr-2" />
                    Inquire Now
                  </button>
                  
                  <button
                    onClick={() => navigate('/tours')}
                    className="w-full bg-[#B7C5C7] hover:bg-[#0A435C] text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Back to Tours
                </button>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-[#075375] hover:bg-[#0A435C] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <WhatsAppIcon className="w-6 h-6" />
      </button>

      {/* Image Gallery Popups */}
      <ImageGalleryPopup
        images={tour?.destination_images}
        title="Destinations"
        isOpen={destinationPopup}
        onClose={() => setDestinationPopup(false)}
      />
      
      <ImageGalleryPopup
        images={tour?.activity_images}
        title="Activities"
        isOpen={activityPopup}
        onClose={() => setActivityPopup(false)}
      />
      
      <ImageGalleryPopup
        images={tour?.hotel_images}
        title="Hotels"
        isOpen={hotelPopup}
        onClose={() => setHotelPopup(false)}
      />

      {/* Inquiry Form Dialog */}
      <InquiryForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedTour={tour}
        selectedCurrency={selectedCurrency}
        convertPrice={convertPrice}
        isMobile={isMobile}
        finalPrice={totalPrice}
        finalOldPrice={finalOldPrice}
        selectedNightsKey={selectedNightsKey}
        selectedNightsOption={selectedNightsOption}
        selectedFoodCategory={selectedFoodCategory}
      />
    </div>
  );
};

export default TourDetails;
