@echo off
echo ========================================
echo Smart Task Manager - Service Startup
echo ========================================

echo.
echo Checking prerequisites...

echo.
echo 1. Checking .NET SDK...
dotnet --version
if %errorlevel% neq 0 (
    echo ERROR: .NET SDK not found. Please install .NET 6.0 SDK from https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

echo.
echo 2. Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python from https://python.org/downloads
    pause
    exit /b 1
)

echo.
echo 3. Setting up Python virtual environment...
cd PythonService
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install flask flask-cors python-dateutil
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python packages
    pause
    exit /b 1
)

echo.
echo 4. Setting up .NET project...
cd ..\Backend\TaskManagerAPI
dotnet restore
if %errorlevel% neq 0 (
    echo ERROR: Failed to restore .NET packages
    pause
    exit /b 1
)

dotnet build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build .NET project
    pause
    exit /b 1
)

echo.
echo ========================================
echo All prerequisites checked successfully!
echo ========================================
echo.
echo Starting services...
echo.
echo 1. Starting Python Flask service...
start "Python Service" cmd /k "cd /d %CD%\..\..\PythonService && venv\Scripts\activate && python app.py"

echo.
echo 2. Waiting 3 seconds for Python service to start...
timeout /t 3 /nobreak > nul

echo.
echo 3. Starting .NET Core API...
start "NET API" cmd /k "cd /d %CD% && dotnet run"

echo.
echo 4. Waiting 5 seconds for API to start...
timeout /t 5 /nobreak > nul

echo.
echo 5. Starting Frontend...
start "Frontend" cmd /k "cd /d %CD%\..\..\Frontend && python -m http.server 8000"

echo.
echo ========================================
echo Services are starting up...
echo ========================================
echo.
echo Please wait a moment, then check:
echo - Frontend: http://localhost:8000
echo - API Swagger: http://localhost:8080/swagger
echo - Python Service: http://localhost:5002
echo.
echo If any service fails to start, check the individual terminal windows for error messages.
echo.
pause