// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7213', // Replace with your base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
