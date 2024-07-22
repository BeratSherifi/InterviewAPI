using AutoMapper;
using InterviewAPI.DTOs;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using InterviewAPI.Services.Interfaces;

namespace InterviewAPI.Services.Implementations;

public class ChoiceService : IChoiceService
{
    private readonly IChoiceRepository _choiceRepository;
    private readonly IMapper _mapper;

    public ChoiceService(IChoiceRepository choiceRepository, IMapper mapper)
    {
        _choiceRepository = choiceRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ChoiceDto>> GetChoicesByQuestionIdAsync(int questionId)
    {
        var choices = await _choiceRepository.GetChoicesByQuestionIdAsync(questionId);
        return _mapper.Map<IEnumerable<ChoiceDto>>(choices);
    }

    public async Task<ChoiceDto> AddChoiceAsync(CreateChoiceDto createChoiceDto, int questionId)
    {
        var choice = _mapper.Map<Choice>(createChoiceDto);
        choice.QuestionId = questionId;
        var addedChoice = await _choiceRepository.AddChoiceAsync(choice);
        return _mapper.Map<ChoiceDto>(addedChoice);
    }
    

    public async Task<bool> DeleteChoiceAsync(int id)
    {
        return await _choiceRepository.DeleteChoiceAsync(id);
    }
}