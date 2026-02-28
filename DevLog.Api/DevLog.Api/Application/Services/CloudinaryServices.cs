using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DevLog.Api.Application.Interfaces;
using DevLog.Api.Configurations;
using Microsoft.Extensions.Options;

namespace DevLog.Api.Application.Services
{
    public class CloudinaryServices : ICloudinaryServices
    {

        private readonly Cloudinary _cloudinary;

        public CloudinaryServices(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

            _cloudinary = new Cloudinary(acc);
        }

        public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;
            else
            {
                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "Devlog",
                };

                var url = await _cloudinary.UploadAsync(uploadParams);
                if (url == null || url.Error != null)
                {
                    throw new Exception("Profile image upload failed");
                }

                return url;
            }
        }

        public async Task<DeletionResult> DeleteImageAsync(string publicId)
        {
            var res = await _cloudinary.DestroyAsync(new DeletionParams(publicId));
            return res;
        }
    }
}
