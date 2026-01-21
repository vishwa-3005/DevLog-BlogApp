using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Enums;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;
using DevLog.Api.Migrations;
using Humanizer;

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

            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();

            var commentDetail = new CommentDetailDto
            {
                CommentId = comment.CommentId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt,
                AuthorId = comment.UserId,
                AuthorName = comment.User.UserName,
                AuthorProfile = getUserProfile(comment.UserId)
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

            var comments = _db.Comments
                .Where(c => c.PostId == postId)
                .Select(c => new CommentDetailDto
                {
                    CommentId = c.CommentId,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    AuthorId = c.UserId,
                    AuthorName = c.User.UserName,
                    AuthorProfile = getUserProfile(c.UserId)
                })
                .ToList();

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

        string getUserProfile(string userId)
        {
             return _db.UsersProfiles.Find(userId).ProfileImage;
        }
    }
}
