using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Migrations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace DevLog.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authServices;

        public AuthController(IAuthServices authServices)
        {
            _authServices = authServices;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm]RegisterDto dto)
        {
            var userId = await _authServices.RegisterUserAsync(dto);
            return CreatedAtAction(nameof(Register), new { id = userId }, new { userId });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var response = await _authServices.LoginUserAsync(dto);
            Response.Cookies.Append(
                "refreshToken",
                response.refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                }
                );
            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var token))
                return Ok();
            await _authServices.LogOutUserAsync(token);
            Response.Cookies.Delete("refreshToken");
            return Ok();
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var token))
                return Unauthorized();

            var response = await _authServices.RefreshAsync(token);
            Response.Cookies.Append(
           "refreshToken",
           response.refreshToken,
           new CookieOptions
           {
               HttpOnly = true,
               Secure = true,
               SameSite = SameSiteMode.None,
               Expires = DateTime.UtcNow.AddDays(7)
           }
           );
            return Ok(response);
        }
    }
}
