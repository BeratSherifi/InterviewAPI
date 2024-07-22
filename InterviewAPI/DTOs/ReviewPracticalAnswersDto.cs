namespace InterviewAPI.DTOs;

public class ReviewPracticalAnswersDto
{
    public int QuizId { get; set; }
    public List<ReviewPracticalAnswerDto> Answers { get; set; }
}