namespace QuizAPI.Domain.Models;

public class Assignment
{
    public int AssignmentId { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }

    public string Title { get; set; }
    public string AssignmentDescription { get; set; }
    public int PositionId { get; set; }
    public Position Position { get; set; }
    public int Score { get; set; }
    public bool Passed { get; set; }
    public bool Controlled { get; set; }
    public string Comment { get; set; }

    public UserAnswer UserAnswer { get; set; }

}