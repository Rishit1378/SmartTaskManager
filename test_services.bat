@echo off
echo ========================================
echo Testing Services
echo ========================================

echo.
echo Testing Python Service (http://localhost:5002)...
curl -s http://localhost:5002 > nul
if %errorlevel% equ 0 (
    echo ✓ Python Service is running
) else (
    echo ✗ Python Service is NOT running
)

echo.
echo Testing .NET API (http://localhost:8080)...
curl -s http://localhost:8080/swagger > nul
if %errorlevel% equ 0 (
    echo ✓ .NET API is running
) else (
    echo ✗ .NET API is NOT running
)

echo.
echo Testing Frontend (http://localhost:3000)...
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is NOT running
)

echo.
pause