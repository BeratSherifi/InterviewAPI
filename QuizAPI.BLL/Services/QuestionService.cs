using AutoMapper;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.BLL.Services;

public class QuestionService : IQuestionService
{
    private readonly IQuestionRepository _questionRepository;
    private readonly IMapper _mapper;

    public QuestionService(IQuestionRepository questionRepository, IMapper mapper)
        {
            _questionRepository = questionRepository;
            _mapper = mapper;
        }

    public async Task<IEnumerable<QuestionDTO>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAllQuestionsAsync();
            return _mapper.Map<IEnumerable<QuestionDTO>>(questions);
        }

        public async Task<QuestionDTO> GetQuestionByIdAsync(int id)
        {
            var question = await _questionRepository.GetQuestionByIdAsync(id);
            return _mapper.Map<QuestionDTO>(question);
        }

        public async Task<IEnumerable<QuestionDTO>> GetQuestionsByPositionIdAsync(int positionId)
        {
            var questions = await _questionRepository.GetQuestionsByPositionIdAsync(positionId);
            return _mapper.Map<IEnumerable<QuestionDTO>>(questions);
        }
        
        public async Task<ChoiceDTO> GetChoiceByIdAsync(int choiceId)
        {
            var choice = await _questionRepository.GetChoiceByIdAsync(choiceId);
            return _mapper.Map<ChoiceDTO>(choice);
        }

        public async Task<QuestionDTO> AddQuestionAsync(CreateQuestionDTO createQuestionDto)
        {
            var question = _mapper.Map<Question>(createQuestionDto);
            question.CreatedAt = DateTime.UtcNow;
            question.Choices = createQuestionDto.Choices.Select(c => _mapper.Map<Choice>(c)).ToList();

            var addedQuestion = await _questionRepository.AddQuestionAsync(question);
            return _mapper.Map<QuestionDTO>(addedQuestion);
        }

        public async Task<QuestionDTO> UpdateQuestionAsync(int id, CreateQuestionDTO updateQuestionDto)
        {
            var question = await _questionRepository.GetQuestionByIdAsync(id);
            if (question == null)
            {
                return null;
            }

            _mapper.Map(updateQuestionDto, question);

            question.Choices.Clear();
            question.Choices = updateQuestionDto.Choices.Select(c => _mapper.Map<Choice>(c)).ToList();

            var updatedQuestion = await _questionRepository.UpdateQuestionAsync(question);
            return _mapper.Map<QuestionDTO>(updatedQuestion);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            return await _questionRepository.DeleteQuestionAsync(id);
        }
}