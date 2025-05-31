namespace Hackaton.Helpers;

public class ApiResponse<T>
{
    public int Status { get; set; }
    public bool Success { get; set; }
    public T? Data { get; set; }

    public ApiResponse(int status, bool success, T? data = default)
    {
        Status = status;
        Success = success;
        Data = data;
    }
}