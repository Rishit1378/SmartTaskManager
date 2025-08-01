@echo off
echo Starting Frontend Server...
cd Frontend
echo Frontend will be available at: http://localhost:3000
python -m http.server 3000
pause