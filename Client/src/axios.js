import axios from 'axios';

// Set the base URL for all API requests
// Use environment variable if available, otherwise fallback based on mode
const baseURL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://api.islekeyholidays.com/api'
    : '/api');

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
