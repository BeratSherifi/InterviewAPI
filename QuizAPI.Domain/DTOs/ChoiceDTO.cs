namespace QuizAPI.Domain.DTOs;

public class ChoiceDTO
{
    public int ChoiceId { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}