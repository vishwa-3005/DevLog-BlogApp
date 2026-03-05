public class PostDetailDto
{
    public int Id { get; set; }

    public string Title { get; set; }

    public string Content { get; set; }

    public string AuthorId { get; set; }

    public string AuthorName { get; set; }
    public string Description { get; set; }

    public string ThumbnailUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int LikeCount { get; set; }
    public string Status { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
}
