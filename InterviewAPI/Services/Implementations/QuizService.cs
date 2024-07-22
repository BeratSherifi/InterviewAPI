using AutoMapper;
using InterviewAPI.DTOs;
using InterviewAPI.Models;
using InterviewAPI.Repositories.Interfaces;
using InterviewAPI.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterviewAPI.Services.Implementations
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public QuizService(IQuizRepository quizRepository, IQuestionRepository questionRepository, UserManager<User> userManager, IMapper mapper)
        {
            _quizRepository = quizRepository;
            _questionRepository = questionRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<QuizDto>> GetAllQuizzesAsync()
        {
            var quizzes = await _quizRepository.GetAllQuizzesAsync();
            return _mapper.Map<IEnumerable<QuizDto>>(quizzes);
        }

        public async Task<QuizDto> AddQuizAsync(CreateQuizDto createQuizDto)
        {
            var questions = await _questionRepository.GetQuestionsByPositionIdAsync(createQuizDto.PositionId);

            var theoreticalQuestions = questions
                .Where(q => q.QuestionType == "Theoretical")
                .GroupBy(q => q.DifficultyLevel)
                .SelectMany(g => g.OrderBy(q => Guid.NewGuid()).Take(2)) // 2 questions per level
                .ToList();

            var practicalQuestions = questions
                .Where(q => q.QuestionType == "Practical")
                .GroupBy(q => q.DifficultyLevel)
                .Select(g => g.OrderBy(q => Guid.NewGuid()).FirstOrDefault()) // 1 question per level
                .ToList();

            var selectedQuestions = theoreticalQuestions.Concat(practicalQuestions).ToList();

            var quiz = new Quiz
            {
                UserId = createQuizDto.UserId,
                PositionId = createQuizDto.PositionId,
                StartedAt = DateTime.UtcNow,
                UserAnswers = new List<UserAnswer>()
            };

            foreach (var question in selectedQuestions)
            {
                quiz.UserAnswers.Add(new UserAnswer
                {
                    QuestionId = question.QuestionId
                });
            }

            var addedQuiz = await _quizRepository.AddQuizAsync(quiz);

            var quizDto = _mapper.Map<QuizDto>(addedQuiz);
            quizDto.Questions = _mapper.Map<ICollection<QuestionsForQuizDto>>(selectedQuestions);

            return quizDto;
        }

        public async Task<QuizDto> UpdateQuizAsync(int id, CreateQuizDto updateQuizDto)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            if (quiz == null)
            {
                return null;
            }

            _mapper.Map(updateQuizDto, quiz);
            var updatedQuiz = await _quizRepository.UpdateQuizAsync(quiz);
            return _mapper.Map<QuizDto>(updatedQuiz);
        }

        public async Task<bool> DeleteQuizAsync(int id)
        {
            return await _quizRepository.DeleteQuizAsync(id);
        }

        public async Task<QuizResultDto> SubmitQuizAsync(SubmitQuizDto submitQuizDto)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(submitQuizDto.QuizId);
            if (quiz == null)
            {
                return null;
            }

            UpdateUserAnswers(quiz, submitQuizDto.Answers);
            var totalScore = CalculateTotalScore(quiz.UserAnswers);

            quiz.TotalScore = totalScore;
            quiz.FinishedAt = DateTime.UtcNow;
            await _quizRepository.UpdateQuizAsync(quiz);

            var result = new QuizResultDto
            {
                QuizId = quiz.QuizId,
                UserId = quiz.UserId,
                PositionId = quiz.PositionId,
                StartedAt = quiz.StartedAt,
                FinishedAt = quiz.FinishedAt,
                TotalScore = totalScore,
                Passed = totalScore >= 65,
                Controlled = quiz.Controlled,
                UserAnswers = _mapper.Map<ICollection<UserAnswerDto>>(quiz.UserAnswers),
                Message = quiz.Controlled ? "Your quiz has been reviewed." : "Please wait for our developers to review your quiz."
            };

            return result;
        }

        public async Task<bool> ReviewPracticalAnswersAsync(ReviewPracticalAnswersDto reviewDto)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(reviewDto.QuizId);
            if (quiz == null)
            {
                return false;
            }

            foreach (var answerDto in reviewDto.Answers)
            {
                var userAnswer = quiz.UserAnswers.FirstOrDefault(ua => ua.UserAnswerId == answerDto.UserAnswerId);
                if (userAnswer == null || userAnswer.Question.QuestionType != "Practical")
                {
                    return false;
                }

                userAnswer.PracticalScore = answerDto.Score;
            }

            quiz.Controlled = true;

            var theoreticalScore = quiz.UserAnswers
                .Where(ua => ua.Question.QuestionType == "Theoretical" && ua.IsCorrect == true)
                .Count() * 5;

            var practicalScore = quiz.UserAnswers
                .Where(ua => ua.Question.QuestionType == "Practical")
                .Sum(ua => ua.PracticalScore ?? 0);

            quiz.TotalScore = theoreticalScore + practicalScore;

            await _quizRepository.UpdateQuizAsync(quiz);
            return true;
        }


        public async Task<QuizDto> GetQuizByIdAsync(int id)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            return _mapper.Map<QuizDto>(quiz);
        }

        public async Task<IEnumerable<QuizResultDto>> GetQuizResultsByUserIdAsync(string userId)
        {
            var quizzes = await _quizRepository.GetQuizzesByUserIdAsync(userId);
            return quizzes.Select(quiz => new QuizResultDto
            {
                QuizId = quiz.QuizId,
                UserId = quiz.UserId,
                PositionId = quiz.PositionId,
                StartedAt = quiz.StartedAt,
                FinishedAt = quiz.FinishedAt,
                TotalScore = quiz.TotalScore,
                Passed = quiz.TotalScore >= 65,
                Controlled = quiz.Controlled,
                UserAnswers = _mapper.Map<ICollection<UserAnswerDto>>(quiz.UserAnswers),
                Message = quiz.Controlled ? "Your quiz has been reviewed." : "Please wait for our developers to review your quiz."
            }).ToList();
        }

        private List<Question> GetRandomQuestionsByDifficulty(IEnumerable<Question> questions, int countPerLevel)
        {
            var theoreticalQuestions = questions
                .Where(q => q.QuestionType == "Theoretical")
                .GroupBy(q => q.DifficultyLevel)
                .SelectMany(g => g.OrderBy(q => Guid.NewGuid()).Take(countPerLevel)) // 2 questions per level
                .ToList();

            var practicalQuestions = questions
                .Where(q => q.QuestionType == "Practical")
                .GroupBy(q => q.DifficultyLevel)
                .Select(g => g.OrderBy(q => Guid.NewGuid()).FirstOrDefault()) // 1 question per level
                .ToList();

            return theoreticalQuestions.Concat(practicalQuestions).ToList();
        }

        private void UpdateUserAnswers(Quiz quiz, ICollection<SubmitAnswerDto> submitAnswerDtos)
        {
            foreach (var answerDto in submitAnswerDtos)
            {
                var userAnswer = quiz.UserAnswers.FirstOrDefault(ua => ua.QuestionId == answerDto.QuestionId);
                if (userAnswer != null)
                {
                    userAnswer.ChoiceId = answerDto.ChoiceId;
                    userAnswer.AnswerText = answerDto.AnswerText; // For practical questions
                    userAnswer.IsCorrect = answerDto.ChoiceId.HasValue && _questionRepository.GetChoiceByIdAsync(answerDto.ChoiceId.Value).Result?.IsCorrect == true;
                }
            }
        }

        private int CalculateTotalScore(IEnumerable<UserAnswer> userAnswers)
        {
            var theoreticalScore = userAnswers.Where(ua => ua.Question.QuestionType == "Theoretical" && ua.IsCorrect == true).Count() * 5;
            var practicalScore = userAnswers.Where(ua => ua.Question.QuestionType == "Practical").Sum(ua => ua.PracticalScore ?? 0);
            return theoreticalScore + practicalScore;
        }
    }
}
