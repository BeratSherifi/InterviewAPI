using QuizAPI.Domain.DTOs;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IChoiceService
{
    Task<IEnumerable<ChoiceDTO>> GetChoicesByQuestionIdAsync(int questionId);
    Task<ChoiceDTO> AddChoiceAsync(CreateChoiceDTO createChoiceDto, int questionId);
    Task<bool> DeleteChoiceAsync(int id);
}