using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Enums;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http.HttpResults;

namespace DevLog.Api.Application.Services
{
    public class ProfileServices : IProfileServices
    {
        private readonly ApplicationDbContext _db;

        public ProfileServices(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<ProfileDto> GetProfileAsync(string CurrentUserId, int profileId)
        {
            var profile = _db.UsersProfiles.Find(profileId);
            if (profile == null)
                throw new NotFoundException("Profile Not Found");

            List<PostSummaryDto> userPosts;
            if (profile.UserId != CurrentUserId)
            {
                userPosts = _db.Posts
                    .Where(p => (p.AuthorId == profile.UserId && p.Status == PostStatus.Published))
                    .Select(p =>
                        new PostSummaryDto
                        {
                            PostId = p.PostId,
                            Title = p.Title,
                            Description = p.Description,
                            AuthorName = p.Author.UserName,
                            CreatedAt = p.CreatedAt,
                            LikeCount = p.Reactions.Count(),
                            Thumbnail = p.Thumbnail,
                            Slug = p.Slug,
                        }
                    )
                    .ToList();
            }
            else
            {
                userPosts = _db.Posts
                    .Where(p => (p.AuthorId == profile.UserId))
                    .Select(p =>
                        new PostSummaryDto
                        {
                            PostId = p.PostId,
                            Title = p.Title,
                            Description = p.Description,
                            AuthorName = p.Author.UserName,
                            CreatedAt = p.CreatedAt,
                            LikeCount = p.Reactions.Count(),
                            Thumbnail = p.Thumbnail,
                            Slug = p.Slug,
                        }
                    )
                    .ToList();
            }
            var userProfile = new ProfileDto
            {
                ProfileId = profile.Id,
                Bio = profile.Bio,
                DOB = profile.DOB,
                ProfileImage = profile.ProfileImage,
                Posts = userPosts
            };

            return userProfile;
        }

        public async Task UpdateProfileAsync(UpdateProfileDto dto, string CurrentUserId, int profileId)
        {
            var profile = _db.UsersProfiles.Find(profileId);
            if (profile == null)
                throw new NotFoundException("Profile Not Found");

            if (profile.UserId != CurrentUserId)
                throw new ForbiddenException("Not The Profile Owner!");

            if (dto.Bio != null) profile.Bio = dto.Bio;
            if (dto.DOB != null) profile.DOB = dto.DOB;
            if (dto.ProfileImage != null) profile.ProfileImage = dto.ProfileImage;
            if (dto.Username != null) profile.UserName = dto.Username;

            await _db.SaveChangesAsync();
        }
    }
}
