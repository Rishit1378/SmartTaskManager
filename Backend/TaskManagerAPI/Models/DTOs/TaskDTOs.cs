using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models.DTOs
{
    public class TaskCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [Required]
        public string Priority { get; set; } = "Medium";
        
        public DateTime? Deadline { get; set; }
        
        public bool IsCompleted { get; set; } = false;
    }
    
    public class TaskUpdateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [Required]
        public string Priority { get; set; } = "Medium";
        
        public DateTime? Deadline { get; set; }
        
        public bool IsCompleted { get; set; } = false;
    }
    
    public class TaskResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = string.Empty;
        public DateTime? Deadline { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}