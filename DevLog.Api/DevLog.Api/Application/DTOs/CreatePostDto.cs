using System.ComponentModel.DataAnnotations;

namespace DevLog.Api.Application.DTOs
{
    public class CreatePostDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Description { get; set; } = string.Empty;

        public IFormFile? Thumbnail { get; set; }

        public string? ThumbnailUrl { get; set; }

        // ✅ ADD THIS (IMPORTANT)
        public List<string> Tags { get; set; } = new();
    }
}