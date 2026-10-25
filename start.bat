@echo off
title Solace Launcher
echo ========================================================
echo                 SOLACE MUSIC SYSTEM LAUNCHER
echo ========================================================
echo.

echo [1/2] Launching Lavalink v4 Audio Node...
start "Solace - Lavalink Audio Node" cmd /k "cd lavalink && java -jar Lavalink.jar"

echo Waiting 5 seconds for Lavalink to initialize...
timeout /t 5 /nobreak >nul

echo [2/2] Launching Solace Discord Bot Client...
start "Solace - Discord Bot Client" cmd /k "npm run dev:bot"

echo.
echo Both services are now running in dedicated terminal windows!
echo To test, join a voice channel in your Discord server and type /play
echo.
pause
