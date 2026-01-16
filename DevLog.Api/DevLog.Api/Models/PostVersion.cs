namespace DevLog.Api.Models
{
    public class PostVersion
    {
        public int PostVersionId { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateddAt { get; set; }
    }
}
