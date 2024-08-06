namespace QuizAPI.Domain.DTOs;

public class QuestionsForQuizDTO
{
    public int QuestionId { get; set; }
    public string Text { get; set; }
    public int DifficultyLevel { get; set; }
    public string QuestionType { get; set; }
    public ICollection<ChoiceForQuestion> Choices { get; set; }
}