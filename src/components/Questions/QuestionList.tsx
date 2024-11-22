import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Choice {
  choiceId: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionId: number;
  text: string;
  difficultyLevel: number;
  questionType: string;
  positionId: number;
  choices: Choice[];
}

interface Position {
  positionId: number;
  positionName: string;
}

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7213/api/Question", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data);
        setFilteredQuestions(response.data); // Initially show all questions
        setError(null);
      } catch (err) {
        setError("Failed to fetch questions.");
      }
    };

    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7213/api/Position", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch positions.");
      }
    };

    fetchQuestions();
    fetchPositions();
  }, []);

  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const positionId = parseInt(event.target.value);
    setSelectedPosition(positionId);

    // Filter questions by the selected position
    if (!isNaN(positionId)) {
      const filtered = questions.filter(
        (question) => question.positionId === positionId
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions); // Show all questions if no position is selected
    }
  };

  const handleDelete = async (questionId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7213/api/Question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
      setFilteredQuestions((prev) =>
        prev.filter((q) => q.questionId !== questionId)
      );
    } catch (err) {
      console.error("Failed to delete the question.", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-5xl shadow-lg">
        <h1 className="text-2xl text-white font-bold mb-6 text-center">
          Question List
        </h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* Dropdown for selecting position */}
        <div className="mb-6">
          <label
            htmlFor="position"
            className="block text-white font-medium mb-2"
          >
            Filter by Position:
          </label>
          <select
            id="position"
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-white"
            value={selectedPosition || ""}
            onChange={handlePositionChange}
          >
            <option value="">All Positions</option>
            {positions.map((position) => (
              <option key={position.positionId} value={position.positionId}>
                {position.positionName}
              </option>
            ))}
          </select>
        </div>

        {/* Display questions */}
        <div className="max-h-[500px] overflow-y-auto space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question: Question) => (
              <motion.div
                key={question.questionId}
                className="bg-gray-700 p-4 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-white">
                  {question.text}
                </h3>
                <p className="text-sm text-gray-300">
                  Difficulty Level: {question.difficultyLevel}
                </p>
                <p className="text-sm text-gray-300">
                  Position:{" "}
                  {
                    positions.find(
                      (pos) => pos.positionId === question.positionId
                    )?.positionName
                  }
                </p>
                <ul className="ml-4 mt-2 space-y-1">
                  {question.choices.map((choice: Choice) => (
                    <li key={choice.choiceId} className="text-gray-300">
                      {choice.text} -{" "}
                      <span
                        className={
                          choice.isCorrect ? "text-green-400" : "text-red-400"
                        }
                      >
                        {choice.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDelete(question.questionId)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
                >
                  Delete
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-white text-center">
              No questions available for the selected position.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
