using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QuizAPI.BLL.Services;
using QuizAPI.DAL.Data;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<QuizController> _logger;

        public AuthController(IAuthService authService, ILogger<QuizController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegistrationRequestDTO request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Authenticate(AuthRequestDTO request)
        {
            try
            {
                var response = await _authService.AuthenticateAsync(request);
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create-role")]
        public async Task<ActionResult> CreateRole(string roleName)
        {
            try
            {
                await _authService.CreateRoleAsync(roleName);
                return Ok($"Role {roleName} created successfully");
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("assign-role")]
        public async Task<ActionResult> AssignRoleToUser(string username, string roleName)
        {
            try
            {
                await _authService.AssignRoleToUserAsync(username, roleName);
                return Ok($"Role {roleName} assigned to user {username} successfully.");
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("roles")]
        public async Task<ActionResult> GetRoles()
        {
            var response = await _authService.GetRolesAsync();
            return Ok(response);
        }

        [HttpGet("users-in-role/{roleName}")]
        public async Task<ActionResult> GetUsersInRole(string roleName)
        {
            var response = await _authService.GetUsersInRoleAsync(roleName);
            return Ok(response);
        }

        [Authorize(Roles = "Admin")] // Ensure only admins can access this endpoint
        [HttpGet("users")] // Set the route for getting all users
        public async Task<ActionResult<List<UserDTO>>> GetAllUsers() // Change return type to UserDto
        {
            try
            {
                var users = await _authService.GetAllUsersAsync(); // Ensure this calls the correct method
                return Ok(users);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")] // Ensure only admins can access this endpoint
        [HttpDelete("users/{userId}")] // Set the route for deleting a user
        public async Task<ActionResult> DeleteUser(string userId)
        {
            try
            {
                await _authService.DeleteUserAsync(userId);
                return Ok($"User with ID '{userId}' deleted successfully.");
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
