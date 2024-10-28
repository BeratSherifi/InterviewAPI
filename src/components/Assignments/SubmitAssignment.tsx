import React, { useState } from 'react';
import axios from 'axios';

const SubmitAssignment: React.FC = () => {
  const [assignmentId, setAssignmentId] = useState<number>(0);
  const [answerText, setAnswerText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://localhost:7213/api/Assignment/submit', {
        assignmentId,
        answerText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess('Assignment submitted successfully!');
        setError(null);
        // Reset the form
        setAssignmentId(0);
        setAnswerText('');
      } else {
        setError('Failed to submit assignment.');
      }
    } catch (error) {
      setError('Error submitting assignment.');
      console.error('Error submitting assignment:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Submit Assignment</h2>
      <input
        type="number"
        placeholder="Assignment ID"
        value={assignmentId}
        onChange={(e) => setAssignmentId(Number(e.target.value))}
        className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
      />
      <textarea
        placeholder="Your answer..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
      >
        Submit Assignment
      </button>
      {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
    </div>
  );
};

export default SubmitAssignment;
