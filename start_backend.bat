@echo off
echo Starting .NET Core Backend...
cd Backend\TaskManagerAPI
echo Backend will be available at: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger
dotnet run
pause