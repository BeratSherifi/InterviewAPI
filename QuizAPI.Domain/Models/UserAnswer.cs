namespace QuizAPI.Domain.Models;

public class UserAnswer
{
    public int UserAnswerId { get; set; }
    public int? QuizId { get; set; }
    public Quiz? Quiz { get; set; }
    public int? AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }
    public int? QuestionId { get; set; }
    public Question? Question { get; set; }
    public int? ChoiceId { get; set; }
    public Choice? Choice { get; set; }
    public bool? IsCorrect { get; set; }
    public string? AnswerText { get; set; } // Answer text for practical questions
    public int? PracticalScore { get; set; } // Score given by the admin for practical questions
    public string? PracticalAnswerStatus { get; set; }
}