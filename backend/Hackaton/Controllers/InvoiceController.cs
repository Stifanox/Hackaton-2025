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

    [HttpPost("invoice")]
    public IActionResult GenerateInvoicePdf([FromBody] InvoiceModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var pdfBytes = _pdfGenerator.GenerateInvoicePdf(model);

        return File(pdfBytes, "application/pdf", "invoice.pdf");
    }
}