namespace QuizAPI.Domain.DTOs;

public class PositionDTO
{
    public int PositionId { get; set; }
    public string PositionName { get; set; }
 
   public ICollection<SimpleQuizDTO> Quizzes { get; set; } 

}