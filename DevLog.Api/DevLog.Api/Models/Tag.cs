namespace DevLog.Api.Models
{
    public class Tag
    {
        public int TagId { get; set; }
        public string Name { get; set; }

        public List<PostTag> PostTags { get; set; } = new();
    }
}
