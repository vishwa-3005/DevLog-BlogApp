using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Enums;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace DevLog.Api.Application.Services
{
    public class ProfileServices : IProfileServices
    {
        private readonly ApplicationDbContext _db;
        private readonly ICloudinaryServices _cs;

        public ProfileServices(ApplicationDbContext db, ICloudinaryServices cs)
        {
            _db = db;
            _cs = cs;
        }
        public async Task<ProfileDto> GetProfileAsync(string CurrentUserId, string userId)
        {
            var profile = await _db.UsersProfiles.Include(u => u.User).FirstOrDefaultAsync(up => up.UserId == userId);
            if (profile == null)
                throw new NotFoundException("Profile Not Found");

            List<PostSummaryDto> userPosts;
           
                var published = _db.Posts
                    .Where(p => (p.AuthorId == profile.UserId) && p.Status == PostStatus.Published)
                    .Select(p =>
                        new PostSummaryDto
                        {
                            PostId = p.PostId,
                            Title = p.Title,
                            Description = p.Description,
                            AuthorName = p.Author.UserName,
                            CreatedAt = p.CreatedAt,
                            LikeCount = p.Reactions.Count(),
                            Thumbnail = p.ThumbnailUrl,
                            Slug = p.Slug,
                        }
                    )
                    .ToList();

            
            if(CurrentUserId != profile.UserId)
            {
                var userProfile = new ProfileDto
                {
                    ProfileId = profile.Id,
                    Bio = profile.Bio,
                    UserId = profile.User.Id,
                    Email = profile.Email,
                    Username = profile.UserName,
                    DOB = profile.DOB,
                    ProfileImage = profile.ProfileImageUrl,
                    PublishedPosts = published,
                    DraftPosts = []
                };
                return userProfile;
            }
            else
            {
                var drafts = _db.Posts
                    .Where(p => (p.AuthorId == profile.UserId) && p.Status == PostStatus.Draft)
                    .Select(p =>
                        new PostSummaryDto
                        {
                            PostId = p.PostId,
                            Title = p.Title,
                            Description = p.Description,
                            AuthorName = p.Author.UserName,
                            CreatedAt = p.CreatedAt,
                            LikeCount = p.Reactions.Count(),
                            Thumbnail = p.ThumbnailUrl,
                            Slug = p.Slug,
                        }
                    ).ToList();

                var userProfile = new ProfileDto
                {
                    ProfileId = profile.Id,
                    Bio = profile.Bio,
                    UserId = userId,
                    Email = profile.Email,
                    Username = profile.UserName,
                    DOB = profile.DOB,
                    ProfileImage = profile.ProfileImageUrl,
                    PublishedPosts = published,
                    DraftPosts = drafts
                };
                return userProfile;
            } 
        }

        public async Task UpdateProfileAsync(UpdateProfileDto dto, string CurrentUserId, string userId)
        {
            var profile = await _db.UsersProfiles.FirstOrDefaultAsync(up => up.UserId == userId);
            if (profile == null)
                throw new NotFoundException("Profile Not Found");

            if (profile.UserId != CurrentUserId)
                throw new ForbiddenException("Not The Profile Owner!");

            if (dto.Bio != null) profile.Bio = dto.Bio;
            /*if (dto.DOB != null) profile.DOB = dto.DOB;*/
            if (dto.ProfileImage != null)
            {
                var result = await _cs.UploadPhotoAsync(dto.ProfileImage);

                if (result == null || result.Error != null)
                {
                    throw new Exception("Profile image upload failed");
                }

                // delete old image if exists
                if (!string.IsNullOrEmpty(profile.ProfileImagePublicId))
                {
                    await _cs.DeleteImageAsync(profile.ProfileImagePublicId);
                }

                // store both values
                profile.ProfileImageUrl = result.SecureUrl.AbsoluteUri;
                profile.ProfileImagePublicId = result.PublicId;
            }
            if (dto.Username != null) profile.UserName = dto.Username;

            await _db.SaveChangesAsync();
        }
    }
}
