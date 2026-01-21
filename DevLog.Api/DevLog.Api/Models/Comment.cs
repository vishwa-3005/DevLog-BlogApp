using DevLog.Api.Models;
using System.ComponentModel.DataAnnotations;

public class Comment
{
    public int CommentId { get; set; }

    [Required, MaxLength(300)]
    public string Content { get; set; }

    public string UserId { get; set; }
    public AppUser User { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
