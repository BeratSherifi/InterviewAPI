namespace QuizAPI.Domain.DTOs;

public class SubmitAnswerDTO
{
    public int QuestionId { get; set; }
    public int? ChoiceId { get; set; }
    public string? AnswerText { get; set; }
}
