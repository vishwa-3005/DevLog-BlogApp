using DevLog.Api.Models;

public class Reaction
{
    public int ReactionId { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; }

    public string UserId { get; set; }
    public AppUser User { get; set; }
}
