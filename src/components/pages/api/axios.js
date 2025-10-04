import axios from 'axios';

const token = localStorage.getItem('token'); // or wherever you store your JWT token

const api = axios.create({
  baseURL: 'https://school-application-backend.onrender.com/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export default api;
