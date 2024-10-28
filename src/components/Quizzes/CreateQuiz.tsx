import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Position {
  positionId: number;
  positionName: string;
}

interface Question {
  questionId: number;
  text: string;
  questionType: string;
  choices: { choiceId: number; text: string }[];
}

const CreateQuiz: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);  // For storing the fetched questions
  const [answers, setAnswers] = useState<{ questionId: number; choiceId?: number; answerText?: string }[]>([]);

  // Fetch available positions on component mount
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/api/Position', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(response.data);
      } catch (error) {
        setError('Failed to fetch positions.');
      }
    };

    fetchPositions();
  }, []);

  // Handle quiz creation and fetch questions after quiz is created
  const handleSubmit = async () => {
    if (!selectedPositionId) {
      setError('Please select a position.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('You are not authenticated.');
        return;
      }

      const response = await axios.post(
        'https://localhost:7213/api/Quiz',
        { positionId: selectedPositionId, userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const quizId = response.data.quizId;
        setQuizId(quizId);
        setSuccess('Quiz created successfully!');

        // Fetch the questions after quiz creation
        const questions = response.data.questions;
        if (questions) {
          setQuestions(questions);
        } else {
          setError('Failed to fetch questions.');
        }

        setError(null);
      } else {
        setError('Failed to create quiz.');
      }
    } catch (error) {
      setError('An error occurred while creating the quiz.');
    }
  };

  // Handle user input for answers (both theoretical and practical)
  const handleAnswerChange = (questionId: number, choiceId?: number, answerText?: string) => {
    setAnswers((prev) => {
      const existing = prev.find((ans) => ans.questionId === questionId);
      if (existing) {
        return prev.map((ans) =>
          ans.questionId === questionId ? { questionId, choiceId, answerText } : ans
        );
      } else {
        return [...prev, { questionId, choiceId, answerText }];
      }
    });
  };

  // Submit the quiz
  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !quizId) {
        setError('You are not authenticated or quiz ID is missing.');
        return;
      }

      const response = await axios.post(
        'https://localhost:7213/api/Quiz/submit',
        { quizId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Quiz submitted successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to submit quiz.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900"> {/* Responsive background */}
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto"> {/* Responsive container */}
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Create Quiz</h2>

        {/* Position Selector */}
        <select
          value={selectedPositionId || ''}
          onChange={(e) => setSelectedPositionId(Number(e.target.value))}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        >
          <option value="" disabled>Select a Position</option>
          {positions.map((position) => (
            <option key={position.positionId} value={position.positionId}>
              {position.positionName}
            </option>
          ))}
        </select>

        {/* Create Quiz Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Create Quiz
        </button>

        {/* Display Questions and Submit */}
        {questions && questions.length > 0 && (
          <div className="mt-6 h-80 overflow-y-auto bg-gray-900 p-4 rounded-lg hide-scrollbar"> {/* Scrollable container */}
            {questions.map((question) => (
              <div key={question.questionId} className="mb-4">
                <h3 className="text-white">{question.text}</h3>

                {/* Theoretical Questions */}
                {question.questionType === 'Theoretical' ? (
                  question.choices.map((choice) => (
                    <label key={choice.choiceId} className="block text-white mb-3"> {/* Added margin for space */}
                      <input
                        type="radio"
                        name={`question-${question.questionId}`}
                        onChange={() => handleAnswerChange(question.questionId, choice.choiceId)}
                      />
                      <span className="ml-2">{choice.text}</span> {/* Add space between input and text */}
                    </label>
                  ))
                ) : (
                  /* Practical Questions */
                  <textarea
                    placeholder="Your answer"
                    onChange={(e) => handleAnswerChange(question.questionId, undefined, e.target.value)}
                    className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white mt-2"
                  ></textarea>
                )}
              </div>
            ))}

            <button
              onClick={handleSubmitQuiz}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
      </div>
    </div>
  );
};

export default CreateQuiz;
