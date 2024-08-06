namespace QuizAPI.Domain.DTOs;

public class UpdateChoiceDTO
{
    public int ChoiceId { get; set; }
    public string Text { get; set; }
    public bool IsCorrect { get; set; }
}