using AutoMapper;
using InterviewAPI.DTOs;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using InterviewAPI.Services.Interfaces;

namespace InterviewAPI.Services.Implementations;

public class PositionService : IPositionService
{
    private readonly IPositionRepository _positionRepository;
    private readonly IMapper _mapper;

    public PositionService(IPositionRepository positionRepository, IMapper mapper)
    {
        _positionRepository = positionRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PositionDto>> GetAllPositionsAsync()
    {
        var positions = await _positionRepository.GetAllPositionsAsync();
        return _mapper.Map<IEnumerable<PositionDto>>(positions);
    }

    public async Task<PositionDto> GetPositionByIdAsync(int id)
    {
        var position = await _positionRepository.GetPositionByIdAsync(id);
        return _mapper.Map<PositionDto>(position);
    }

    public async Task<PositionDto> AddPositionAsync(CreatePositionDto createPositionDto)
    {
        var position = _mapper.Map<Position>(createPositionDto);
        position.CreatedAt = DateTime.UtcNow;
        var addedPosition = await _positionRepository.AddPositionAsync(position);
        return _mapper.Map<PositionDto>(addedPosition);
    }

    public async Task<PositionDto> UpdatePositionAsync(int id, CreatePositionDto updatePositionDto)
    {
        var position = await _positionRepository.GetPositionByIdAsync(id);
        if (position == null)
        {
            return null;
        }

        _mapper.Map(updatePositionDto, position);
        var updatedPosition = await _positionRepository.UpdatePositionAsync(position);
        return _mapper.Map<PositionDto>(updatedPosition);
    }

    public async Task<bool> DeletePositionAsync(int id)
    {
        return await _positionRepository.DeletePositionAsync(id);
    }
}