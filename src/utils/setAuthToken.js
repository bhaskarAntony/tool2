// utils/setAuthToken.js
import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // Apply token to every request if logged in
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Delete auth header if no token
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;