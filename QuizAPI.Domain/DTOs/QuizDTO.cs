namespace QuizAPI.Domain.DTOs;

public class QuizDTO
{
    public int QuizId { get; set; }
    public string UserId { get; set; }
    public int PositionId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int TotalScore { get; set; }
    
    public ICollection<QuestionsForQuizDTO> Questions { get; set; }
    public ICollection<UserAnswerDTO> UserAnswers { get; set; }
}