using DevLog.Api.Application.DTOs;
using DevLog.Api.Application.Interfaces;
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

        public async Task<int> CreateCommentAsync(CommentDto dto, string userId)
        {
            var post = _db.Posts.Find(dto.PostId);
            if (post == null)
                throw new NotFoundException("Post not found");

            var comment = new Comment
            {
                Content = dto.Content,
                PostId = dto.PostId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();

            return comment.CommentId;
        }
        //edit comment
        public async Task UpdateCommentAsync(UpdateCommentDto dto, string userId)
        {
            var post = _db.Posts.Find(dto.PostId);
            if (post == null)
                throw new NotFoundException("Post not found");

            var comment = _db.Comments.Find(dto.CommentId);
            if (comment == null)
                throw new NotFoundException("Comment not found");

            if (comment.UserId != userId)
                throw new ForbiddenException("Not comment Owner");

            if (dto.Content != null)
                comment.Content = dto.Content;
            else
                throw new InvalidInputException("Comment must not be null");

            await _db.SaveChangesAsync();

        }
        //get all comments
        public async Task<List<CommentDetailDto>> GetAllCommentsAsync(int postId)
        {
            var post = _db.Posts.Find(postId);
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
            var comment = _db.Comments.Find(commentId);
            if (comment == null)
                throw new NotFoundException("Comment not found");

            if (comment.UserId != userId)
                throw new ForbiddenException("Not comment Owner");

            _db.Comments.Remove(comment);

            await _db.SaveChangesAsync();
           
        }

        string getUserProfile(string userId)
        {
            return _db.UsersProfiles.Where(u => u.UserId == userId).Select(u => u.ProfileImage).ToString();
        }
    }
}
