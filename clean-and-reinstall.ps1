Write-Host "Cleaning project..." -ForegroundColor Green
Write-Host ""

Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }

Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" }

Write-Host "Removing .vite cache..." -ForegroundColor Yellow
if (Test-Path ".vite") { Remove-Item -Recurse -Force ".vite" }

Write-Host "Removing dist folder..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "Done! You can now run: npm run dev" -ForegroundColor Green
Read-Host "Press Enter to continue"

