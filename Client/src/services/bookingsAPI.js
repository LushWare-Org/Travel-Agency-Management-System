import axios from '../axios';

const bookingsAPI = {
  // Get hotel/resort bookings for logged-in user
  getMy: async () => {
    try {
      const response = await axios.get('/bookings/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel bookings:', error);
      throw error;
    }
  }
};

export default bookingsAPI;
