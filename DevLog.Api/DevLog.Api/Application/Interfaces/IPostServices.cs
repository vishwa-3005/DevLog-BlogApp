using DevLog.Api.Application.DTOs;
using DevLog.Api.Common.Enums;

namespace DevLog.Api.Application.Interfaces
{
    public interface IPostServices
    {
        // Create
        Task<int> CreateDraftAsync(CreatePostDto dto, string authorId);

        // Read
        Task<PostDetailDto> GetByIdAsync(int postId, string? currentUserId);
        Task<List<PostSummaryDto>> GetAllPublishedAsync();
        Task<List<PostSummaryDto>> GetByAuthorAsync(string authorId);

        // Update
        Task<int> UpdateDraftAsync(int postId, UpdatePostDto dto, string authorId);
        Task PublishAsync(int postId, string authorId);
        public Task<List<string>> GetAllTagsAsync();
        // Delete 
        Task<List<PostSummaryDto>> GetPostsByTagsAsync(string tags);
        Task ArchiveAsync(int postId, string authorId);
    }
}
