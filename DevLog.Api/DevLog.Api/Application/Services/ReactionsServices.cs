using DevLog.Api.Application.Interfaces;
using DevLog.Api.Common.Exceptions;
using DevLog.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DevLog.Api.Application.Services
{
    public class ReactionsServices : IReactionsServices
    {
        private readonly ApplicationDbContext _db;

        public ReactionsServices(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task ToggleLikePostAsync(int postId, string userId)
        {
            var post = await _db.Posts.FirstOrDefaultAsync(p => p.PostId == postId);
            if(post == null)
                throw new NotFoundException("Post Not Found");

            var likedPost = await _db.Reactions.FirstOrDefaultAsync(p => p.PostId == postId && p.UserId == userId);

            if (likedPost == null)
            {
                var like = new Reaction
                {
                    PostId = postId,
                    UserId = userId,
                };

                await _db.Reactions.AddAsync(like);
                
            } else
            {
                _db.Reactions.Remove(likedPost);
            }
            await _db.SaveChangesAsync();
        }
    }
}
