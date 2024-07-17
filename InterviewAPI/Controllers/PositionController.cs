using InterviewAPI.DTOs;
using InterviewAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InterviewAPI.Controllers
{
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
        public async Task<ActionResult<IEnumerable<PositionDto>>> GetAllPositions()
        {
            var positions = await _positionService.GetAllPositionsAsync();
            return Ok(positions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PositionDto>> GetPositionById(int id)
        {
            var position = await _positionService.GetPositionByIdAsync(id);
            if (position == null)
            {
                return NotFound();
            }

            return Ok(position);
        }

        [HttpPost]
        public async Task<ActionResult<PositionDto>> AddPosition(CreatePositionDto createPositionDto)
        {
            var position = await _positionService.AddPositionAsync(createPositionDto);
            return CreatedAtAction(nameof(GetPositionById), new { id = position.PositionId }, position);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PositionDto>> UpdatePosition(int id, CreatePositionDto updatePositionDto)
        {
            var position = await _positionService.UpdatePositionAsync(id, updatePositionDto);
            if (position == null)
            {
                return NotFound();
            }

            return Ok(position);
        }

        [HttpDelete("{id}")]
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
}