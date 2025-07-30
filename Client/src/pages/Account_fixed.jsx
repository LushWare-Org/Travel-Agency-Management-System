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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <p className="mt-1 text-sm text-gray-900">{user.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/bookings"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                  >
                    View Bookings
                  </a>
                  <a
                    href="/search"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-center hover:bg-green-700 transition-colors"
                  >
                    Search Hotels
                  </a>
                  <a
                    href="/contact"
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-center hover:bg-gray-700 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              </div>

              {/* Hotel/Resort Booking History */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Hotel/Resort Bookings</h3>
                {loadingHotels ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : hotelBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No hotel bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {hotelBookings.map(booking => (
                      <div key={booking._id} className="bg-gray-50 shadow rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-md font-medium text-gray-900">
                              {booking.hotel?.name || 'Hotel Information'}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Room: {booking.room?.roomName || booking.room?.roomType || 'N/A'}
                            </p>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>Check-in: {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}</p>
                              <p>Check-out: {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}</p>
                              <p>Guests: {booking.adults || 0} Adults, {booking.children || 0} Children</p>
                              <p>Nights: {booking.nights || 'N/A'}</p>
                              <p>Status: <span className={`font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' :
                                booking.status === 'Pending' ? 'text-yellow-600' :
                                booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                              }`}>{booking.status || 'Pending'}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Booking Ref</p>
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

              {/* Tour Booking History */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Tour Bookings</h3>
                {loadingTours ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : tourBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No tour bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {tourBookings.map(booking => (
                      <div key={booking._id} className="bg-gray-50 shadow rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-md font-medium text-gray-900">
                              {booking.tour?.title || booking.tourName || 'Tour Information'}
                            </h4>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>Date: {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</p>
                              <p>Participants: {booking.participants || booking.guests || 'N/A'}</p>
                              <p>Status: <span className={`font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' :
                                booking.status === 'Pending' ? 'text-yellow-600' :
                                booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                              }`}>{booking.status || 'Pending'}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
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

              {/* Activity Booking History */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Activity Bookings</h3>
                {loadingActivity ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : activityBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {activityBookings.map(booking => (
                      <div key={booking._id} className="bg-gray-50 shadow rounded-lg p-4">
                        {booking.activity?.image && (
                          <img 
                            src={booking.activity.image} 
                            alt={booking.activity.title} 
                            className="w-full h-32 object-cover rounded mb-3" 
                          />
                        )}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-md font-medium text-gray-900">
                              {booking.activity?.title || 'Activity Information'}
                            </h4>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>Date: {booking.bookingDetails?.date ? new Date(booking.bookingDetails.date).toLocaleDateString() : 'N/A'}</p>
                              <p>Guests: {booking.bookingDetails?.guests || 'N/A'}</p>
                              <p>Status: <span className={`font-medium ${
                                booking.status === 'Confirmed' ? 'text-green-600' :
                                booking.status === 'Pending' ? 'text-yellow-600' :
                                booking.status === 'Cancelled' ? 'text-red-600' : 'text-gray-600'
                              }`}>{booking.status || 'Pending'}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
