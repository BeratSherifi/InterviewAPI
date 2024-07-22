namespace InterviewAPI.DTOs;

public class UpdateChoiceDto
{
    public int ChoiceId { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}