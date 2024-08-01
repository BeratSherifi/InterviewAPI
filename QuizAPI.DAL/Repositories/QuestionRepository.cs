using Microsoft.EntityFrameworkCore;
using QuizAPI.DAL.Data;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Models;

namespace QuizAPI.DAL.Repositories;

public class QuestionRepository : IQuestionRepository
{
    private readonly AppDbContext _context;

    public QuestionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
    {
        return await _context.Questions.Include(q => q.Choices).ToListAsync();
    }

    public async Task<Question> GetQuestionByIdAsync(int id)
    {
        return await _context.Questions.Include(q => q.Choices).FirstOrDefaultAsync(q => q.QuestionId == id);
    }

    public async Task<IEnumerable<Question>> GetQuestionsByPositionIdAsync(int positionId)
    {
        return await _context.Questions
            .Where(q => q.PositionId == positionId)
            .Include(q => q.Choices)
            .ToListAsync();
    }
    public async Task<Choice> GetChoiceByIdAsync(int choiceId)
    {
        return await _context.Choices
            .FirstOrDefaultAsync(c => c.ChoiceId == choiceId);
    }

    public async Task<Question> AddQuestionAsync(Question question)
    {
        await _context.Questions.AddAsync(question);
        await _context.SaveChangesAsync();
        return question;
    }

    public async Task<Question> UpdateQuestionAsync(Question question)
    {
        _context.Questions.Update(question);
        await _context.SaveChangesAsync();
        return question;
    }

    public async Task<bool> DeleteQuestionAsync(int id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null)
        {
            return false;
        }

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();
        return true;
    }
}