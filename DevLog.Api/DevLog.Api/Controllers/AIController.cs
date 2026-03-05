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
        public async Task<IActionResult> generateThumbnail([FromBody] string content)
        {
            try
            {
                var res = await _ai.GenerateThumbnailAsync(content);
                return Ok(new { thumbnailUrl = res });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
