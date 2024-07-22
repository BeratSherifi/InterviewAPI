namespace InterviewAPI.DTOs;

public class QuestionWithChoicesDto
{
    public int QuestionId { get; set; }
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public ICollection<ChoiceDto> Choices { get; set; }
}