using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;

namespace QuizAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetAllQuestions()
        {
            var questions = await _questionService.GetAllQuestionsAsync();
            return Ok(questions);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<QuestionDTO>> GetQuestionById(int id)
        {
            var question = await _questionService.GetQuestionByIdAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        [HttpGet("position/{positionId}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetQuestionsByPosition(int positionId)
        {
            var questions = await _questionService.GetQuestionsByPositionIdAsync(positionId);
            return Ok(questions);
        }

        [HttpPost]
       [Authorize(Policy = "Admin")]
        public async Task<ActionResult<QuestionDTO>> AddQuestion(CreateQuestionDTO createQuestionDto)
        {
            var question = await _questionService.AddQuestionAsync(createQuestionDto);
            return CreatedAtAction(nameof(GetQuestionById), new { id = question.QuestionId }, question);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<QuestionDTO>> UpdateQuestion(int id, CreateQuestionDTO updateQuestionDto)
        {
            var question = await _questionService.UpdateQuestionAsync(id, updateQuestionDto);
            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> DeleteQuestion(int id)
        {
            var success = await _questionService.DeleteQuestionAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }