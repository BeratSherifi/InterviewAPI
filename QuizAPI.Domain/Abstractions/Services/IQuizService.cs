using QuizAPI.Domain.DTOs;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IQuizService
{
    Task<IEnumerable<QuizGetAllDTO>> GetAllQuizzesAsync();
    Task<QuizDTO> AddQuizAsync(CreateQuizDTO createQuizDto);
    Task<QuizDTO> UpdateQuizAsync(int id, CreateQuizDTO updateQuizDto);
    Task<bool> DeleteQuizAsync(int id);

    Task<QuizResultDTO> SubmitQuizAsync(SubmitQuizDTO submitQuizDto);
    Task<bool> ReviewPracticalAnswersAsync(ReviewPracticalAnswersDTO reviewDto);
    Task<QuizResultDTO> GetQuizByIdAsync(int id);
    Task<IEnumerable<QuizResultDTO>> GetQuizResultsByUserIdAsync(string userId);
}