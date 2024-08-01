namespace QuizAPI.Domain.DTOs;

public class QuizGetAllDTO
{
    public int QuizId { get; set; }
    public string UserId { get; set; }
    public int PositionId { get; set; }
    public int TotalScore { get; set; }
    public bool Passed { get; set; }
    public bool Controlled { get; set; }
}