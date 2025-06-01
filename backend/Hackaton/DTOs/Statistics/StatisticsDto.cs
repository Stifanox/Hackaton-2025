using System.ComponentModel.DataAnnotations;

namespace Hackaton.DTOs;

public class StatisticsDto
{
    [Required]
    public List<MonthlyDataItem> MonthlyData { get; set; }
    [Required]
    public List<TotalDataItem> TotalData { get; set; }
}