using System.ComponentModel.DataAnnotations;

namespace DevLog.Api.Application.DTOs
{
    public class CreatePostDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public string ThumbnailUrl { get; set; }
        [Required, MaxLength(200)]
        public string Description { get; set; }
    }
}
