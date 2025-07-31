// Pages/HotelProfile.jsx
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { FaBed, FaPhone, FaGlobe, FaEnvelope } from "react-icons/fa"
import { MdLocationOn } from "react-icons/md"
import { AiFillStar } from "react-icons/ai"
import Footer from "../Components/Footer"
import RoomCard from "../Components/RoomCard"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function HotelProfile() {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const locationState = useLocation()
  const [hotelData, setHotelData] = useState(null)
  const [roomsData, setRoomsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [menuImageUrl, setMenuImageUrl] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [usersData, setUsersData] = useState({})
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
  })

  const datePickerRef = useRef(null)

  const previousRoute = locationState.state?.previousRoute || "/search"
  const selectedNationality = locationState.state?.nationality || ""

  const getRoomPrice = (room, nationality, checkIn, checkOut) => {
    if (!room) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let price = 0;
    if (room.pricePeriods?.length > 0 && checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        // Sort periods by start date to get the most recent applicable period
        const applicablePeriods = room.pricePeriods
          .filter(period => {
            const periodStart = new Date(period.startDate);
            const periodEnd = new Date(period.endDate);
            periodStart.setHours(0, 0, 0, 0);
            periodEnd.setHours(23, 59, 59, 999);
            
            return (
              periodStart <= checkOutDate &&
              periodEnd >= checkInDate &&
              periodEnd >= today &&
              periodStart <= periodEnd &&
              period.price != null
            );
          })
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        // Use the most recent applicable period price
        if (applicablePeriods.length > 0) {
          price = applicablePeriods[0].price;
          console.log(`Using period price: $${price} for dates ${checkIn} to ${checkOut}`);
        }
      }
    }    // If no period price is found, return 0
    if (price === 0) {
      console.log('No valid price period found for these dates');
    }

    // Apply nationality surcharge if any
    const surcharge = room.prices?.find((p) => p.country === nationality)?.price || 0;
    console.log(`Applied nationality surcharge: $${surcharge} for ${nationality}`);
    
    return Number(price) + surcharge;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          axios.get(`/hotels/${hotelId}`),
          axios.get(`/rooms/hotel/${hotelId}`),
        ])
        setHotelData(hotelRes.data)
        const baseRooms = locationState.state?.filteredRooms || roomsRes.data
        const enrichedRooms = baseRooms.map((r) => ({
          ...r,
          basePrice: getRoomPrice(r, selectedNationality, bookingData.checkIn, bookingData.checkOut),
        }))
        setRoomsData(enrichedRooms)

        const checkIn = locationState.state?.checkIn || locationState.state?.checkInDate || ''
        const checkOut = locationState.state?.checkOut || locationState.state?.checkOutDate || locationState.state?.checkoutDate || ''
        
        console.log("Date values from location state:", { 
          checkIn, 
          checkOut,
          rawCheckIn: locationState.state?.checkIn,
          rawCheckInDate: locationState.state?.checkInDate,
          rawCheckOut: locationState.state?.checkOut,
          rawCheckOutDate: locationState.state?.checkOutDate,
          rawCheckoutDate: locationState.state?.checkoutDate
        })

        let validCheckIn = null
        let validCheckOut = null

        if (checkIn) {
          const checkInDate = new Date(checkIn)
          if (!isNaN(checkInDate)) {
            validCheckIn = checkInDate
          } else {
            console.warn("Invalid check-in date format in location.state:", checkIn)
          }
        }

        if (checkOut) {
          const checkOutDate = new Date(checkOut)
          if (!isNaN(checkOutDate)) {
            validCheckOut = checkOutDate
          } else {
            console.warn("Invalid check-out date format in location.state:", checkOut)
          }
        }

        setBookingData({
          checkIn: validCheckIn,
          checkOut: validCheckOut,
        })
        console.log("Initialized dates:", { validCheckIn, validCheckOut })
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Hotel not found")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [hotelId, selectedNationality])

  useEffect(() => {
    if (!hotelData?.reviews) return
    const missingIds = hotelData.reviews
      .map((r) => (typeof r.user === "string" ? r.user : null))
      .filter((id) => id && !usersData[id])
    if (missingIds.length === 0) return

    const fetchUsers = async () => {
      try {
        const results = await Promise.all(
          missingIds.map((id) =>
            axios
              .get(`/users/${id}`)
              .then((res) => ({ id, name: res.data.email }))
              .catch(() => null),
          ),
        )
        const newUsers = { ...usersData }
        results.forEach((u) => {
          if (u) newUsers[u.id] = u.name
        })
        setUsersData(newUsers)
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    fetchUsers()
  }, [hotelData?.reviews, usersData])

  const submitReview = async () => {
    try {
      const res = await axios.post(`/hotels/${hotelId}/reviews`, {
        rating: newRating,
        comment: newComment,
      })
      setHotelData((prev) => ({
        ...prev,
        reviews: [...prev.reviews, res.data],
      }))
      setNewRating(5)
      setNewComment("")
    } catch (err) {
      console.error("Error submitting review", err)
    }
  }

  const handleTabChange = (idx) => setActiveTab(idx)

  const handleRoomSelect = (roomId) => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select both check-in and check-out dates before selecting a room.")
      console.log("Room selection aborted: Missing dates", bookingData)
      return
    }

    if (!(bookingData.checkIn instanceof Date) || isNaN(bookingData.checkIn)) {
      alert("Invalid check-in date. Please select a valid date.")
      console.log("Room selection aborted: Invalid check-in date", bookingData.checkIn)
      return
    }

    if (!(bookingData.checkOut instanceof Date) || isNaN(bookingData.checkOut)) {
      alert("Invalid check-out date. Please select a valid date.")
      console.log("Room selection aborted: Invalid check-out date", bookingData.checkOut)
      return
    }

    if (bookingData.checkIn >= bookingData.checkOut) {
      alert("Check-out date must be after check-in date.")
      console.log("Room selection aborted: Invalid date range", bookingData)
      return
    }

    const selectedRoom = roomsData.find((room) => room._id === roomId)
    if (!selectedRoom) {
      alert("Selected room not found.")
      console.log("Room selection aborted: Room not found", roomId)
      return
    }

    const checkInISO = bookingData.checkIn.toISOString()
    const checkOutISO = bookingData.checkOut.toISOString()

    console.log("Navigating to room details with state:", {
      hotelId,
      hotelName: hotelData.name,
      roomId,
      roomName: selectedRoom.name,
      basePricePerNight: selectedRoom.basePrice,
      checkIn: checkInISO,
      checkOut: checkOutISO,
      mealPlan: selectedRoom.mealPlan || hotelData.mealPlans[0] || { planName: "All-Inclusive" },
      previousRoute,
      selectedNationality,
    })

    navigate(`/hotels/${hotelId}/rooms/${roomId}`, {
      state: {
        hotelId,
        hotelName: hotelData.name,
        roomId,
        roomName: selectedRoom.name,
        basePricePerNight: selectedRoom.basePrice,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        mealPlan: selectedRoom.mealPlan || hotelData.mealPlans[0] || { planName: "All-Inclusive" },
        previousRoute,
        selectedNationality,
      },
    })
  }

  const handleViewMenu = (url) => {
    setMenuImageUrl(url)
    setMenuModalOpen(true)
  }

  const closeMenuModal = () => setMenuModalOpen(false)

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-t-4 border-b-4 border-lapis_lazuli"></div>
      </div>
    )
  if (error || !hotelData)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-600 p-4 sm:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-2">{error || "Hotel Not Found"}</h3>
        </div>
      </div>
    )

  const tabItems = ["Overview", "Rooms", "Dining", "Gallery", "Reviews"]
  const {
    name,
    location,
    starRating,
    description,
    amenities,
    mealPlans,
    dinningOptions,
    gallery,
    contactDetails,
    reviews,
  } = hotelData

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-platinum to-ash_gray font-sans">
        <section className="relative h-80 sm:h-[400px] md:h-[600px] overflow-hidden">
          <img src={gallery[0] || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8 md:pb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2">{name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white mb-2 sm:mb-4 text-xs sm:text-base">
                <div className="flex items-center">
                  <MdLocationOn className="text-lapis_lazuli mr-1 w-4 sm:w-5 h-4 sm:h-5" />
                  {location}
                </div>
                <div className="flex items-center">
                  {[...Array(starRating)].map((_, i) => (
                    <AiFillStar key={i} className={`${i < starRating ? "text-yellow-400" : "text-gray-400"} w-4 sm:w-5 h-4 sm:h-5`} />
                  ))}
                  <span className="ml-2">({starRating} Star)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-[100%] sm:max-w-7xl overflow-x-hidden">
          <div className="sticky top-0 z-10 mb-6 sm:mb-8">
            <div className="w-full max-w-[100%] mx-auto px-2 sm:px-4">
              <div className="bg-gradient-to-r from-platinum/90 to-ash_gray/90 backdrop-blur-sm rounded-xl p-2 flex overflow-x-auto scrollbar-hide border border-gray-200">
                {tabItems.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTabChange(idx)}
                    className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 min-w-[80px] sm:min-w-[100px] whitespace-nowrap ${
                      activeTab === idx 
                        ? "bg-lapis_lazuli text-white shadow-lg border border-lapis_lazuli" 
                        : "text-gray-700 hover:text-lapis_lazuli hover:bg-white/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-platinum rounded-2xl shadow-xl p-4 sm:p-6">
            {activeTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
                <div className="lg:col-span-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">About</h2>
                  <p className="text-gray-600 leading-relaxed mb-6 sm:mb-10 text-sm sm:text-base">{description}</p>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Amenities & Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {amenities.map((am, i) => (
                      <div key={i} className="p-3 sm:p-4 bg-blue-50 rounded-xl">
                        <span className="font-medium text-sm sm:text-base">{am}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:sticky lg:top-20">
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-lapis_lazuli to-indigo_dye text-white p-6">
                      <div className="flex items-center">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Meal Plans</h3>
                          <p className="text-ash_gray text-sm mt-1">Select your perfect meal experience</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4 bg-platinum/50">
                      {mealPlans.map((plan, i) => (
                        <div key={i} className="bg-white border border-platinum rounded-xl p-5 shadow-sm hover:shadow-md hover:border-lapis_lazuli transition-all duration-200 group">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-base text-gray-800 group-hover:text-blue-700 transition-colors">
                              {plan.planName}
                            </h4>
                            <div className="text-right">
                              {plan.price === 0 ? (
                                <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                  Included
                                </span>
                              ) : (
                                <div className="text-gray-800">
                                  <span className="font-bold text-lg text-lapis_lazuli">${plan.price}</span>
                                  <span className="text-xs text-gray-500 block mt-0.5">per person/day</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{plan.description}</p>
                          
                          <div className="flex items-center space-x-2">
                            {plan.planName.toLowerCase().includes('breakfast') && (
                              <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                                <span className="text-xs text-gray-500 font-medium">Breakfast</span>
                              </div>
                            )}
                            {plan.planName.toLowerCase().includes('lunch') && (
                              <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full"></div>
                                <span className="text-xs text-gray-500 font-medium">Lunch</span>
                              </div>
                            )}
                            {plan.planName.toLowerCase().includes('dinner') && (
                              <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full"></div>
                                <span className="text-xs text-gray-500 font-medium">Dinner</span>
                              </div>
                            )}
                            {plan.planName.toLowerCase().includes('all') && (
                              <div className="flex items-center space-x-1.5">
                                <div className="w-2.5 h-2.5 bg-lapis_lazuli rounded-full"></div>
                                <span className="text-xs text-gray-500 font-medium">All Meals</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Availability button removed as requested */}
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div className="w-full overflow-x-hidden">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Find Your Perfect Room</h2>

                <div className="bg-gradient-to-r from-platinum to-ash_gray rounded-2xl shadow-lg overflow-visible mb-6 sm:mb-10 relative z-10">
                  <div className="bg-indigo_dye text-platinum p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">Check Room Availability</h3>
                    <p className="text-ash_gray text-xs sm:text-sm">Select your dates to find available rooms</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                      <div className="col-span-5 relative">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Check-in Date</label>
                        <div
                          className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => datePickerRef.current?.setOpen(true)}
                        >
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lapis_lazuli">
                            <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={
                              bookingData.checkIn
                                ? bookingData.checkIn.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : ""
                            }
                            readOnly
                            placeholder="Select check-in date"
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-lapis_lazuli rounded-lg cursor-pointer text-xs sm:text-base"
                          />
                        </div>
                        <DatePicker
                          selectsRange
                          startDate={bookingData.checkIn}
                          endDate={bookingData.checkOut}
                          onChange={(dates) => {
                            const [start, end] = dates
                            setBookingData((prev) => ({
                              ...prev,
                              checkIn: start,
                              checkOut: end,
                            }))
                            // Update room prices based on new dates
                            setRoomsData(prevRooms => prevRooms.map(room => ({
                              ...room,
                              basePrice: getRoomPrice(room, selectedNationality, start, end)
                            })))
                          }}
                          minDate={new Date()}
                          dateFormat="MMMM d, yyyy"
                          popperPlacement="bottom-start"
                          popperModifiers={[
                            {
                              name: "offset",
                              options: {
                                offset: [0, 8],
                              },
                            },
                            {
                              name: "preventOverflow",
                              options: {
                                rootBoundary: "viewport",
                                tether: true,
                                altAxis: true,
                                padding: 8,
                              },
                            },
                            {
                              name: "flip",
                              options: {
                                fallbackPlacements: ["top", "bottom", "left", "right"],
                              },
                            },
                          ]}
                          ref={datePickerRef}
                          className="absolute opacity-0 pointer-events-none"
                        />
                      </div>

                      <div className="col-span-2 flex justify-center items-center">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-platinum flex items-center justify-center text-lapis_lazuli">
                          <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="col-span-5">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Check-out Date</label>
                        <div
                          className="relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => datePickerRef.current?.setOpen(true)}
                        >
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lapis_lazuli">
                            <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={
                              bookingData.checkOut
                                ? bookingData.checkOut.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : ""
                            }
                            readOnly
                            placeholder="Select check-out date"
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-lapis_lazuli rounded-lg cursor-pointer text-xs sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4">
                    <button
                      onClick={async () => {
                          if (!bookingData.checkIn || !bookingData.checkOut) {
                            alert("Please select both check-in and check-out dates")
                            console.log("Availability check aborted: Missing dates", bookingData)
                            return
                          }
                          if (bookingData.checkIn >= bookingData.checkOut) {
                            alert("Check-out date must be after check-in date")
                            console.log("Availability check aborted: Invalid date range", bookingData)
                            return
                          }
                          try {
                            console.log("Checking availability with params:", {
                              hotelId,
                              checkIn: bookingData.checkIn.toISOString(),
                              checkOut: bookingData.checkOut.toISOString(),
                              nationality: selectedNationality,
                            })

                            const response = await axios.get(`/rooms/availability`, {
                              params: {
                                hotelId: hotelId,
                                checkIn: bookingData.checkIn.toISOString(),
                                checkOut: bookingData.checkOut.toISOString(),
                                nationality: selectedNationality,
                              },
                            })

                            console.log("Availability response:", response.data)

                            if (response.data && response.data.length > 0) {
                              setRoomsData(
                                response.data.map((r) => ({
                                  ...r,
                                  basePrice: getRoomPrice(r, selectedNationality, bookingData.checkIn, bookingData.checkOut),
                                })),
                              )
                            } else {
                              setRoomsData([])
                              alert("No rooms available for the selected dates. Please try different dates.")
                            }
                          } catch (error) {
                            console.error("Error fetching available rooms:", error)
                            let errorMessage = "Failed to fetch available rooms"

                            if (error.response) {
                              console.error("Server error response:", error.response.data)
                              errorMessage = error.response.data.msg || `Server error: ${error.response.status}`
                            } else if (error.request) {
                              console.error("No response received:", error.request)
                              errorMessage = "Network error: Please check your internet connection"
                            } else {
                              console.error("Error details:", error.message)
                              errorMessage = `Error: ${error.message}`
                            }

                            alert(errorMessage)
                          }
                        }}
                        className="w-full bg-lapis_lazuli hover:bg-indigo_dye text-platinum py-2 sm:py-3 rounded-lg shadow-lg flex items-center justify-center gap-1 sm:gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] text-xs sm:text-base min-h-[44px]"
                      >
                        <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <span className="font-semibold">Search Available Rooms</span>
                      </button>
                    </div>

                    {(bookingData.checkIn || bookingData.checkOut) && (
                      <div className="mt-3 sm:mt-4 bg-platinum rounded-lg p-2 sm:p-3 border border-ash_gray">
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                          {bookingData.checkIn && (
                            <div className="flex items-center">
                              <span className="font-semibold">Check-in:</span>
                              <span className="ml-1 text-indigo_dye">
                                {bookingData.checkIn.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          {bookingData.checkOut && (
                            <div className="flex items-center">
                              <span className="font-semibold">Check-out:</span>
                              <span className="ml-1 text-indigo_dye">
                                {bookingData.checkOut.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                          {bookingData.checkIn && bookingData.checkOut && (
                            <div className="flex items-center">
                              <span className="font-semibold">Duration:</span>
                              <span className="ml-1 text-indigo_dye">
                                {Math.ceil((bookingData.checkOut - bookingData.checkIn) / (1000 * 60 * 60 * 24))} nights
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {roomsData.length > 0 && (
                  <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-green-800">
                      {roomsData.length} Room{roomsData.length !== 1 ? "s" : ""} Available
                    </h3>
                    <p className="text-xs sm:text-sm text-green-600">
                      for{" "}
                      {bookingData.checkIn?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      to{" "}
                      {bookingData.checkOut?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                <div className="w-full space-y-4 sm:space-y-8">
                  {roomsData.length > 0 ? (
                    roomsData.map((room) => (
                      <div key={room._id} className="w-full min-h-[auto] mx-0 overflow-visible">
                        <RoomCard 
                          room={{
                            ...room,
                            searchDates: {
                              checkIn: bookingData.checkIn,
                              checkOut: bookingData.checkOut
                            }
                          }} 
                          onSelect={handleRoomSelect} 
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                      <div className="bg-platinum rounded-full w-12 sm:w-20 h-12 sm:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <FaBed className="h-6 sm:h-10 w-6 sm:w-10 text-lapis_lazuli" />
                      </div>
                      <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-2">No Rooms Selected Yet</h3>
                      <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                        Choose your check-in and check-out dates above to find available rooms for your stay.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Dining Options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  {dinningOptions.map((option, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40 z-10"></div>
                      <img
                        src={option.image || "/placeholder.svg"}
                        alt={option.optionName}
                        className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 text-white">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{option.optionName}</h3>
                        <p className="text-white/80 text-xs sm:text-base">{option.description}</p>
                        <button
                          className="mt-2 sm:mt-4 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-1 sm:py-2 transition-colors w-fit text-xs sm:text-base min-h-[44px]"
                          onClick={() => handleViewMenu(option.menu)}
                        >
                          View Menu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Photo Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-40 sm:h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-lapis_lazuli/0 group-hover:bg-lapis_lazuli/20 flex items-center justify-center transition-all duration-300">
                        <div className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-50 transition-all duration-300">
                          <div className="bg-white/90 backdrop-blur-sm text-lapis_lazuli rounded-full p-2 sm:p-3">
                            <svg className="h-4 sm:h-6 w-4 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Guest Reviews</h2>
                {reviews.length > 0 && (
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Overall Rating</h3>
                        <div className="flex items-center">
                          {(() => {
                            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0)
                            const avgRating = totalRating / reviews.length
                            return (
                              <>
                                <div className="flex mr-2 sm:mr-3">
                                  {[...Array(5)].map((_, i) => (
                                    <AiFillStar
                                      key={i}
                                      size={20}
                                      className={`${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"} sm:size-28`}
                                    />
                                  ))}
                                </div>
                                <div>
                                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-lapis_lazuli">{avgRating.toFixed(1)}</span>
                                  <span className="text-gray-600 ml-1">/ 5</span>
                                  <p className="text-gray-600 text-xs sm:text-sm">
                                    from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                                  </p>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-0 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-lapis_lazuli">{reviews.length}</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Total Reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-base mb-2">Your Rating:</label>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="text-lg sm:text-2xl focus:outline-none transition-colors mr-1 min-h-[44px]"
                      >
                        <AiFillStar
                          className={`${
                            star <= newRating ? "text-yellow-400" : "text-gray-300"
                          } hover:text-yellow-400 transform hover:scale-110 transition-all`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600 text-xs sm:text-sm">
                      {newRating} Star{newRating !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Write your review..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border p-1.5 sm:p-2 rounded mb-3 sm:mb-4 text-xs sm:text-base"
                  />
                  <button
                    onClick={submitReview}
                    className="bg-lapis_lazuli hover:bg-indigo_dye text-platinum px-4 sm:px-6 py-1.5 sm:py-2 
                               rounded-full transition-colors shadow-md text-xs sm:text-base min-h-[44px]"
                  >
                    Submit Review
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {reviews.map((rev, i) => {
                    const userId = typeof rev.user === "string" ? rev.user : rev.user._id
                    const displayName = usersData[userId] || "Anonymous"
                    const initial = displayName.charAt(0).toUpperCase()
                    return (
                      <div
                        key={i}
                        className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition"
                      >
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                          <div className="flex items-center">
                            <div className="bg-platinum text-indigo_dye rounded-full w-6 sm:w-10 h-6 sm:h-10 flex items-center justify-center font-bold mr-2 sm:mr-3 text-xs sm:text-base">
                              {initial}
                            </div>
                            <strong className="text-xs sm:text-base">{displayName}</strong>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, idx) => (
                              <AiFillStar
                                key={idx}
                                className={`${idx < rev.rating ? "text-yellow-400" : "text-gray-300"} w-3 sm:w-5 h-3 sm:h-5`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-base mb-2">{rev.comment}</p>
                        <div className="text-gray-400 text-xs sm:text-sm">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
        
        {menuModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg overflow-hidden">
              <button onClick={closeMenuModal} className="absolute top-1 right-1 text-gray-600 hover:text-gray-800 text-xl sm:text-2xl min-h-[44px]">
                ✕
              </button>
              <img
                src={menuImageUrl || "/placeholder.svg"}
                alt="Menu"
                className="max-h-[80vh] max-w-[90vw] sm:max-h-[80vh] sm:max-w-[80vw] object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .react-datepicker {
          font-family: 'Inter', sans-serif;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 260px;
          z-index: 1000;
          background-color: white;
        }
        @media (min-width: 640px) {
          .react-datepicker {
            width: 280px;
          }
        }
        @media (min-width: 768px) {
          .react-datepicker {
            width: 300px;
          }
        }
        .react-datepicker__header {
          background-color: #005E84;
          color: white;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          padding: 0.5rem;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white;
          font-weight: 600;
          font-size: 0.7rem;
        }
        @media (min-width: 640px) {
          .react-datepicker__current-month,
          .react-datepicker__day-name {
            font-size: 0.75rem;
          }
        }
        @media (min-width: 768px) {
          .react-datepicker__current-month,
          .react-datepicker__day-name {
            font-size: 0.875rem;
          }
        }
        .react-datepicker__day {
          color: #1f2937;
          border-radius: 0.375rem;
          transition: all 0.2s;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 0.7rem;
        }
        @media (min-width: 640px) {
          .react-datepicker__day {
            width: 32px;
            height: 32px;
            line-height: 32px;
            font-size: 0.75rem;
          }
        }
        @media (min-width: 768px) {
          .react-datepicker__day {
            width: 36px;
            height: 36px;
            line-height: 36px;
            font-size: 0.875rem;
          }
        }
        .react-datepicker__day:hover {
          background-color: #E7E9E5;
          color: #005E84;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: #E7E9E5;
          color: #005E84;
        }
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background-color: #005E84 !important;
          color: white !important;
        }
        .react-datepicker__day--range-start:hover,
        .react-datepicker__day--range-end:hover {
          background-color: #075375 !important;
        }
        .react-datepicker__day--outside-month {
          color: #d1d5db;
        }
        .react-datepicker__day--disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
        .react-datepicker__triangle {
          display: none;
        }
        .react-datepicker-popper {
          z-index: 1000;
        }
        .react-datepicker__month-container {
          width: 100%;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}

export default HotelProfile;