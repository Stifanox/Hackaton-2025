using System.ComponentModel.DataAnnotations;

namespace Hackaton.DTOs;

public class MonthlyDataItem
{
    [Required]
    public int Month { get; set; }
    [Required]
    public double Ed { get; set; }
    [Required]
    public double Em { get; set; }
    [Required]
    public double Hid { get; set; }
    [Required]
    public double Sdm { get; set; }
}