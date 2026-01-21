using DevLog.Api.Application.DTOs;

namespace DevLog.Api.Application.Interfaces
{
    public interface IProfileService
    {
        //get profile
        public Task<ProfileDto> GetProfileAsync(string CurrentUserId, int profileId);
        //update profile
        public Task UpdateProfileAsync(UpdateProfileDto dto, string CurrentUserId, int profileId);
    }
}
