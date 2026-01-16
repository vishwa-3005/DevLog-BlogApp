using DevLog.Api.Models;

public class UserProfile
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Bio { get; set; }
    public string ProfileImage { get; set; }
    public DateOnly DOB { get; set; }

    public string UserId { get; set; }
    public AppUser User { get; set; }
}
