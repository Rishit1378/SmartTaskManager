# Troubleshooting Guide

## Common Issues and Solutions

### 1. .NET API Not Starting (Port 7001)

**Check if .NET is installed:**
```bash
dotnet --version
```

**If not installed:**
- Download .NET 6.0 SDK from: https://dotnet.microsoft.com/download
- Install and restart your command prompt

**Check if port is in use:**
```bash
netstat -ano | findstr :7001
```

**If port is occupied:**
- Kill the process: `taskkill /PID <PID_NUMBER> /F`
- Or change port in `Backend/TaskManagerAPI/Properties/launchSettings.json`

**Trust HTTPS certificate:**
```bash
dotnet dev-certs https --trust
```

### 2. Python Service Not Starting (Port 5001)

**Check if Python is installed:**
```bash
python --version
```

**If not installed:**
- Download Python from: https://python.org/downloads
- Make sure to check "Add Python to PATH" during installation

**Check if port is in use:**
```bash
netstat -ano | findstr :5001
```

**Manual Python setup:**
```bash
cd PythonService
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors python-dateutil
python app.py
```

### 3. Database Issues

**If using SQL Server:**
- Install SQL Server Express or LocalDB
- Update connection string in `appsettings.json`

**If using SQLite (recommended for testing):**
- No additional setup required
- Database file will be created automatically

### 4. CORS Issues

**If frontend can't connect to API:**
- Make sure all three services are running
- Check browser console for CORS errors
- Verify API is accessible at https://localhost:7001/swagger

### 5. Firewall/Antivirus Issues

**If services start but aren't accessible:**
- Temporarily disable Windows Firewall
- Add exceptions for ports 5001, 7001, and 8000
- Check antivirus software blocking connections

## Step-by-Step Manual Start

### Step 1: Start Python Service
```bash
cd PythonService
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors python-dateutil
python app.py
```
**Expected output:** "Service will be available at: http://localhost:5001"

### Step 2: Start .NET API
```bash
cd Backend\TaskManagerAPI
dotnet restore
dotnet build
dotnet run
```
**Expected output:** "Now listening on: https://localhost:7001"

### Step 3: Start Frontend
```bash
cd Frontend
python -m http.server 8000
```
**Expected output:** "Serving HTTP on 0.0.0.0 port 8000"

## Testing Services

**Test Python Service:**
```bash
curl http://localhost:5001
```

**Test .NET API:**
```bash
curl -k https://localhost:7001/swagger
```

**Test Frontend:**
```bash
curl http://localhost:8000
```

## Port Configuration

If you need to change ports, update these files:

**Python Service:** `PythonService/app.py` (line with `app.run`)
**API:** `Backend/TaskManagerAPI/Properties/launchSettings.json`
**Frontend:** Change the port in the python server command

Remember to update the API URLs in `Frontend/script.js` if you change API ports.