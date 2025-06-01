using System.ComponentModel.DataAnnotations;

namespace Hackaton.DTOs;

public class MessageInput
{
    [Required]
    public string Message { get; set; }
}