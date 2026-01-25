using System.ComponentModel.DataAnnotations;

namespace DevLog.Api.Application.DTOs
{
    public class RegisterDto
    {
        [Required, MaxLength(50)]
        public string fullName { get; set; }
        public string username { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public DateOnly Dob  { get; set; }
        [Required]
        public string Bio { get; set; }
        public string password { get; set; }
        public IFormFile profile { get; set; }
    }
}
