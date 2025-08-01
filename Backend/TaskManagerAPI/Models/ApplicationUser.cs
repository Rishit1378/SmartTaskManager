using Microsoft.AspNetCore.Identity;

namespace TaskManagerAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}