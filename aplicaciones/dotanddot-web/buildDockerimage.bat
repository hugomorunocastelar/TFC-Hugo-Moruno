@echo off

echo Login de Docker:
call docker login -u hugomoru5 -p moru5-docker
if ERRORLEVEL 1 (
    echo Error login de Docker
    pause
    exit /b 1
)

echo Ejecutando build del proyecto...
call npm run build
if ERRORLEVEL 1 (
    echo Error en npm run build 
    pause
    exit /b 1
)

echo Construyendo la imagen Docker...
docker build -t hugomoru5/dotdot-front .
if ERRORLEVEL 1 (
    echo Error en docker build
    pause
    exit /b 1
)

echo Etiquetando la imagen como 'latest'...
docker tag hugomoru5/dotdot-front hugomoru5/dotdot-front:latest
if ERRORLEVEL 1 (
    echo Error en docker tag
    pause
    exit /b 1
)

echo Pusheando la imagen a Docker Hub...
docker push hugomoru5/dotdot-front:latest
if ERRORLEVEL 1 (
    echo Error en docker push
    pause
    exit /b 1
)

echo.
echo Proceso completado con exito.
pause
