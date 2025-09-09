import { useState } from "react"
import { useLocation } from "react-router-dom"

export const useBookingState = () => {
  const location = useLocation()
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
  const [marketSurcharge, setMarketSurcharge] = useState(0)
  const [roomConfigs, setRoomConfigs] = useState([{ adults: 2, children: 0, childrenAges: [] }])

  return {
    activeStep,
    setActiveStep,
    bookingData,
    setBookingData,
    errors,
    setErrors,
    loading,
    setLoading,
    loadingData,
    setLoadingData,
    hotel,
    setHotel,
    room,
    setRoom,
    showConfirmation,
    setShowConfirmation,
    offers,
    setOffers,
    selectedOffer,
    setSelectedOffer,
    autoAppliedOffers,
    setAutoAppliedOffers,
    mealPlans,
    setMealPlans,
    passengerDetails,
    setPassengerDetails,
    marketSurcharge,
    setMarketSurcharge,
    roomConfigs,
    setRoomConfigs,
    locationState: {
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
    }
  }
}
