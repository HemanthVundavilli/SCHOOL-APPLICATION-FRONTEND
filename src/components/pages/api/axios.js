import axios from 'axios';

const api = axios.create({
  baseURL: 'https://school-application-backend.onrender.com/api',
  //baseURL: 'http://localhost:10000/api'

});
// Attach token dynamically before each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  else {
    delete config.headers['Authorization'];
  }
  return config;
});

export default api;
