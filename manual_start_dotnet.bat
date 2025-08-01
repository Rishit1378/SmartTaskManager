@echo off
echo Starting .NET Core API...
cd Backend\TaskManagerAPI


echo Restoring packages...
dotnet restore

echo Building project...
dotnet build

echo Starting API...
echo API will be available at: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger
dotnet run

pause