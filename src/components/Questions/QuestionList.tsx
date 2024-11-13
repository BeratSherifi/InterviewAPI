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
  const [theoreticalQuestions, setTheoreticalQuestions] = useState<Question[]>([]);
  const [practicalQuestions, setPracticalQuestions] = useState<Question[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
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

        const allQuestions = response.data as Question[];
        const theoretical = allQuestions.filter(
          (question: Question) => question.questionType === "Theoretical"
        );
        const practical = allQuestions.filter(
          (question: Question) => question.questionType === "Practical"
        );
        setTheoreticalQuestions(theoretical);
        setPracticalQuestions(practical);
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
      } catch (err) {
        setError("Failed to fetch positions.");
      }
    };

    fetchQuestions();
    fetchPositions();
  }, []);

  const handleDelete = async (questionId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7213/api/Question/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTheoreticalQuestions((prev) =>
        prev.filter((q) => q.questionId !== questionId)
      );
      setPracticalQuestions((prev) =>
        prev.filter((q) => q.questionId !== questionId)
      );
    } catch (err) {
      console.error("Failed to delete the question.", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-4xl">
        <h1 className="text-2xl text-white mb-4">Question List</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <h2 className="text-white text-xl mb-2">Theoretical Questions</h2>
        <div className="max-h-96 overflow-y-auto">
          <ul className="text-white mb-6 space-y-4">
            {theoreticalQuestions.map((question: Question) => (
              <motion.li
                key={question.questionId}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="font-semibold">{question.text}</h3>
                  <p>Difficulty Level: {question.difficultyLevel}</p>
                  <p>Type: {question.questionType}</p>
                  <p>
                    Position:{" "}
                    {
                      positions.find((pos) => pos.positionId === question.positionId)?.positionName
                    }
                  </p>
                  <ul className="ml-4">
                    {question.choices.map((choice: Choice) => (
                      <li key={choice.choiceId}>
                        {choice.text} - {choice.isCorrect ? "Correct" : "Incorrect"}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleDelete(question.questionId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg w-full md:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <h2 className="text-white text-xl mb-2">Practical Questions</h2>
        <div className="max-h-96 overflow-y-auto">
          <ul className="text-white space-y-4">
            {practicalQuestions.map((question: Question) => (
              <motion.li
                key={question.questionId}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h3 className="font-semibold">{question.text}</h3>
                  <p>Difficulty Level: {question.difficultyLevel}</p>
                  <p>Type: {question.questionType}</p>
                  <p>
                    Position:{" "}
                    {
                      positions.find((pos) => pos.positionId === question.positionId)?.positionName
                    }
                  </p>
                  <ul className="ml-4">
                    {question.choices.map((choice: Choice) => (
                      <li key={choice.choiceId}>
                        {choice.text} - {choice.isCorrect ? "Correct" : "Incorrect"}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleDelete(question.questionId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg w-full md:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
