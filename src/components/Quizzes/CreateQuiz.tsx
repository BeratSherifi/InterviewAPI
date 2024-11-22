import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';

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
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; choiceId?: number; answerText?: string }[]>([]);

  // Language mapping based on position name
  const languageMap: { [key: string]: string } = {
    React: 'javascript',
    JavaScript: 'javascript',
    Laravel: 'php',
  'C++': 'cpp',
    'C#': 'csharp',
  };

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/api/Position', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPositions(response.data);
      } catch (error) {
        setError('Failed to fetch positions.');
      }
    };
    fetchPositions();
  }, []);

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
        { positionId: selectedPositionId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200 || response.status === 201) {
        const quizId = response.data.quizId;
        const quizQuestions = response.data.questions || [];
  
        if (quizQuestions.length === 0) {
          setError('Cannot create quiz because there are no questions for the selected position.');
          setSuccess(null);  // Clear success message
          setQuizId(null);    // Clear quiz ID
          setQuestions(null); // Clear questions
        } else {
          setQuizId(quizId);
          setQuestions(quizQuestions);
          setSuccess('Quiz created successfully!');
          setError(null);
        }
      } else {
        setError('Failed to create quiz.');
      }
    } catch (error) {
      setError('An error occurred while creating the quiz.');
    }
  };

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

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !quizId) {
        setError('You are not authenticated or quiz ID is missing.');
        return;
      }

      await axios.post(
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

  // Get the selected language for Monaco Editor based on the selected position
  const selectedLanguage = languageMap[positions.find(pos => pos.positionId === selectedPositionId)?.positionName || ''] || 'javascript';

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
        <option value="" disabled>Select a Position</option>
        {positions.map((position) => (
          <option key={position.positionId} value={position.positionId}>
            {position.positionName}
          </option>
        ))}
      </select>
  
      <motion.button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Quiz
      </motion.button>
  
      {questions && questions.length > 0 && (
        <div className="mt-6 bg-gray-900 p-4 rounded-lg hide-scrollbar overflow-y-auto max-h-[600px]">
          <div className="space-y-6">
            {questions.map((question) => (
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
                          onChange={() =>
                            handleAnswerChange(question.questionId, choice.choiceId)
                          }
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
                      answers.find((ans) => ans.questionId === question.questionId)
                        ?.answerText || ''
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
