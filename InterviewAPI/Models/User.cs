using Microsoft.AspNetCore.Identity;

namespace InterviewAPI.Models;

public class User : IdentityUser
{
    public DateTime CreatedAt { get; set; }   
}