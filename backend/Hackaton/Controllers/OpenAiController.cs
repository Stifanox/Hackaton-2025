using Hackaton.DTOs;
using Hackaton.Helpers;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Hackaton.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpenAiController: ControllerBase
{
    private readonly OpenAiService _openAiService;

    public OpenAiController(OpenAiService openAiService)
    {
        _openAiService = openAiService;
    }

    [HttpPost("get-response")]
    public async Task<IActionResult> OpenAi([FromBody] MessageInput input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorResponse<string>(data:"Message not provided"));
        }
        var result = await _openAiService.AskChatAsync(input.Message);

        return Ok(new SuccessResponse<string>(data:result));
    }
}