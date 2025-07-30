import axios from '../axios';

const activityBookingsAPI = {
  // Get activity bookings for logged-in user
  getMy: async () => {
    try {
      const response = await axios.get('/activity-bookings/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity bookings:', error);
      throw error;
    }
  }
};

export default activityBookingsAPI;
