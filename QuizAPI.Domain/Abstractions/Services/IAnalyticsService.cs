using QuizAPI.Domain.DTOs;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IAnalyticsService
{
    Task<IEnumerable<QuizGetAllDTO>> GetTopScoresByPositionAsync(int positionId);
    Task<IEnumerable<QuizGetAllDTO>> GetLowestsScoresByPositionAsync(int positionId);

    Task<IEnumerable<QuizGetAllDTO>> GetTopScoresByUserIdAsync(string userId);
    
    Task<QuizGetAllDTO> GetHighestScoringQuizAsync();

    Task<QuizGetAllDTO> GetLowestScoringQuizAsync();
}