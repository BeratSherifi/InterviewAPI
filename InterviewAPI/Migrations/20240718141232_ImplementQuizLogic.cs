using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterviewAPI.Migrations
{
    /// <inheritdoc />
    public partial class ImplementQuizLogic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCorrect",
                table: "UserAnswers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TotalScore",
                table: "Quizzes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCorrect",
                table: "UserAnswers");

            migrationBuilder.DropColumn(
                name: "TotalScore",
                table: "Quizzes");
        }
    }
}
