namespace DevLog.Api.Application.DTOs
{
    public class UpdateCommentDto
    {
        public int PostId { get; set; }
        public int CommentId { get; set; }
        public string Content { get; set; }
    }
}
