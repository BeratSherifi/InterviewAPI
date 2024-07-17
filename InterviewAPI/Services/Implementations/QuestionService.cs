using InterviewAPI.DTOs;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using InterviewAPI.Services.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterviewAPI.Services.Implementations
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IMapper _mapper;

        public QuestionService(IQuestionRepository questionRepository, IMapper mapper)
        {
            _questionRepository = questionRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAllQuestionsAsync();
            return _mapper.Map<IEnumerable<QuestionDto>>(questions);
        }

        public async Task<QuestionDto> GetQuestionByIdAsync(int id)
        {
            var question = await _questionRepository.GetQuestionByIdAsync(id);
            return _mapper.Map<QuestionDto>(question);
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByPositionAsync(int positionId)
        {
            var questions = await _questionRepository.GetQuestionsByPositionAsync(positionId);
            return _mapper.Map<IEnumerable<QuestionDto>>(questions);
        }

        public async Task<QuestionDto> AddQuestionAsync(CreateQuestionDto createQuestionDto)
        {
            var question = _mapper.Map<Question>(createQuestionDto);
            question.CreatedAt = DateTime.UtcNow;
            question.Choices = createQuestionDto.Choices.Select(c => _mapper.Map<Choice>(c)).ToList();

            var addedQuestion = await _questionRepository.AddQuestionAsync(question);
            return _mapper.Map<QuestionDto>(addedQuestion);
        }

        public async Task<QuestionDto> UpdateQuestionAsync(int id, CreateQuestionDto updateQuestionDto)
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
            return _mapper.Map<QuestionDto>(updatedQuestion);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            return await _questionRepository.DeleteQuestionAsync(id);
        }
    }
}
