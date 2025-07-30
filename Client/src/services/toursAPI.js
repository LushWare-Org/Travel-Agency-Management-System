import axios from '../axios';

const toursAPI = {
  // Get all tours
  getAll: async () => {
    try {
      const response = await axios.get('/tours');
      return response.data;
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  },

  // Get tour by ID
  getById: async (tourId) => {
    try {
      const response = await axios.get(`/tours/${tourId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  },

  // Get user's tour bookings (placeholder - tour booking system not implemented yet)
  getMy: async () => {
    try {
      // This endpoint doesn't exist yet, so return empty array for now
      // When tour booking system is implemented, this should call the appropriate endpoint
      return [];
    } catch (error) {
      console.error('Error fetching tour bookings:', error);
      // Return empty array instead of throwing error since tour booking isn't implemented yet
      return [];
    }
  }
};

export default toursAPI;
