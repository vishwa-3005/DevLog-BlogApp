using DevLog.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;

namespace DevLog.Api.Controllers
{
    [Route("api/uploads")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        public readonly ICloudinaryServices _cs;
        public CloudinaryController(ICloudinaryServices cs)
        {
            _cs = cs;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> uploadImage(IFormFile file)
        {
            var res = await _cs.UploadPhotoAsync(file);
            return Ok(new { location = res.SecureUrl.AbsoluteUri});
        }
    }
}
