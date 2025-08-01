using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagerAPI.Models.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        
        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        
        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                var userId = GetUserId();
                var tasks = await _taskService.GetTasksByUserIdAsync(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(string id)
        {
            try
            {
                var userId = GetUserId();
                var task = await _taskService.GetTaskByIdAsync(id, userId);
                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskCreateDto taskDto)
        {
            try
            {
                var userId = GetUserId();
                var result = await _taskService.CreateTaskAsync(taskDto, userId);
                if (result.Success)
                {
                    return CreatedAtAction(nameof(GetTask), new { id = result.Data.Id }, result.Data);
                }
                return BadRequest(new { message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(string id, [FromBody] TaskUpdateDto taskDto)
        {
            try
            {
                var userId = GetUserId();
                var result = await _taskService.UpdateTaskAsync(id, taskDto, userId);
                if (result.Success)
                {
                    return Ok(result.Data);
                }
                return BadRequest(new { message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(string id)
        {
            try
            {
                var userId = GetUserId();
                var result = await _taskService.DeleteTaskAsync(id, userId);
                if (result.Success)
                {
                    return Ok(new { message = "Task deleted successfully" });
                }
                return BadRequest(new { message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}