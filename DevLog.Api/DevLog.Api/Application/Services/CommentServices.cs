using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Enums;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;

using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace DevLog.Api.Application.Services
{
    public class CommentServices : ICommentServices
    {
        private readonly ApplicationDbContext _db;

        public CommentServices(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<CommentDetailDto> CreateCommentAsync(CreateCommentDto dto, string userId, int postId)
        {
            var post = await _db.Posts.FindAsync(postId);
            if (post == null)
                throw new NotFoundException("Post not found");

            if (post.Status != PostStatus.Published)
                throw new BadRequestException("Cannot comment on unpublished post");

            var comment = new Comment
            {
                Content = dto.Content,
                PostId = postId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var up = await _db.UsersProfiles.Include(u => u.User).FirstOrDefaultAsync(u => u.UserId == userId);

            await _db.Comments.AddAsync(comment);
            await _db.SaveChangesAsync();

            var commentDetail = new CommentDetailDto
            {
                CommentId = comment.CommentId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt,
                AuthorId = comment.UserId,
                AuthorName = comment.User.UserName,
                AuthorProfile = up.ProfileImageUrl
            };

            return commentDetail;
        }
        //edit comment
        public async Task UpdateCommentAsync(UpdateCommentDto dto, string userId, int commentId)
        {

            var comment = await _db.Comments.FindAsync(commentId);
            if (comment == null)
                throw new NotFoundException("Comment not found");

            if (comment.UserId != userId)
                throw new ForbiddenException("Not comment Owner");

            var post = await _db.Posts.FindAsync(comment.PostId);
            if (post == null)
                throw new NotFoundException("Post not found");

            if (dto.Content != null)
                comment.Content = dto.Content;
            else
                throw new InvalidInputException("Comment must not be null");

            await _db.SaveChangesAsync();

        }
        //get all comments
        public async Task<List<CommentDetailDto>> GetAllCommentsAsync(int postId)
        {
            var post = await _db.Posts.FindAsync(postId);
            if (post == null)
                throw new NotFoundException("Post not found");

            var comments = await _db.Comments
                .Where(c => c.PostId == postId)
                .Include(c => c.User)
                .Join(
                    _db.UsersProfiles,
                    c => c.UserId,
                    up => up.UserId,
                    (c, up) => new { c, up }
                )
                .Select(x => new CommentDetailDto
                {
                    CommentId = x.c.CommentId,
                    Content = x.c.Content,
                    CreatedAt = x.c.CreatedAt,
                    UpdatedAt = x.c.UpdatedAt,
                    AuthorId = x.c.UserId,
                    AuthorName = x.c.User.UserName,
                    AuthorProfile = x.up.ProfileImageUrl
                }).ToListAsync();
                
            return comments;
        }
        //delete comment
        public async Task DeleteCommentAsync(int commentId, string userId)
        {
            var comment = await _db.Comments.FindAsync(commentId);
            if (comment == null)
                throw new NotFoundException("Comment not found");

            if (comment.UserId != userId)
                throw new ForbiddenException("Not comment Owner");

            _db.Comments.Remove(comment);

            await _db.SaveChangesAsync();
           
        }
    }
}
