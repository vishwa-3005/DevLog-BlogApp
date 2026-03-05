namespace DevLog.Api.Application.Interfaces
{
    public interface IAIServices
    {
        Task<string> GenerateThumbnailAsync(string prompt);
    }
}
