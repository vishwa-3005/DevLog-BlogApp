using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DevLog.Api.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostController : ControllerBase
    {
        private readonly IPostServices _postService;

        public PostController(IPostServices postService)
        {
            _postService = postService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm]CreatePostDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var postId = await _postService.CreateDraftAsync(dto, userId);

            return Ok(new { id = postId });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var post = await _postService.GetByIdAsync(id, userId);

            return Ok(post);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPublished()
        {
            var summary = await _postService.GetAllPublishedAsync();
            return Ok(summary);
        }

        [HttpGet("author/{authorId}")]
        public async Task<IActionResult> GetByAuthor(string authorId)
        {
            var posts = await _postService.GetByAuthorAsync(authorId);
            return Ok(posts);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateDraft(int id, UpdatePostDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var postId = await _postService.UpdateDraftAsync(id, dto, userId);
            return Ok(new { id = postId });
        }

        [HttpPatch("{id}/publish")]
        [Authorize]
        public async Task<IActionResult> Publish(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _postService.PublishAsync(id, userId);
            return Ok(new {postId = id});
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Archive(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _postService.ArchiveAsync(id, userId);
            return Ok();
        }
    }


}


