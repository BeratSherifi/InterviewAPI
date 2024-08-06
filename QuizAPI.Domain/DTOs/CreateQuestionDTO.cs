namespace QuizAPI.Domain.DTOs;

public class CreateQuestionDTO
{
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public int PositionId { get; set; }
    public ICollection<CreateChoiceDTO> Choices { get; set; }
}