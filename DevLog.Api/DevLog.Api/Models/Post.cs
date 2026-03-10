using DevLog.Api.Common.Enums;
using DevLog.Api.Models;
using System.ComponentModel.DataAnnotations;

public class Post
{
    public int PostId { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }

    public string Slug { get; set; }

    public string ThumbnailUrl { get; set; } = "";
    public string ThumbnailPublicId { get; set; } = "";

    public string Content { get; set; }

    public PostStatus Status { get; set; } = PostStatus.Draft;
    public DateTime CreatedAt { get; set; }
    // OWNER
    public string AuthorId { get; set; }
    public AppUser Author { get; set; }

    public List<Comment> Comments { get; set; }
    public List<Reaction> Reactions { get; set; }
    public List<PostVersion> Versions { get; set; }
    public List<PostTag> PostTags { get; set; }
}
