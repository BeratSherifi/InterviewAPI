namespace InterviewAPI.DTOs;

public class QuizDto
{
    public int QuizId { get; set; }
    public string UserId { get; set; }
    public int PositionId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public int TotalScore { get; set; }
    
    public ICollection<QuestionsForQuizDto> Questions { get; set; }
    public ICollection<UserAnswerDto> UserAnswers { get; set; }
    
}