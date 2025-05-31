public class HttpClientPV{
private readonly HttpClient _httpClient;

    public HttpClientPV(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GetPvDataAsync()
    {
        var url = "https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=45&lon=8&peakpower=1&loss=14&mountingplace=building&optimalangles=1&outputformat=json";

        var response = await _httpClient.GetAsync(url);

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync();
    }
}

