@echo off
title BlackSecurity Web - Desenvolvimento
color 0B

echo ================================================
echo Iniciando BlackSecurity Web
echo ================================================
echo.

cd /d "%~dp0"

echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Instale Node.js de: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

echo Verificando dependencias...
if not exist "node_modules" (
    echo [INFO] Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando servidor web...
echo.
echo URL: http://localhost:3000
echo API: http://108.165.179.162:5000/api
echo.
echo Pressione Ctrl+C para parar
echo.

npm run dev

pause

