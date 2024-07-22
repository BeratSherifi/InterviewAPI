using AutoMapper;
using InterviewAPI.DTOs;
using InterviewAPI.Models;

namespace InterviewAPI.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, AuthResponseDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName));
        
        CreateMap<UserAnswer, UserAnswerDto>();
        CreateMap<CreateUserAnswerDto, UserAnswer>();
        
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Quizzes, opt => opt.MapFrom(src => src.Quizzes));
        
        CreateMap<Position, PositionDto>()
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions))
            .ForMember(dest => dest.Quizzes, opt => opt.MapFrom(src => src.Quizzes));
        CreateMap<CreatePositionDto, Position>();

        CreateMap<Question, SimpleQuestionDto>();
        CreateMap<Quiz, SimpleQuizDto>();

        CreateMap<Question, QuestionDto>()
            .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));
        CreateMap<CreateQuestionDto, Question>()
            .ForMember(dest => dest.Choices, opt => opt.Ignore());

        CreateMap<Choice, ChoiceDto>();
        CreateMap<CreateChoiceDto, Choice>();

        CreateMap<Choice, ChoiceForQuestion>();
        CreateMap<CreateQuizDto, Choice>();
        
        CreateMap<Quiz, QuizDto>()
            .ForMember(dest => dest.UserAnswers, opt => opt.MapFrom(src => src.UserAnswers));
        CreateMap<CreateQuizDto, Quiz>();

        CreateMap<Quiz, QuizResultDto>()
            .ForMember(dest => dest.Passed, opt => opt.Ignore())
            .ForMember(dest => dest.Message, opt => opt.Ignore());
        
        CreateMap<Question, QuestionWithChoicesDto>()
            .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));

        CreateMap<Question, QuestionsForQuizDto>()
            .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));
        
        CreateMap<SubmitAnswerDto, UserAnswer>()
            .ForMember(dest => dest.ChoiceId, opt => opt.MapFrom(src => src.ChoiceId))
            .ForMember(dest => dest.AnswerText, opt => opt.MapFrom(src => src.AnswerText));
    }
}