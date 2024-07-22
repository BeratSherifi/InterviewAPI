namespace InterviewAPI.DTOs;

public class SimpleQuizDto
{
    public int QuizId { get; set; }
    public ICollection<SubmitAnswerDto> Answers { get; set; }

}