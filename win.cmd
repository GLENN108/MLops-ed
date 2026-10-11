@echo off
setlocal

echo Starting development servers...

REM -------------------------
REM Server
REM -------------------------

start "SERVER" cmd /k "uvicorn server.main:app --reload --port 5000"

echo.
echo Development servers started.
echo.
echo Client: http://localhost:5173
echo Server: http://localhost:5000
echo.
echo Close the CLIENT and SERVER windows to stop the servers.

pause
