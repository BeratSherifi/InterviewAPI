using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.BLL.Services;

public class AssignmentService : IAssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly IMapper _mapper;

    public AssignmentService(IAssignmentRepository assignmentRepository, IMapper mapper)
    {
        _assignmentRepository = assignmentRepository;
        _mapper = mapper;
    }

    public async Task<AssignmentDTO> AddAssignmentAsync(CreateAssignmentDTO createAssignmentDto)
    {
        var assignment = _mapper.Map<Assignment>(createAssignmentDto);
        assignment.Comment = string.Empty; // Initialize Comment as empty or null

        var addedAssignment = await _assignmentRepository.AddAssignmentAsync(assignment);
        return _mapper.Map<AssignmentDTO>(addedAssignment);
    }

    public async Task<bool> ReviewAssignmentAsync(ReviewAssignmentDTO reviewDto)
    {
        var assignment = await _assignmentRepository.GetAssignmentByIdAsync(reviewDto.AssignmentId);
        if (assignment == null)
        {
            return false;
        }

        // Update the score and comment
        assignment.Score = reviewDto.Score;
        assignment.Comment = reviewDto.Comment;

        // Automatically set the controlled flag to true
        assignment.Controlled = true;

        // Determine if the assignment is passed based on the score
        assignment.Passed = reviewDto.Score >= 80;

        await _assignmentRepository.UpdateAssignmentAsync(assignment);
        return true;
    }
    
    public async Task<AssignmentResultDTO> SubmitAssignmentAsync(SubmitAssignmentDTO submitAssignmentDto)
    {
        var assignment = await _assignmentRepository.GetAssignmentByIdAsync(submitAssignmentDto.AssignmentId);
        if (assignment == null)
        {
            return null;
        }

        // Update the user's answer
        assignment.UserAnswer.AnswerText = submitAssignmentDto.AnswerText;

        // Set the assignment as reviewed (controlled)
        assignment.Controlled = true;

        // Calculate if the assignment is passed based on the score
        assignment.Passed = assignment.Score >= 80;

        // Save the changes
        await _assignmentRepository.UpdateAssignmentAsync(assignment);

        // Map to DTO and return
        return _mapper.Map<AssignmentResultDTO>(assignment);
    }

}