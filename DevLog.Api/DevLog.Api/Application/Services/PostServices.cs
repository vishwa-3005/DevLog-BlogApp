using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Enums;
using DevLog.Api.Infrastructure.Data;
using DevLog.Api.Models;
using DevLog.Api.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using Slugify;

namespace DevLog.Api.Application.Services
{

    public class PostServices : IPostService
    {
        private readonly ApplicationDbContext _db;

        public PostServices(ApplicationDbContext db)
        {
            _db = db;
        }

        // Create
        public async Task<int> CreateDraftAsync(CreatePostDto dto, string authorId) //post id
        {
            var newPost = new Post
            {
                AuthorId = authorId,
                Content = dto.Content,
                Description = dto.Description,
                Thumbnail = dto.Thumbnail,
                Title = dto.Title,
                Slug = generateSlug(dto.Title),
                Status = PostStatus.Draft
            };
            _db.Posts.AddAsync(newPost);
            await _db.SaveChangesAsync();

            var version = new PostVersion
            {
                PostId = newPost.PostId,
                CreatedAt = DateTime.Now,
                UpdateddAt = DateTime.Now
            };
            _db.PostVersions.Add(version);
            await _db.SaveChangesAsync();

            return newPost.PostId;
        }

        // Read
        public async Task<PostDetailDto> GetByIdAsync(int postId, string? currentUserId)
        {

            var post = await _db.Posts.FindAsync(postId);
            if (post == null)
                throw new NotFoundException("Post Not Found!");

            var version = _db.PostVersions.Where(pv => pv.PostId == postId).Last();

            var postDetail = new PostDetailDto
            {
                Id = post.PostId,
                Title = post.Title,
                Description = post.Description,
                Content = post.Content,
                AuthorName = post.Author.UserName,
                Thumbnail = post.Thumbnail,
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
                    Thumbnail = p.Thumbnail,
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
                .Where(p => p.AuthorId == authorId && p.Status == PostStatus.Published)
                .Select(p =>
                new PostSummaryDto
                {
                    PostId = p.PostId,
                    Thumbnail = p.Thumbnail,
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
            var post = _db.Posts.Find(postId);
            if (post == null)
                throw new NotFoundException("Post not found");

            if (post.AuthorId != authorId)
                throw new ForbiddenException("Not the post owner");

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.Description = dto.Description;
            post.Thumbnail = dto.Thumbnail;

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
            var post = await _db.Posts.FindAsync(postId);

            if (post == null)
                throw new NotFoundException("Post not found");

            if (post.AuthorId != authorId)
                throw new ForbiddenException("Not the post owner");

            if (post.Status != PostStatus.Draft)
                throw new InvalidOperationException("Only drafts can be published");

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
