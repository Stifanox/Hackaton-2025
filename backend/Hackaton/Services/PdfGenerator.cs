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
        return new byte[0]; // Placeholder
    }

    public byte[] GenerateStatisticsPdf(StatisticsDto model)
    {
        var dataByMonth = model.MonthlyData
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
            ed = model.TotalData.Average(item => item.Ed),
            em = model.TotalData.Average(item => item.Em),
            ey = model.TotalData.Average(item => item.Ey),
            hid = model.TotalData.Average(item => item.Hid),
            him = model.TotalData.Average(item => item.Him),
            hiy = model.TotalData.Average(item => item.Hiy),
            sdm = model.TotalData.Average(item => item.Sdm),
            sdy = model.TotalData.Average(item => item.Sdy),
            laoi = model.TotalData.Average(item => item.laoi),
            lspec = model.TotalData.Average(item => item.lspec),
            ltg = model.TotalData.Average(item => item.ltg),
            ltotal = model.TotalData.Average(item => item.ltotal),
        };

        var averageData = new StatisticAverageData
        {
            monthlyAverage = dataByMonth,
            totalAverage = dataByTotal
        };

        return GenerateStatisticsPdf(averageData); // delegacja do drugiej metody
    }

    public byte[] GenerateStatisticsPdf(StatisticAverageData data)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(40);
                page.Size(PageSizes.A4);

                page.Header()
                    .Text("Statistics Report")
                    .FontSize(22)
                    .Bold()
                    .AlignCenter();

                page.Content().PaddingVertical(10).Column(column =>
                {
                    column.Spacing(15);

                    column.Item().Text("Monthly Averages").FontSize(16).Bold();
                    column.Item().Table(table =>
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
                            header.Cell().Text("Month").Bold();
                            header.Cell().Text("Ed").Bold();
                            header.Cell().Text("Em").Bold();
                            header.Cell().Text("Hid").Bold();
                            header.Cell().Text("Sdm").Bold();
                        });

                        foreach (var item in data.monthlyAverage.OrderBy(m => m.month))
                        {
                            table.Cell().Text(System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(item.month));
                            table.Cell().Text(item.ed.ToString("F2"));
                            table.Cell().Text(item.em.ToString("F2"));
                            table.Cell().Text(item.hid.ToString("F2"));
                            table.Cell().Text(item.sdm.ToString("F2"));
                        }
                    });

                    column.Item().PaddingTop(20).Text("Total Averages").FontSize(16).Bold();

                    column.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        void AddRow(string label, double value)
                        {
                            table.Cell().Text(label);
                            table.Cell().Text(value.ToString("F2"));
                        }

                        var t = data.totalAverage;

                        AddRow("Ed", t.ed);
                        AddRow("Em", t.em);
                        AddRow("Ey", t.ey);
                        AddRow("Hid", t.hid);
                        AddRow("Him", t.him);
                        AddRow("Hiy", t.hiy);
                        AddRow("Sdm", t.sdm);
                        AddRow("Sdy", t.sdy);
                        AddRow("Laoi", t.laoi);
                        AddRow("Lspec", t.lspec);
                        AddRow("Ltg", t.ltg);
                        AddRow("Ltotal", t.ltotal);
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
