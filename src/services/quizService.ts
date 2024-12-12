import api from './api'; // Replace this with your Axios instance if configured

// Fetch all positions
export const fetchPositions = async (token: string) => {
  const response = await api.get('/api/Position', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new quiz
export const createQuiz = async (positionId: number, userId: string, token: string) => {
  const response = await api.post(
    '/api/Quiz',
    { positionId, userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // Should include quizId and questions
};

// Submit quiz answers
export const submitQuiz = async (quizId: number, answers: { questionId: number; choiceId?: number; answerText?: string }[], token: string) => {
  await api.post(
    '/api/Quiz/submit',
    { quizId, answers },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Other service calls (e.g., fetch quizzes, fetch questions, etc.) remain unchanged
export const fetchQuizzes = async (token: string) => {
  const response = await api.get('/api/Quiz', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch details of a quiz by ID
export const fetchQuizDetails = async (quizId: number, token: string) => {
  const response = await api.get(`/api/Quiz/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch user map (userId to email mapping)
export const fetchUserMap = async (token: string) => {
  const response = await api.get('/api/Auth/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.reduce(
    (acc: { [key: string]: string }, user: any) => {
      acc[user.id] = user.email;
      return acc;
    },
    {}
  );
};

// Fetch question details by ID
export const fetchQuestionDetails = async (questionId: number, token: string) => {
  const response = await api.get(`/api/Question/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a quiz by ID
export const deleteQuiz = async (quizId: number, token: string) => {
  await api.delete(`/api/Quiz/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Submit quiz review
export const submitQuizReview = async (reviewPayload: any, token: string) => {
  await api.post('/api/Quiz/review', reviewPayload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
