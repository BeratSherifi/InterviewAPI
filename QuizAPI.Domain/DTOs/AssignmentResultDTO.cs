using QuizAPI.Domain.Models;

namespace QuizAPI.Domain.DTOs;

public class AssignmentResultDTO
{
    public int AssignemtnId { get; set; }
    public string UserId { get; set; }
    public int PositionId { get; set; }
    public int Score { get; set; }
    public bool Passed { get; set; }
    public bool Controlled { get; set; }
    public string AnswerText { get; set; }
    public string Comment { get; set; }
}