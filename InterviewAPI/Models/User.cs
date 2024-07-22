using Microsoft.AspNetCore.Identity;

namespace InterviewAPI.Models;

public class User : IdentityUser
{
    public DateTime CreatedAt { get; set; }
    public ICollection<Quiz> Quizzes { get; set; } 
}