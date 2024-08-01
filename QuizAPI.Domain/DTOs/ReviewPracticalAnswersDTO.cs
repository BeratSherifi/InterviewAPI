namespace QuizAPI.Domain.DTOs;

public class ReviewPracticalAnswersDTO
{
    public int QuizId { get; set; }
    public List<ReviewPracticalAnswerDTO> Answers { get; set; }
}