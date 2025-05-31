using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class PvController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public PvController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("get-pv")]
    public async Task<IActionResult> GetInfo()
    {
        var httpClient = _httpClientFactory.CreateClient("PVGIS");

        // Ścieżka względna do BaseAddress
        var path = "PVcalc?lat=45&lon=8&peakpower=1&loss=14&mountingplace=building&optimalangles=1&outputformat=json";

        var httpResponseMessage = await httpClient.GetAsync(path);

        if (!httpResponseMessage.IsSuccessStatusCode)
        {
            return StatusCode((int)httpResponseMessage.StatusCode, "API call failed.");
        }

        var response = await httpResponseMessage.Content.ReadAsStringAsync();
        return Ok(response);
    }
}
