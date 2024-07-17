using InterviewAPI.Models;

namespace InterviewAPI.Repositories.Interfaces;

public interface IPositionRepository
{
    Task<IEnumerable<Position>> GetAllPositionsAsync();
    Task<Position> GetPositionByIdAsync(int id);
    Task<Position> AddPositionAsync(Position position);
    Task<Position> UpdatePositionAsync(Position position);
    Task<bool> DeletePositionAsync(int id);
}