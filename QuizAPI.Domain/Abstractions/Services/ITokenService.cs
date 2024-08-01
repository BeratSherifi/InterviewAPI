using QuizAPI.Domain.Models;

namespace QuizAPI.Domain.Abstractions.Services;

public interface ITokenService
{
    Task<string> CreateToken(User user);
}