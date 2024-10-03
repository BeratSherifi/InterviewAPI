using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;

namespace QuizAPI.API.Controllers;

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
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<QuizDTO>>> GetAllQuizzes()
        {
            var quizzes = await _quizService.GetAllQuizzesAsync();
            return Ok(quizzes);
        }


        [HttpPost]
        [Authorize(Policy = "User")]
        public async Task<ActionResult<QuizDTO>> AddQuiz(CreateQuizDTO createQuizDto)
        {
            var quiz = await _quizService.AddQuizAsync(createQuizDto);
            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizId }, quiz);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<QuizDTO>> UpdateQuiz(int id, CreateQuizDTO updateQuizDto)
        {
            var quiz = await _quizService.UpdateQuizAsync(id, updateQuizDto);
            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        [HttpDelete("{id}")]
       [Authorize(Policy = "AdminOrUser")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            var success = await _quizService.DeleteQuizAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }



        [HttpPost("submit")]
        [Authorize(Policy = "User")]
        public async Task<ActionResult<QuizResultDTO>> SubmitQuiz([FromBody] SubmitQuizDTO submitQuizDto)
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
       [Authorize(Policy = "Admin")]
        public async Task<ActionResult> ReviewPracticalAnswers([FromBody] ReviewPracticalAnswersDTO reviewDto)
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
        [Authorize(Policy = "AdminOrUser")]
        public async Task<ActionResult<QuizDTO>> GetQuizById(int id)
        {
            var quiz = await _quizService.GetQuizByIdAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }
        
        [HttpGet("results/{userId}")]
        [Authorize(Policy = "AdminOrUser")]
        public async Task<ActionResult<IEnumerable<QuizResultDTO>>> GetQuizResultsByUserId(string userId)
        {
            var results = await _quizService.GetQuizResultsByUserIdAsync(userId);
            return Ok(results);
        }
    }