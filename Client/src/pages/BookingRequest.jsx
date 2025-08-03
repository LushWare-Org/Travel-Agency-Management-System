"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import Footer from "../Components/Footer"
import { FaCheckCircle, FaBed, FaRulerCombined, FaUsers, FaShip, FaPlane, FaCar, FaPlaneDeparture } from "react-icons/fa"
import { countries } from "../assets/nationalities"

const BookingRequest = ({ sidebarOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(0)
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    childrenAges: [],
    rooms: 1,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    specialRequests: "",
    mealPlan: location.state?.mealPlan?.planName || "All-Inclusive",
    selectedMealPlan: location.state?.mealPlan || null,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [hotel, setHotel] = useState(null)
  const [room, setRoom] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [offers, setOffers] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [autoAppliedOffers, setAutoAppliedOffers] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [passengerDetails, setPassengerDetails] = useState([])
  const [childPassengerDetails, setChildPassengerDetails] = useState([])
  const [marketSurcharge, setMarketSurcharge] = useState(0)

  const {
    roomId,
    hotelId,
    roomName,
    hotelName,
    basePricePerNight,
    checkIn,
    checkOut,
    mealPlan,
    previousRoute,
    selectedNationality,
    market,
  } = location.state || {}

  // Find market surcharge if available
  useEffect(() => {
    if (room && market) {
      const marketPrice = room.prices?.find(p => p.market === market)?.price || 0
      // If basePricePerNight === room.basePrice + marketPrice, then marketPrice is already included
      if (typeof room.basePrice === 'number' && (Number(basePricePerNight) === Number(room.basePrice) + Number(marketPrice))) {
        setMarketSurcharge(0)
      } else {
        setMarketSurcharge(Number(marketPrice))
      }
    }
  }, [room, market, basePricePerNight])

  const steps = ["Dates & Guests", "Client Information", "Review", "Confirmation"]

  // Helper to get transport icon
  const getTransportIcon = (method) => {
    const lowerMethod = method.toLowerCase()
    if (lowerMethod.includes('boat') || lowerMethod.includes('ship')) return <FaShip className="text-[#005E84]" />
    if (lowerMethod.includes('plane') && !lowerMethod.includes('domestic')) return <FaPlane className="text-[#005E84]" />
    if (lowerMethod.includes('domestic flight')) return <FaPlaneDeparture className="text-[#005E84]" />
    return <FaCar className="text-[#005E84]" />
  }

  // Validate dates on mount and redirect if invalid
  useEffect(() => {
    let checkInDate = null
    let checkOutDate = null

    try {
      if (checkIn) {
        checkInDate = new Date(checkIn)
        if (isNaN(checkInDate.getTime())) {
          console.error("Invalid check-in date format:", checkIn)
          checkInDate = null
        }
      }

      if (checkOut) {
        checkOutDate = new Date(checkOut)
        if (isNaN(checkOutDate.getTime())) {
          console.error("Invalid check-out date format:", checkOut)
          checkOutDate = null
        }
      }

      setBookingData((prev) => ({
        ...prev,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      }))

      if (!checkInDate || !checkOutDate) {
        console.error("Missing dates:", { checkIn, checkOut, checkInDate, checkOutDate })
        alert("Invalid or missing check-in/check-out dates. Please select dates again.")
        navigate(`/hotels/${hotelId}`, {
          state: { previousRoute, selectedNationality },
        })
        return
      }

      if (checkInDate >= checkOutDate) {
        console.error("Invalid date range:", { checkInDate, checkOutDate })
        alert("Check-out date must be after check-in date. Please select valid dates.")
        navigate(`/hotels/${hotelId}`, {
          state: { previousRoute, selectedNationality },
        })
        return
      }

      console.log("Dates validated successfully:", { checkInDate, checkOutDate })
    } catch (error) {
      console.error("Error processing dates:", error)
      alert("Error processing dates. Please select dates again.")
      navigate(`/hotels/${hotelId}`, {
        state: { previousRoute, selectedNationality },
      })
    }
  }, [checkIn, checkOut, hotelId, navigate, previousRoute, selectedNationality])

  useEffect(() => {
    if (!hotelId || !roomId) {
      alert("Missing hotel or room information.")
      navigate("/search")
      return
    }
    ;(async () => {
      try {
        const [hRes, rRes] = await Promise.all([
          axios.get(`/hotels/${hotelId}`),
          axios.get(`/rooms/${roomId}`)
        ])
        setHotel(hRes.data)
        setRoom(rRes.data)
        setMealPlans(hRes.data.mealPlans || [])
        // Set default adults/children from maxOccupancy if available
        if (rRes.data?.maxOccupancy) {
          setBookingData((prev) => ({
            ...prev,
            adults: rRes.data.maxOccupancy.adults || 1,
            children: rRes.data.maxOccupancy.children || 0,
            childrenAges: (rRes.data.maxOccupancy.children && rRes.data.maxOccupancy.children > 0)
              ? Array(rRes.data.maxOccupancy.children).fill(0)
              : [],
          }))
        }
      } catch (err) {
        console.error("Failed to load hotel or room", err)
        setErrors({ fetch: "Failed to load hotel or room data." })
      } finally {
        setLoadingData(false)
      }
    })()
  }, [hotelId, roomId, navigate])

  // Fetch applicable offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const [offersRes, userRes] = await Promise.all([
          axios.get("/discounts"),
          axios.get("/users/me")
        ])
        const userBookings = await axios.get("/bookings/my")
        const userBookingCount = userBookings.data.length
        const today = new Date()
        const checkInDate = new Date(bookingData.checkIn)
        const checkOutDate = new Date(bookingData.checkOut)
        const nights = calculateNights()
        const userId = userRes.data._id || userRes.data.userId
        const userRole = userRes.data.role
        const applicableOffers = offersRes.data.filter((offer) => {
          if (!offer.active) return false
          const validFrom = offer.validFrom ? new Date(offer.validFrom) : null
          const validTo = offer.validTo ? new Date(offer.validTo) : null
          if (validFrom && today < validFrom) return false
          if (validTo && today > validTo) return false
          if (offer.applicableHotels && offer.applicableHotels.length > 0) {
            if (!offer.applicableHotels.includes(hotelId)) return false
          }
          if (offer.conditions.stayPeriod) {
            const stayStart = offer.conditions.stayPeriod.start ? new Date(offer.conditions.stayPeriod.start) : null
            const stayEnd = offer.conditions.stayPeriod.end ? new Date(offer.conditions.stayPeriod.end) : null
            if (stayStart && checkInDate < stayStart) return false
            if (stayEnd && checkOutDate > stayEnd) return false
          }
          if (offer.conditions.bookingWindow) {
            const bookingStart = offer.conditions.bookingWindow.start ? new Date(offer.conditions.bookingWindow.start) : null
            const bookingEnd = offer.conditions.bookingWindow.end ? new Date(offer.conditions.bookingWindow.end) : null
            if (bookingStart && today < bookingStart) return false
            if (bookingEnd && today > bookingEnd) return false
          }
          if (offer.conditions.minNights && nights < offer.conditions.minNights) return false
          switch (offer.discountType) {
            case "exclusive": {
              if (userRole !== "agent" && userRole !== "admin") return false
              if (!offer.eligibleAgents?.includes(userId)) return false
              if (offer.usedAgents?.includes(userId)) return false
              if (offer.conditions.minBookings && userBookingCount < offer.conditions.minBookings) return false
              return true
            }
            case "transportation": {
              const minStay = offer.conditions.minStayDays || 5
              if (nights < minStay) return false
              return true
            }
            case "seasonal": {
              const currentMonth = today.getMonth() + 1
              if (offer.conditions.seasonalMonths && !offer.conditions.seasonalMonths.includes(currentMonth)) return false
              return true
            }
            case "libert":
              return offer.conditions.isDefault
            case "percentage":
              return true
            default:
              return false
          }
        }).sort((a, b) => {
          const typePriority = {
            exclusive: 4,
            transportation: 3,
            seasonal: 2,
            percentage: 2,
            libert: 1,
          }
          return typePriority[b.discountType] - typePriority[a.discountType]
        })
        let filteredOffers = applicableOffers
        const hasNonLibert = applicableOffers.some(o => o.discountType !== "libert")
        if (hasNonLibert) {
          filteredOffers = applicableOffers.filter(o => o.discountType !== "libert")
        }
        const exclusiveOffers = filteredOffers.filter((offer) => offer.discountType === "exclusive")
        const nonExclusiveOffers = filteredOffers.filter((offer) => offer.discountType !== "exclusive")
        setOffers(exclusiveOffers)
        setAutoAppliedOffers(nonExclusiveOffers)
        const firstExclusiveOffer = exclusiveOffers[0]
        if (firstExclusiveOffer) {
          setSelectedOffer(firstExclusiveOffer)
        }
      } catch (err) {
        console.error("Error fetching offers:", err)
      }
    }
    if (bookingData.checkIn && bookingData.checkOut) {
      fetchOffers()
    }
  }, [bookingData.checkIn, bookingData.checkOut, hotelId])

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const validateStep = (step) => {
    const errs = {}
    if (step === 0) {
      if (!bookingData.checkIn) errs.checkIn = "Check-in date is required"
      if (!bookingData.checkOut) errs.checkOut = "Check-out date is required"
      if (
        bookingData.checkIn &&
        bookingData.checkOut &&
        new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)
      ) {
        errs.checkOut = "Check-out must be after check-in"
      }
      if (bookingData.children > 0 && bookingData.childrenAges.some((age) => age === 0)) {
        errs.childrenAges = "Please select an age for each child"
      }
      if (!bookingData.selectedMealPlan) errs.mealPlan = "Please select a meal plan"
    }
    if (step === 1) {
      if (!bookingData.clientName.trim()) errs.clientName = "Name is required"
      if (!bookingData.clientEmail.trim()) errs.clientEmail = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(bookingData.clientEmail)) errs.clientEmail = "Invalid email format"
      if (!bookingData.clientPhone.trim()) errs.clientPhone = "Phone is required"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePassengerChange = (idx, field, value) => {
  setPassengerDetails((prev) => {
    const arr = [...prev];
    arr[idx] = { ...arr[idx], [field]: value };
    return arr;
  });
};

