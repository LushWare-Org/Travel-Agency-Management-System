import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import activityBookingsAPI from '../services/activityBookingsAPI';

const Account = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await activityBookingsAPI.getMy();
        if (res.success) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch activity bookings', err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
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
              {/* Activity Booking History */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Activity Bookings</h3>
                {loadingBookings ? (
                  <p>Loading...</p>
                ) : bookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking._id} className="bg-white shadow rounded-lg p-4">
                        <img src={booking.activity.image} alt={booking.activity.title} className="w-full h-32 object-cover rounded mb-2" />
                        <div className="flex justify-between">
                          <h4 className="text-md font-medium text-gray-900">{booking.activity.title}</h4>
                          <span className="text-sm text-gray-500">{new Date(booking.bookingDetails.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">Guests: {booking.bookingDetails.guests}</p>
                          <p className="text-sm text-gray-700">Status: {booking.status}</p>
                          <p className="text-sm text-gray-700">Total Price: ${booking.pricing.totalPrice}</p>
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
