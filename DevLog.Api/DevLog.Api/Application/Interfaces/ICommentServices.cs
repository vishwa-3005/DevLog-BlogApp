using DevLog.Api.Application.DTOs;

namespace DevLog.Api.Application.Interfaces
{
    public interface ICommentServices
    {
        //create comment
        public Task<int> CreateCommentAsync(CommentDto dto, string userId);
        //edit comment
        public Task UpdateCommentAsync(UpdateCommentDto dto, string userId);
        //get all comments
        public Task<List<CommentDetailDto>> GetAllCommentsAsync(int postId);
        //delete comment
        public Task DeleteCommentAsync(int commentId, string userId);
    }
}
