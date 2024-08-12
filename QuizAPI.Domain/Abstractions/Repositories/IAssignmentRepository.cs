using QuizAPI.Domain.Models;

namespace QuizAPI.Domain.Abstractions.Repositories;

public interface IAssignmentRepository
{
    Task<Assignment> GetAssignmentByIdAsync(int assignmentId);
    Task<Assignment> AddAssignmentAsync(Assignment assignment);
    Task<bool> UpdateAssignmentAsync(Assignment assignment);
}