namespace QuizAPI.Domain.DTOs;

public class QuizResultDTO
{
    public int QuizId { get; set; }
    public string UserId { get; set; }
    public int PositionId { get; set; }
    //public DateTime StartedAt { get; set; }
    //public DateTime? FinishedAt { get; set; }
    public int TotalScore { get; set; }
    public bool Passed { get; set; }
    public bool Controlled { get; set; }
    public ICollection<UserAnswerDTO> UserAnswers { get; set; }
    public string Message { get; set; }
}