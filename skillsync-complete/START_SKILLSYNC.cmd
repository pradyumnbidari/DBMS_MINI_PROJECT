@echo off
setlocal
cd /d "%~dp0"
echo ===== SkillSync: safe local setup and run =====
if not exist ".env.local" (
  if exist "..\skillsync-app\.env.local" (
    copy /Y "..\skillsync-app\.env.local" ".env.local" >nul
    echo Copied working connection settings from sibling skillsync-app folder.
  ) else (
    echo ERROR: .env.local missing. Copy it from your existing skillsync-app folder.
    echo See README.md. Do not paste passwords into the chat.
    pause
    exit /b 1
  )
)
call npm install
if errorlevel 1 goto failed
call npm run setup:db
if errorlevel 1 goto failed
call npm run verify
if errorlevel 1 goto failed
echo Starting website. Open http://localhost:3000
call npm run dev
exit /b %errorlevel%
:failed
echo An earlier step failed; see the error text above.
pause
exit /b 1
