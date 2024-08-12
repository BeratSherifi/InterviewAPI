namespace QuizAPI.Domain.DTOs;

public class AssignmentGetAllDTO
{
    public int AssignmentId { get; set; }
    public string Title { get; set; }
    public string AssigmmentDescription { get; set; }
    public string UserId { get; set; }
    public int PositionId { get; set; }
    public int Score { get; set; }
    public bool Passed { get; set; }
    public bool Controlled { get; set; }
}