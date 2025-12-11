@echo off
echo ========================================
echo   DESPLEGAR EDGE FUNCTION A SUPABASE
echo ========================================
echo.

echo Paso 1: Verificando Supabase CLI...
call npx supabase --version
if errorlevel 1 (
    echo ERROR: Supabase CLI no esta disponible
    echo Instalando Supabase CLI...
    call npm install -g supabase
)

echo.
echo Paso 2: Desplegando funcion auditar-pdf...
call npx supabase functions deploy auditar-pdf

echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo Ahora puedes usar la aplicacion normalmente.
echo Reinicia el servidor de desarrollo (npm run dev) si es necesario.
echo.
pause
