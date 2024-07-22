namespace InterviewAPI.DTOs;

public class UpdateQuestionDto
{
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public ICollection<UpdateChoiceDto> Choices { get; set; }
}