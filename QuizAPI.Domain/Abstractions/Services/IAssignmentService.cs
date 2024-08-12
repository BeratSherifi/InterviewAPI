using QuizAPI.Domain.DTOs;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IAssignmentService
{
    Task<AssignmentDTO> AddAssignmentAsync(CreateAssignmentDTO createAssignmentDto);
    Task<bool> ReviewAssignmentAsync(ReviewAssignmentDTO reviewAssignmentDto);

    Task<AssignmentResultDTO> SubmitAssignmentAsync(SubmitAssignmentDTO submitAssignmentDto);
}