@echo off
REM Pure Life Compass Quiz - Windows Production Deployment Script
REM This script handles the complete deployment process on Windows

echo 🚀 Starting Pure Life Compass Quiz Deployment...

REM Check if .env.production exists
if not exist ".env.production" (
    echo [ERROR] .env.production file not found!
    echo [WARNING] Please copy .env.production template and fill in your actual credentials
    exit /b 1
)

REM Check for placeholder values
findstr /C:"your_actual_ghl_api_key_here" .env.production >nul
if %errorlevel% == 0 (
    echo [ERROR] Production environment not configured!
    echo [WARNING] Please replace placeholder values in .env.production with your actual GHL credentials
    exit /b 1
)

echo [INFO] Validating production environment variables... ✅

REM Build Docker image
echo [INFO] Building Docker image...
docker build -t pure-life-compass-quiz:latest .
if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed!
    exit /b 1
)
echo [SUCCESS] Docker image built successfully ✅

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose -f docker-compose.prod.yml down 2>nul

REM Start production services
echo [INFO] Starting production services...
docker-compose -f docker-compose.prod.yml up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services!
    exit /b 1
)

REM Wait for services to be ready
echo [INFO] Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Health check
echo [INFO] Performing health check...
set /a attempts=0
:healthcheck
set /a attempts+=1
curl -f http://localhost:3000/api/health-check >nul 2>&1
if %errorlevel% == 0 (
    echo [SUCCESS] Health check passed! ✅
    goto :healthcheck_passed
)
if %attempts% geq 30 (
    echo [ERROR] Health check failed after 30 attempts
    echo [WARNING] Check logs: docker-compose -f docker-compose.prod.yml logs
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto :healthcheck

:healthcheck_passed
echo [SUCCESS] 🎉 Deployment completed successfully!
echo [INFO] Your Pure Life Compass Quiz is now running at:
echo [INFO] - API: http://localhost:3000
echo [INFO] - Health Check: http://localhost:3000/api/health-check
echo.
echo [INFO] Useful commands:
echo [INFO] - View logs: docker-compose -f docker-compose.prod.yml logs -f
echo [INFO] - Stop services: docker-compose -f docker-compose.prod.yml down
echo [INFO] - Restart services: docker-compose -f docker-compose.prod.yml restart
echo.
echo ✅ Deployment complete!
pause