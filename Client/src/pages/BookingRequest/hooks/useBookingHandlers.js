import { useNavigate } from "react-router-dom"
import axios from "axios"
import { calculateNights, calculateMealPlanAddon, calculateMarketSurcharge, getFinalPerNightPrice, calculateTotal } from "../utils/bookingUtils"

export const useBookingHandlers = ({
  activeStep,
  setActiveStep,
  bookingData,
  setBookingData,
  errors,
  setErrors,
  loading,
  setLoading,
  setShowConfirmation,
  passengerDetails,
  setPassengerDetails,
  selectedOffer,
  autoAppliedOffers,
  room,
  market,
  basePricePerNight,
  marketSurcharge,
  hotelId,
  roomId,
  navigate
}) => {

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

  const handlePassengerChange = (roomIdx, adultIdx, field, value) => {
    setPassengerDetails((prev) => {
      const arr = [...prev]
      if (arr[roomIdx] && arr[roomIdx].adults) {
        arr[roomIdx].adults[adultIdx] = { ...arr[roomIdx].adults[adultIdx], [field]: value }
      }
      return arr
    })
  }

  const handleChildPassengerChange = (roomIdx, childIdx, field, value) => {
    setPassengerDetails((prev) => {
      const arr = [...prev]
      if (arr[roomIdx] && arr[roomIdx].children) {
        arr[roomIdx].children[childIdx] = { ...arr[roomIdx].children[childIdx], [field]: value }
      }
      return arr
    })
  }

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
    const { name, value, type, checked } = e.target
    setBookingData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "adults" || name === "rooms"
          ? Number.parseInt(value, 10)
          : value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const handleConfirmSubmit = () => {
    setShowConfirmation(true)
  }

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return
    setLoading(true)
    try {
      const children = bookingData.childrenAges.map((age) => ({ age }))
      const nights = calculateNights(bookingData.checkIn, bookingData.checkOut)
      const baseRoomPerNight = getFinalPerNightPrice(basePricePerNight, marketSurcharge)
      const roomTotal = getFinalPerNightPrice(basePricePerNight, marketSurcharge) * nights * bookingData.rooms
      const mealPlanType = bookingData.mealPlan
      const mealPlanPrice = bookingData.selectedMealPlan?.price || 0
      const mealPlanTotal = calculateMealPlanAddon(bookingData.selectedMealPlan, bookingData.adults, bookingData.children, nights)
      const marketSurchargeType = market || null
      const marketSurchargePrice = marketSurcharge
      const marketSurchargeTotal = calculateMarketSurcharge(marketSurcharge, nights, bookingData.rooms)
      const discounts = [
        ...autoAppliedOffers.map(offer => {
          let found = Array.isArray(offer.discountValues) && market
            ? offer.discountValues.find(v => v.market === market)
            : null
          if (!found) return null
          return {
            type: offer.discountType,
            value: offer.discountType === "percentage"
              ? (
                  ((getFinalPerNightPrice(basePricePerNight, marketSurcharge) * nights * bookingData.rooms + mealPlanTotal + marketSurchargeTotal) * found.value) / 100
                ).toFixed(2)
              : found.value,
            description: offer.description
          }
        }).filter(Boolean),
        ...(selectedOffer && selectedOffer.discountType === "exclusive"
          ? (() => {
              let found = Array.isArray(selectedOffer.discountValues) && market
                ? selectedOffer.discountValues.find(v => v.market === market)
                : null
              if (!found) return []
              return [{ type: selectedOffer.discountType, value: found.value, description: selectedOffer.description }]
            })()
          : [])
      ]
      const total = calculateTotal(
        basePricePerNight,
        marketSurcharge,
        nights,
        bookingData.rooms,
        mealPlanTotal,
        marketSurchargeTotal,
        autoAppliedOffers,
        selectedOffer,
        market
      )

      // Combine adult and child passenger details from all rooms
      const allPassengerDetails = []
      passengerDetails.forEach((room, roomIdx) => {
        room.adults.forEach(adult => {
          allPassengerDetails.push({ ...adult, type: 'adult', roomNumber: roomIdx + 1 })
        })
        room.children.forEach(child => {
          allPassengerDetails.push({ ...child, type: 'child', roomNumber: roomIdx + 1 })
        })
      })

      const payload = {
        hotel: hotelId,
        room: roomId,
        passengerDetails: allPassengerDetails,
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
      setShowConfirmation(false)
      setActiveStep(3)
    } catch (err) {
      console.error("Booking failed", err)
      setLoading(false)
      setErrors({ submit: "Booking failed. Please try again." })
    }
  }

  return {
    handleNext,
    handleBack,
    validateStep,
    handlePassengerChange,
    handleChildPassengerChange,
    handleChildrenChange,
    handleChildAgeChange,
    handleChange,
    handleConfirmSubmit,
    handleSubmit
  }
}
