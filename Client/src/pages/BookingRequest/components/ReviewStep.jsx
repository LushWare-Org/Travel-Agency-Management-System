import { calculateNights, getFinalPerNightPrice, formatDate } from "../utils/bookingUtils"

const ReviewStep = ({
  hotel,
  room,
  bookingData,
  hotelName,
  roomName,
  market,
  marketSurcharge,
  basePricePerNight,
  autoAppliedOffers,
  selectedOffer
}) => {
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut)

  return (
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
                  {nights} night{nights !== 1 ? "s" : ""}
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
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-600 text-sm">
                <span className="font-medium">
                  {nights} night{nights !== 1 ? "s" : ""}
                </span>{" "}
                × {bookingData.rooms} room{bookingData.rooms !== 1 ? "s" : ""}
              </div>
              <div className="text-gray-800 text-sm">
                ${Number(basePricePerNight) - Number(marketSurcharge)} per night
              </div>
            </div>
            <div className="text-gray-800 text-sm text-right mb-3">
              Room Total: {(Number(basePricePerNight) - Number(marketSurcharge)) * nights * bookingData.rooms}
            </div>
            {bookingData.selectedMealPlan && (
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-600 text-sm">
                  {bookingData.mealPlan} ({bookingData.adults + bookingData.children} guest{bookingData.adults + bookingData.children !== 1 ? "s" : ""} × ${bookingData.selectedMealPlan.price}/night)
                </div>
                <div className="text-gray-800 text-sm">
                  ${bookingData.selectedMealPlan.price * (bookingData.adults + bookingData.children) * nights}
                </div>
              </div>
            )}
            {market && (
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-600 text-sm">
                  {market} Market Surcharge ({nights} night{nights !== 1 ? 's' : ''} × ${marketSurcharge}/night)
                </div>
                <div className="text-gray-800 text-sm">
                  ${marketSurcharge * nights * bookingData.rooms}
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
                        ((getFinalPerNightPrice(basePricePerNight, marketSurcharge) * nights * bookingData.rooms + (bookingData.selectedMealPlan ? bookingData.selectedMealPlan.price * (bookingData.adults + bookingData.children) * nights : 0) + (marketSurcharge * nights * bookingData.rooms)) * offer.value) /
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
              <div className="font-bold text-xl text-indigo-600">${/* Calculate total */}</div>
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
  )
}

export default ReviewStep
