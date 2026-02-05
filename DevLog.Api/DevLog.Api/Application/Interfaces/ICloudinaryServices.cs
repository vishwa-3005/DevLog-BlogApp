using CloudinaryDotNet.Actions;

namespace DevLog.Api.Application.Interfaces
{
    public interface ICloudinaryServices
    {
        //upload photo
        public Task<ImageUploadResult> UploadPhotoAsync(IFormFile photo);
        //delete photo
        public Task<DeletionResult> DeleteImageAsync(string publicId);
    }
}
