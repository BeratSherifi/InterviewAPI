using InterviewAPI.DTOs;

namespace InterviewAPI.Services.Interfaces;

public interface IQuizService
{
    Task<IEnumerable<QuizDto>> GetAllQuizzesAsync();
    Task<QuizDto> AddQuizAsync(CreateQuizDto createQuizDto);
    Task<QuizDto> UpdateQuizAsync(int id, CreateQuizDto updateQuizDto);
    Task<bool> DeleteQuizAsync(int id);

    Task<QuizResultDto> SubmitQuizAsync(SubmitQuizDto submitQuizDto);
    Task<bool> ReviewPracticalAnswersAsync(ReviewPracticalAnswersDto reviewDto);
    Task<QuizDto> GetQuizByIdAsync(int id);
    Task<IEnumerable<QuizResultDto>> GetQuizResultsByUserIdAsync(string userId);

}