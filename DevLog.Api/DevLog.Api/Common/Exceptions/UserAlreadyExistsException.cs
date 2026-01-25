using System.Runtime.Serialization;

namespace DevLog.Api.Common.Exceptions
{
    public class UserAlreadyExistsException : Exception
    {
        public UserAlreadyExistsException()
        {
        }

        public UserAlreadyExistsException(string? message) : base(message)
        {
        }

        public UserAlreadyExistsException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

    }
}
