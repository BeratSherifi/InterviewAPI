using AutoMapper;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.BLL.Services;

public class ChoiceService : IChoiceService
{
    private readonly IChoiceRepository _choiceRepository;
    private readonly IMapper _mapper;

    public ChoiceService(IChoiceRepository choiceRepository, IMapper mapper)
    {
        _choiceRepository = choiceRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ChoiceDTO>> GetChoicesByQuestionIdAsync(int questionId)
    {
        var choices = await _choiceRepository.GetChoicesByQuestionIdAsync(questionId);
        return _mapper.Map<IEnumerable<ChoiceDTO>>(choices);
    }

    public async Task<ChoiceDTO> AddChoiceAsync(CreateChoiceDTO createChoiceDto, int questionId)
    {
        var choice = _mapper.Map<Choice>(createChoiceDto);
        choice.QuestionId = questionId;
        var addedChoice = await _choiceRepository.AddChoiceAsync(choice);
        return _mapper.Map<ChoiceDTO>(addedChoice);
    }
    

    public async Task<bool> DeleteChoiceAsync(int id)
    {
        return await _choiceRepository.DeleteChoiceAsync(id);
    }
}