using System.ComponentModel.DataAnnotations;

namespace DevLog.Api.Application.DTOs
{
    public class CreatePostDto
    {
        [Required, MaxLength(100)]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public string Thumbnail { get; set; }
        [Required, MaxLength(300)]
        public string Description { get; set; }
    }
}
