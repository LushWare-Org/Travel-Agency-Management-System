import axios from 'axios';

const activitiesAPI = {
  // Get all activities
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await axios.get(`/activities?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get activity by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`/activities/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching activity by ID:', error);
      throw error;
    }
  },

  // Create new activity (admin only)
  create: async (activityData) => {
    try {
      const response = await axios.post('/activities', activityData);
      return response;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  // Update activity (admin only)
  update: async (id, activityData) => {
    try {
      const response = await axios.put(`/activities/${id}`, activityData);
      return response;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },

  // Delete activity (admin only)
  delete: async (id) => {
    try {
      const response = await axios.delete(`/activities/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }
};

export default activitiesAPI;
