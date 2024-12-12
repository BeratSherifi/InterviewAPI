import axios from "axios";

const BASE_URL = "https://localhost:7213/api/Position";

// Fetch all positions
export const fetchPositionsApi = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// Create a position
export const createPositionApi = async (positionName: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You are not authenticated. Please log in.");
  }

  const response = await axios.post(
    BASE_URL,
    { positionName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Delete a position
export const deletePositionApi = async (positionId: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You are not authenticated. Please log in.");
  }

  await axios.delete(`${BASE_URL}/${positionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update a position
export const updatePositionApi = async (
  positionId: number,
  positionName: string
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You are not authenticated. Please log in.");
  }

  const response = await axios.put(
    `${BASE_URL}/${positionId}`,
    { positionName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
