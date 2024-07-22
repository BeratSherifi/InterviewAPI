using InterviewAPI.Models;

namespace InterviewAPI.Repositories.Interfaces;

public interface IQuizRepository
{
    Task<IEnumerable<Quiz>> GetAllQuizzesAsync();
    Task<Quiz> GetQuizByIdAsync(int id);
    Task<IEnumerable<Quiz>> GetQuizzesByUserIdAsync(string userId);
    Task<Quiz> AddQuizAsync(Quiz quiz);
    Task<Quiz> UpdateQuizAsync(Quiz quiz);
    Task<bool> DeleteQuizAsync(int id);
}