const handleChildPassengerChange = (idx, field, value) => {
  setChildPassengerDetails((prev) => {
    const arr = [...prev];
    arr[idx] = { ...arr[idx], [field]: value };
    return arr;
  });
};

  const handleChildrenChange = (value) => {
    const count = Number.parseInt(value, 10)
    setBookingData((prev) => ({
      ...prev,
      children: count,
      childrenAges: count > 0 ? Array(count).fill(0) : [],
    }))
    if (errors.childrenAges) setErrors((prev) => ({ ...prev, childrenAges: null }))
  }

  const handleChildAgeChange = (idx, value) => {
    const ages = [...bookingData.childrenAges]
    ages[idx] = Number.parseInt(value, 10)
    setBookingData((prev) => ({ ...prev, childrenAges: ages }))
    if (errors.childrenAges) setErrors((prev) => ({ ...prev, childrenAges: null }))
  }

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setBookingData((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : name === "adults" || name === "rooms"
        ? Number.parseInt(value, 10)
        : value,
  }));
  if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
};

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0
    const diff = new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  // Meal plan addon total
  const calculateMealPlanAddon = () => {
    if (!bookingData.selectedMealPlan) return 0
    const { price = 0 } = bookingData.selectedMealPlan
    const totalGuests = bookingData.adults + bookingData.children
    const nights = calculateNights()
    return price * totalGuests * nights
  }

  // Market surcharge total
  const calculateMarketSurcharge = () => {
    return marketSurcharge * calculateNights() * bookingData.rooms
  }

  const getFinalPerNightPrice = () => {
    return Number(basePricePerNight) - Number(marketSurcharge);
  };

  const calculateTotal = () => {
    // Room Total
    const roomTotal = getFinalPerNightPrice() * calculateNights() * bookingData.rooms;
    const mealPlanAddon = calculateMealPlanAddon();
    // Market surcharge
    const marketAddon = calculateMarketSurcharge();
    let totalDiscount = 0;

    autoAppliedOffers.forEach((offer) => {
      let found = Array.isArray(offer.discountValues) && market
        ? offer.discountValues.find(v => v.market === market)
        : null;
      if (!found) return;
      if (offer.discountType === "percentage") {
        totalDiscount += ((roomTotal + mealPlanAddon + marketAddon) * found.value) / 100;
      } else {
        totalDiscount += found.value;
      }
    });

    if (selectedOffer && selectedOffer.discountType === "exclusive") {
      let found = Array.isArray(selectedOffer.discountValues) && market
        ? selectedOffer.discountValues.find(v => v.market === market)
        : null;
      if (found) {
        totalDiscount += found.value;
      }
    }

    return roomTotal + mealPlanAddon + marketAddon - totalDiscount;
  }

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) return "Not selected"
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleConfirmSubmit = () => {
    setShowConfirmation(true)
  }

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return
    setLoading(true)
    try {
      const children = bookingData.childrenAges.map((age) => ({ age }))
      const nights = calculateNights()
      const baseRoomPerNight = getDisplayPerNightPrice() - (marketSurcharge || 0)
      const roomTotal = getFinalPerNightPrice() * nights * bookingData.rooms
      const mealPlanType = bookingData.mealPlan
      const mealPlanPrice = bookingData.selectedMealPlan?.price || 0
      const mealPlanTotal = calculateMealPlanAddon()
      const marketSurchargeType = market || null
      const marketSurchargePrice = marketSurcharge
      const marketSurchargeTotal = calculateMarketSurcharge()
      const discounts = [
        ...autoAppliedOffers.map(offer => {
          let found = Array.isArray(offer.discountValues) && market
            ? offer.discountValues.find(v => v.market === market)
            : null;
          if (!found) return null;
          return {
            type: offer.discountType,
            value: offer.discountType === "percentage"
              ? (
                  ((getFinalPerNightPrice() * nights * bookingData.rooms + mealPlanTotal + marketSurchargeTotal) * found.value) / 100
                ).toFixed(2)
              : found.value,
            description: offer.description
          };
        }).filter(Boolean),
        ...(selectedOffer && selectedOffer.discountType === "exclusive"
          ? (() => {
              let found = Array.isArray(selectedOffer.discountValues) && market
                ? selectedOffer.discountValues.find(v => v.market === market)
                : null;
              if (!found) return [];
              return [{ type: selectedOffer.discountType, value: found.value, description: selectedOffer.description }];
            })()
          : [])
      ]
      const total = calculateTotal()

      // Combine adult and child passenger details
      const allPassengerDetails = [
        ...passengerDetails.map(p => ({ ...p, type: 'adult' })),
        ...childPassengerDetails.map(p => ({ ...p, type: 'child' }))
      ]

      const payload = {
        hotel: hotelId,
        room: roomId,
        passengerDetails: allPassengerDetails, // send combined array
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        mealPlan: bookingData.mealPlan,
        adults: bookingData.adults,
        children,
        rooms: bookingData.rooms,
        nights, 
        clientDetails: {
          name: bookingData.clientName,
          email: bookingData.clientEmail,
          phone: bookingData.clientPhone,
        },
        additionalServices: [],
        priceBreakdown: {
          basePricePerNight: baseRoomPerNight,
          roomTotal,
          mealPlan: mealPlanType ? { type: mealPlanType, price: mealPlanPrice, total: mealPlanTotal } : null,
          marketSurcharge: marketSurchargeType ? { type: marketSurchargeType, price: marketSurchargePrice, total: marketSurchargeTotal } : null,
          discounts,
          total,
        },
        autoAppliedDiscounts: autoAppliedOffers,
        exclusiveDiscount: selectedOffer && selectedOffer.discountType === "exclusive" ? selectedOffer : null,
        transportations: room?.transportations || [],
      }
      const bookingRes = await axios.post("/bookings", payload, { withCredentials: true })

      if (selectedOffer && selectedOffer.discountType === "exclusive") {
        await axios.put(
          `/discounts/${selectedOffer._id}`,
          {
            usedAgents: [...(selectedOffer.usedAgents || []), bookingRes.data.user],
          },
          { withCredentials: true },
        )
      }

      setLoading(false)
      setShowConfirmation(false) // Hide the confirmation popup
      setActiveStep(3)
    } catch (err) {
      console.error("Booking failed", err)
      setLoading(false)
      setErrors({ submit: "Booking failed. Please try again." })
    }
  }

  // --- DESKTOP LAYOUT ---
  const renderDesktopLayout = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#E7E9E5] to-[#B7C5C7] flex flex-col">
      <div className="flex flex-1">
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"} ml-0`}>
          <div className="container mx-auto px-6 py-8 max-w-7xl overflow-x-hidden">
            {loadingData ? (
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#005E84] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-3 text-gray-600 text-lg font-medium">Loading booking information...</p>
                </div>
              </div>
            ) : (
              <>
                {activeStep < 3 && (
                  <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
                    <img
                      src="https://i.postimg.cc/k4MRXkFx/maldives-3793871-1280.jpg"
                      alt="Maldives"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A435C]/70 to-transparent flex flex-col justify-center px-10">
                      <h1 className="text-4xl font-bold text-white mb-2">Book Your Luxury Escape</h1>
                      <p className="text-lg text-[#B7C5C7] max-w-xl">
                        Complete your booking at {hotelName} for an unforgettable Maldives getaway
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg mb-8 p-8">
                  {activeStep < 3 && (
                    <div className="mb-10 overflow-x-auto scrollbar-hide">
                      <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                          <div key={step} className="flex flex-col items-center relative w-full">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold z-10 ${
                                activeStep >= index ? "bg-[#0A435C] text-white" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <p
                              className={`mt-2 text-sm font-medium ${activeStep >= index ? "text-[#0A435C]" : "text-gray-500"}`}
                            >
                              {step}
                            </p>
                            {index < steps.length - 1 && (
                              <div
                                className={`absolute h-1 top-5 left-1/2 w-full ${activeStep > index ? "bg-[#0A435C]" : "bg-gray-200"}`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 0 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Dates & Guests</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-transform hover:scale-[1.02]">
                            <div className="relative">
                              <img
                                src={hotel?.gallery[0] || "/placeholder.svg"}
                                alt={hotelName}
                                className="w-full h-56 object-cover"
                              />
                            </div>
                            <div className="p-5">
                              <h3 className="text-xl font-bold text-gray-800">{hotelName}</h3>
                              <div className="flex items-center mt-2 mb-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-[#005E84]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600 ml-1">{hotel?.location}</span>
                              </div>
                              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                                <div>
                                  <span className="text-2xl font-bold text-[#0A435C]">${getFinalPerNightPrice()}</span>
                                  <span className="text-sm text-gray-500 ml-1">per night</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-[#E7E9E5] to-[#B7C5C7] rounded-xl p-5 mt-6 border border-[#B7C5C7]">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Property Highlights</h3>
                            <span className="text-sm text-gray-700">{hotel?.descriptionShort}</span>
                          </div>
                        </div>
                        <div className="lg:col-span-3">
                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Dates and Guests</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                                    {formatDate(bookingData.checkIn)}
                                  </div>
                                </div>
                                {errors.checkIn && <p className="mt-1 text-xs text-red-600">{errors.checkIn}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                                    {formatDate(bookingData.checkOut)}
                                  </div>
                                </div>
                                {errors.checkOut && <p className="mt-1 text-xs text-red-600">{errors.checkOut}</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                                <select
                                  name="adults"
                                  value={bookingData.adults}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                >
                                  {Array.from({ length: room?.maxOccupancy?.adults || 6 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                                <select
                                  name="children"
                                  value={bookingData.children}
                                  onChange={(e) => handleChildrenChange(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                >
                                  {Array.from({ length: (room?.maxOccupancy?.children || 4) + 1 }, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                                <select
                                  name="rooms"
                                  value={bookingData.rooms}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                >
                                  {[1, 2, 3, 4].map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Meal Plan</label>
                              <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm flex items-center">
                                {bookingData.mealPlan} (+${bookingData.selectedMealPlan?.price || 0})
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Country (Market)</label>
                              <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm flex items-center">
                                {market || 'Not selected'}
                                {marketSurcharge > 0 && (
                                  <span className="ml-2 text-[#075375]">(+${marketSurcharge} per night)</span>
                                )}
                              </div>
                            </div>
                            {room?.transportations && room.transportations.length > 0 && (
                              <div className="mt-4">
                                <label className="flex text-sm font-semibold text-black mb-2 items-center gap-2">
                                  <svg className="w-5 h-5 text-[#005E84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Transportation Options
                                </label>
                                <ul className="flex flex-wrap gap-2">
                                  {room.transportations.map((t, idx) => (
                                    <li key={idx} className="flex items-center gap-2 bg-[#E7E9E5] border border-[#B7C5C7] text-[#0A435C] px-4 py-2 rounded-full text-xs shadow-sm hover:bg-[#B7C5C7] transition-all">
                                      {getTransportIcon(t.method)}
                                      <span className="font-medium capitalize">{t.type}: {t.method}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {bookingData.children > 0 && (
                              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Children Ages</label>
                                <div className="grid grid-cols-2 gap-4">
                                  {bookingData.childrenAges.map((age, index) => (
                                    <select
                                      key={index}
                                      value={age}
                                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    >
                                      <option value={0}>Select age</option>
                                      {[...Array(18).keys()].map((num) => (
                                        <option key={num} value={num}>
                                          {num} {num === 1 ? "year" : "years"}
                                        </option>
                                      ))}
                                    </select>
                                  ))}
                                </div>
                                {errors.childrenAges && (
                                  <p className="mt-1 text-xs text-red-600">{errors.childrenAges}</p>
                                )}
                              </div>
                            )}
                            {/* Only display 'Choose an Exclusive Offer' if hotelName exists and there are eligible offers */}
                            {hotelName && hotel && hotel._id && (() => {
                              const eligibleOffers = offers.filter(offer => {
                                if (offer.discountType !== "exclusive") return false;
                                const hasHotels = Array.isArray(offer.applicableHotels) && offer.applicableHotels.length > 0;
                                const hasMarkets = Array.isArray(offer.discountValues) && offer.discountValues.length > 0;
                                if (!hasHotels && !hasMarkets) return false;
                                if (hasHotels && offer.applicableHotels.includes(hotel._id)) return true;
                                if (hasMarkets && market && offer.discountValues.some(v => v.market === market)) return true;
                                return false;
                              });
                              if (eligibleOffers.length === 0) return null;
                              return (
                                <div className="mt-6">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Choose an Exclusive Offer</h4>
                                  <div className="grid grid-cols-1 gap-4">
                                    {eligibleOffers.map((offer) => (
                                      <div
                                        key={offer._id}
                                        onClick={() => setSelectedOffer(selectedOffer?._id === offer._id ? null : offer)}
                                        className={`
                                          p-4 rounded-lg border cursor-pointer transition-colors
                                          ${
                                            selectedOffer?._id === offer._id
                                              ? "border-indigo-500 bg-indigo-50"
                                              : "border-gray-200 hover:border-indigo-300"
                                          }
                                        `}
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <h5 className="text-base font-medium text-gray-900">
                                              {offer.description || (() => {
                                                let marketValue = null;
                                                if (Array.isArray(offer.discountValues) && market) {
                                                  const found = offer.discountValues.find(v => v.market === market);
                                                  if (found) {
                                                    marketValue = found.type === 'percentage' ? `${found.value}%` : `$${found.value}`;
                                                  }
                                                }
                                                return marketValue ? `Save ${marketValue}` : `Save $${offer.value}`;
                                              })()}
                                            </h5>
                                            {offer.conditions?.minBookings && (
                                              <p className="text-sm text-gray-600">
                                                Requires {offer.conditions.minBookings}+ bookings
                                              </p>
                                            )}
                                          </div>
                                          <span className="text-indigo-600 font-medium text-sm">
                                            {(() => {
                                              if (Array.isArray(offer.discountValues) && market) {
                                                const found = offer.discountValues.find(v => v.market === market);
                                                if (found) {
                                                  if (found.type === 'percentage') {
                                                    const base = getFinalPerNightPrice() * calculateNights() * bookingData.rooms + calculateMealPlanAddon() + calculateMarketSurcharge();
                                                    return `-$${((base * found.value) / 100).toFixed(2)} (${found.value}%)`;
                                                  } else {
                                                    // Fixed discount
                                                    return `-$${found.value}`;
                                                  }
                                                }
                                              }
                                              if (Array.isArray(offer.applicableHotels) && offer.applicableHotels.includes(hotel._id)) {
                                                return `-$${offer.value}`;
                                              }
                                              return '-';
                                            })()}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                            {bookingData.checkIn && bookingData.checkOut && calculateNights() > 0 && (
                              <div className="bg-gradient-to-r from-[#E7E9E5] to-[#B7C5C7] rounded-xl p-6 border border-[#B7C5C7] mt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Price Summary</h4>
                                <div className="flex justify-between items-center mb-3">
                                  <div className="text-gray-600 text-sm">
                                    <span className="font-medium">
                                      {calculateNights()} night{calculateNights() !== 1 ? "s" : ""}
                                    </span>{" "}
                                    × {bookingData.rooms} room{bookingData.rooms !== 1 ? "s" : ""}
                                  </div>
                                  <div className="text-gray-800 text-sm">
                                    ${Number(basePricePerNight) - Number(marketSurcharge)} per night
                                  </div>
                                </div>
                                <div className="text-gray-800 text-sm text-right mb-3">
                                  Room Total: {(Number(basePricePerNight) - Number(marketSurcharge)) * calculateNights() * bookingData.rooms}
                                </div>
                                {bookingData.selectedMealPlan && (
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="text-gray-600 text-sm">
                                      {bookingData.mealPlan} ({bookingData.adults + bookingData.children} guest{bookingData.adults + bookingData.children !== 1 ? "s" : ""} × ${bookingData.selectedMealPlan.price}/night)
                                    </div>
                                    <div className="text-gray-800 text-sm">
                                      ${calculateMealPlanAddon()}
                                    </div>
                                  </div>
                                )}
                                {market && (
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="text-gray-600 text-sm">
                                      {market} Market Surcharge ({calculateNights()} night{calculateNights() !== 1 ? 's' : ''} × ${marketSurcharge}/night)
                                    </div>
                                    <div className="text-gray-800 text-sm">
                                      ${calculateMarketSurcharge()}
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-gray-700 text-sm">All-inclusive package</span>
                                  <span className="text-green-600 text-sm">Included</span>
                                </div>
                            {autoAppliedOffers.map((offer) => {
                              let found = Array.isArray(offer.discountValues) && market
                                ? offer.discountValues.find(v => v.market === market)
                                : null;
                              if (!found) return null; 
                              let discountLabel = offer.discountType === "percentage"
                                ? `${found.value}% Discount`
                                : offer.discountType === "seasonal"
                                  ? "Seasonal Offer"
                                  : offer.discountType === "transportation"
                                    ? "Transportation Offer"
                                    : "Libert Offer";
                              let discountValue = found.value;
                              return (
                                <div key={offer._id} className="flex justify-between items-center mb-3">
                                  <span className="text-gray-600">{discountLabel}</span>
                                  <span className="text-green-600 font-medium">
                                    -$
                                    {offer.discountType === "percentage"
                                      ? (
                                          ((getFinalPerNightPrice() * calculateNights() * bookingData.rooms + calculateMealPlanAddon() + calculateMarketSurcharge()) * discountValue) /
                                          100
                                        ).toFixed(2)
                                      : discountValue}
                                  </span>
                                </div>
                              );
                            })}
                            {selectedOffer && selectedOffer.discountType === "exclusive" && (
                              (() => {
                                let found = Array.isArray(selectedOffer.discountValues) && market
                                  ? selectedOffer.discountValues.find(v => v.market === market)
                                  : null;
                                if (!found) return null;
                                let discountValue = found.value;
                                return (
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Exclusive Agent Offer</span>
                                    <span className="text-green-600 font-medium">-${discountValue}</span>
                                  </div>
                                );
                              })()
                            )}
                                <div className="border-t border-indigo-200 my-3"></div>
                                <div className="flex justify-between items-center">
                                  <div className="font-semibold text-lg text-gray-800">Total</div>
                                  <div className="font-bold text-xl text-indigo-600">${calculateTotal().toFixed(2)}</div>
                                </div>
                                <div className="mt-4 text-xs text-indigo-700 bg-indigo-100 px-3 py-2 rounded-lg flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  This booking includes complimentary round-trip seaplane transfers, worth $450 per person.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Information</h2>
                      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg mb-8">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-[#005E84]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-indigo-800">
                              Please ensure all guest information is accurate. Changes cannot be made after booking.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name *</label>
                            <input
                              type="text"
                              name="clientName"
                              value={bookingData.clientName}
                              onChange={handleChange}
                              className={`w-full px-4 py-2 border ${
                                errors.clientName ? "border-red-300" : "border-gray-300"
                              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                            />
                            {errors.clientName && <p className="mt-1 text-xs text-red-600">{errors.clientName}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Email *</label>
                            <input
                              type="email"
                              name="clientEmail"
                              value={bookingData.clientEmail}
                              onChange={handleChange}
                              className={`w-full px-4 py-2 border ${
                                errors.clientEmail ? "border-red-300" : "border-gray-300"
                              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                            />
                            {errors.clientEmail && <p className="mt-1 text-xs text-red-600">{errors.clientEmail}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Guest Phone *</label>
                            <input
                              type="text"
                              name="clientPhone"
                              value={bookingData.clientPhone}
                              onChange={handleChange}
                              className={`w-full px-4 py-2 border ${
                                errors.clientPhone ? "border-red-300" : "border-gray-300"
                              } rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                            />
                            {errors.clientPhone && <p className="mt-1 text-xs text-red-600">{errors.clientPhone}</p>}
                          </div>
                         
                        </div>
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                          <textarea
                            name="specialRequests"
                            value={bookingData.specialRequests}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#005E84] focus:border-[#005E84] text-sm"
                            placeholder="Enter any special requests or preferences..."
                          />
                        </div>
                      </div>
                      {activeStep === 1 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Guests Details</h3>
                          
                          {/* Adult Guests */}
                          <div className="mb-6">
                            <h4 className="font-medium text-[#0A435C] mb-3">Adult Guests</h4>
                            {[...Array(bookingData.adults)].map((_, idx) => (
                              <div key={`adult-${idx}`} className="mb-8 p-4 border border-gray-200 rounded-lg bg-[#E7E9E5]">
                                <h4 className="font-medium text-gray-700 mb-2">Adult {idx + 1}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerDetails[idx]?.name || ''}
                                      onChange={e => handlePassengerChange(idx, "name", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Passport Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerDetails[idx]?.passport || ''}
                                      onChange={e => handlePassengerChange(idx, "passport", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                      value={passengerDetails[idx]?.country || ''}
                                      onChange={e => handlePassengerChange(idx, "country", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    >
                                      <option value="">Select country</option>
                                      {countries.map((c, i) => (
                                        <option key={i} value={c.name}>{c.flag} {c.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Arrival Flight Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerDetails[idx]?.arrivalFlightNumber || ''}
                                      onChange={e => handlePassengerChange(idx, "arrivalFlightNumber", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Arrival Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="time"
                                      value={passengerDetails[idx]?.arrivalTime || ''}
                                      onChange={e => handlePassengerChange(idx, "arrivalTime", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Departure Flight Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerDetails[idx]?.departureFlightNumber || ''}
                                      onChange={e => handlePassengerChange(idx, "departureFlightNumber", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Departure Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="time"
                                      value={passengerDetails[idx]?.departureTime || ''}
                                      onChange={e => handlePassengerChange(idx, "departureTime", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Child Guests */}
                          {bookingData.children > 0 && (
                            <div className="mb-6">
                              <h4 className="font-medium text-[#0A435C] mb-3">Child Guests</h4>
                              {[...Array(bookingData.children)].map((_, idx) => (
                                <div key={`child-${idx}`} className="mb-8 p-4 border border-gray-200 rounded-lg bg-indigo-50">
                                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">Child {idx + 1}
                                    <span className="ml-3 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                                      Age: {bookingData.childrenAges?.[idx] ? `${bookingData.childrenAges[idx]} ${bookingData.childrenAges[idx] === 1 ? 'year' : 'years'}` : 'N/A'}
                                    </span>
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={childPassengerDetails[idx]?.name || ''}
                                        onChange={e => handleChildPassengerChange(idx, "name", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Passport Number <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={childPassengerDetails[idx]?.passport || ''}
                                        onChange={e => handleChildPassengerChange(idx, "passport", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country <span className="text-red-500">*</span>
                                      </label>
                                      <select
                                        value={childPassengerDetails[idx]?.country || ''}
                                        onChange={e => handleChildPassengerChange(idx, "country", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      >
                                        <option value="">Select country</option>
                                        {countries.map((c, i) => (
                                          <option key={i} value={c.name}>{c.flag} {c.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Arrival Flight Number <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={childPassengerDetails[idx]?.arrivalFlightNumber || ''}
                                        onChange={e => handleChildPassengerChange(idx, "arrivalFlightNumber", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Arrival Time <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="time"
                                        value={childPassengerDetails[idx]?.arrivalTime || ''}
                                        onChange={e => handleChildPassengerChange(idx, "arrivalTime", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Departure Flight Number <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={childPassengerDetails[idx]?.departureFlightNumber || ''}
                                        onChange={e => handleChildPassengerChange(idx, "departureFlightNumber", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Departure Time <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="time"
                                        value={childPassengerDetails[idx]?.departureTime || ''}
                                        onChange={e => handleChildPassengerChange(idx, "departureTime", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Booking Request</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hotel Information</h3>
                            <div className="flex space-x-4">
                              <img
                                src={hotel?.gallery[0] || "/placeholder.svg"}
                                alt={hotelName}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{hotelName}</h4>
                                <p className="text-sm text-gray-600">{hotel?.location}</p>
                                <div className="flex items-center mt-2">
                                  <div className="flex text-yellow-400">
                                    {[...Array(hotel?.starRating || 5)].map((_, i) => (
                                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-600">{hotel?.starRating} Star</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Details</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Check-in</span>
                                <span className="font-medium text-gray-900">{formatDate(bookingData.checkIn)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Check-out</span>
                                <span className="font-medium text-gray-900">{formatDate(bookingData.checkOut)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Duration</span>
                                <span className="font-medium text-gray-900">
                                  {calculateNights()} night{calculateNights() !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Guests</span>
                                <span className="font-medium text-gray-900">
                                  {bookingData.adults} Adults, {bookingData.children} Children
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Rooms</span>
                                <span className="font-medium text-gray-900">
                                  {bookingData.rooms} Room{bookingData.rooms !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Room Type</span>
                                <span className="font-medium text-gray-900">{roomName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Meal Plan</span>
                                <span className="font-medium text-gray-900">
                                  {bookingData.mealPlan} (+${bookingData.selectedMealPlan?.price || 0})
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Country (Market)</span>
                                <span className="font-medium text-gray-900">{market || 'Not selected'}{marketSurcharge > 0 ? ` (+$${marketSurcharge}/night)` : ''}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Information</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Name</span>
                                <span className="font-medium text-gray-900">{bookingData.clientName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium text-gray-900">{bookingData.clientEmail}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Phone</span>
                                <span className="font-medium text-gray-900">{bookingData.clientPhone}</span>
                              </div>
                            </div>
                            {bookingData.specialRequests && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Special Requests</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {bookingData.specialRequests}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-gradient-to-br from-[#E7E9E5] to-[#B7C5C7] rounded-xl p-6 border border-[#B7C5C7] sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h3>
                            {/* Use the same structure as Price Summary */}
                            <div className="flex justify-between items-center mb-3">
                              <div className="text-gray-600 text-sm">
                                <span className="font-medium">
                                  {calculateNights()} night{calculateNights() !== 1 ? "s" : ""}
                                </span>{" "}
                                × {bookingData.rooms} room{bookingData.rooms !== 1 ? "s" : ""}
                              </div>
                              <div className="text-gray-800 text-sm">
                                ${Number(basePricePerNight) - Number(marketSurcharge)} per night
                              </div>
                            </div>
                            <div className="text-gray-800 text-sm text-right mb-3">
                              Room Total: {(Number(basePricePerNight) - Number(marketSurcharge)) * calculateNights() * bookingData.rooms}
                            </div>
                            {bookingData.selectedMealPlan && (
                              <div className="flex justify-between items-center mb-3">
                                <div className="text-gray-600 text-sm">
                                  {bookingData.mealPlan} ({bookingData.adults + bookingData.children} guest{bookingData.adults + bookingData.children !== 1 ? "s" : ""} × ${bookingData.selectedMealPlan.price}/night)
                                </div>
                                <div className="text-gray-800 text-sm">
                                  ${calculateMealPlanAddon()}
                                </div>
                              </div>
                            )}
                            {market && (
                              <div className="flex justify-between items-center mb-3">
                                <div className="text-gray-600 text-sm">
                                  {market} Market Surcharge ({calculateNights()} night{calculateNights() !== 1 ? 's' : ''} × ${marketSurcharge}/night)
                                </div>
                                <div className="text-gray-800 text-sm">
                                  ${calculateMarketSurcharge()}
                                </div>
                              </div>
                            )}
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 text-sm">All-inclusive package</span>
                              <span className="text-green-600 text-sm">Included</span>
                            </div>
                            {autoAppliedOffers.map((offer) => (
                              <div key={offer._id} className="flex justify-between items-center mb-3">
                                <span className="text-gray-600">
                                  {offer.discountType === "percentage"
                                    ? `${offer.value}% Discount`
                                    : offer.discountType === "seasonal"
                                      ? "Seasonal Offer"
                                      : offer.discountType === "transportation"
                                        ? "Transportation Offer"
                                        : "Libert Offer"}
                                </span>
                                <span className="text-green-600 font-medium">
                                  -$
                                  {offer.discountType === "percentage"
                                    ? (
                                        ((getFinalPerNightPrice() * calculateNights() * bookingData.rooms + calculateMealPlanAddon() + calculateMarketSurcharge()) * offer.value) /
                                        100
                                      ).toFixed(2)
                                    : offer.value}
                                </span>
                              </div>
                            ))}
                            {selectedOffer && selectedOffer.discountType === "exclusive" && (
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600">Exclusive Agent Offer</span>
                                <span className="text-green-600 font-medium">-${selectedOffer.value}</span>
                              </div>
                            )}
                            <div className="border-t border-indigo-200 my-3"></div>
                            <div className="flex justify-between items-center">
                              <div className="font-semibold text-lg text-gray-800">Total</div>
                              <div className="font-bold text-xl text-indigo-600">${calculateTotal().toFixed(2)}</div>
                            </div>
                            <div className="mt-4 text-xs text-indigo-700 bg-indigo-100 px-3 py-2 rounded-lg flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              This booking includes complimentary round-trip seaplane transfers, worth $450 per person.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="text-center py-12">
                      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Request Submitted!</h2>
                      <p className="text-gray-600 max-w-md mx-auto mb-8">
                        Your booking request for {hotelName} has been successfully submitted. You will receive a
                        confirmation email soon.
                      </p>
                      <div className="bg-indigo-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                        <h3 className="text-lg font-semibold text-indigo-800 mb-2">What's Next?</h3>
                        <p className="text-sm text-indigo-700">
                          Our team will review your booking request and send you a detailed confirmation within 24
                          hours. You'll receive updates via email at {bookingData.clientEmail}.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/search")}
                        className="bg-[#075375] text-white px-8 py-3 rounded-lg hover:bg-[#0A435C] transition-colors font-medium"
                      >
                        Return to Search
                      </button>
                    </div>
                  )}

                  {activeStep < 3 && (
                    <div className="flex justify-between mt-8">
                      {activeStep > 0 && (
                        <button
                          onClick={handleBack}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button
                        onClick={activeStep === 2 ? handleConfirmSubmit : handleNext}
                        className="bg-[#075375] text-white px-6 py-2 rounded-lg hover:bg-[#0A435C] transition-colors ml-auto"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : activeStep === 2 ? "Confirm Booking" : "Continue"}
                      </button>
                    </div>
                  )}
                </div>

                {showConfirmation && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Booking</h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Are you sure you want to submit this booking request for {hotelName} from{" "}
                        {formatDate(bookingData.checkIn)} to {formatDate(bookingData.checkOut)}?
                      </p>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="bg-[#075375] text-white px-4 py-2 rounded-lg hover:bg-[#0A435C] transition-colors"
                          disabled={loading}
                        >

                          {loading ? "Submitting..." : "Confirm"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )

  // Helper to get the correct per night price
const getDisplayPerNightPrice = () => {
  if (marketSurcharge === 0 && market && room) {
    const marketPrice = room.prices?.find(p => p.market === market)?.price || 0;
    if (Number(marketPrice) > 0) {
      return Number(basePricePerNight) - Number(marketPrice);
    }
  }
  return Number(basePricePerNight);
}

const getFinalDisplayPerNightPrice = () => {
  const nights = calculateNights();
  if (!nights) return getDisplayPerNightPrice();
  const marketPerNight = calculateMarketSurcharge() / nights;
  // If marketPerNight > 0, show the breakdown
  if (marketPerNight > 0) {
    return `${getDisplayPerNightPrice()} - ${marketPerNight}`;
  }
  return getDisplayPerNightPrice();
}

// Only consider adults for passenger details
useEffect(() => {
  const totalGuests = bookingData.adults;
  setPassengerDetails((prev) => {
    if (totalGuests === 0) return [];
    const arr = [...prev];
    if (arr.length < totalGuests) {
      for (let i = arr.length; i < totalGuests; i++) {
        arr.push({
          name: "",
          passport: "",
          country: "",
          arrivalFlightNumber: "",
          arrivalTime: "",
          departureFlightNumber: "",
          departureTime: "",
        });
      }
    } else if (arr.length > totalGuests) {
      arr.length = totalGuests;
    }
    return arr;
  });
}, [bookingData.adults]);

useEffect(() => {
  const totalChildren = bookingData.children;
  setChildPassengerDetails((prev) => {
    if (totalChildren === 0) return [];
    const arr = [...prev];
    if (arr.length < totalChildren) {
      for (let i = arr.length; i < totalChildren; i++) {
        arr.push({
          name: "",
          passport: "",
          country: "",
          arrivalFlightNumber: "",
          arrivalTime: "",
          departureFlightNumber: "",
          departureTime: "",
        });
      }
    } else if (arr.length > totalChildren) {
      arr.length = totalChildren;
    }
    return arr;
  });
}, [bookingData.children]);

  return (
    <>
      {renderDesktopLayout()}
    </>
  )
}

export default BookingRequest
