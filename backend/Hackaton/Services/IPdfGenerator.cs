using Hackaton.DTOs;
using Hackaton.DTOs.FormattedStatistics;

namespace Hackaton.Services;

public interface IPdfGenerator
{
    byte[] GenerateInvoicePdf(InvoiceModel model);
    byte[] GenerateStatisticsPdf(StatisticAverageData data);
    byte[] GenerateStatisticsPdf(StatisticsDto model);
}