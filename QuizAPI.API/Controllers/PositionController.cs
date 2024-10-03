using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;

namespace QuizAPI.API.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class PositionController : ControllerBase
    {
        private readonly IPositionService _positionService;

        public PositionController(IPositionService positionService)
        {
            _positionService = positionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PositionDTO>>> GetAllPositions()
        {
            var positions = await _positionService.GetAllPositionsAsync();
            return Ok(positions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PositionDTO>> GetPositionById(int id)
        {
            var position = await _positionService.GetPositionByIdAsync(id);
            if (position == null)
            {
                return NotFound();
            }

            return Ok(position);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<PositionDTO>> AddPosition(CreatePositionDTO createPositionDto)
        {
            var position = await _positionService.AddPositionAsync(createPositionDto);
            return CreatedAtAction(nameof(GetPositionById), new { id = position.PositionId }, position);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<PositionDTO>> UpdatePosition(int id, CreatePositionDTO updatePositionDto)
        {
            var position = await _positionService.UpdatePositionAsync(id, updatePositionDto);
            if (position == null)
            {
                return NotFound();
            }

            return Ok(position);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> DeletePosition(int id)
        {
            var success = await _positionService.DeletePositionAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }