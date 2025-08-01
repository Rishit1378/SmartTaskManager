# Smart Task Manager - Full Stack Application

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: .NET Core Web API (C#)
- **Microservice**: Python Flask
- **Database**: SQL Server

## Project Structure

```
SmartTaskManager/
├── Frontend/                 # HTML/CSS/JS Frontend
├── Backend/                  # .NET Core Web API
├── PythonService/           # Flask Microservice
└── Database/                # SQL Scripts
```

## Prerequisites

### 1. Install .NET Core SDK

- Download from: https://dotnet.microsoft.com/download
- Version: .NET 6.0 or later

### 2. Install Python

- Download from: https://python.org/downloads
- Version: Python 3.8 or later
- Make sure to add Python to PATH

### 3. Install SQL Server

- **Option A**: SQL Server Express (Free)
  - Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- **Option B**: SQL Server LocalDB (Lightweight)
  - Included with Visual Studio or download separately

### 4. Install Visual Studio Code or Visual Studio

- VS Code: https://code.visualstudio.com/
- Visual Studio Community: https://visualstudio.microsoft.com/

## Setup Instructions

### Step 1: Create the Project Structure

```bash
mkdir SmartTaskManager
cd SmartTaskManager
mkdir Frontend Backend PythonService Database
```

### Step 2: Setup .NET Core Backend

```bash
cd Backend
dotnet new webapi -n TaskManagerAPI
cd TaskManagerAPI
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Swashbuckle.AspNetCore
```

### Step 3: Setup Python Flask Service

```bash
cd ../../PythonService
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install flask flask-cors requests python-dateutil
```

### Step 4: Setup Database

- Create a new database named `TaskManagerDB` in SQL Server
- Or use the connection string for LocalDB provided in the code

## Running the Application

### 1. Start the Database

- Ensure SQL Server is running
- The application will create tables automatically on first run

### 2. Start the .NET Core API

```bash
cd Backend/TaskManagerAPI
dotnet restore
dotnet ef database update
dotnet run
```

- API will run on: https://localhost:8080
- Swagger UI: https://localhost:8080/swagger

### 3. Start the Python Flask Service

```bash
cd PythonService
# Activate virtual environment first
python app.py
```

- Flask service will run on: http://localhost:5002

### 4. Start the Frontend

- Open `Frontend/index.html` in a web browser
- Or use a local server:

```bash
cd Frontend
python -m http.server 8000
```

- Frontend will be available at: http://localhost:8000

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Tasks

- GET `/api/tasks` - Get all tasks for user
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/{id}` - Update task
- DELETE `/api/tasks/{id}` - Delete task

### Python Service

- POST `/analyze` - Get priority suggestion

## Environment Variables

### Backend (.NET Core)

Create `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskManagerDB;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here-make-it-long-and-secure",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerClient"
  },
  "PythonServiceUrl": "http://localhost:5002"
}
```

### Python Service

Create `.env` file:

```
FLASK_ENV=development
FLASK_DEBUG=True
```

## Troubleshooting

### Common Issues:

1. **Port Conflicts**: Change ports in configuration if needed
2. **CORS Issues**: Ensure CORS is properly configured in .NET API
3. **Database Connection**: Verify SQL Server is running and connection string is correct
4. **Python Dependencies**: Make sure virtual environment is activated

### Database Issues:

```bash
# Reset database
cd Backend/TaskManagerAPI
dotnet ef database drop
dotnet ef database update
```

## Features Implemented

✅ JWT Authentication (Register/Login)
✅ Task CRUD Operations
✅ Smart Priority Suggestions (Python Flask)
✅ Responsive UI with Bootstrap
✅ Live Search and Filtering
✅ RESTful API with Swagger Documentation
✅ Entity Framework with SQL Server
✅ Microservice Communication

## Next Steps

1. Deploy to Azure App Services
2. Add real-time notifications with SignalR
3. Implement task categories and tags
4. Add email notifications for deadlines
5. Implement task analytics dashboard
#
