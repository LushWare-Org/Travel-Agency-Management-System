import axios from '../axios';

const bookingsAPI = {
  // Get all bookings
  getAll: async () => {
    try {
      const response = await axios.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Get user's bookings
  getMy: async () => {
    try {
      const response = await axios.get('/bookings/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching my bookings:', error);
      throw error;
    }
  },

  // Create a new booking
  create: async (bookingData) => {
    try {
      const response = await axios.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  update: async (id, updateData) => {
    try {
      const response = await axios.put(`/bookings/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Cancel booking with detailed cancellation info
  cancel: async (id, cancellationData) => {
    try {
      const response = await axios.put(`/bookings/${id}/cancel`, cancellationData);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Delete booking (legacy - soft delete)
  delete: async (id) => {
    try {
      const response = await axios.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Generate customer quote PDF
  generateQuote: async (id, profitMargin, marginType = 'percentage') => {
    try {
      const response = await axios.post(`/bookings/${id}/customer-quote`, {
        profitMargin,
        marginType
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating quote:', error);
      throw error;
    }
  },

  // Generate confirmation PDF
  generateConfirmation: async (id) => {
    try {
      const response = await axios.get(`/bookings/${id}/confirmation-pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating confirmation PDF:', error);
      throw error;
    }
  }
};

export default bookingsAPI;