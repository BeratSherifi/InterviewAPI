using InterviewAPI.DTOs;

namespace InterviewAPI.Services.Interfaces;

public interface IChoiceService
{
    Task<IEnumerable<ChoiceDto>> GetChoicesByQuestionIdAsync(int questionId);
    Task<ChoiceDto> AddChoiceAsync(CreateChoiceDto createChoiceDto, int questionId);
    Task<bool> DeleteChoiceAsync(int id);
}