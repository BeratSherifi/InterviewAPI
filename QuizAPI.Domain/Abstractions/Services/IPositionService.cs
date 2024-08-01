using QuizAPI.Domain.DTOs;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IPositionService
{
    Task<IEnumerable<PositionDTO>> GetAllPositionsAsync();
    Task<PositionDTO> GetPositionByIdAsync(int id);
    Task<PositionDTO> AddPositionAsync(CreatePositionDTO createPositionDto);
    Task<PositionDTO> UpdatePositionAsync(int id, CreatePositionDTO updatePositionDto);
    Task<bool> DeletePositionAsync(int id);
}