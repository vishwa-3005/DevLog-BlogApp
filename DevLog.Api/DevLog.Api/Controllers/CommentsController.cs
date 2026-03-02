using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DevLog.Api.Controllers
{
    [Route("api/posts/{postId}/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentServices _commentServices;

        public CommentsController(ICommentServices commentServices)
        {
            _commentServices = commentServices;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateComment(CreateCommentDto dto, int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
           
            var comment = await _commentServices.CreateCommentAsync(dto, userId, postId);

            return Ok(comment);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllComments(int postId)
        {
            var comments = await _commentServices.GetAllCommentsAsync(postId);
            return Ok(comments);
        }

        [HttpDelete("{commentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _commentServices.DeleteCommentAsync(commentId, userId);
            return Ok(new {id = commentId});
        }

        [HttpPut("{commentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(UpdateCommentDto dto, int commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _commentServices.UpdateCommentAsync(dto, userId, commentId);

            return Ok(new {id = commentId, content = dto.Content});
        }
    }
}
