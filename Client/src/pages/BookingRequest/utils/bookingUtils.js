import { FaShip, FaPlane, FaCar, FaPlaneDeparture } from "react-icons/fa"

// Calculate nights
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Meal plan addon total
export const calculateMealPlanAddon = (selectedMealPlan, adults, children, nights) => {
  if (!selectedMealPlan) return 0
  const { price = 0 } = selectedMealPlan
  const totalGuests = adults + children
  return price * totalGuests * nights
}

// Market surcharge total
export const calculateMarketSurcharge = (marketSurcharge, nights, rooms) => {
  return marketSurcharge * nights * rooms
}

export const getFinalPerNightPrice = (basePricePerNight, marketSurcharge) => {
  return Number(basePricePerNight) - Number(marketSurcharge)
}

export const calculateTotal = (
  basePricePerNight,
  marketSurcharge,
  calculateNights,
  rooms,
  calculateMealPlanAddon,
  calculateMarketSurcharge,
  autoAppliedOffers,
  selectedOffer,
  market
) => {
  // Room Total
  const roomTotal = getFinalPerNightPrice(basePricePerNight, marketSurcharge) * calculateNights * rooms
  const mealPlanAddon = calculateMealPlanAddon
  // Market surcharge
  const marketAddon = calculateMarketSurcharge
  let totalDiscount = 0

  autoAppliedOffers.forEach((offer) => {
    let found = Array.isArray(offer.discountValues) && market
      ? offer.discountValues.find(v => v.market === market)
      : null
    if (!found) return
    if (offer.discountType === "percentage") {
      totalDiscount += ((roomTotal + mealPlanAddon + marketAddon) * found.value) / 100
    } else {
      totalDiscount += found.value
    }
  })

  if (selectedOffer && selectedOffer.discountType === "exclusive") {
    let found = Array.isArray(selectedOffer.discountValues) && market
      ? selectedOffer.discountValues.find(v => v.market === market)
      : null
    if (found) {
      totalDiscount += found.value
    }
  }

  return roomTotal + mealPlanAddon + marketAddon - totalDiscount
}

export const formatDate = (date) => {
  if (!date || isNaN(new Date(date))) return "Not selected"
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// Helper to get the correct per night price
export const getDisplayPerNightPrice = (basePricePerNight, marketSurcharge, market, room) => {
  if (marketSurcharge === 0 && market && room) {
    const marketPrice = room.prices?.find(p => p.market === market)?.price || 0
    if (Number(marketPrice) > 0) {
      return Number(basePricePerNight) - Number(marketPrice)
    }
  }
  return Number(basePricePerNight)
}

export const getFinalDisplayPerNightPrice = (basePricePerNight, marketSurcharge, calculateNights, calculateMarketSurcharge) => {
  const nights = calculateNights
  if (!nights) return getDisplayPerNightPrice(basePricePerNight, marketSurcharge, null, null)
  const marketPerNight = calculateMarketSurcharge / nights
  // If marketPerNight > 0, show the breakdown
  if (marketPerNight > 0) {
    return `${getDisplayPerNightPrice(basePricePerNight, marketSurcharge, null, null)} - ${marketPerNight}`
  }
  return getDisplayPerNightPrice(basePricePerNight, marketSurcharge, null, null)
}

export const steps = ["Dates & Guests", "Client Information", "Review", "Confirmation"]
