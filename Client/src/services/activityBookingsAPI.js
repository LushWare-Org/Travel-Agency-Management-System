import axios from '../axios';

const activityBookingsAPI = {
  // Get activity bookings for logged-in user
  getMy: async () => {
    try {
      const response = await axios.get('/activity-bookings/my');
      console.log('Activity bookings API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity bookings:', error);
      throw error;
    }
  },

  // Create a new activity booking
  create: async (bookingData) => {
    try {
      const response = await axios.post('/activity-bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating activity booking:', error);
      throw error;
    }
  },

  // Get all activity bookings (admin only)
  getAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`/activity-bookings${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all activity bookings:', error);
      throw error;
    }
  },

  // Update activity booking status
  updateStatus: async (id, updateData) => {
    try {
      const response = await axios.put(`/activity-bookings/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity booking:', error);
      throw error;
    }
  },

  // Cancel activity booking
  cancel: async (id) => {
    try {
      const response = await axios.put(`/activity-bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling activity booking:', error);
      throw error;
    }
  },

  // Create test booking (development only)
  createTest: async () => {
    try {
      const response = await axios.post('/activity-bookings/test');
      return response.data;
    } catch (error) {
      console.error('Error creating test booking:', error);
      throw error;
    }
  }
};

export default activityBookingsAPI;
