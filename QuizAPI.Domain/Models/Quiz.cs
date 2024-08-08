namespace QuizAPI.Domain.Models;

public class Quiz
{
    public int QuizId { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public int PositionId { get; set; }
    public Position Position { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int TotalScore { get; set; }
    
    public bool Passed { get; set; }
    public bool Controlled { get; set; } = false;
    
    public string Comment { get; set; }
    public ICollection<UserAnswer> UserAnswers { get; set; } 
}