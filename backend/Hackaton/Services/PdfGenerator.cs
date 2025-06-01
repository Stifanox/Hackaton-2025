using Hackaton.DTOs;
using Hackaton.DTOs.FormattedStatistics;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Hackaton.Services;

public class PdfGenerator : IPdfGenerator
{
    public byte[] GenerateInvoicePdf(InvoiceModel model)
    {
        return new byte[0];
    }

   public byte[] GenerateStatisticsPdf(StatisticsDto model)
{

    var monthlyAverages = model.MonthlyData
        .GroupBy(item => item.Month)
        .Select(g => new
        {
            Month = g.Key,
            Ed = g.Average(x => x.Ed),
            Em = g.Average(x => x.Em),
            Hid = g.Average(x => x.Hid),
            Sdm = g.Average(x => x.Sdm)
        })
        .OrderBy(x => x.Month)
        .ToList();
    
    var totalAverage = new
    {
        Ed = model.TotalData.Average(x => x.Ed),
        Em = model.TotalData.Average(x => x.Em),
        Ey = model.TotalData.Average(x => x.Ey),
        Hid = model.TotalData.Average(x => x.Hid),
        Him = model.TotalData.Average(x => x.Him),
        Hiy = model.TotalData.Average(x => x.Hiy),
        Sdm = model.TotalData.Average(x => x.Sdm),
        Sdy = model.TotalData.Average(x => x.Sdy),
        Laoi = model.TotalData.Average(x => x.laoi),
        Lspec = model.TotalData.Average(x => x.lspec),
        Ltg = model.TotalData.Average(x => x.ltg),
        Ltotal = model.TotalData.Average(x => x.ltotal),
    };

    var document = Document.Create(container =>
    {
        container.Page(page =>
        {
            page.Margin(40);
            page.Size(PageSizes.A4);

            page.Header()
                .Text("Raport statystyczny")
                .FontSize(22)
                .Bold()
                .AlignCenter();

            page.Content().PaddingVertical(10).Column(column =>
            {
                column.Spacing(15);
                
                column.Item().Text("Średnie miesięczne").FontSize(16).Bold();
                column.Item().PaddingBottom(5).Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(60);
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().PaddingBottom(10).Text("Miesiąc").Bold();
                        header.Cell().PaddingBottom(10).Text("Średnia dzienna produkcja").Bold().AlignCenter();
                        header.Cell().PaddingBottom(10).Text("Średnia miesięczna produkcja").Bold().AlignCenter();
                        header.Cell().PaddingBottom(10).Text("Średnie dzienne napromieniowanie").Bold().AlignCenter();
                        header.Cell().PaddingBottom(10).Text("Odchylenie standardowe miesięczne").Bold().AlignCenter();
                    });

                    foreach (var item in monthlyAverages)
                    {
                        table.Cell().Text(new System.Globalization.CultureInfo("pl-PL").DateTimeFormat.GetMonthName(item.Month));
                        table.Cell().PaddingBottom(5).Text(item.Ed.ToString("F2")).AlignCenter();
                        table.Cell().PaddingBottom(5).Text(item.Em.ToString("F2")).AlignCenter();
                        table.Cell().PaddingBottom(5).Text(item.Hid.ToString("F2")).AlignCenter();
                        table.Cell().PaddingBottom(5).Text(item.Sdm.ToString("F2")).AlignCenter();
                    }
                });
                
                column.Item().PaddingTop(20).Text("Średnie totalne").FontSize(16).Bold();
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(30);
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().PaddingBottom(10).Text("#").Bold();
                        header.Cell().PaddingBottom(10).Text("Opis").Bold();
                        header.Cell().PaddingBottom(10).Text("Wartość").Bold().AlignRight();
                    });

                    void AddRow(int index, string label, double value)
                    {
                        table.Cell().Text(index.ToString());
                        table.Cell().PaddingBottom(5).Text(label);
                        table.Cell().PaddingBottom(5).Text(value.ToString("F2")).AlignRight();
                    }

                    int idx = 1;
                    AddRow(idx++, "Średnia dzienna produkcja", totalAverage.Ed);
                    AddRow(idx++, "Średnia miesięczna produkcja", totalAverage.Em);
                    AddRow(idx++, "Średnia roczna produkcja", totalAverage.Ey);
                    AddRow(idx++, "Średnie dzienne napromieniowanie", totalAverage.Hid);
                    AddRow(idx++, "Średnie miesięczne napromieniowanie", totalAverage.Him);
                    AddRow(idx++, "Średnie roczne napromieniowanie", totalAverage.Hiy);
                    AddRow(idx++, "Odchylenie standardowe zmienności miesięcznej", totalAverage.Sdm);
                    AddRow(idx++, "Odchylenie standardowe zmienności rok do roku", totalAverage.Sdy);
                    AddRow(idx++, "Straty z płytkiego kąta padania światła", totalAverage.Laoi);
                    AddRow(idx++, "Straty z widma promieniowania słonecznego", totalAverage.Lspec);
                    AddRow(idx++, "Straty z niskiego natężenia promieniowania", totalAverage.Ltg);
                    AddRow(idx++, "Całkowite straty", totalAverage.Ltotal);
                });
            });

            page.Footer()
                .AlignCenter()
                .Text("Generated by Hackaton Platform – QuestPDF");
        });
    });

    return document.GeneratePdf();
}


}
