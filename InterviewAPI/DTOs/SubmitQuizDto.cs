namespace InterviewAPI.DTOs;

public class SubmitQuizDto
{
    public int QuizId { get; set; }
    public ICollection<SubmitAnswerDto> Answers { get; set; }
}