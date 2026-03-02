namespace DevLog.Api.Application.Interfaces
{
    public interface IReactionsServices
    {
        public Task<int> ToggleLikePostAsync(int postId, string userId);
    }
}
