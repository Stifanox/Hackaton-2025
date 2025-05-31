using Hackaton.Enums;
using Hackaton.Exceptions;
using Hackaton.Helpers;

namespace Hackaton.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ApiException ex)
        {
            _logger.LogInformation($"{ex.StatusCode}");
            var response = new ErrorResponse<string>(ex.StatusCode,ex.Message);
            context.Response.StatusCode = response.Status;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(response);
        }
        catch (Exception ex)
        {
            
            _logger.LogError(ex, ex.Message);
            var response = new ErrorResponse<string>(data:ex.Message);


            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(response);
        }

       
    }
}
