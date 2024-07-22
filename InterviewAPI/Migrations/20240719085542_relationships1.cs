using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterviewAPI.Migrations
{
    /// <inheritdoc />
    public partial class relationships1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAnswers_Choices_ChoiceId",
                table: "UserAnswers");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAnswers_Choices_ChoiceId",
                table: "UserAnswers",
                column: "ChoiceId",
                principalTable: "Choices",
                principalColumn: "ChoiceId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAnswers_Choices_ChoiceId",
                table: "UserAnswers");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAnswers_Choices_ChoiceId",
                table: "UserAnswers",
                column: "ChoiceId",
                principalTable: "Choices",
                principalColumn: "ChoiceId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
