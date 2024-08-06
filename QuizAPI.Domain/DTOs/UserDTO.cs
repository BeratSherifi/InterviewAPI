namespace QuizAPI.Domain.DTOs;

public class UserDTO
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<QuizDTO> Quizzes { get; set; }
}