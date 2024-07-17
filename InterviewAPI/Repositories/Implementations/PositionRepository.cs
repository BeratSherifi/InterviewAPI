using InterviewAPI.Data;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InterviewAPI.Repositories.Implementations;

public class PositionRepository : IPositionRepository
{
    private readonly AppDbContext _context;

    public PositionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Position>> GetAllPositionsAsync()
    {
        return await _context.Positions.ToListAsync();
    }

    public async Task<Position> GetPositionByIdAsync(int id)
    {
        return await _context.Positions.FindAsync(id);
    }

    public async Task<Position> AddPositionAsync(Position position)
    {
        _context.Positions.Add(position);
        await _context.SaveChangesAsync();
        return position;
    }

    public async Task<Position> UpdatePositionAsync(Position position)
    {
        _context.Positions.Update(position);
        await _context.SaveChangesAsync();
        return position;
    }

    public async Task<bool> DeletePositionAsync(int id)
    {
        var position = await _context.Positions.FindAsync(id);
        if (position == null)
        {
            return false;
        }

        _context.Positions.Remove(position);
        await _context.SaveChangesAsync();
        return true;
    }
}