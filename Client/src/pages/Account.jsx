import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import activityBookingsAPI from '../services/activityBookingsAPI';
import bookingsAPI from '../services/bookingsAPI';
import toursAPI from '../services/toursAPI';

const Account = () => {
  const { user } = useContext(AuthContext);
  const [activityBookings, setActivityBookings] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [tourBookings, setTourBookings] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await activityBookingsAPI.getMy();
        if (res.success) setActivityBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch activity bookings', err);
      } finally {
        setLoadingActivity(false);
      }
    };
    
    const fetchHotels = async () => {
      try {
        const res = await bookingsAPI.getMy();
        if (Array.isArray(res)) setHotelBookings(res);
      } catch (err) {
        console.error('Failed to fetch hotel bookings', err);
      } finally {
        setLoadingHotels(false);
      }
    };
    
    const fetchTours = async () => {
      try {
        const res = await toursAPI.getMy();
        if (Array.isArray(res)) setTourBookings(res);
      } catch (err) {
        console.error('Failed to fetch tour bookings', err);
      } finally {
        setLoadingTours(false);
      }
    };
    
    fetchActivities();
    fetchHotels();
    fetchTours();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your account</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-800">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10">
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-3">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" />
              </svg>
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Account</h1>
          </div>
          {/* Tabs Navigation */}
          <div className="px-8 pt-4 pb-0 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-2">
            <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none transition-colors ${activeTab === 'profile' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-700'}`}>Profile</button>
            <button onClick={() => setActiveTab('hotels')} className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none transition-colors ${activeTab === 'hotels' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-700'}`}>Hotel Bookings</button>
            <button onClick={() => setActiveTab('tours')} className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none transition-colors ${activeTab === 'tours' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-700'}`}>Tour Bookings</button>
            <button onClick={() => setActiveTab('activities')} className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none transition-colors ${activeTab === 'activities' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-700'}`}>Activity Bookings</button>
          </div>
          <div className="px-8 py-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">First Name</label>
                  <p className="mt-1 text-base text-gray-900 font-medium">{user.firstName}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                  <p className="mt-1 text-base text-gray-900 font-medium">{user.lastName}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <p className="mt-1 text-base text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Country</label>
                  <p className="mt-1 text-base text-gray-900 font-medium">{user.country}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                  <p className="mt-1 text-base text-gray-900 font-medium">{user.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Account Type</label>
                  <p className="mt-1 text-base text-gray-900 font-medium capitalize">{user.role}</p>
                </div>
              </div>
            )}

            {/* Hotel Bookings Tab */}
            {activeTab === 'hotels' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75v-1.5A2.25 2.25 0 0110.5 3h3a2.25 2.25 0 012.25 2.25v1.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v3.75M3 10.5v7.5A2.25 2.25 0 005.25 20.25h13.5A2.25 2.25 0 0021 18V10.5M3 10.5h18" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">My Hotel/Resort Bookings</h3>
                </div>
                {loadingHotels ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : hotelBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No hotel bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {hotelBookings.map(booking => (
                      <div key={booking._id} className="bg-blue-50/60 shadow-sm rounded-lg p-4 border border-blue-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-blue-900">
                              {booking.hotel?.name || 'Hotel Information'}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Room: {booking.room?.roomName || booking.room?.roomType || 'N/A'}
                            </p>
                            <div className="mt-2 text-sm text-gray-700 space-y-1">
                              <p>Check-in: {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}</p>
                              <p>Check-out: {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</p>
                              <p>Guests: {booking.adults || 0} Adults, {booking.children || 0} Children</p>
                              <p>Nights: {booking.nights || 'N/A'}</p>
                              <p>Status: <span className={`font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' :
                                booking.status === 'Pending' ? 'text-yellow-600' :
                                booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                              }`} title={
                                booking.status === 'Confirmed' ? 'Your booking is confirmed.' :
                                booking.status === 'Pending' ? 'Your booking is pending confirmation.' :
                                booking.status === 'Cancelled' ? 'Your booking was cancelled.' : 'Status unknown.'
                              }>{booking.status || 'Pending'}</span></p>
                            </div>
                          </div>
                          <div className="text-right min-w-[120px]">
                            <p className="text-xs text-gray-500">Booking Ref</p>
                            <p className="text-sm font-medium text-gray-900">{booking.bookingReference}</p>
                            {booking.priceBreakdown?.total && (
                              <p className="text-lg font-bold text-blue-600 mt-2">
                                ${booking.priceBreakdown.total}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tour Bookings Tab */}
            {activeTab === 'tours' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">My Tour Bookings</h3>
                </div>
                {loadingTours ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : tourBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No tour bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {tourBookings.map(booking => (
                      <div key={booking._id} className="bg-green-50/60 shadow-sm rounded-lg p-4 border border-green-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-green-900">
                              {booking.tour?.title || booking.tourName || 'Tour Information'}
                            </h4>
                            <div className="mt-2 text-sm text-gray-700 space-y-1">
                              <p>Date: {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</p>
                              <p>Participants: {booking.participants || booking.guests || 'N/A'}</p>
                              <p>Status: <span className={`font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' :
                                booking.status === 'Pending' ? 'text-yellow-600' :
                                booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                              }`} title={
                                booking.status === 'Confirmed' ? 'Your booking is confirmed.' :
                                booking.status === 'Pending' ? 'Your booking is pending confirmation.' :
                                booking.status === 'Cancelled' ? 'Your booking was cancelled.' : 'Status unknown.'
                              }>{booking.status || 'Pending'}</span></p>
                            </div>
                          </div>
                          <div className="text-right min-w-[120px]">
                            {booking.totalPrice && (
                              <p className="text-lg font-bold text-green-600">
                                ${booking.totalPrice}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activity Bookings Tab */}
            {activeTab === 'activities' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">My Activity Bookings</h3>
                </div>
                {loadingActivity ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : activityBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {activityBookings.map(booking => (
                      <div key={booking._id} className="bg-purple-50/60 shadow-sm rounded-lg p-4 border border-purple-100">
                        {booking.activity?.image && (
                          <img 
                            src={booking.activity.image} 
                            alt={booking.activity.title} 
                            className="w-full h-32 object-cover rounded mb-3" 
                          />
                        )}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-purple-900">
                              {booking.activity?.title || 'Activity Information'}
                            </h4>
                            <div className="mt-2 text-sm text-gray-700 space-y-1">
                              <p>Date: {booking.bookingDetails?.date ? new Date(booking.bookingDetails.date).toLocaleDateString() : 'N/A'}</p>
                              <p>Guests: {booking.bookingDetails?.guests || 'N/A'}</p>
                              <p>Status: <span className={`font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' :
                                booking.status === 'Pending' ? 'text-yellow-600' :
                                booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                              }`} title={
                                booking.status === 'Confirmed' ? 'Your booking is confirmed.' :
                                booking.status === 'Pending' ? 'Your booking is pending confirmation.' :
                                booking.status === 'Cancelled' ? 'Your booking was cancelled.' : 'Status unknown.'
                              }>{booking.status || 'Pending'}</span></p>
                            </div>
                          </div>
                          <div className="text-right min-w-[120px]">
                            {booking.pricing?.totalPrice && (
                              <p className="text-lg font-bold text-purple-600">
                                ${booking.pricing.totalPrice}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;