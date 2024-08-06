using AutoMapper;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.BLL.Services;

public class PositionService : IPositionService
{
    private readonly IPositionRepository _positionRepository;
    private readonly IMapper _mapper;

    public PositionService(IPositionRepository positionRepository, IMapper mapper)
    {
        _positionRepository = positionRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PositionDTO>> GetAllPositionsAsync()
    {
        var positions = await _positionRepository.GetAllPositionsAsync();
        return _mapper.Map<IEnumerable<PositionDTO>>(positions);
    }

    public async Task<PositionDTO> GetPositionByIdAsync(int id)
    {
        var position = await _positionRepository.GetPositionByIdAsync(id);
        return _mapper.Map<PositionDTO>(position);
    }

    public async Task<PositionDTO> AddPositionAsync(CreatePositionDTO createPositionDto)
    {
        var position = _mapper.Map<Position>(createPositionDto);
        position.CreatedAt = DateTime.UtcNow;
        var addedPosition = await _positionRepository.AddPositionAsync(position);
        return _mapper.Map<PositionDTO>(addedPosition);
    }

    public async Task<PositionDTO> UpdatePositionAsync(int id, CreatePositionDTO updatePositionDto)
    {
        var position = await _positionRepository.GetPositionByIdAsync(id);
        if (position == null)
        {
            return null;
        }

        _mapper.Map(updatePositionDto, position);
        var updatedPosition = await _positionRepository.UpdatePositionAsync(position);
        return _mapper.Map<PositionDTO>(updatedPosition);
    }

    public async Task<bool> DeletePositionAsync(int id)
    {
        return await _positionRepository.DeletePositionAsync(id);
    }
}