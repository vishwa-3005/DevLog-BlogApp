using DevLog.Api.Application.DTOs;

namespace DevLog.Api.Application.Interfaces
{
    public interface IProfileServices
    {
        //get profile
        public Task<ProfileDto> GetProfileAsync(string CurrentUserId, int profileId);
        //update profile
        public Task UpdateProfileAsync(UpdateProfileDto dto, string CurrentUserId, int profileId);
    }
}
