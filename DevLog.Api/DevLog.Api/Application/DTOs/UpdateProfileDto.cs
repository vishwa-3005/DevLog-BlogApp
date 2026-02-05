namespace DevLog.Api.Application.DTOs
{
    public class UpdateProfileDto
    {
        public string? Fullname { get; set; }
        public string? Username { get; set; }
        public string? Bio { get; set; }
        public IFormFile? ProfileImage  { get; set; }
        public DateOnly? DOB { get; set; }
    }
}
