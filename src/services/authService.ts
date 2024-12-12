import axios from 'axios';

// API request for login
export const loginApi = async (email: string, password: string) => {
  return await axios.post("https://localhost:7213/api/auth/login", { email, password });
};

// API request for registration
export const registerApi = async (email: string, password: string) => {
  return await axios.post("https://localhost:7213/api/auth/register", { email, password });
};
