namespace InterviewAPI.Models;

public class Question
{
    public int QuestionId { get; set; }
    public string Text { get; set; }
    public int DifficultyLevel { get; set; } // 1 to 5
    public string QuestionType { get; set; } // "Theoretical" or "Practical"
    public int PositionId { get; set; }
    public Position Position { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Choice> Choices { get; set; }
}