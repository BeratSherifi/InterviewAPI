namespace InterviewAPI.DTOs;

public class UserDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<QuizDto> Quizzes { get; set; }
}