using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace DevLog.Api.Controllers
{
    [Route("api/profiles")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int profileId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var profile = await _profileService.GetProfileAsync(currentUserId, profileId);

            return Ok(profile);
        } //api/get/profiles/{id}

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto, int profileId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _profileService.UpdateProfileAsync(dto, currentUserId, profileId);

            return Ok();
        } // api/put/profiles/{id}
    }
}
