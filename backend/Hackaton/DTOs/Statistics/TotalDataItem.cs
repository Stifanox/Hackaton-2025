using System.ComponentModel.DataAnnotations;

namespace Hackaton.DTOs;

public class TotalDataItem
{
    [Required]
    public double Ed { get; set; }
    [Required]
    public double Em { get; set; }
    [Required]
    public double Ey { get; set; }
    [Required]
    public double Hid { get; set; }
    [Required]
    public double Him { get; set; }
    [Required]
    public double Hiy { get; set; }
    [Required]
    public double Sdm { get; set; }
    [Required]
    public double Sdy { get; set; }
    [Required]
    public double laoi { get; set; }
    [Required]
    public double lspec { get; set; }
    [Required]
    public double ltg { get; set; }
    [Required]
    public double ltotal { get; set; }
}