import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const useBookingData = ({
  locationState,
  bookingData,
  setBookingData,
  setHotel,
  setRoom,
  setMealPlans,
  setLoadingData,
  setErrors,
  setOffers,
  setAutoAppliedOffers,
  setSelectedOffer,
  setMarketSurcharge,
  setPassengerDetails,
  setChildPassengerDetails,
  room,
  market,
  basePricePerNight,
  hotelId,
  roomId,
  navigate
}) => {
  const {
    roomId: locRoomId,
    hotelId: locHotelId,
    checkIn,
    checkOut,
    previousRoute,
    selectedNationality,
    market: locMarket,
  } = locationState

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
  }, [room, market, basePricePerNight, setMarketSurcharge])

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
  }, [checkIn, checkOut, hotelId, navigate, previousRoute, selectedNationality, setBookingData])

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
  }, [hotelId, roomId, navigate, setHotel, setRoom, setMealPlans, setBookingData, setLoadingData, setErrors])

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
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
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
  }, [bookingData.checkIn, bookingData.checkOut, hotelId, setOffers, setAutoAppliedOffers, setSelectedOffer])

  // Only consider adults for passenger details
  useEffect(() => {
    const totalGuests = bookingData.adults
    setPassengerDetails((prev) => {
      if (totalGuests === 0) return []
      const arr = [...prev]
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
          })
        }
      } else if (arr.length > totalGuests) {
        arr.length = totalGuests
      }
      return arr
    })
  }, [bookingData.adults, setPassengerDetails])

  useEffect(() => {
    const totalChildren = bookingData.children
    setChildPassengerDetails((prev) => {
      if (totalChildren === 0) return []
      const arr = [...prev]
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
          })
        }
      } else if (arr.length > totalChildren) {
        arr.length = totalChildren
      }
      return arr
    })
  }, [bookingData.children, setChildPassengerDetails])
}
