import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch all quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not authenticated. Please log in.');
          return;
        }

        const response = await axios.get('https://localhost:7213/api/Quiz', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuizzes(response.data);
      } catch (error) {
        setError('Failed to fetch quizzes.');
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  // Fetch the question text for a given question ID
  const fetchQuestionText = async (questionId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://localhost:7213/api/Question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.text; // Return the question text
    } catch (error) {
      console.error('Error fetching question text:', error);
      return 'Failed to load question text'; // Fallback in case of error
    }
  };

  // Handle quiz selection and fetch details
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const quizDetails: QuizDetails = response.data;

      // Get only the last 5 questions assuming they are practical ones
      const practicalQuestions = quizDetails.userAnswers.slice(-5);

      // Fetch question texts for all the practical questions
      const newQuestionTexts: { [key: number]: string } = {};
      for (const answer of practicalQuestions) {
        const text = await fetchQuestionText(answer.questionId);
        newQuestionTexts[answer.questionId] = text;
      }

      setQuestionTexts(newQuestionTexts); // Update state with the fetched question texts
      setSelectedQuiz(quizDetails);
      setAnswers(practicalQuestions);
    } catch (error) {
      setError('Failed to fetch quiz details.');
      console.error('Error fetching quiz details:', error);
    }
  };

  // Handle score change for practical questions
  const handleScoreChange = (userAnswerId: number, score: number) => {

    if (score < 0) score = 0;
    if (score > 10) score = 10;
    setAnswerScores((prevScores) => ({
      ...prevScores,
      [userAnswerId]: score,
    }));
  };

  // Handle submit review
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
          score: answerScores[answer.userAnswerId] || 0, // Assign a score to each practical question
        })),
        comment,
      };

      const response = await axios.post('https://localhost:7213/api/Quiz/review', reviewPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess('Quiz reviewed successfully!');
        setError(null);
      } else {
        setError('Failed to submit quiz review.');
      }
    } catch (error) {
      setError('Error submitting quiz review.');
      console.error('Error submitting quiz review:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">Review Quizzes</h2>

        {/* Quiz List */}
        <div className="mb-4">
          <ul className="space-y-4">
            {quizzes.map((quiz) => (
              <li
                key={quiz.quizId}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-white">Quiz ID: {quiz.quizId}</p>
                  <p className="text-gray-300">User ID: {quiz.userId}</p>
                  <p className="text-gray-300">Total Score: {quiz.totalScore}</p>
                  <p className="text-gray-300">Passed: {quiz.passed ? 'Yes' : 'No'}</p>
                  <p className="text-gray-300">Controlled: {quiz.controlled ? 'Yes' : 'No'}</p>
                </div>
                <button
                  onClick={() => handleQuizSelection(quiz.quizId)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
                >
                  Review Quiz
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Review Selected Quiz */}
        {selectedQuiz && (
          <div className="mt-6">
            <h3 className="text-lg text-white font-bold">Reviewing Quiz ID: {selectedQuiz.quizId}</h3>
            <h4 className="text-md text-gray-300">Practical Questions</h4>
            {answers.map((answer, index) => (
              <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                <p className="text-white">
                  Question: {questionTexts[answer.questionId] || 'Loading question...'}
                </p>
                <p className="text-white">Answer Text: {answer.answerText || 'No answer provided'}</p>

                {/* Input for the score */}
                <input
                  type="number"
                  placeholder="Enter score"
                  value={answerScores[answer.userAnswerId] || ''}
                  onChange={(e) => handleScoreChange(answer.userAnswerId, Number(e.target.value))}
                  className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                />
              </div>
            ))}

            <div className="mt-6">
              <textarea
                placeholder="Add your comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4"
            >
              Submit Review
            </button>

            {/* Success/Error message at the bottom */}
            {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
            {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewQuiz;
