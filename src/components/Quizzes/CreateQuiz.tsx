import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchPositionsThunk,
  createQuizThunk,
  submitQuizThunk,
  setAnswer,
  clearError,
} from '../../store/slices/quizSlice';
import { motion } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';

const CreateQuiz: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    positions,
    quizId,
    questions,
    answers,
    error,
    success,
  } = useSelector((state: RootState) => state.quiz);

  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Utility function to decode JWT and extract the role
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  // Language mapping based on position name
  const languageMap: { [key: string]: string } = {
    React: 'javascript',
    JavaScript: 'javascript',
    Laravel: 'php',
    'C++': 'cpp',
    'C#': 'csharp',
  };

  // Fetch positions on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      const userIdFromToken = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      if (userIdFromToken) {
        setUserId(userIdFromToken); // Set userId from the token
      }
    }
  }, []);

  // Fetch positions when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchPositionsThunk(token));
    }
  }, [dispatch]);

  const handleCreateQuiz = () => {
    if (!selectedPositionId || !userId) {
      dispatch(clearError());
      return;
    }

    const token = localStorage.getItem('token');
    if (token && userId) {
      dispatch(createQuizThunk({ positionId: selectedPositionId, userId }));
    }
  };

  const handleAnswerChange = (questionId: number, choiceId?: number, answerText?: string) => {
    dispatch(setAnswer({ questionId, choiceId, answerText }));
  };

  const handleSubmitQuiz = () => {
    const token = localStorage.getItem('token');
    if (token && quizId) {
      const formattedAnswers = answers.map((answer) => ({
        questionId: answer.questionId,
        choiceId: answer.choiceId ?? undefined,
        answerText: answer.answerText ?? undefined,
      }));

      dispatch(submitQuizThunk({ quizId, answers: formattedAnswers }));
    }
  };

  const selectedLanguage =
    languageMap[positions.find((pos) => pos.positionId === selectedPositionId)?.positionName || ''] ||
    'javascript';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Create Quiz</h2>

        <select
          value={selectedPositionId || ''}
          onChange={(e) => setSelectedPositionId(Number(e.target.value))}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        >
          <option value="" disabled>
            Select a Position
          </option>
          {positions.map((position) => (
            <option key={position.positionId} value={position.positionId}>
              {position.positionName}
            </option>
          ))}
        </select>

        <motion.button
          onClick={handleCreateQuiz}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Quiz
        </motion.button>

        {(questions || []).length > 0 && (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg hide-scrollbar overflow-y-auto max-h-[600px]">
            <div className="space-y-6">
              {(questions || []).map((question) => (
                <div key={question.questionId} className="border-b border-gray-700 pb-4">
                  <h3 className="text-lg text-white font-semibold mb-4">{question.text}</h3>
                  {question.questionType === 'Theoretical' ? (
                    <div className="space-y-3">
                      {question.choices.map((choice) => (
                        <label
                          key={choice.choiceId}
                          className="block bg-gray-800 p-3 rounded-lg text-white cursor-pointer hover:bg-gray-700"
                        >
                          <input
                            type="radio"
                            name={`question-${question.questionId}`}
                            className="mr-2"
                            onChange={() => handleAnswerChange(question.questionId, choice.choiceId)}
                          />
                          {choice.text}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <MonacoEditor
                      height="150px"
                      language={selectedLanguage}
                      theme="vs-dark"
                      value={
                        answers.find((ans) => ans.questionId === question.questionId)?.answerText || ''
                      }
                      onChange={(value) =>
                        handleAnswerChange(question.questionId, undefined, value || '')
                      }
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <motion.button
              onClick={handleSubmitQuiz}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Quiz
            </motion.button>
          </div>
        )}

        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
      </motion.div>
    </div>
  );
};

export default CreateQuiz;
