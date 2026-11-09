@echo off
cd /d "%~dp0"
if not exist ".env.local" (
  echo ERROR: .env.local missing. Extract this patch INTO your skillsync-complete folder.
  pause
  exit /b 1
)
call npm run setup:db
if errorlevel 1 goto fail
node --env-file=.env.local scripts/seed-demo.mjs
if errorlevel 1 goto fail
call npm run verify
if errorlevel 1 goto fail
call npm run check
if errorlevel 1 goto fail
call npm run build
if errorlevel 1 goto fail
echo.
echo ALL CHECKS PASSED. Now type: npm run dev
pause
exit /b 0
:fail
echo.
echo A CHECK FAILED. Read error above. Existing records were not reset.
pause
exit /b 1
