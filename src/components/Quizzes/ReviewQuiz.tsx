import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchQuizzesThunk,
  fetchUserMapThunk,
  fetchQuizDetailsThunk,
  fetchPositionsThunk,
  submitQuizReviewThunk,
  setAnswerScores,
} from '../../store/slices/quizSlice';
import { motion } from 'framer-motion';

const ReviewQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    quizzes,
    selectedQuiz,
    answerScores,
    questionDetails,
    userMap,
    success,
    error,
    positions, // Include positions from state
  } = useSelector((state: RootState) => state.quiz);

  const reviewSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchQuizzesThunk(token));
      dispatch(fetchUserMapThunk(token));
      dispatch(fetchPositionsThunk(token)); // Fetch positions
    }
  }, [dispatch]);

  const handleQuizSelection = (quizId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    dispatch(fetchQuizDetailsThunk({ quizId, token }));
    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScoreChange = (userAnswerId: number, score: number) => {
    dispatch(setAnswerScores({ userAnswerId, score: Math.max(0, Math.min(10, score)) }));
  };

  const handleSubmitReview = () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedQuiz) return;

    const reviewPayload = {
      quizId: selectedQuiz.quizId,
      answers: selectedQuiz.userAnswers
        .filter((answer) => questionDetails[answer.questionId]?.questionType === 'Practical')
        .map((answer) => ({
          userAnswerId: answer.userAnswerId,
          score: answerScores[answer.userAnswerId] || 0,
        })),
      comment: '', // Add a comment input if necessary
    };

    dispatch(submitQuizReviewThunk({ reviewPayload, token }));
  };

  const getPositionName = (positionId: number): string => {
    const position = positions.find((pos) => pos.positionId === positionId);
    return position ? position.positionName : 'Unknown Position';
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
                  <p className="text-gray-300">User Email: {userMap[quiz.userId] || 'Loading...'}</p>
                  <p className="text-gray-300">Position: {getPositionName(quiz.positionId)}</p>
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
            {selectedQuiz.userAnswers.map((answer, index) => {
              const question = questionDetails[answer.questionId];
              if (!question) return null;

              const chosenAnswer =
                question.choices?.find((choice) => choice.choiceId === answer.choiceId)?.text ||
                answer.answerText || // Practical answers
                'No answer provided';

              return (
                <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                  <p className="text-indigo-400 font-bold">Question: {question.text}</p>
                  <p className="text-white">Answer: {chosenAnswer}</p>

                  {question.choices && question.questionType === 'Theoretical' && (
                    <>
                      <p className="text-white mt-4">Choices:</p>
                      <ul className="ml-4">
                        {question.choices.map((choice) => (
                          <li
                            key={choice.choiceId}
                            className="mt-1 flex justify-between"
                          >
                            <span className="text-gray-300">{choice.text}</span>
                            <span
                              className={`ml-2 font-semibold ${
                                choice.isCorrect ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {choice.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {question.questionType === 'Practical' && (
                    <input
                      type="number"
                      placeholder="Enter score"
                      value={answerScores[answer.userAnswerId] || ''}
                      onChange={(e) =>
                        handleScoreChange(answer.userAnswerId, Number(e.target.value))
                      }
                      className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
                    />
                  )}
                </div>
              );
            })}
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
