namespace Hackaton.Helpers;

public class SuccessResponse<T> : ApiResponse<T>
{
    public SuccessResponse(int status = 200, T? data = default) : base(status, true, data)
    {
    }
}