import React, { useEffect, useState } from "react";
import axios from "axios";

interface Quiz {
  quizId: number;
  positionId: number;
  controlled: boolean;
  passed: boolean;
  totalScore: number;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch quizzes from the API
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found, please log in.");
          setLoading(false);
          return;
        }

        // Make the request with the token in the Authorization header
        const response = await axios.get("https://localhost:7213/api/quiz", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched quizzes:", response.data);  // Log the fetched data

        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching quizzes or unauthorized access.");
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.quizId}>
            <h3>Quiz ID: {quiz.quizId}</h3>
            <p>Position ID: {quiz.positionId}</p>
            <p>Controlled: {quiz.controlled ? "Yes" : "No"}</p>
            <p>Total Score: {quiz.totalScore}</p>
            <p>Passed: {quiz.passed ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
