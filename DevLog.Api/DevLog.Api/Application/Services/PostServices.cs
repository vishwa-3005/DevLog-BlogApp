using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Enums;
using DevLog.Api.Infrastructure.Data;
using DevLog.Api.Models;
using DevLog.Api.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using Slugify;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DevLog.Api.Application.Services
{

    public class PostServices : IPostServices
    {
        private readonly ApplicationDbContext _db;
        private readonly ICloudinaryServices _cs;

        public PostServices(ApplicationDbContext db, ICloudinaryServices cs)
        {
            _db = db;
            _cs = cs;
        }

        // Create
        public async Task<int> CreateDraftAsync(CreatePostDto dto, string authorId) //post id
        {

                var res = await _cs.UploadPhotoAsync(dto.Thumbnail);
                if (res == null) throw new Exception("Failed to upload photo on cloudinary!");
            var newPost = new Post
            {
                AuthorId = authorId,
                Content = dto.Content,
                Description = dto.Description,
                ThumbnailUrl = res.SecureUrl.AbsoluteUri,
                ThumbnailPublicId = res.PublicId,
                Title = dto.Title,
                Slug = generateSlug(dto.Title),
                Status = PostStatus.Draft
            };
            

            await _db.Posts.AddAsync(newPost);
            await _db.SaveChangesAsync();

            var version = new PostVersion
            {
                PostId = newPost.PostId,
                CreatedAt = DateTime.Now,
                UpdateddAt = DateTime.Now
            };

            await _db.PostVersions.AddAsync(version);

            await _db.SaveChangesAsync();

            return newPost.PostId;
        }

        // Read
        public async Task<PostDetailDto> GetByIdAsync(int postId, string? currentUserId)
        {

            var post = await _db.Posts.Include(p => p.Author).Include(p => p.Reactions).FirstOrDefaultAsync(p => p.PostId == postId);
            if (post == null)
                throw new NotFoundException("Post Not Found!");

            var version = await _db.PostVersions
                .Where(pv => pv.PostId == postId)
                .OrderByDescending(pv => pv.CreatedAt)
                .FirstOrDefaultAsync();

            var postDetail = new PostDetailDto
            {
                Id = post.PostId,
                Title = post.Title,
                Description = post.Description,
                Content = post.Content,
                AuthorName = post.Author.UserName,
                ThumbnailUrl = post.ThumbnailUrl,
                LikeCount = post.Reactions.Count(),
                CreatedAt = version.CreatedAt,
                UpdatedAt = version.UpdateddAt
            };

            return postDetail;

        }
        public async Task<List<PostSummaryDto>> GetAllPublishedAsync()
        {

            List<PostSummaryDto> postSummary = await _db.Posts
            .Where(p => p.Status == PostStatus.Published)
            .Select(p =>
                new PostSummaryDto
                {
                    PostId = p.PostId,
                    Thumbnail = p.ThumbnailUrl,
                    Title = p.Title,
                    Slug = p.Slug,
                    Description = p.Description,
                    AuthorName = p.Author.UserName,
                    CreatedAt = p.CreatedAt,
                    LikeCount = p.Reactions.Count()
                })
            .ToListAsync();
            return postSummary;
        }
        public async Task<List<PostSummaryDto>> GetByAuthorAsync(string authorId)
        {
            var list = await _db.Posts
                .Include(p => p.Author)
                .Include(p => p.Reactions)
                .Where(p => p.AuthorId == authorId && p.Status == PostStatus.Published)
                .Select(p =>
                new PostSummaryDto
                {
                    PostId = p.PostId,
                    Thumbnail = p.ThumbnailUrl,
                    Title = p.Title,
                    Slug = p.Slug,
                    Description = p.Description,
                    AuthorName = p.Author.UserName,
                    CreatedAt = p.CreatedAt,
                    LikeCount = p.Reactions.Count()
                })
            .ToListAsync();

            return list;
        }

        // Update
        public async Task UpdateDraftAsync(int postId, UpdatePostDto dto, string authorId)
        {
            var post = await _db.Posts.FirstOrDefaultAsync(p => p.PostId == postId);
            if (post == null)
                throw new NotFoundException("Post not found");

            if (post.AuthorId != authorId)
                throw new ForbiddenException("Not the post owner");

            var res = await _cs.UploadPhotoAsync(dto.Thumbnail);
            if (res == null || res.Error != null)
            {
                throw new Exception("Profile image upload failed");
            }
            else
            {
                if (!string.IsNullOrEmpty(post.ThumbnailPublicId))
                {
                    await _cs.DeleteImageAsync(post.ThumbnailPublicId);
                }
                post.ThumbnailPublicId = res.SecureUrl.AbsoluteUri;
                post.ThumbnailPublicId = res.PublicId;
            }

            if(dto.Title != null) post.Title = dto.Title;
            post.Content = dto.Content;
            post.Description = dto.Description;
            

            await _db.SaveChangesAsync();

           // return post.PostId;
        }
        public async Task PublishAsync(int postId, string authorId)
        {
            var post = await _db.Posts.FindAsync(postId);

            if (post == null)
                throw new NotFoundException("Post not found");

            if (post.AuthorId != authorId)
                throw new ForbiddenException("Not the post owner");

            if (post.Status != PostStatus.Draft)
                throw new InvalidOperationException("Only drafts can be published");

            post.Status = PostStatus.Published;
            
            _db.PostVersions.Add(new PostVersion
            {
                PostId = postId,
                CreatedAt = post.CreatedAt,
                UpdateddAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
        }


        // Delete 
        public async Task ArchiveAsync(int postId, string authorId)
        {
            var post = await _db.Posts.FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null)
                throw new NotFoundException("Post not found");

            if (post.AuthorId != authorId)
                throw new ForbiddenException("Not the post owner");

            if (post.Status != PostStatus.Published)
                throw new InvalidOperationException("Only Published posts can be Archived");

            post.Status = PostStatus.Archived;

           /* _db.PostVersions.Add(new PostVersion
            {
                PostId = postId,
                CreatedAt = post.CreatedAt,
                UpdateddAt = DateTime.UtcNow
            });*/

            await _db.SaveChangesAsync();
        }

        #region helper functions
        public string generateSlug(string title)
        {
            return new SlugHelper().GenerateSlug(title);
        }
        #endregion
    }
}
