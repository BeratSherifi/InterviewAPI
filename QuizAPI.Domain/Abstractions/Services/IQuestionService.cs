using QuizAPI.Domain.DTOs;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IQuestionService
{
    Task<IEnumerable<QuestionDTO>> GetAllQuestionsAsync();
    Task<QuestionDTO> GetQuestionByIdAsync(int id);
    Task<IEnumerable<QuestionDTO>> GetQuestionsByPositionIdAsync(int positionId);
    Task<ChoiceDTO> GetChoiceByIdAsync(int choiceId);
    Task<QuestionDTO> AddQuestionAsync(CreateQuestionDTO createQuestionDto);
    Task<QuestionDTO> UpdateQuestionAsync(int id, CreateQuestionDTO updateQuestionDto);
    Task<bool> DeleteQuestionAsync(int id);
}