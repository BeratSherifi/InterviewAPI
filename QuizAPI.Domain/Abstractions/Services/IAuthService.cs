using Microsoft.AspNetCore.Identity;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.Domain.Abstractions.Services;

public interface IAuthService
{
    Task<AuthResponseDTO> RegisterAsync(RegistrationRequestDTO request);
    Task<AuthResponseDTO> AuthenticateAsync(AuthRequestDTO request);
    Task CreateRoleAsync(string roleName);
    Task AssignRoleToUserAsync(string username, string roleName);
    Task<List<IdentityRole>> GetRolesAsync();
    Task<List<User>> GetUsersInRoleAsync(string roleName);

    Task<List<User>> GetAllUsersAsync();

    Task DeleteUserAsync(string userId);
}