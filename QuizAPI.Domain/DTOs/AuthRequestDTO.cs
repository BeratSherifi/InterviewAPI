namespace QuizAPI.Domain.DTOs;

public class AuthRequestDTO
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}