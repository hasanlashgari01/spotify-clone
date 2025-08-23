@echo off
echo Cleaning project...
echo.

echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules

echo Removing package-lock.json...
if exist package-lock.json del package-lock.json

echo Removing .vite cache...
if exist .vite rmdir /s /q .vite

echo Removing dist folder...
if exist dist rmdir /s /q dist

echo.
echo Installing dependencies...
npm install

echo.
echo Done! You can now run: npm run dev
pause

