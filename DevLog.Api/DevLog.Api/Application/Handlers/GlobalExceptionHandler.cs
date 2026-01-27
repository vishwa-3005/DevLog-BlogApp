using Microsoft.AspNetCore.Diagnostics;
using System.Net;
using DevLog.Api.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace DevLog.Api.Application.Handlers
{
    
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext context,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, exception.Message);

            var statusCode = GetStatusCode(exception);
            var message = statusCode == HttpStatusCode.InternalServerError
                ? "Internal server error"
                : exception.Message;

            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                success = false,
                statusCode = (int)statusCode,
                message
            }, cancellationToken);

            return true;
        }

        private static HttpStatusCode GetStatusCode(Exception exception)
        {
            if (exception is BadRequestException ||
                exception is InvalidInputException)
                return HttpStatusCode.BadRequest;

            if (exception is ForbiddenException)
                return HttpStatusCode.Forbidden;

            if (exception is NotFoundException)
                return HttpStatusCode.NotFound;

            if (exception is UserAlreadyExistsException)
                return HttpStatusCode.Conflict;

            return HttpStatusCode.InternalServerError;
        }
    }

}
