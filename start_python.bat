@echo off
echo Starting Python Flask Service...
cd PythonService
echo Python service will be available at: http://localhost:5002
call venv\Scripts\activate
python app.py
pause