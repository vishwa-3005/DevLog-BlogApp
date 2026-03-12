using System.ComponentModel.DataAnnotations;

namespace DevLog.Api.Application.DTOs
{
    public class UpdatePostDto
    {
        [MaxLength(100)]
        public string? Title { get; set; }

        public string? Content { get; set; }

        public IFormFile? Thumbnail { get; set; }   // backend upload 

        [MaxLength(300)]
        public string? ThumbnailUrl { get; set; }   // frontend upload 

        public string? Description { get; set; }
    }
}