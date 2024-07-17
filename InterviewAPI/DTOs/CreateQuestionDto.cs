namespace InterviewAPI.DTOs;

public class CreateQuestionDto
{
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public int PositionId { get; set; }
    public ICollection<CreateChoiceDto> Choices { get; set; }
}