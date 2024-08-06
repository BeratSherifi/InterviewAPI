namespace QuizAPI.Domain.DTOs;

public class QuizScoreDTO
{
    public int QuizId { get; set; }
    public string UserId { get; set; }
    public int TotalScore { get; set; }
    public DateTime TakenOn { get; set; }
}