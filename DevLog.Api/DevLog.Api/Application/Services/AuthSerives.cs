using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;
using DevLog.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Azure.Core;
using Azure;

namespace DevLog.Api.Application.Services
{
    public class AuthSerives : IAuthServices
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _config;
        public AuthSerives(ApplicationDbContext db, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration config)
        {
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        public async Task<string> RefreshAsync(string token)
        {
                var tokens = await _db.RefreshTokens
                    .Include(r => r.User)
                    .Where(r =>
                        !r.IsRevoked &&
                        r.ExpiresAt > DateTime.UtcNow)
                    .ToListAsync();

            var stored = tokens.FirstOrDefault(r => BCrypt.Net.BCrypt.Verify(token, r.TokenHash));


            if (stored == null)
                throw new BadRequestException("Can not refresh tokens!");

            stored.IsRevoked = true;

            var newRefresh = GenerateRefreshToken();

            _db.RefreshTokens.Add(new RefreshToken
            {
                UserId = stored.UserId,
                TokenHash = BCrypt.Net.BCrypt.HashPassword(newRefresh),
                ExpiresAt = DateTime.UtcNow.AddDays(int.Parse(_config["Jwt:RefreshTokenDays"])),
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            var accessToken = CreateAccessToken(stored.User);

            return accessToken;
        }

        public async Task<string> LoginUserAsync(LoginDto dto)
        {
            //check if user exists
            var user = await _userManager.FindByEmailAsync(dto.email);
            if (user is null)
                throw new NotFoundException("No user found with given credentials!");

            //validate password
            var isValid = await _userManager.CheckPasswordAsync(user, dto.password);
            if (!isValid)
            {
                throw new InvalidInputException("Incorrect Password!");
            }

            //generate access token
            var accessToken = CreateAccessToken(user);

            //generate refresh token
            var refreshToken = GenerateRefreshToken();
            var refreshEntity = new RefreshToken
            {
                UserId = user.Id,
                TokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken),
                ExpiresAt = DateTime.UtcNow.AddDays(
                    int.Parse(_config["Jwt:RefreshTokenDays"])),
                CreatedAt = DateTime.UtcNow
            };

            _db.RefreshTokens.Add(refreshEntity);
            await _db.SaveChangesAsync();

            //return access token
            return accessToken;
        }

        public async Task LogOutUserAsync(string token)
        {
            var tokens = await _db.RefreshTokens
                .Include(r => r.User)
                .Where(r =>
                    !r.IsRevoked &&
                    r.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            var stored = tokens.FirstOrDefault(r => BCrypt.Net.BCrypt.Verify(token, r.TokenHash));

            if (stored != null)
            {
                stored.IsRevoked = true;
                await _db.SaveChangesAsync();
            }
            else throw new ForbiddenException("Invalid Token!");

        }

        public async Task<int> RegisterUserAsync(RegisterDto dto)
        {
            var user = await _db.UsersProfiles.Where(u => u.Email == dto.email).FirstOrDefaultAsync();
            if(user is not null)
            {
                throw new UserAlreadyExistsException("User Already Exists!");
            }

            var newUser = new AppUser { FullName = dto.fullName };

            var result = await _userManager.CreateAsync(newUser, dto.password);

            if (result.Succeeded)
            {
                var newProfile = new UserProfile
                {
                    UserName = dto.username,
                    Email = dto.email,
                    DOB = dto.Dob,
                    Bio = dto.Bio,
                    UserId = newUser.Id
                };

                _db.UsersProfiles.Add(newProfile);
                await _db.SaveChangesAsync();

                return newProfile.Id;
            }
            else throw new Exception("Failed to create User");
           
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        private string CreateAccessToken(AppUser user)
        {
            //user claims
            var claims = new List<Claim> 
                { 
                    new Claim(ClaimTypes.NameIdentifier, user.Id), //claim type : value
                    new Claim(ClaimTypes.Email, user.Email)
                };

            //symmetric security key for jwt created of your secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["jwt:Key"]));

            //credentails
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //create new jwt token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_config["Jwt:AccessTokenMinutes"])),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
