namespace QuizAPI.Domain.DTOs;

public class CreateAssignmentDTO
{
    public int PositionId { get; set; }
    public string UserId { get; set; }
    public string Title { get; set; }
    public string AssignmentDescription { get; set; }
    
}