using Hackaton.Enums;

namespace Hackaton.Exceptions;

public class ApiException : Exception
{
    public int StatusCode { get; }
    public ErrorCode ErrorCode { get; }

    public ApiException(string message, ErrorCode errorCode, int statusCode = 500) : base(message)
    {
        StatusCode = statusCode;
        ErrorCode = errorCode;
    }
}