import axios from 'axios';

// Set the base URL for all API requests
axios.defaults.baseURL = 'https://api.islekeyholidays.com/api';
axios.defaults.withCredentials = true;

export default axios;
