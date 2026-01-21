namespace DevLog.Api.Application.DTOs
{
    public class CommentDetailDto
    {
        public int CommentId { get; set; }
        public string Content { get; set; }
        public string AuthorId  { get; set; }
        public string AuthorName { get; set; }
        public string AuthorProfile { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
