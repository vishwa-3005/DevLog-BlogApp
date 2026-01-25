using DevLog.Api.Application.DTOs;

namespace DevLog.Api.Application.Interfaces
{
    public interface IAuthServices
    {
        //register user
        public Task<int> RegisterUserAsync(RegisterDto dto);
        //logs in user
        public Task LoginUserAsync(LoginDto dto);
        //logs out user
        public Task LogOutUserAsync(string userId);
        //generate refresh token
        public Task<string> GenerateRefreshToken();
        
    }
}
