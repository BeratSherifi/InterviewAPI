using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuizAPI.DAL.Data;
using QuizAPI.Domain.Abstractions.Services;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.BLL.Services;

 public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly AppDbContext _context;

        public AuthService(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ITokenService tokenService, AppDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _context = context;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegistrationRequestDTO request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);

            if (userExists != null)
            {
                throw new ApplicationException("User already exists");
            }

            var user = new User
            {
                Email = request.Email,
                UserName = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                throw new ApplicationException(string.Join(", ", result.Errors));
            }

            var token = await _tokenService.CreateToken(user);

            return new AuthResponseDTO
            {
                UserId = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Token = token
            };
        }

        public async Task<AuthResponseDTO> AuthenticateAsync(AuthRequestDTO request)
        {
            var managedUser = await _userManager.FindByEmailAsync(request.Email);
            if (managedUser == null || !await _userManager.CheckPasswordAsync(managedUser, request.Password))
            {
                throw new ApplicationException("Bad credentials");
            }

            var accessToken = await _tokenService.CreateToken(managedUser);
            return new AuthResponseDTO
            {
                UserId = managedUser.Id,
                Username = managedUser.UserName,
                Email = managedUser.Email,
                Token = accessToken
            };
        }

        public async Task CreateRoleAsync(string roleName)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        public async Task AssignRoleToUserAsync(string username, string roleName)
        {
            var user = await _userManager.FindByNameAsync(username)
                ?? throw new ApplicationException($"User with username '{username}' not found.");
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                throw new ApplicationException($"Role '{roleName}' does not exist.");
            }

            if (!await _userManager.IsInRoleAsync(user, roleName))
            {
                await _userManager.AddToRoleAsync(user, roleName);
            }
        }

        public async Task<List<IdentityRole>> GetRolesAsync()
        {
            return await _roleManager.Roles.ToListAsync();
        }

        public async Task<List<User>> GetUsersInRoleAsync(string roleName)
        {
            return (await _userManager.GetUsersInRoleAsync(roleName)).ToList();
        }


    public async Task<List<UserDTO>> GetAllUsersAsync() // Return UserDto with roles
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = new List<UserDTO>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                Roles = roles.ToList() // Assign roles to the DTO
            });
        }

        return userDtos;
    }

    public async Task DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            throw new ApplicationException($"User with ID '{userId}' not found.");
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            throw new ApplicationException("Failed to delete the user. Errors: " + string.Join(", ", result.Errors));
        }
    }


}