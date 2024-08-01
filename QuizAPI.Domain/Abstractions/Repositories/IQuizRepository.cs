using QuizAPI.Domain.Models;

namespace  QuizAPI.Domain.Abstractions.Repositories;

public interface IQuizRepository
{
    IQueryable<Quiz> GetAllQuizzes();
    Task<Quiz> GetQuizByIdAsync(int id);
    IQueryable<Quiz> GetQuizzesByUserIdAsync(string userId);
    Task<Quiz> AddQuizAsync(Quiz quiz);
    Task<Quiz> UpdateQuizAsync(Quiz quiz);
    Task<bool> DeleteQuizAsync(int id);
}