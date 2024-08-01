using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Domain.Abstractions.Repositories;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.BLL.Services;

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

        public async Task<IEnumerable<QuizGetAllDTO>> GetAllQuizzesAsync()
        {
            // Retrieve IQueryable from the repository
            var quizQuery = _quizRepository.GetAllQuizzes();

            // Execute the query and map the results
            var quizzes = await quizQuery.ToListAsync(); // Ensure the query executes by calling ToListAsync
            return _mapper.Map<IEnumerable<QuizGetAllDTO>>(quizzes);
        }

        public async Task<QuizDTO> AddQuizAsync(CreateQuizDTO createQuizDto)
        {
            var questions = await _questionRepository.GetQuestionsByPositionIdAsync(createQuizDto.PositionId);

            var selectedQuestions = GetRandomQuestionsByDifficulty(questions, 2);

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

            var quizDto = _mapper.Map<QuizDTO>(addedQuiz);
            quizDto.Questions = _mapper.Map<ICollection<QuestionsForQuizDTO>>(selectedQuestions);

            return quizDto;
        }

        public async Task<QuizDTO> UpdateQuizAsync(int id, CreateQuizDTO updateQuizDto)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            if (quiz == null)
            {
                return null;
            }

            _mapper.Map(updateQuizDto, quiz);
            var updatedQuiz = await _quizRepository.UpdateQuizAsync(quiz);
            return _mapper.Map<QuizDTO>(updatedQuiz);
        }

        public async Task<bool> DeleteQuizAsync(int id)
        {
            return await _quizRepository.DeleteQuizAsync(id);
        }

        public async Task<QuizResultDTO> SubmitQuizAsync(SubmitQuizDTO submitQuizDto)
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

            var result = _mapper.Map<QuizResultDTO>(quiz);
            result.Message = quiz.Controlled ? "Your quiz has been reviewed." : "Please wait for our developers to review your quiz.";
            result.Passed = totalScore >= 65;


            foreach (var userAnswer in result.UserAnswers)
            {
                if (userAnswer.PracticalScore.HasValue)
                {
                    userAnswer.PracticalAnswerStatus = GetPracticalAnswerStatus(userAnswer.PracticalScore.Value);
                }
            }

            return result;
        }

        private string GetPracticalAnswerStatus(int score)
        {
            if (score == 0)
                return "Wrong answer";
            if (score >= 1 && score <= 3)
                return "Weak answer";
            if (score >= 4 && score <= 7)
                return "Partially correct answer";
            if (score >= 8 && score <= 9)
                return "Mostly correct answer";
            if (score == 10)
                return "Correct answer";
            return string.Empty;
        }

        public async Task<bool> ReviewPracticalAnswersAsync(ReviewPracticalAnswersDTO reviewDto)
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
                userAnswer.PracticalAnswerStatus = GetPracticalAnswerStatus(answerDto.Score); // Update status here
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

        public async Task<QuizResultDTO> GetQuizByIdAsync(int id)
        {
            var quiz = await _quizRepository.GetQuizByIdAsync(id);
            return _mapper.Map<QuizResultDTO>(quiz);
        }

        public async Task<IEnumerable<QuizResultDTO>> GetQuizResultsByUserIdAsync(string userId)
        {
            var quizQuery =  _quizRepository.GetQuizzesByUserIdAsync(userId);

            var quizzes = await quizQuery.ToListAsync();
            return _mapper.Map<IEnumerable<QuizResultDTO>>(quizzes);
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

        private void UpdateUserAnswers(Quiz quiz, ICollection<SubmitAnswerDTO> submitAnswerDtos)
        {
            var unansweredQuestions = quiz.UserAnswers.Where(ua => !submitAnswerDtos.Any(sa => sa.QuestionId == ua.QuestionId)).ToList();

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

            // Handle unanswered questions
            foreach (var unanswered in unansweredQuestions)
            {
                if (unanswered.Question.QuestionType == "Theoretical")
                {
                    unanswered.IsCorrect = false;
                }
                else if (unanswered.Question.QuestionType == "Practical")
                {
                    unanswered.PracticalScore = 0;
                    unanswered.PracticalAnswerStatus = GetPracticalAnswerStatus(0); // Set practical answer status
                }
            }
        }

        private int CalculateTotalScore(IEnumerable<UserAnswer> userAnswers)
        {
            var theoreticalScore = userAnswers
                .Where(ua => ua.Question.QuestionType == "Theoretical" && (ua.IsCorrect ?? false)) // Handle nullable bool
                .Count() * 5;

            var practicalScore = userAnswers
                .Where(ua => ua.Question.QuestionType == "Practical")
                .Sum(ua => ua.PracticalScore ?? 0);

            return theoreticalScore + practicalScore;
        }
    }