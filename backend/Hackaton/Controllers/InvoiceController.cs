using Hackaton.DTOs;
using Hackaton.DTOs.FormattedStatistics;
using Hackaton.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/pdf")]
public class PdfApiController : ControllerBase
{
    private readonly IPdfGenerator _pdfGenerator;

    public PdfApiController(IPdfGenerator pdfGenerator)
    {
        _pdfGenerator = pdfGenerator;
    }

    [HttpPost("statistics")]
    public IActionResult GenerateStatisticsPdf([FromBody] StatisticAverageData model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var pdfBytes = _pdfGenerator.GenerateStatisticsPdf(model);

        return File(pdfBytes, "application/pdf", "statistics-report.pdf");
    }
}