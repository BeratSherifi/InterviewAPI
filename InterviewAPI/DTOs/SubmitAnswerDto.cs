namespace InterviewAPI.DTOs;

public class SubmitAnswerDto
{
    public int QuestionId { get; set; }
    public int? ChoiceId { get; set; }
    public string? AnswerText { get; set; }
}