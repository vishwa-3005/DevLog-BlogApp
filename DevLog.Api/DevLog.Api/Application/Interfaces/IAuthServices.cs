using DevLog.Api.Application.DTOs;

namespace DevLog.Api.Application.Interfaces
{
    public interface IAuthServices
    {
        //register user
        public Task<int> RegisterUserAsync(RegisterDto dto);
        //logs in user
        public Task<(string accessToken, string refreshToken)> LoginUserAsync(LoginDto dto);
        //logs out user
        public Task LogOutUserAsync(string token);
        //refresh
        public Task<string> RefreshAsync(string token);
        
    }
}
