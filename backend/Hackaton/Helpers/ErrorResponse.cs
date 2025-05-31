namespace Hackaton.Helpers;

public class ErrorResponse<T> : ApiResponse<T>
{
    public ErrorResponse(int status = 500, T? data = default) : base(status, false, data)
    {
    }
}