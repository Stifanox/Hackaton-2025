using Hackaton.Services;
using QuestPDF.Fluent;
namespace Hackaton.Services;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

public class PdfGenerator : IPdfGenerator
{
    public byte[] GenerateInvoicePdf(InvoiceModel model)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(50);

                page.Header()
                    .Text("Summary")
                    .FontSize(20)
                    .Bold()
                    .AlignCenter();

                page.Content()
                    .Column(column =>
                    {
                        column.Spacing(5);

                        column.Item().Text($"Customer: {model.CustomerName}");
                        column.Item().Text($"Date: {model.Date:yyyy-MM-dd}");
                        column.Item().Text($"Amount: {model.Amount:C}");

                        // możesz dodać więcej danych i stylów
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(text =>
                    {
                        text.Span("Generated with QuestPDF");
                    });
            });
        });

        return document.GeneratePdf();
    }
}