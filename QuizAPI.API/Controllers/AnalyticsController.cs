using Microsoft.AspNetCore.Mvc;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;

namespace QuizAPI.API.Controllers;

public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    // Get top scores by position
    [HttpGet("positions/{positionId}/top-scores")]
    public async Task<ActionResult<IEnumerable<QuizGetAllDTO>>> GetTopScoresByPosition(int positionId)
    {
        var scores = await _analyticsService.GetTopScoresByPositionAsync(positionId);
        if (scores == null || !scores.Any())
            return NotFound("No quizzes found for the specified position.");

        return Ok(scores);
    }

    [HttpGet("positions/{positionId}/lowest-scores")]
    public async Task<ActionResult<IEnumerable<QuizGetAllDTO>>> GetLowestsScoresByPosition(int positionId)
    {
        var scores = await _analyticsService.GetLowestsScoresByPositionAsync(positionId);
        if (scores == null || !scores.Any())
            return NotFound("No quizzes found for the specified position");
        return Ok(scores);
    }

    [HttpGet("users/{userId}/topscores-by-user-id")]
    public async Task<ActionResult<IEnumerable<QuizGetAllDTO>>> GetTopScoresByUserId(string userId)
    {
        var scores = await _analyticsService.GetTopScoresByUserIdAsync(userId);
        if (scores == null || !scores.Any())
            return NotFound("No quizzes found for the specified user");
        return Ok(scores);

    }

    // Get the highest scoring quiz
    [HttpGet("quizzes/highest-score")]
    public async Task<ActionResult<QuizDTO>> GetHighestScoringQuiz()
    {
        var quiz = await _analyticsService.GetHighestScoringQuizAsync();
        if (quiz == null)
            return NotFound("No quizzes available.");

        return Ok(quiz);
    }



    [HttpGet("quizzes/lowest-score")]
    public async Task<ActionResult<QuizDTO>> GetLowestScore()
    {
        var quiz = await _analyticsService.GetLowestScoringQuizAsync();
        if (quiz == null)
            return NotFound("No quizzes available.");

        return Ok(quiz);
    }

    [HttpGet("positions/{positionId}/average-score")]
    public async Task<ActionResult<double>> GetAverageScoreByPosition(int positionId)
    {
        var averageScore = await _analyticsService.GetAverageScoreByPositionAsync(positionId);
        return averageScore;
    }
    
    [HttpGet("users/passed-quizzes")]
    public async Task<ActionResult<QuizGetAllDTO>> GetUsersThatPassedQuizzes()
    {
        var quizzes = await _analyticsService.GetUsersPasseddQuizzesAsync();
        if (quizzes == null)
            return NotFound("There is no passed quizzes");

        return Ok(quizzes);
    }
    
    [HttpGet("users/failed-quizzes")]
    public async Task<ActionResult<QuizGetAllDTO>> GetUsersThatFailedQuizzes()
    {
        var quizzes = await _analyticsService.GetUsersFailedQuizzesAsync();
        if (quizzes == null)
            return NotFound("There is no failed quizzes");

        return Ok(quizzes);
    }
    
}