using DevLog.Api.Common.Enums;
using DevLog.Api.Models;
using System.ComponentModel.DataAnnotations;

public class Post
{
    public int PostId { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public string Slug { get; set; }

    [Required]
    public string Thumbnail { get; set; }

    [Required]
    public string Content { get; set; }

    public PostStatus Status { get; set; } = PostStatus.Draft;

    // OWNER
    public string AuthorId { get; set; }
    public AppUser Author { get; set; }

    public List<Comment> Comments { get; set; }
    public List<Reaction> Reactions { get; set; }
    public List<PostVersion> Versions { get; set; }
}
