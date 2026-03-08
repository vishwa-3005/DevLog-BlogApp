using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DevLog.Api.Controllers
{
    [Route("api/thumbnails")]
    [ApiController]
    public class AIController : ControllerBase
    {
        
        private readonly IAIServices _ai;

        public AIController(IAIServices ai)
        {
            _ai = ai;
        }

        [HttpPost]
        public async Task<IActionResult> generateThumbnail([FromBody] ThumbnailRequest req)
        {
            try
            {
                var res = await _ai.GenerateThumbnailAsync(req.Content);
                return Ok(new { thumbnailUrl = res });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
