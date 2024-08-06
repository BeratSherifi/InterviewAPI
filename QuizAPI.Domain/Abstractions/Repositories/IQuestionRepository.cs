using QuizAPI.Domain.Models;

namespace QuizAPI.Domain.Abstractions.Repositories;

public interface IQuestionRepository
{
    Task<IEnumerable<Question>> GetAllQuestionsAsync();
    Task<Question> GetQuestionByIdAsync(int id);
    Task<IEnumerable<Question>> GetQuestionsByPositionIdAsync(int positionId);
    Task<Choice> GetChoiceByIdAsync(int choiceId);
    Task<Question> AddQuestionAsync(Question question);
    Task<Question> UpdateQuestionAsync(Question question);
    Task<bool> DeleteQuestionAsync(int id);
}