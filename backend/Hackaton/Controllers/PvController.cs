using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Hackaton.DTOs;
using Hackaton.Helpers;
using System.Text.Json;


[ApiController]
[Route("[controller]")]
public class PvController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public PvController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("GetInfo")]
    public async Task<IActionResult> GetInfo([FromQuery] InputDto input)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var queryParams = new List<string>
        {
            $"lat={input.Latitude.ToString(CultureInfo.InvariantCulture)}",
            $"lon={input.Longitude.ToString(CultureInfo.InvariantCulture)}",
            $"peakpower={input.PeakPower.ToString(CultureInfo.InvariantCulture)}",
            $"loss={input.SystemLoss.ToString(CultureInfo.InvariantCulture)}"
        };

        if (input.UseHorizon.HasValue) queryParams.Add($"usehorizon={(input.UseHorizon.Value ? 1 : 0)}");
        if (!string.IsNullOrEmpty(input.MountingPlace)) queryParams.Add($"mountingplace={input.MountingPlace}");
        if (input.FixedAngle.HasValue) queryParams.Add($"angle={input.FixedAngle}");
        if (input.OptimalAngles.HasValue) queryParams.Add($"optimalangles={(input.OptimalAngles.Value ? 1 : 0)}");
        queryParams.Add($"outputformat=json");

        var httpClient = _httpClientFactory.CreateClient("PVGIS");
        var path = $"PVcalc?{string.Join("&", queryParams)}";

        var httpResponseMessage = await httpClient.GetAsync(path);

        if (!httpResponseMessage.IsSuccessStatusCode)
            return StatusCode((int)httpResponseMessage.StatusCode);
        
        var content = await httpResponseMessage.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<object>(content);
        var response = new SuccessResponse<object>(data: content);
        return Ok(response);
    }

}
