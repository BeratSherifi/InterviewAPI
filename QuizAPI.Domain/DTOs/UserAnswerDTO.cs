namespace QuizAPI.Domain.DTOs;

public class UserAnswerDTO
{
    public int UserAnswerId { get; set; }
    public int QuestionId { get; set; }
    public int? ChoiceId { get; set; }
    public bool? IsCorrect { get; set; }
    public string? AnswerText { get; set; }
    public int? PracticalScore { get; set; }
    public string? PracticalAnswerStatus { get; set; }
}