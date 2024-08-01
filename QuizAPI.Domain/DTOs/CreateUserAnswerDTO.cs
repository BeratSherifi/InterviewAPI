namespace QuizAPI.Domain.DTOs;

public class CreateUserAnswerDTO
{
    public int QuestionId { get; set; }
    public int ChoiceId { get; set; }
}