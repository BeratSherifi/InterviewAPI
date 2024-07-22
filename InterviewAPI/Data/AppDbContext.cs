using InterviewAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InterviewAPI.Data;

public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<Position> Positions { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Choice> Choices { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }
    public DbSet<UserAnswer> UserAnswers { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Question and Choice
        modelBuilder.Entity<Question>()
            .HasMany(q => q.Choices)
            .WithOne(c => c.Question)
            .HasForeignKey(c => c.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Question>()
            .HasMany(q => q.UserAnswers)
            .WithOne(ua => ua.Question)
            .HasForeignKey(ua => ua.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Position and Question
        modelBuilder.Entity<Position>()
            .HasMany(p => p.Questions)
            .WithOne(q => q.Position)
            .HasForeignKey(q => q.PositionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // Quiz and Position
        modelBuilder.Entity<Position>()
            .HasMany(p => p.Quizzes)
            .WithOne(q => q.Position)
            .HasForeignKey(q => q.PositionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        
        // Quiz
        modelBuilder.Entity<Quiz>()
            .HasKey(q => q.QuizId);
        modelBuilder.Entity<Quiz>()
            .Property(q => q.Controlled)
            .HasDefaultValue(false);
        
        // Quiz and UserAnswer
        modelBuilder.Entity<Quiz>()
            .HasMany(q => q.UserAnswers)
            .WithOne(ua => ua.Quiz)
            .HasForeignKey(ua => ua.QuizId)
            .OnDelete(DeleteBehavior.Cascade);

        //  Quiz and User
        modelBuilder.Entity<Quiz>()
            .HasOne(q => q.User)
            .WithMany(u => u.Quizzes)
            .HasForeignKey(q => q.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<UserAnswer>()
            .HasOne(ua => ua.Choice)
            .WithMany()
            .HasForeignKey(ua => ua.ChoiceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}