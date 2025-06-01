namespace Hackaton.DTOs.FormattedStatistics;

public class StatisticAverageData
{
    public List<MonthAverageData> monthlyAverage { get; set; }
    public TotalAverageData totalAverage { get; set; }
}