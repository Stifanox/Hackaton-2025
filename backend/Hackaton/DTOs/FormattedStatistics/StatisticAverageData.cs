namespace Hackaton.DTOs.FormattedStatistics;

public class StatisticAverageData
{
    public List<MonthAverageData> MonthlyAverage { get; set; }
    public TotalAverageData TotalAverage { get; set; }
}