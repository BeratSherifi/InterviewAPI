using InterviewAPI.DTOs;

namespace InterviewAPI.Services.Interfaces;

public interface IPositionService
{
    Task<IEnumerable<PositionDto>> GetAllPositionsAsync();
    Task<PositionDto> GetPositionByIdAsync(int id);
    Task<PositionDto> AddPositionAsync(CreatePositionDto createPositionDto);
    Task<PositionDto> UpdatePositionAsync(int id, CreatePositionDto updatePositionDto);
    Task<bool> DeletePositionAsync(int id);
}