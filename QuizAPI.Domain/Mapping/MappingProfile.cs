using AutoMapper;
using QuizAPI.Domain.DTOs;
using QuizAPI.Domain.Models;

namespace QuizAPI.Domain.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
            CreateMap<User, AuthResponseDTO>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName));

            CreateMap<UserAnswer, UserAnswerDTO>()
                .ForMember(dest => dest.PracticalAnswerStatus,
                    opt => opt.MapFrom(src => src.PracticalAnswerStatus))
                .ForMember(dest => dest.IsCorrect, opt => opt.Condition(src => src.Question.QuestionType != "Practical"));

            CreateMap<CreateUserAnswerDTO, UserAnswer>();

            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Quizzes, opt => opt.MapFrom(src => src.Quizzes));

            CreateMap<Position, PositionDTO>()
                .ForMember(dest => dest.Quizzes, opt => opt.MapFrom(src => src.Quizzes));
            CreateMap<CreatePositionDTO, Position>();

            CreateMap<Question, SimpleQuestionDTO>();
            CreateMap<Quiz, SimpleQuizDTO>();

            CreateMap<Question, QuestionDTO>()
                .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));
            CreateMap<CreateQuestionDTO, Question>()
                .ForMember(dest => dest.Choices, opt => opt.Ignore());

            CreateMap<Choice, ChoiceDTO>();
            CreateMap<CreateChoiceDTO, Choice>();

            CreateMap<Choice, ChoiceForQuestion>();
            CreateMap<CreateQuizDTO, Choice>();

            CreateMap<Quiz, QuizDTO>()
                .ForMember(dest => dest.UserAnswers, opt => opt.MapFrom(src => src.UserAnswers));
            CreateMap<CreateQuizDTO, Quiz>();

            CreateMap<Quiz, QuizScoreDTO>();

            CreateMap<Quiz, QuizResultDTO>()
                .ForMember(dest => dest.Passed, opt => opt.MapFrom(src => src.TotalScore >= 65))
                .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Controlled ? "Your quiz has been reviewed." : "Please wait for our developers to review your quiz."));

            CreateMap<Quiz, QuizGetAllDTO>();
            
            CreateMap<Question, QuestionWithChoicesDTO>()
                .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));

            CreateMap<Question, QuestionsForQuizDTO>()
                .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));

            CreateMap<SubmitAnswerDTO, UserAnswer>()
                .ForMember(dest => dest.ChoiceId, opt => opt.MapFrom(src => src.ChoiceId))
                .ForMember(dest => dest.AnswerText, opt => opt.MapFrom(src => src.AnswerText));
        
    }
}