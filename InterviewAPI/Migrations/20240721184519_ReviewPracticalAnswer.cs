using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterviewAPI.Migrations
{
    /// <inheritdoc />
    public partial class ReviewPracticalAnswer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsCorrect",
                table: "UserAnswers",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AddColumn<string>(
                name: "AnswerText",
                table: "UserAnswers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PracticalScore",
                table: "UserAnswers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Controlled",
                table: "Quizzes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "Questions",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnswerText",
                table: "UserAnswers");

            migrationBuilder.DropColumn(
                name: "PracticalScore",
                table: "UserAnswers");

            migrationBuilder.DropColumn(
                name: "Controlled",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "Questions");

            migrationBuilder.AlterColumn<bool>(
                name: "IsCorrect",
                table: "UserAnswers",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);
        }
    }
}
