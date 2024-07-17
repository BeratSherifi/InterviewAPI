using InterviewAPI.Data;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InterviewAPI.Repositories.Implementations;

public class ChoiceRepository : IChoiceRepository
{
    private readonly AppDbContext _context;

    public ChoiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Choice>> GetChoicesByQuestionIdAsync(int questionId)
    {
        return await _context.Choices.Where(c => c.QuestionId == questionId).ToListAsync();
    }

    public async Task<Choice> AddChoiceAsync(Choice choice)
    {
        _context.Choices.Add(choice);
        await _context.SaveChangesAsync();
        return choice;
    }

    public async Task<Choice> UpdateChoiceAsync(Choice choice)
    {
        _context.Choices.Update(choice);
        await _context.SaveChangesAsync();
        return choice;
    }

    public async Task<bool> DeleteChoiceAsync(int id)
    {
        var choice = await _context.Choices.FindAsync(id);
        if (choice == null)
        {
            return false;
        }

        _context.Choices.Remove(choice);
        await _context.SaveChangesAsync();
        return true;
    }
}