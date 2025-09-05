import axios from 'axios';

// Set the base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5001/api';
axios.defaults.withCredentials = true;

export default axios;
