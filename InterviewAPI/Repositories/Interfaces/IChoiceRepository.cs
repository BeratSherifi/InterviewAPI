using InterviewAPI.Models;

namespace InterviewAPI.Repositories.Interfaces;

public interface IChoiceRepository
{
    Task<IEnumerable<Choice>> GetChoicesByQuestionIdAsync(int questionId);
    Task<Choice> AddChoiceAsync(Choice choice);
    Task<Choice> UpdateChoiceAsync(Choice choice);
    Task<bool> DeleteChoiceAsync(int id);
}