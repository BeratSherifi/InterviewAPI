import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminUserResults: React.FC = () => {
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(''); // Admin inputs the user's email

  // Function to fetch user ID based on email
  const fetchUserIdByEmail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        setLoading(false);
        return null;
      }

      const response = await axios.get('https://localhost:7213/api/Auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = response.data;
      const user = users.find((u: any) => u.email === email);
      if (user) {
        return user.id;
      } else {
        setError('No user found with that email.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      setError('Failed to fetch users.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch the quiz results by userId
  const fetchQuizResults = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://localhost:7213/api/Quiz/results/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch questions for user answers
      const resultsWithQuestions = await Promise.all(
        response.data.map(async (result: any) => {
          const userAnswersWithQuestions = await Promise.all(
            result.userAnswers.map(async (answer: any) => {
              try {
                const questionResponse = await axios.get(
                  `https://localhost:7213/api/Question/${answer.questionId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                const question = questionResponse.data;
                const chosenAnswer =
                  question.choices.find(
                    (choice: any) => choice.choiceId === answer.choiceId
                  )?.text || 'No answer provided';

                return {
                  ...answer,
                  question,
                  chosenAnswer,
                };
              } catch (err) {
                console.error('Error fetching question:', err);
                return { ...answer, question: null, chosenAnswer: 'Error loading answer' };
              }
            })
          );
          return { ...result, userAnswers: userAnswersWithQuestions };
        })
      );

      setUserResults(resultsWithQuestions);
      setError(null);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      setError('Failed to fetch quiz results.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to fetch results when admin submits email
  const handleFetchResults = async () => {
    setError(null);
    const fetchedUserId = await fetchUserIdByEmail();
    if (fetchedUserId) {
      await fetchQuizResults(fetchedUserId);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div
        className="bg-gray-800 p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl text-white font-bold mb-6 text-center">
          View User Quiz Results
        </h2>

        <input
          type="email"
          placeholder="Enter User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-6 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />

        <motion.button
          onClick={handleFetchResults}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? 'Fetching Results...' : 'Fetch Results'}
        </motion.button>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
        )}

        {/* Scrollable Quiz Results */}
        {userResults.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl text-white mb-6">Quiz Results:</h3>
            <div className="max-h-96 overflow-y-auto bg-gray-700 p-6 rounded-lg hide-scrollbar">
              {userResults.map((result: any) => (
                <div key={result.quizId} className="mb-6 p-6 bg-gray-800 rounded-lg">
                  <p className="text-white mb-2">Quiz ID: {result.quizId}</p>
                  <p className="text-white mb-2">Total Score: {result.totalScore}</p>
                  <p className="text-white mb-2">
                    Passed: {result.passed ? 'Yes' : 'No'}
                  </p>
                  <p className="text-white mb-2">
                    Message: {result.message || 'No message available'}
                  </p>
                  <p className="text-white mb-2">
                    Comment: {result.comment || 'No comment available'}
                  </p>

                  {result.userAnswers &&
                    result.userAnswers.map((answer: any) => {
                      const question = answer?.question;
                      if (!question) return null;

                      return (
                        <div
                          key={answer.userAnswerId}
                          className="mt-6 p-6 bg-gray-700 rounded-lg"
                        >
                          <p className="text-indigo-400 font-bold">
                            Question: {question.text || 'No question text'}
                          </p>
                          <p className="text-white mt-2">Chosen Answer:</p>
                          <p className="text-gray-300 italic ml-4">
                            {answer.chosenAnswer || 'No answer provided'}
                          </p>
                          {question.choices && (
                            <>
                              <p className="text-white mt-4">Choices:</p>
                              <ul className="ml-4">
                                {question.choices.map((choice: any) => (
                                  <li
                                    key={choice.choiceId}
                                    className="mt-1 flex justify-between"
                                  >
                                    <span className="text-gray-300">{choice.text}</span>
                                    <span
                                      className={`ml-2 font-semibold ${
                                        choice.isCorrect
                                          ? 'text-green-500'
                                          : 'text-red-500'
                                      }`}
                                    >
                                      {choice.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUserResults;
