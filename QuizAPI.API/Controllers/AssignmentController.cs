using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;

namespace QuizAPI.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AssignmentController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddAssignment(CreateAssignmentDTO createAssignmentDto)
    {
        var result = await _assignmentService.AddAssignmentAsync(createAssignmentDto);
        if (result == null)
        {
            return BadRequest("Unable to add assignment.");
        }
        return Ok(result);
    }
    
    
    [HttpPost("submit")]
    public async Task<IActionResult> SubmitAssignment(SubmitAssignmentDTO submitAssignmentDto)
    {
        var result = await _assignmentService.SubmitAssignmentAsync(submitAssignmentDto);
        if (result == null)
        {
            return BadRequest("Unable to submit assignment.");
        }
        return Ok(result);
    }
    
    [HttpPost]
    [Route("review")]
    public async Task<IActionResult> ReviewAssignment(ReviewAssignmentDTO reviewAssignmentDto)
    {
        var result = await _assignmentService.ReviewAssignmentAsync(reviewAssignmentDto);
        if (result)
        {
            return Ok("Assignment reviewed successfully.");
        }

        return BadRequest("Failed to review assignment.");
    }
}
        
    