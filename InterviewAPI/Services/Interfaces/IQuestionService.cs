using InterviewAPI.DTOs;

namespace InterviewAPI.Services.Interfaces;

public interface IQuestionService
{
    Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync();
    Task<QuestionDto> GetQuestionByIdAsync(int id);
    Task<IEnumerable<QuestionDto>> GetQuestionsByPositionAsync(int positionId);
    Task<QuestionDto> AddQuestionAsync(CreateQuestionDto createQuestionDto);
    Task<QuestionDto> UpdateQuestionAsync(int id, CreateQuestionDto updateQuestionDto);
    Task<bool> DeleteQuestionAsync(int id);
}