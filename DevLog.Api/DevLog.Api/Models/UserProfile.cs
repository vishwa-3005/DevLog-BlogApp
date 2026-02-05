using DevLog.Api.Models;

public class UserProfile
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string Bio { get; set; }
    public string ProfileImageUrl { get; set; } = "";
    public string ProfileImagePublicId { get; set; } = "";
    public DateOnly DOB { get; set; }

    public string UserId { get; set; }
    public AppUser User { get; set; }
}
