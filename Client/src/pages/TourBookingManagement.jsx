import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TourBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/tour-bookings', { withCredentials: true });

      // Tour bookings are already filtered on the backend
      const tourBookings = response.data
        .map(booking => ({
          ...booking,
          _id: booking._id?.$oid || booking._id,
          travelDate: booking.travelDate ? new Date(booking.travelDate) : null,
          status: booking.status || 'Pending',
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(tourBookings);
    } catch (err) {
      console.error('Error fetching tour bookings:', err);
      setError('Failed to load tour bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      let newStatus = '';
      switch (action) {
        case 'confirm':
          newStatus = 'Confirmed';
          break;
        case 'cancel':
          newStatus = 'Cancelled';
          break;
        case 'reconfirm':
          newStatus = 'Confirmed';
          break;
        default:
          return;
      }

      await axios.put(`/tour-bookings/${id}/status`, { status: newStatus }, { withCredentials: true });
      fetchBookings(); // Refresh the list
    } catch (err) {
      console.error(`Error ${action}ing booking:`, err);
      setError(`Failed to ${action} booking`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`/tour-bookings/${id}`, { withCredentials: true });
      fetchBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
    }
  };

  const openDetailsDialog = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setSelectedBooking(null);
    setDetailsDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const parseMessageDetails = (message) => {
    // For tour bookings, special requests and emergency contact are direct fields
    return {
      specialRequests: selectedBooking?.specialRequests || '',
      emergencyContact: selectedBooking?.emergencyContact || '',
      paymentMethod: selectedBooking?.paymentMethod || 'bank-transfer'
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
        <button 
          onClick={fetchBookings}
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tour Booking Management</h2>
        <p className="mt-1 text-sm text-gray-600">Manage tour bookings submitted through the booking form</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {bookings.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No tour bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Travel Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Travellers
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <tr key={booking._id} className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.clientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.clientEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.tourTitle}</div>
                      <div className="text-xs text-gray-500">
                        {booking.selectedNightsOption} • {booking.selectedFoodCategory}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {booking.travelDate ? (
                        <div className="text-sm text-gray-900">
                          {booking.travelDate.toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">Not set</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.travellerCount}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.currency} {booking.finalPrice?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(booking.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                          booking.status === 'Confirmed' ? 'bg-green-600' : 
                          booking.status === 'Cancelled' ? 'bg-red-600' : 'bg-yellow-600'
                        }`}></span>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => openDetailsDialog(booking)}
                          className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                        >
                          Details
                        </button>

                        {booking.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'confirm')}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm
                          </button>
                        )}

                        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'cancel')}
                            className="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                          >
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        )}

                        {booking.status === 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(booking._id, 'reconfirm')}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reconfirm
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="text-red-600 hover:text-red-900 text-xs font-medium"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Booking count */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
              Showing {bookings.length} tour bookings
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsDialogOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Tour Booking Details</h3>
                  <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <button
                  onClick={closeDetailsDialog}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedBooking.clientName}</div>
                      <div><span className="font-medium">Email:</span> {selectedBooking.clientEmail}</div>
                      <div><span className="font-medium">Phone:</span> {selectedBooking.phoneCountryCode} {selectedBooking.clientPhone}</div>
                      <div><span className="font-medium">Nationality:</span> {selectedBooking.nationality}</div>
                      {selectedBooking.emergencyContact && (
                        <div><span className="font-medium">Emergency Contact:</span> {selectedBooking.emergencyContact}</div>
                      )}
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tour Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Tour:</span> {selectedBooking.tourTitle}</div>
                      <div><span className="font-medium">Duration:</span> {selectedBooking.selectedNightsKey} Nights</div>
                      <div><span className="font-medium">Package:</span> {selectedBooking.selectedNightsOption}</div>
                      <div><span className="font-medium">Meal Plan:</span> {selectedBooking.selectedFoodCategory}</div>
                      <div><span className="font-medium">Travellers:</span> {selectedBooking.travellerCount}</div>
                      <div><span className="font-medium">Travel Date:</span> {
                        selectedBooking.travelDate
                          ? selectedBooking.travelDate.toLocaleDateString()
                          : 'Not specified'
                      }</div>
                    </div>
                  </div>

                  {/* Pricing & Payment */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Pricing & Payment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedBooking.currency} {selectedBooking.finalPrice?.toLocaleString()}
                      </div>
                      {(() => {
                        const details = parseMessageDetails(selectedBooking.specialRequests);
                        return details.paymentMethod && (
                          <div><span className="font-medium">Payment Method:</span> {details.paymentMethod}</div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Special Requests</h4>
                    <div className="text-sm">
                      {(() => {
                        const details = parseMessageDetails(selectedBooking.specialRequests);
                        return details.specialRequests && details.specialRequests !== 'None' ? (
                          <div>{details.specialRequests}</div>
                        ) : (
                          <div className="text-gray-500">No special requests</div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Booking Timeline */}
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Booking Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Submitted:</span> {new Date(selectedBooking.createdAt).toLocaleString()}</div>
                      {selectedBooking.updatedAt !== selectedBooking.createdAt && (
                        <div><span className="font-medium">Last Updated:</span> {new Date(selectedBooking.updatedAt).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  onClick={closeDetailsDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedBooking.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking._id, 'confirm');
                      closeDetailsDialog();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Booking
                  </button>
                )}
                {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedBooking._id, 'cancel');
                      closeDetailsDialog();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourBookingManagement;
