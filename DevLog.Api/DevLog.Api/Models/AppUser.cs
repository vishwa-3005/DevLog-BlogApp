using Microsoft.AspNetCore.Identity;

namespace DevLog.Api.Models
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public UserProfile Profile { get; set; }
    }
}
