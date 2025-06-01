using OpenAI;
using OpenAI.Chat;

public class OpenAiService
{
    private readonly ChatClient _api;

    public OpenAiService(IConfiguration config)
    {
        var key = config["OpenAI:ApiKey"];
        _api = new(model:"gpt-3.5-turbo", apiKey:key);
    }

    public async Task<string> AskChatAsync(string message)
    {
       ChatCompletion result = await _api.CompleteChatAsync(message);
       
       return result.Content[0].Text;
    }
}