namespace QuizAPI.Domain.DTOs;

public class SubmitQuizDTO
{
    public int QuizId { get; set; }
    public ICollection<SubmitAnswerDTO> Answers { get; set; }
}