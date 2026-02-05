using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevLog.Api.Migrations
{
    /// <inheritdoc />
    public partial class update_userprofile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfileImage",
                table: "UsersProfiles",
                newName: "ProfileImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImagePublicId",
                table: "UsersProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImagePublicId",
                table: "UsersProfiles");

            migrationBuilder.RenameColumn(
                name: "ProfileImageUrl",
                table: "UsersProfiles",
                newName: "ProfileImage");
        }
    }
}
