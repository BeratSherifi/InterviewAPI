using System.Security.Claims;
using InterviewAPI.DTOs;
using InterviewAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InterviewAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetAllQuizzes()
        {
            var quizzes = await _quizService.GetAllQuizzesAsync();
            return Ok(quizzes);
        }


        [HttpPost]
        public async Task<ActionResult<QuizDto>> AddQuiz(CreateQuizDto createQuizDto)
        {
            var quiz = await _quizService.AddQuizAsync(createQuizDto);
            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizId }, quiz);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<QuizDto>> UpdateQuiz(int id, CreateQuizDto updateQuizDto)
        {
            var quiz = await _quizService.UpdateQuizAsync(id, updateQuizDto);
            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            var success = await _quizService.DeleteQuizAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        /* [HttpPost("generate")]
         public async Task<ActionResult<QuizDto>> GenerateQuiz(GenerateQuizDto generateQuizDto)
         {
             var quiz = await _quizService.GenerateQuizAsync(generateQuizDto.UserId, generateQuizDto.PositionId);
             return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizId }, quiz);
         }
         */

        [HttpPost("submit")]
        public async Task<ActionResult<QuizResultDto>> SubmitQuiz([FromBody] SubmitQuizDto submitQuizDto)
        {
            if (submitQuizDto == null)
            {
                return BadRequest("Invalid payload.");
            }

            var result = await _quizService.SubmitQuizAsync(submitQuizDto);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        
        [HttpPost("review")]
        public async Task<ActionResult> ReviewPracticalAnswers([FromBody] ReviewPracticalAnswersDto reviewDto)
        {
            if (reviewDto == null || reviewDto.Answers == null || !reviewDto.Answers.Any())
            {
                return BadRequest("Invalid payload.");
            }

            var result = await _quizService.ReviewPracticalAnswersAsync(reviewDto);
            if (!result)
            {
                return BadRequest("Failed to review the practical answers.");
            }

            return Ok();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<QuizDto>> GetQuizById(int id)
        {
            var quiz = await _quizService.GetQuizByIdAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }
        
        [HttpGet("results/{userId}")]
        public async Task<ActionResult<IEnumerable<QuizResultDto>>> GetQuizResultsByUserId(string userId)
        {
            var results = await _quizService.GetQuizResultsByUserIdAsync(userId);
            return Ok(results);
        }
    }
}
