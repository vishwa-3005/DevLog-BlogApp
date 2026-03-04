namespace DevLog.Api.Application.DTOs
{
    public class AuthResponseDto
    {
        public string accessToken { get; set; }
        public string refreshToken { get; set; }
        public object user { get; set; }
    }
}
