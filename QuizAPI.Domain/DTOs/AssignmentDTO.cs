namespace QuizAPI.Domain.DTOs;

public class AssignmentDTO
{
    public int AssignmentId { get; set; }
    public string UserId { get; set; }
    public string Title { get; set; }
    public string AssignmentDescription { get; set; }
    public int PoisitionId { get; set; }
    public int Score { get; set; }
    public bool Passed { get; set; }
    public bool Controlled { get; set; }
    public string Comment { get; set; }
    
    public AssignmentUserAnswerDTO UserAnswer { get; set; }
}