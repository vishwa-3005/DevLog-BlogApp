using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;
using DevLog.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DevLog.Api.Application.Services
{
    public class AuthSerives : IAuthServices
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AuthSerives(ApplicationDbContext db, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<string> GenerateRefreshToken()
        {
            throw new NotImplementedException();
        }

        public async Task LoginUserAsync(LoginDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task LogOutUserAsync(string userId)
        {
            throw new NotImplementedException();
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
    }
}
