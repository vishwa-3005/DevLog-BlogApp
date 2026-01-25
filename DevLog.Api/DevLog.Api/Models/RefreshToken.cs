namespace DevLog.Api.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }

        public string TokenHash { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; }

        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
