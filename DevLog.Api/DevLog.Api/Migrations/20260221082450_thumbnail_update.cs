using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevLog.Api.Migrations
{
    /// <inheritdoc />
    public partial class thumbnail_update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Thumbnail",
                table: "Posts",
                newName: "ThumbnailUrl");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailPublicId",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailPublicId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "ThumbnailUrl",
                table: "Posts",
                newName: "Thumbnail");
        }
    }
}
