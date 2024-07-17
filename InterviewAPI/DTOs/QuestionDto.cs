namespace InterviewAPI.DTOs;

public class QuestionDto
{
    public int QuestionId { get; set; }
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public int PositionId { get; set; }
    public ICollection<ChoiceDto> Choices { get; set; }
}