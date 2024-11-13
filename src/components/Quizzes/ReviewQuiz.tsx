import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface UserAnswer {
  userAnswerId: number;
  questionId: number;
  answerText: string | null;
  practicalScore: number | null;
}

interface QuizDetails {
  quizId: number;
  userAnswers: UserAnswer[];
}

const ReviewQuiz: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetails | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [answerScores, setAnswerScores] = useState<{ [key: number]: number }>({});
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [questionTexts, setQuestionTexts] = useState<{ [key: number]: string }>({});
  
  // Reference to the review section
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not authenticated. Please log in.');
          return;
        }

        const response = await axios.get('https://localhost:7213/api/Quiz', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(response.data);
      } catch (error) {
        setError('Failed to fetch quizzes.');
      }
    };

    fetchQuizzes();
  }, []);

  const fetchQuestionText = async (questionId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7213/api/Question/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.text;
    } catch {
      return 'Failed to load question text';
    }
  };

  const handleQuizSelection = async (quizId: number) => {
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        return;
      }

      const response = await axios.get(`https://localhost:7213/api/Quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizDetails: QuizDetails = response.data;
      const practicalQuestions = quizDetails.userAnswers.slice(-5);

      const newQuestionTexts: { [key: number]: string } = {};
      for (const answer of practicalQuestions) {
        const text = await fetchQuestionText(answer.questionId);
        newQuestionTexts[answer.questionId] = text;
      }

      setQuestionTexts(newQuestionTexts);
      setSelectedQuiz(quizDetails);
      setAnswers(practicalQuestions);

      // Scroll to the review section
      reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setError('Failed to fetch quiz details.');
    }
  };

  const handleScoreChange = (userAnswerId: number, score: number) => {
    setAnswerScores((prevScores) => ({
      ...prevScores,
      [userAnswerId]: Math.max(0, Math.min(10, score)),
    }));
  };

  const handleSubmitReview = async () => {
    if (!selectedQuiz) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        return;
      }

      const reviewPayload = {
        quizId: selectedQuiz.quizId,
        answers: answers.map((answer) => ({
          userAnswerId: answer.userAnswerId,
          score: answerScores[answer.userAnswerId] || 0,
        })),
        comment,
      };

      const response = await axios.post('https://localhost:7213/api/Quiz/review', reviewPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess('Quiz reviewed successfully!');
        setError(null);
      } else {
        setError('Failed to submit quiz review.');
      }
    } catch {
      setError('Error submitting quiz review.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl text-white font-bold mb-6 text-center">Review Quizzes</h2>

        <div className="mb-4">
          <ul className="space-y-4">
            {quizzes.map((quiz) => (
              <motion.li
                key={quiz.quizId}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="text-white">Quiz ID: {quiz.quizId}</p>
                  <p className="text-gray-300">User ID: {quiz.userId}</p>
                  <p className="text-gray-300">Total Score: {quiz.totalScore}</p>
                  <p className="text-gray-300">Passed: {quiz.passed ? 'Yes' : 'No'}</p>
                  <p className="text-gray-300">Controlled: {quiz.controlled ? 'Yes' : 'No'}</p>
                </div>
                <motion.button
                  onClick={() => handleQuizSelection(quiz.quizId)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Review Quiz
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </div>

        {selectedQuiz && (
          <motion.div
            ref={reviewSectionRef}
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg text-white font-bold">Reviewing Quiz ID: {selectedQuiz.quizId}</h3>
            {answers.map((answer, index) => (
              <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                <p className="text-white">
                  Question: {questionTexts[answer.questionId] || 'Loading question...'}
                </p>
                <p className="text-white">Answer Text: {answer.answerText || 'No answer provided'}</p>
                <input
                  type="number"
                  placeholder="Enter score"
                  value={answerScores[answer.userAnswerId] || ''}
                  onChange={(e) => handleScoreChange(answer.userAnswerId, Number(e.target.value))}
                  className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                />
              </div>
            ))}
            <textarea
              placeholder="Add your comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
            ></textarea>
            <motion.button
              onClick={handleSubmitReview}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Review
            </motion.button>
            {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
            {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewQuiz;
