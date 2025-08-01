using TaskManagerAPI.Models.DTOs;

namespace TaskManagerAPI.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskResponseDto>> GetTasksByUserIdAsync(string userId);
        Task<TaskResponseDto?> GetTaskByIdAsync(string taskId, string userId);
        Task<ServiceResult<TaskResponseDto>> CreateTaskAsync(TaskCreateDto taskDto, string userId);
        Task<ServiceResult<TaskResponseDto>> UpdateTaskAsync(string taskId, TaskUpdateDto taskDto, string userId);
        Task<ServiceResult<string>> DeleteTaskAsync(string taskId, string userId);
    }
}