using DevLog.Api.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace DevLog.Api.Application.Services
{
    public class AIServices : IAIServices
    {
        private readonly HttpClient _http;
        private readonly ICloudinaryServices _cs;
        private readonly IConfiguration _config;

        public AIServices(HttpClient http, ICloudinaryServices cs, IConfiguration config)
        {
            _http = http;
            _cs = cs;
            _config = config;
        }

        public async Task<string> GenerateThumbnailAsync(string prompt)
        {
            var accountId = _config["CloudflareAI:AccountId"];
            var token = _config["CloudflareAI:ApiToken"];

            if (string.IsNullOrEmpty(accountId) || string.IsNullOrEmpty(token))
                throw new Exception("Cloudflare AI configuration missing");

            var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0"
            );

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var body = new
            {
                prompt = prompt,
                width = 1024,
                height = 1024
            };

            request.Content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _http.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"AI Error: {error}");
            }

            // Cloudflare returns RAW IMAGE BYTES
            var bytes = await response.Content.ReadAsByteArrayAsync();

            using var stream = new MemoryStream(bytes);

            IFormFile file = new FormFile(stream, 0, bytes.Length, "thumbnail", "thumbnail.png")
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png"
            };

            var res = await _cs.UploadPhotoAsync(file);

            return res.SecureUrl.AbsoluteUri;
        }
    }
}