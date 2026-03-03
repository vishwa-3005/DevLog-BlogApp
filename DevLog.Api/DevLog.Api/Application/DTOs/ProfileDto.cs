namespace DevLog.Api.Application.DTOs
{
    public class ProfileDto
    {
        public int ProfileId { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Bio { get; set; }
        public string ProfileImage { get; set; } = "";
        public DateOnly DOB { get; set; }
        public List<PostSummaryDto> PublishedPosts { get; set; }
        public List<PostSummaryDto> DraftPosts { get; set; }
    }
}
