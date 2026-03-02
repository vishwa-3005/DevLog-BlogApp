using DevLog.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DevLog.Api.Controllers
{
    [Route("api/reactions/{postId}")]
    [ApiController]
    public class ReactionsController : ControllerBase
    {
        private readonly IReactionsServices _reactionsServices;
        public ReactionsController(IReactionsServices reactionsServices)
        {
            _reactionsServices = reactionsServices;
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> ToggleLikePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var res = await _reactionsServices.ToggleLikePostAsync(postId, userId);

            return Ok(new { id = postId, likeCount = res});
        }
    }
}
