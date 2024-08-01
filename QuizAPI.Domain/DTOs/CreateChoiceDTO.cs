namespace QuizAPI.Domain.DTOs;

public class CreateChoiceDTO
{
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}