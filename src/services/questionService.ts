import api from "./api"; // Assuming you have a pre-configured Axios instance

// Fetch all questions
export const fetchQuestions = async (token: string) => {
  const response = await api.get("/api/Question", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch all positions
export const fetchPositions = async (token: string) => {
  const response = await api.get("/api/Position", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a question by ID
export const deleteQuestion = async (questionId: number, token: string) => {
  await api.delete(`/api/Question/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// Create a new question
export const createQuestion = async (
    { text, difficultyLevel, questionType, positionId, choices }: any,
    token: string
  ) => {
    const response = await api.post(
      "/api/Question",
      {
        text,
        difficultyLevel,
        questionType,
        positionId,
        choices,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  };