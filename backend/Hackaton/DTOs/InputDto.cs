using System.ComponentModel.DataAnnotations;

namespace Hackaton.DTOs;

public class InputDto
{
    [Required]
    public double Latitude { get; set; }

    [Required]
    public double Longitude { get; set; }

    [Required]
    public double PeakPower { get; set; }

    [Required]
    public double SystemLoss { get; set; }
    
    public bool? UseHorizon { get; set; }
    public string? MountingPlace { get; set; }
    public bool? Fixed { get; set; }
    public int? Angle { get; set; }
    public bool? OptimalAngles { get; set; }
    public string? OutputFormat { get; set; }
}