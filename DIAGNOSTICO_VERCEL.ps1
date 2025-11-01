# Script de diagnostico para verificar el deploy en Vercel
# Ejecutar: .\DIAGNOSTICO_VERCEL.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DIAGNOSTICO DE DEPLOY EN VERCEL" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Verificando endpoint de salud del backend..." -ForegroundColor Yellow
Write-Host ""

$apiUrl = "https://gestio-rv-automoviles.vercel.app/api/health"
Write-Host "  URL: $apiUrl" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Respuesta:" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor White
}
catch {
    Write-Host "  ERROR al conectar al backend" -ForegroundColor Red
    Write-Host "  Detalles: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Posibles causas:" -ForegroundColor Yellow
    Write-Host "  - El deploy aun no ha terminado (espera 2-3 minutos)" -ForegroundColor Gray
    Write-Host "  - Hay un error en el codigo del backend" -ForegroundColor Gray
    Write-Host "  - Las variables de entorno no estan configuradas" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Verificando frontend..." -ForegroundColor Yellow
Write-Host ""

$frontendUrl = "https://gestio-rv-automoviles.vercel.app"
Write-Host "  URL: $frontendUrl" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    if ($response.Content -match "<!doctype html" -or $response.Content -match "<!DOCTYPE html") {
        Write-Host "  Frontend cargado correctamente" -ForegroundColor Green
    }
    else {
        Write-Host "  ADVERTENCIA: Respuesta inesperada del frontend" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  ERROR al conectar al frontend" -ForegroundColor Red
    Write-Host "  Detalles: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   PROXIMOS PASOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ve a Vercel Dashboard:" -ForegroundColor White
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Abre tu proyecto: Gestio_RV_Automoviles" -ForegroundColor White
Write-Host ""
Write-Host "3. Click en 'Deployments'" -ForegroundColor White
Write-Host ""
Write-Host "4. Verifica el estado del ultimo deployment:" -ForegroundColor White
Write-Host "   - Debe tener un checkmark verde" -ForegroundColor Gray
Write-Host "   - Si esta en proceso, espera a que termine" -ForegroundColor Gray
Write-Host "   - Si tiene X roja, click para ver los errores" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Para ver logs del backend:" -ForegroundColor White
Write-Host "   - Click en el deployment" -ForegroundColor Gray
Write-Host "   - Ve a 'Functions'" -ForegroundColor Gray
Write-Host "   - Click en 'api/index.js'" -ForegroundColor Gray
Write-Host "   - Ve a 'Logs'" -ForegroundColor Gray
Write-Host ""
