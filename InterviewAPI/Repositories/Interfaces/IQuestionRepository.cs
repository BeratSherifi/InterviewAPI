using InterviewAPI.Models;

namespace InterviewAPI.Repositories.Interfaces;

public interface IQuestionRepository
{
    Task<IEnumerable<Question>> GetAllQuestionsAsync();
    Task<Question> GetQuestionByIdAsync(int id);
    Task<IEnumerable<Question>> GetQuestionsByPositionAsync(int positionId);
    Task<Question> AddQuestionAsync(Question question);
    Task<Question> UpdateQuestionAsync(Question question);
    Task<bool> DeleteQuestionAsync(int id);
}