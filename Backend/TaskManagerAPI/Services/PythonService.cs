using System.Text;
using System.Text.Json;

namespace TaskManagerAPI.Services
{
    public class PythonService : IPythonService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<PythonService> _logger;
        
        public PythonService(HttpClient httpClient, ILogger<PythonService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }
        
        public async Task<PriorityAnalysisResult> AnalyzePriorityAsync(PriorityAnalysisRequest request)
        {
            try
            {
                var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
                
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("/analyze", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<PriorityAnalysisResult>(responseJson, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });
                    
                    return result ?? new PriorityAnalysisResult
                    {
                        SuggestedPriority = "Medium",
                        Reason = "Default priority",
                        Confidence = 0.5
                    };
                }
                else
                {
                    _logger.LogWarning("Python service returned error: {StatusCode}", response.StatusCode);
                    return GetDefaultPriority();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Python service");
                return GetDefaultPriority();
            }
        }
        
        private static PriorityAnalysisResult GetDefaultPriority()
        {
            return new PriorityAnalysisResult
            {
                SuggestedPriority = "Medium",
                Reason = "Python service unavailable",
                Confidence = 0.5
            };
        }
    }
}