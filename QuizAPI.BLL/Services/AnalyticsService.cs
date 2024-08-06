using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;

namespace QuizAPI.BLL.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IQuizRepository _quizRepository;
    private readonly IMapper _mapper;

    public AnalyticsService(IQuizRepository quizRepository, IMapper mapper)
    {
        _quizRepository = quizRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<QuizGetAllDTO>> GetTopScoresByPositionAsync(int positionId)
    {
        var quizzes = await _quizRepository.GetAllQuizzes()
            .Where(q => q.PositionId == positionId)
            .OrderByDescending(q => q.TotalScore)
            .ToListAsync();

        return quizzes.Select(q => _mapper.Map<QuizGetAllDTO>(q));
    }

    public async Task<IEnumerable<QuizGetAllDTO>> GetLowestsScoresByPositionAsync(int positionId)
    {
        var quizzes = await _quizRepository.GetAllQuizzes()
            .Where(q => q.PositionId == positionId)
            .OrderBy(q => q.TotalScore)
            .ToListAsync();
        return quizzes.Select(q => _mapper.Map<QuizGetAllDTO>(q));
    }
    
    public async Task<IEnumerable<QuizGetAllDTO>> GetTopScoresByUserIdAsync(string userId)
    {
        var quizzes = await _quizRepository.GetQuizzesByUserIdAsync(userId)
            .Where(q=>q.UserId == userId)
            .OrderByDescending(q => q.TotalScore)
            .ToListAsync();
        return _mapper.Map<IEnumerable<QuizGetAllDTO>>(quizzes);
    }


    

    public async Task<QuizGetAllDTO> GetHighestScoringQuizAsync()
    {
        var highestScoringQuiz = await _quizRepository.GetAllQuizzes()
            .OrderByDescending(q => q.TotalScore)
            .FirstOrDefaultAsync();

        return _mapper.Map<QuizGetAllDTO>(highestScoringQuiz);
    }

    public async Task<QuizGetAllDTO> GetLowestScoringQuizAsync()
    {
        var lowestScoringQuiz = await _quizRepository.GetAllQuizzes()
            .OrderBy(q => q.TotalScore)
            .FirstOrDefaultAsync();

        return _mapper.Map<QuizGetAllDTO>(lowestScoringQuiz);
    }
    
    
    
    
}
