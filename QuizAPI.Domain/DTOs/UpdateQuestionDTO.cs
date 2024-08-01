namespace QuizAPI.Domain.DTOs;

public class UpdateQuestionDTO
{
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public ICollection<UpdateChoiceDTO> Choices { get; set; }
}