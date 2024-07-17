namespace InterviewAPI.Models;

public class Position
{
    public int PositionId { get; set; }
    public string PositionName { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Question> Questions { get; set; }
}