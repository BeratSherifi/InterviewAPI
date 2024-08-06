namespace QuizAPI.Domain.DTOs;

public class QuestionDTO
{
    public int QuestionId { get; set; }
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public int PositionId { get; set; }
    public ICollection<ChoiceDTO> Choices { get; set; }
}