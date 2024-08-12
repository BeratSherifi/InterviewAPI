using Microsoft.AspNetCore.Identity;

namespace QuizAPI.Domain.Models;

public class User : IdentityUser
{
    public DateTime CreatedAt { get; set; }
    public ICollection<Quiz> Quizzes { get; set; } 
    public ICollection<Assignment> Assignments { get; set; }
    
    //comment for testing github
}