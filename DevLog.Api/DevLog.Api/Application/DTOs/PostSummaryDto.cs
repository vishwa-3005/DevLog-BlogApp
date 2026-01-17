namespace DevLog.Api.Application.DTOs
{
    public class PostSummaryDto
    {
        public string Title { get; set; }

        public string Slug { get; set; }

        public string Description { get; set; }

        public string Thumbnail { get; set; }

        public string AuthorName { get; set; }

        public string AuthorProfileImage { get; set; }

        public DateTime CreatedAt { get; set; }

        public int LikeCount { get; set; }
    }
}
