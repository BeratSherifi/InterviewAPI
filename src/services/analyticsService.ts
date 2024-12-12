import api from './api'; // Assuming a pre-configured axios instance

export const fetchPositions = async (token: string) => {
  const response = await api.get('/api/Position', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAverageScore = async (positionId: number, token: string) => {
  const response = await api.get(`/positions/${positionId}/average-score`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchFailedQuizzes = async (token: string) => {
  const response = await api.get('/users/failed-quizzes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPassedQuizzes = async (token: string) => {
  const response = await api.get('/users/passed-quizzes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchHighestQuizScore = async (token: string) => {
  const response = await api.get('/quizzes/highest-score', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchLowestQuizScore = async (token: string) => {
  const response = await api.get('/quizzes/lowest-score', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchLowestScores = async (positionId: number, token: string) => {
  const response = await api.get(`/positions/${positionId}/lowest-scores`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUserIdByEmail = async (email: string, token: string) => {
  const response = await api.get('/api/Auth/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = response.data;
  const user = users.find((u: any) => u.email === email);
  if (!user) throw new Error('User not found');
  return user.id; // Return the user ID based on email
};

export const fetchTopScoresByUserId = async (userId: string, token: string) => {
  const response = await api.get(`/users/${userId}/topscores-by-user-id`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchTopScores = async (positionId: number, token: string) => {
    const response = await api.get(`/positions/${positionId}/top-scores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  