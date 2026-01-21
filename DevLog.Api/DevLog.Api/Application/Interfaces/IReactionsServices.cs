namespace DevLog.Api.Application.Interfaces
{
    public interface IReactionsServices
    {
        public Task ToggleLikePostAsync(int postId, string userId);
    }
}
