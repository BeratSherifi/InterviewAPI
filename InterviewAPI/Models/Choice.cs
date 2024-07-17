namespace InterviewAPI.Models;

public class Choice
{
    public int ChoiceId { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; }
}