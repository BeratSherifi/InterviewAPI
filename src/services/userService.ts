// services/userService.ts
import api from './api'; // Assuming `api` is your pre-configured Axios instance

// Fetch all users
export const fetchUsers = async (token: string) => {
  const response = await api.get('/api/Auth/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch quiz results for a specific user by userId
export const fetchQuizResultsByUserId = async (userId: string, token: string) => {
  const response = await api.get(`/api/Quiz/results/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch question details by questionId
export const fetchQuestionDetailsById = async (questionId: number, token: string) => {
  const response = await api.get(`/api/Question/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};  
  // Delete user
  export const deleteUser = async (userId: string, token: string) => {
    await api.delete(`/api/auth/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };