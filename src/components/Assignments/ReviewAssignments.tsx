import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Assignment {
  assignmentId: number;
  userId: string;
  title: string;
  assignmentDescription: string;
  score: number;
  comment: string;
  controlled: boolean;
}

const ReviewAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/api/Assignment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignments(response.data);
      } catch (error) {
        setError('Failed to fetch assignments.');
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const handleReviewAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://localhost:7213/api/Assignment/review', {
        assignmentId: selectedAssignment.assignmentId,
        score,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess('Assignment reviewed successfully!');
        setError(null);
        // Reset the review fields
        setSelectedAssignment(null);
        setScore(0);
        setComment('');
      } else {
        setError('Failed to review assignment.');
      }
    } catch (error) {
      setError('Error reviewing assignment.');
      console.error('Error reviewing assignment:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl text-white font-bold mb-4">Review Assignments</h2>

      <ul className="space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment.assignmentId} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-white">Assignment ID: {assignment.assignmentId}</p>
              <p className="text-gray-300">User ID: {assignment.userId}</p>
              <p className="text-gray-300">Title: {assignment.title}</p>
              <p className="text-gray-300">Description: {assignment.assignmentDescription}</p>
              <p className="text-gray-300">Controlled: {assignment.controlled ? 'Yes' : 'No'}</p>
            </div>
            <button
              onClick={() => {
                setSelectedAssignment(assignment);
                setScore(assignment.score);
                setComment(assignment.comment);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
            >
              Review
            </button>
          </li>
        ))}
      </ul>

      {selectedAssignment && (
        <div className="mt-6">
          <h3 className="text-lg text-white font-bold">Reviewing Assignment ID: {selectedAssignment.assignmentId}</h3>
          <input
            type="number"
            placeholder="Enter score (0-10)"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <textarea
            placeholder="Add your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          ></textarea>
          <button
            onClick={handleReviewAssignment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-4"
          >
            Submit Review
          </button>
          {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
        </div>
      )}
    </div>
  );
};

export default ReviewAssignments;
