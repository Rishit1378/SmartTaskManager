using TaskManagerAPI.Models.DTOs;

namespace TaskManagerAPI.Services
{
    public interface IAuthService
    {
        Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto loginDto);
        Task<ServiceResult<string>> RegisterAsync(RegisterDto registerDto);
    }
    
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T Data { get; set; } = default(T)!;
        
        public static ServiceResult<T> SuccessResult(T data, string message = "")
        {
            return new ServiceResult<T> { Success = true, Data = data, Message = message };
        }
        
        public static ServiceResult<T> FailureResult(string message)
        {
            return new ServiceResult<T> { Success = false, Message = message };
        }
    }
}