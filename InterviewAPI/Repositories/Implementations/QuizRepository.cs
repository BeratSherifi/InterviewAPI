using InterviewAPI.Data;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InterviewAPI.Repositories.Implementations;

public class QuizRepository : IQuizRepository
{
    private readonly AppDbContext _context;

    public QuizRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Quiz>> GetAllQuizzesAsync()
    {
        return await _context.Quizzes
            .Include(q => q.UserAnswers)
            .ThenInclude(ua => ua.Question)
            .ToListAsync();
    }

    public async Task<Quiz> GetQuizByIdAsync(int id)
    {
        return await _context.Quizzes
            .Include(q => q.UserAnswers)
            .ThenInclude(ua => ua.Question)
            .FirstOrDefaultAsync(q => q.QuizId == id);
    }
    
    public async Task<IEnumerable<Quiz>> GetQuizzesByUserIdAsync(string userId)
    {
        return await _context.Quizzes
            .Include(q => q.UserAnswers)
            .ThenInclude(ua => ua.Question)
            .Where(q => q.UserId == userId)
            .ToListAsync();
    }

    public async Task<Quiz> AddQuizAsync(Quiz quiz)
    {
        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();
        return quiz;
    }

    public async Task<Quiz> UpdateQuizAsync(Quiz quiz)
    {
        _context.Quizzes.Update(quiz);
        await _context.SaveChangesAsync();
        return quiz;
    }

    public async Task<bool> DeleteQuizAsync(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
        {
            return false;
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();
        return true;
    }
}