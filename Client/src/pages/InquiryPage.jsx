import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Swal from 'sweetalert2';

const foodCategoryMap = {
  0: 'Half Board',
  1: 'Full Board',
  2: 'All Inclusive'
};

// Country codes for phone number selection
const countryCodes = [
  { code: "+1", label: "🇺🇸" },
  { code: "+44", label: "🇬🇧" },
  { code: "+91", label: "🇮🇳" },
  { code: "+61", label: "🇦🇺" },
  { code: "+49", label: "🇩🇪" },
  { code: "+33", label: "🇫🇷" },
  { code: "+81", label: "🇯🇵" },
  { code: "+86", label: "🇨🇳" },
  { code: "+971", label: "🇦🇪" },
  { code: "+7", label: "🇷🇺" },
  { code: "+55", label: "🇧🇷" },
  { code: "+34", label: "🇪🇸" },
  { code: "+39", label: "🇮🇹" },
  { code: "+82", label: "🇰🇷" },
  { code: "+92", label: "🇵🇰" },
  { code: "+90", label: "🇹🇷" },
  { code: "+27", label: "🇿🇦" },
  { code: "+234", label: "🇳🇬" },
  { code: "+20", label: "🇪🇬" },
  { code: "+351", label: "🇵🇹" },
  { code: "+31", label: "🇳🇱" },
  { code: "+46", label: "🇸🇪" },
  { code: "+41", label: "🇨🇭" },
  { code: "+32", label: "🇧🇪" },
  { code: "+43", label: "🇦🇹" },
  { code: "+47", label: "🇳🇴" },
  { code: "+45", label: "🇩🇰" },
  { code: "+380", label: "🇺🇦" },
  { code: "+66", label: "🇹🇭" },
  { code: "+65", label: "🇸🇬" },
  { code: "+64", label: "🇳🇿" },
  { code: "+63", label: "🇵🇭" },
  { code: "+60", label: "🇲🇾" },
  { code: "+62", label: "🇮🇩" },
  { code: "+58", label: "🇻🇪" },
  { code: "+57", label: "🇨🇴" },
  { code: "+56", label: "🇨🇱" },
  { code: "+52", label: "🇲🇽" },
  { code: "+51", label: "🇵🇪" },
  { code: "+48", label: "🇵🇱" },
  { code: "+40", label: "🇷🇴" },
  { code: "+420", label: "🇨🇿" },
  { code: "+36", label: "🇭🇺" },
  { code: "+98", label: "🇮🇷" },
  { code: "+212", label: "🇲🇦" },
  { code: "+213", label: "🇩🇿" },
  { code: "+216", label: "🇹🇳" },
  { code: "+94", label: "🇱🇰" },
  { code: "+880", label: "🇧🇩" },
  { code: "+972", label: "🇮🇱" },
  { code: "+353", label: "🇮🇪" },
  { code: "+354", label: "🇮🇸" },
  { code: "+505", label: "🇳🇮" },
  { code: "+509", label: "🇭🇹" },
  { code: "+93", label: "🇦🇫" },
  { code: "+995", label: "🇬🇪" },
  { code: "+374", label: "🇦🇲" },
  { code: "+993", label: "🇹🇲" },
  { code: "+998", label: "🇺🇿" },
  { code: "+675", label: "🇵🇬" },
  { code: "+679", label: "🇫🇯" },
  { code: "+676", label: "🇹🇴" },
  { code: "+960", label: "🇲🇻" },
  { code: "+248", label: "🇸🇨" },
  { code: "+267", label: "🇧🇼" },
  { code: "+254", label: "🇰🇪" },
  { code: "+255", label: "🇹🇿" },
  { code: "+256", label: "🇺🇬" },
  { code: "+233", label: "🇬🇭" },
  { code: "+225", label: "🇨🇮" },
  { code: "+221", label: "🇸🇳" },
  { code: "+218", label: "🇱🇾" },
  { code: "+964", label: "🇮🇶" },
  { code: "+967", label: "🇾🇪" },
  { code: "+965", label: "🇰🇼" },
  { code: "+966", label: "🇸🇦" },
  { code: "+973", label: "🇧🇭" },
  { code: "+974", label: "🇶🇦" },
  { code: "+968", label: "🇴🇲" },
  { code: "+961", label: "🇱🇧" },
  { code: "+963", label: "🇸🇾" },
  { code: "+249", label: "🇸🇩" },
  { code: "+211", label: "🇸🇸" },
  { code: "+975", label: "🇧🇹" },
  { code: "+977", label: "🇳🇵" },
  { code: "+856", label: "🇱🇦" },
  { code: "+855", label: "🇰🇭" },
  { code: "+852", label: "🇭🇰" },
  { code: "+853", label: "🇲🇴" },
  { code: "+373", label: "🇲🇩" },
  { code: "+381", label: "🇷🇸" },
  { code: "+382", label: "🇲🇪" },
  { code: "+389", label: "🇲🇰" },
];

const InquiryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('InquiryPage loaded');
  console.log('Location:', location);
  console.log('Location state:', location.state);
  
  // Get data from navigation state
  const {
    selectedTour,
    selectedCurrency,
    exchangeRates,
    finalPrice,
    finalOldPrice,
    selectedNightsKey,
    selectedNightsOption,
    selectedFoodCategory,
  } = location.state || {};

  // Create convertPrice function using exchangeRates
  const convertPrice = (priceInUSD) => {
    if (!exchangeRates || !exchangeRates[selectedCurrency]) {
      return priceInUSD.toLocaleString();
    }
    return (priceInUSD * exchangeRates[selectedCurrency]).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  console.log('Selected tour:', selectedTour);

  // Local state for the enquiry form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellerCount, setTravellerCount] = useState('');
  const [message, setMessage] = useState('');

  // If no tour data, redirect back
  useEffect(() => {
    console.log('InquiryPage useEffect - selectedTour:', selectedTour);
    if (!selectedTour) {
      console.log('No selectedTour found, redirecting back');
      // Add a small delay to allow for debugging
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  }, [selectedTour, navigate]);

  // Reset form when component mounts
  useEffect(() => {
    // Form is already initialized to empty strings
  }, []);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmitInquiry = async () => {
    try {
      const nightsOption =
        selectedTour?.nights?.[String(selectedNightsKey)]?.[String(selectedNightsOption)]?.option ||
        selectedNightsOption;
      const foodCategoryLabel = foodCategoryMap[String(selectedFoodCategory)] || selectedFoodCategory;
      const numericNightsKey = selectedNightsKey ? parseInt(selectedNightsKey, 10) : 0;

      const payload = {
        name,
        email,
        phone_number: `${phoneNumber} ${phoneNumber1}`,
        travel_date: travelDate,
        traveller_count: travellerCount,
        message,
        tour: selectedTour?.title,
        final_price: finalPrice,
        currency: selectedCurrency,
        selected_nights_key: numericNightsKey,
        selected_nights_option: nightsOption,
        selected_food_category: foodCategoryLabel,
      };

      const response = await axios.post('/inquiries', payload);
      console.log('Inquiry response:', response);

      // If we reach here without an error, treat it as success:
      Swal.fire('Success!', 'Your inquiry has been submitted successfully.', 'success');
      navigate(-1); // Go back after successful submission
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Swal.fire('Error!', 'Failed to submit inquiry. Please try again.', 'error');
    }
  };

  if (!selectedTour) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <IconButton onClick={handleClose} className="mr-4">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" className="font-bold text-gray-800">
            Get Custom Quote
          </Typography>
        </div>

        {/* Tour Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#005E84] to-[#075375] p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              Tour Details
            </h2>
          </div>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {selectedTour?.tour_image && (
                <img
                  src={selectedTour.tour_image}
                  alt={selectedTour.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '16px',
                  }}
                />
              )}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedTour?.title || 'Tour Title'}
                </Typography>
                {finalPrice && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: '8px' }}>
                    <Typography
                      sx={{
                        color: '#333',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                      }}
                    >
                      {selectedCurrency} {convertPrice(finalPrice || 0)}
                    </Typography>
                    {finalOldPrice && (
                      <Typography
                        sx={{
                          ml: '12px',
                          color: '#888',
                          textDecoration: 'line-through',
                          fontSize: '1rem',
                        }}
                      >
                        {selectedCurrency} {convertPrice(finalOldPrice || 0)}
                      </Typography>
                    )}
                    {finalOldPrice && finalPrice && (
                      <Typography
                        sx={{
                          ml: '12px',
                          backgroundColor: 'green',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                        }}
                      >
                        SAVE {selectedCurrency} {convertPrice(finalOldPrice - finalPrice)}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Your Selections */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your Selections:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
              <Typography variant="body1">
                <strong>Nights:</strong> {selectedNightsKey || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Option:</strong> {selectedTour?.nights?.[selectedNightsKey]?.[selectedNightsOption]?.option || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ gridColumn: 'span 2' }}>
                <strong>Food Category:</strong> {foodCategoryMap[selectedFoodCategory] || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#075375] to-[#0A435C] p-6">
            <h2 className="text-2xl font-bold text-white">
              Contact Information
            </h2>
            <p className="text-gray-100 mt-1">Fill in your details to connect with our travel experts</p>
          </div>

          <Box sx={{ p: 3 }}>
            <TextField
              required
              label="Full Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: '8px', mt: 2, mb: 1 }}>
              <Autocomplete
                options={countryCodes}
                getOptionLabel={(option) => `${option.label} ${option.code}`}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{option.label}</Typography>
                    <Typography>{option.code}</Typography>
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Country Code" />}
                onChange={(event, newValue) => setPhoneNumber(newValue ? newValue.code : '')}
                sx={{ width: '200px' }}
              />
              <TextField
                required
                label="Your Phone"
                fullWidth
                type="tel"
                value={phoneNumber1}
                onChange={(e) => setPhoneNumber1(e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: '8px', mt: 2, mb: 1 }}>
              <TextField
                required
                label="Travel Date"
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
              <TextField
                required
                label="Traveller Count"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={travellerCount}
                onChange={(e) => setTravellerCount(e.target.value)}
              />
            </Box>
            <TextField
              label="Message (Optional)"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your specific requirements, preferences, or any questions you have..."
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleSubmitInquiry}
                sx={{
                  backgroundColor: '#016170',
                  color: '#fff',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#e65c00',
                  },
                }}
              >
                Connect with an Expert
              </Button>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;
