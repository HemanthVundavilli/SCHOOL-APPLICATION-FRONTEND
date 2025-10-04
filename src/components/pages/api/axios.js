import axios from 'axios';

const token = localStorage.getItem('token'); // or wherever you store your JWT token

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export default api;