@echo off
echo.
echo ========================================
echo  FlyNova ACARS Tracker - Build Script
echo ========================================
echo.
echo Verification des prerequis...
echo.

:: Verifier Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe!
    echo Telechargez-le sur https://nodejs.org/
    pause
    exit /b 1
)

:: Verifier npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas installe!
    pause
    exit /b 1
)

echo [OK] Node.js et npm sont installes
echo.

:: Verifier les dependances
if not exist "node_modules\" (
    echo Installation des dependances...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Echec de l'installation des dependances
        pause
        exit /b 1
    )
)

echo [OK] Dependances installees
echo.

:: Verifier l'icone
if not exist "build\icon.ico" (
    echo [ATTENTION] Icone manquante: build\icon.ico
    echo L'application utilisera l'icone par defaut Electron
    echo.
    echo Pour ajouter une icone personnalisee:
    echo 1. Creez une image 512x512px
    echo 2. Convertissez-la en .ico
    echo 3. Placez-la dans build\icon.ico
    echo.
    timeout /t 5
)

:: Nettoyer le dossier dist precedent
if exist "dist\" (
    echo Nettoyage du dossier dist...
    rmdir /s /q dist
    echo [OK] Dossier dist nettoye
    echo.
)

:: Verifier la configuration de l'API
findstr /C:"https://flynova-backend-production.up.railway.app" "src\services\api.js" >nul
if %errorlevel% neq 0 (
    echo.
    echo [ATTENTION] L'API ne semble pas configuree pour la PRODUCTION!
    echo.
    echo Verifiez que src\services\api.js contient:
    echo const API_BASE_URL = 'https://flynova-backend-production.up.railway.app/api/acars';
    echo.
    choice /C YN /M "Voulez-vous continuer quand meme"
    if errorlevel 2 exit /b 0
    echo.
)

:: Lancer le build
echo ========================================
echo  Demarrage du build...
echo ========================================
echo.
echo Cela peut prendre 5-10 minutes...
echo.

call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  BUILD TERMINE AVEC SUCCES!
    echo ========================================
    echo.
    echo L'installateur se trouve dans: dist\
    echo.
    dir dist\*.exe
    echo.
    echo Fichier principal:
    for %%f in (dist\*Setup*.exe) do echo   - %%f
    echo.
    echo ========================================
    choice /C YN /M "Voulez-vous ouvrir le dossier dist"
    if errorlevel 1 if not errorlevel 2 start explorer dist
) else (
    echo.
    echo ========================================
    echo  ERREUR DURANT LE BUILD!
    echo ========================================
    echo.
    echo Verifiez les erreurs ci-dessus
    echo.
)

echo.
pause
