using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Hackaton.DTOs;
using Hackaton.Helpers;
using System.Text.Json;
using Hackaton.DTOs.FormattedStatistics;


[ApiController]
[Route("api/[controller]")]
public class PvController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<PvController> _logger;
    public PvController(IHttpClientFactory httpClientFactory, ILogger<PvController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    [HttpGet("GetInfo")]
    public async Task<IActionResult> GetInfo([FromQuery] InputDto input)
    {
        if (!ModelState.IsValid)
            return UnprocessableEntity(new ErrorResponse<string>(422, "Wysłano niepoprawne dane"));

        var queryParams = new List<string>
        {
            $"lat={input.Latitude.ToString(CultureInfo.InvariantCulture)}",
            $"lon={input.Longitude.ToString(CultureInfo.InvariantCulture)}",
            $"peakpower={input.PeakPower.ToString(CultureInfo.InvariantCulture)}",
            $"loss={input.SystemLoss.ToString(CultureInfo.InvariantCulture)}"
        };

        if (input.UseHorizon.HasValue) queryParams.Add($"usehorizon={(input.UseHorizon.Value ? 1 : 0)}");
        if (!string.IsNullOrEmpty(input.MountingPlace)) queryParams.Add($"mountingplace={input.MountingPlace}");
        if (input.Fixed.HasValue) queryParams.Add($"fixed={(input.Fixed.Value ? 1 : 0)}");
        if (input.Angle.HasValue) queryParams.Add($"angle={input.Angle}");
        if (input.OptimalAngles.HasValue) queryParams.Add($"optimalangles={(input.OptimalAngles.Value ? 1 : 0)}");
        queryParams.Add($"outputformat=json");

        var httpClient = _httpClientFactory.CreateClient("PVGIS");
        var path = $"PVcalc?{string.Join("&", queryParams)}";

        var httpResponseMessage = await httpClient.GetAsync(path);

        if (!httpResponseMessage.IsSuccessStatusCode)
            return StatusCode((int)httpResponseMessage.StatusCode);
        
        var content = await httpResponseMessage.Content.ReadAsStringAsync();
        
        
        using var document = JsonDocument.Parse(content);

        if (document.RootElement.TryGetProperty("outputs", out var outputsElement) 
            && document.RootElement.TryGetProperty("inputs", out var inputsElement)
            && inputsElement.TryGetProperty("mounting_system", out var mountingSystemElement))
        {
            string outputsJson = outputsElement.GetRawText();
            string mountingSystemJson = mountingSystemElement.GetRawText();
            
            var outputsObj = JsonSerializer.Deserialize<object>(outputsJson);
            var mountingSystemObj = JsonSerializer.Deserialize<object>(mountingSystemJson);

            var responseData = new
            {
                outputs = outputsObj,
                mounting_system = mountingSystemObj
            };

            return Ok(new SuccessResponse<object>(data: responseData));
        }

        return BadRequest(new ErrorResponse<string>(422, "Brak pola 'outputs' lub 'mounting_system' w odpowiedzi API"));
       
        
    }


    [HttpPost("statistics")]
    public async Task<IActionResult> Statistics([FromBody] StatisticsDto input)
    {
        if(input.MonthlyData.Count == 0 || input.TotalData.Count == 0)
            return UnprocessableEntity(new ErrorResponse<string>(422, "Dane miesięczne bądź dane ogólne są puste"));

        var dataByMonth = input.MonthlyData
            .GroupBy(item => item.Month)
            .Select(g => new MonthAverageData
            {
                month = g.Key,
                ed = g.Average(item => item.Ed),
                em = g.Average(item => item.Em),
                hid = g.Average(item => item.Hid),
                sdm = g.Average(item => item.Sdm),
            }).ToList();

        var dataByTotal = new TotalAverageData
        {
            ed = input.TotalData.Average(item => item.Ed),
            em = input.TotalData.Average(item => item.Em),
            ey= input.TotalData.Average(item => item.Ey),
            hid= input.TotalData.Average(item => item.Hid),
            him= input.TotalData.Average(item => item.Him),
            hiy= input.TotalData.Average(item => item.Hiy),
            sdm= input.TotalData.Average(item => item.Sdm),
            sdy= input.TotalData.Average(item => item.Sdy),
            laoi= input.TotalData.Average(item => item.laoi),
            lspec = input.TotalData.Average(item => item.lspec),
            ltg = input.TotalData.Average(item => item.ltg),
            ltotal = input.TotalData.Average(item => item.ltotal),
        };

        return Ok(new SuccessResponse<StatisticAverageData>(data: new StatisticAverageData
        {
            monthlyAverage = dataByMonth,
            totalAverage = dataByTotal,
        }));
    }
}
