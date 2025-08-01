using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;
using TaskManagerAPI.Models.DTOs;

namespace TaskManagerAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;
        
        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<TaskResponseDto>> GetTasksByUserIdAsync(string userId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Deadline = t.Deadline,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .ToListAsync();
                
            return tasks;
        }
        
        public async Task<TaskResponseDto?> GetTaskByIdAsync(string taskId, string userId)
        {
            var task = await _context.Tasks
                .Where(t => t.Id == taskId && t.UserId == userId)
                .Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Deadline = t.Deadline,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .FirstOrDefaultAsync();
                
            return task;
        }
        
        public async Task<ServiceResult<TaskResponseDto>> CreateTaskAsync(TaskCreateDto taskDto, string userId)
        {
            try
            {
                var task = new TaskItem
                {
                    Title = taskDto.Title,
                    Description = taskDto.Description,
                    Priority = taskDto.Priority,
                    Deadline = taskDto.Deadline,
                    IsCompleted = taskDto.IsCompleted,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();
                
                var responseDto = new TaskResponseDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    Priority = task.Priority,
                    Deadline = task.Deadline,
                    IsCompleted = task.IsCompleted,
                    CreatedAt = task.CreatedAt,
                    UpdatedAt = task.UpdatedAt
                };
                
                return ServiceResult<TaskResponseDto>.SuccessResult(responseDto, "Task created successfully");
            }
            catch (Exception ex)
            {
                return ServiceResult<TaskResponseDto>.FailureResult($"Failed to create task: {ex.Message}");
            }
        }
        
        public async Task<ServiceResult<TaskResponseDto>> UpdateTaskAsync(string taskId, TaskUpdateDto taskDto, string userId)
        {
            try
            {
                var task = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
                    
                if (task == null)
                {
                    return ServiceResult<TaskResponseDto>.FailureResult("Task not found");
                }
                
                task.Title = taskDto.Title;
                task.Description = taskDto.Description;
                task.Priority = taskDto.Priority;
                task.Deadline = taskDto.Deadline;
                task.IsCompleted = taskDto.IsCompleted;
                task.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                
                var responseDto = new TaskResponseDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    Priority = task.Priority,
                    Deadline = task.Deadline,
                    IsCompleted = task.IsCompleted,
                    CreatedAt = task.CreatedAt,
                    UpdatedAt = task.UpdatedAt
                };
                
                return ServiceResult<TaskResponseDto>.SuccessResult(responseDto, "Task updated successfully");
            }
            catch (Exception ex)
            {
                return ServiceResult<TaskResponseDto>.FailureResult($"Failed to update task: {ex.Message}");
            }
        }
        
        public async Task<ServiceResult<string>> DeleteTaskAsync(string taskId, string userId)
        {
            try
            {
                var task = await _context.Tasks
                    .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
                    
                if (task == null)
                {
                    return ServiceResult<string>.FailureResult("Task not found");
                }
                
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
                
                return ServiceResult<string>.SuccessResult("Task deleted successfully");
            }
            catch (Exception ex)
            {
                return ServiceResult<string>.FailureResult($"Failed to delete task: {ex.Message}");
            }
        }
    }
}