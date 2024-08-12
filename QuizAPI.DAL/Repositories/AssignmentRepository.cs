using Microsoft.EntityFrameworkCore;
using QuizAPI.DAL.Data;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Models;

namespace QuizAPI.DAL.Repositories;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly AppDbContext _context;

    public AssignmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Assignment> GetAssignmentByIdAsync(int assignmentId)
    {
        return await _context.Assignments
            .Include(a => a.UserAnswer)
            .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);
    }

    public async Task<Assignment> AddAssignmentAsync(Assignment assignment)
    {
        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();
        return assignment;
    }

    public async Task<bool> UpdateAssignmentAsync(Assignment assignment)
    {
        _context.Assignments.Update(assignment);
        return await _context.SaveChangesAsync() > 0;
    }
}

