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
        
        CreateMap<Position, PositionDto>();
        CreateMap<CreatePositionDto, Position>();

        CreateMap<Question, QuestionDto>()
            .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices));
        CreateMap<CreateQuestionDto, Question>();

        CreateMap<Choice, ChoiceDto>();
        CreateMap<CreateChoiceDto, Choice>();


    }
}