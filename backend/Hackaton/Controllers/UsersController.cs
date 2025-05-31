using Microsoft.AspNetCore.Mvc;

namespace Hackaton.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(new[] { "Alice", "Bob" });
    }
}