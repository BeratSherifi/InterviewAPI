namespace InterviewAPI.DTOs;

public class PositionDto
{
    public int PositionId { get; set; }
    public string PositionName { get; set; }
    public ICollection<SimpleQuizDto> Quizzes { get; set; } 
    public ICollection<SimpleQuestionDto> Questions { get; set; }
   
}