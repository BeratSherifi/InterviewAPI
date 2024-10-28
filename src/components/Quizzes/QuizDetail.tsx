import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/Quiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuiz(response.data);
      } catch (err) {
        setError('Failed to fetch quiz details.');
      }
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) return <div>Loading...</div>;

  return (
    <div>
      <h1>Quiz Detail</h1>
      {error && <div className="error">{error}</div>}
      <p>Quiz ID: {quiz.quizId}</p>
      <p>User ID: {quiz.userId}</p>
      <p>Position ID: {quiz.positionId}</p>
      <p>Total Score: {quiz.totalScore}</p>
    </div>
  );
};

export default QuizDetail;
