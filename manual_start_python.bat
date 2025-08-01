@echo off
echo Starting Python Flask Service...
cd PythonService

echo Creating virtual environment...
if not exist venv (
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install flask flask-cors python-dateutil

echo Starting Flask service...
echo Service will be available at: http://localhost:5002
python app.py

pause