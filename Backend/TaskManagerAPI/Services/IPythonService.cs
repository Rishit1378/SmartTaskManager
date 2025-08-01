namespace TaskManagerAPI.Services
{
    public interface IPythonService
    {
        Task<PriorityAnalysisResult> AnalyzePriorityAsync(PriorityAnalysisRequest request);
    }
    
    public class PriorityAnalysisRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? Deadline { get; set; }
    }
    
    public class PriorityAnalysisResult
    {
        public string SuggestedPriority { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}