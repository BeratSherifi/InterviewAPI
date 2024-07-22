using InterviewAPI.DTOs;
using InterviewAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InterviewAPI.Controllers
{
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
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAllQuestions()
        {
            var questions = await _questionService.GetAllQuestionsAsync();
            return Ok(questions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuestionDto>> GetQuestionById(int id)
        {
            var question = await _questionService.GetQuestionByIdAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        [HttpGet("position/{positionId}")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestionsByPosition(int positionId)
        {
            var questions = await _questionService.GetQuestionsByPositionIdAsync(positionId);
            return Ok(questions);
        }

        [HttpPost]
        public async Task<ActionResult<QuestionDto>> AddQuestion(CreateQuestionDto createQuestionDto)
        {
            var question = await _questionService.AddQuestionAsync(createQuestionDto);
            return CreatedAtAction(nameof(GetQuestionById), new { id = question.QuestionId }, question);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<QuestionDto>> UpdateQuestion(int id, CreateQuestionDto updateQuestionDto)
        {
            var question = await _questionService.UpdateQuestionAsync(id, updateQuestionDto);
            if (question == null)
            {
                return NotFound();
            }

            return Ok(question);
        }

        [HttpDelete("{id}")]
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
}
