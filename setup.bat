@echo off
echo Setting up Smart Task Manager...

echo.
echo 1. Setting up .NET Core Backend...
cd Backend\TaskManagerAPI
dotnet restore
if %errorlevel% neq 0 (
    echo Failed to restore .NET packages
    pause
    exit /b 1
)

echo.
echo 2. Setting up Python Flask Service...
cd ..\..\PythonService
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python packages
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To run the application:
echo 1. Start SQL Server (LocalDB or Express)
echo 2. Run start_backend.bat to start the .NET API
echo 3. Run start_python.bat to start the Python service
echo 4. Open Frontend\index.html in your browser
echo.
pause