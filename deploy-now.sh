#!/bin/bash

# 🚀 DEPLOY AHORA - FIESTACO ANALYTICS
# Script rápido para desplegar en producción

set -e
echo "🚀 DEPLOY INMEDIATO - FIESTACO CON ANALYTICS"
echo "============================================"
echo "📅 $(date)"
echo ""

# Variables
CONTAINER_NAME="fiestaco-production"
IMAGE_NAME="fiestaco:production-$(date +%s)"
PORT=3001
DOMAIN="fiestaco.today"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. VERIFICAR PRERREQUISITOS
log "1. Verificando prerrequisitos..."
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    warning "Curl no está instalado, instalando..."
    apt-get update && apt-get install -y curl 2>/dev/null || true
fi

success "Prerrequisitos verificados"

# 2. CONSTRUIR IMAGEN
log "2. Construyendo imagen Docker..."
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    success "Imagen construida: $IMAGE_NAME"
else
    error "Error construyendo imagen"
    exit 1
fi

# 3. PREPARAR DIRECTORIOS
log "3. Preparando directorios..."
mkdir -p ./data
chmod 777 ./data 2>/dev/null || true
success "Directorios listos"

# 4. DETENER CONTENEDOR EXISTENTE
log "4. Deteniendo contenedor existente..."
docker stop $CONTAINER_NAME 2>/dev/null && success "Contenedor detenido" || warning "No había contenedor corriendo"
docker rm $CONTAINER_NAME 2>/dev/null && success "Contenedor eliminado" || warning "No había contenedor para eliminar"

# 5. EJECUTAR NUEVO CONTENEDOR
log "5. Ejecutando nuevo contenedor..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 127.0.0.1:$PORT:3001 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  -e ANALYTICS_TOKEN="fiestaco-prod-$(date +%s)" \
  -e DASHBOARD_TOKEN="fiestaco-admin-$(date +%s)" \
  $IMAGE_NAME

if [ $? -eq 0 ]; then
    success "Contenedor ejecutado: $CONTAINER_NAME"
else
    error "Error ejecutando contenedor"
    exit 1
fi

# 6. ESPERAR INICIALIZACIÓN
log "6. Esperando inicialización..."
sleep 10

MAX_RETRIES=15
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f http://localhost:$PORT/health > /dev/null 2>&1; then
        success "Contenedor saludable en http://localhost:$PORT"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    log "Intento $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    error "Contenedor no responde después de $MAX_RETRIES intentos"
    docker logs $CONTAINER_NAME
    exit 1
fi

# 7. VERIFICAR COMPONENTES
log "7. Verificando componentes..."

# 7.1 Sitio principal
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ | grep -q "200"; then
    success "Sitio principal: 200 OK"
else
    warning "Sitio principal no responde 200"
fi

# 7.2 Dashboard
DASH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/dashboard)
if [ "$DASH_STATUS" = "200" ]; then
    success "Dashboard: 200 OK"
    log "   Contraseña: fiestaco2024"
elif [ "$DASH_STATUS" = "404" ]; then
    error "Dashboard: 404 Not Found"
else
    warning "Dashboard: $DASH_STATUS"
fi

# 7.3 API Analytics
API_RESPONSE=$(curl -s -X POST http://localhost:$PORT/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"deploy-test","eventName":"deploy_complete","pagePath":"/"}')
if echo "$API_RESPONSE" | grep -q "success"; then
    success "API Analytics: Funcionando"
else
    warning "API Analytics: Posible problema"
fi

# 8. CONFIGURAR NGINX (SI ES NECESARIO)
log "8. Configurando Nginx..."
if [ -f /etc/nginx/sites-available/fiestaco ]; then
    # Verificar configuración actual
    CURRENT_PORT=$(grep -o "proxy_pass http://localhost:[0-9]*" /etc/nginx/sites-available/fiestaco | grep -o "[0-9]*" | head -1)
    
    if [ "$CURRENT_PORT" != "$PORT" ]; then
        warning "Nginx apunta a puerto $CURRENT_PORT, actualizando a $PORT..."
        
        # Backup
        cp /etc/nginx/sites-available/fiestaco /etc/nginx/sites-available/fiestaco.backup.$(date +%s)
        
        # Actualizar puerto
        sed -i "s|proxy_pass http://localhost:[0-9]*|proxy_pass http://localhost:$PORT|g" /etc/nginx/sites-available/fiestaco
        
        # Testear configuración
        if nginx -t 2>/dev/null; then
            systemctl reload nginx 2>/dev/null && success "Nginx recargado" || warning "No se pudo recargar Nginx"
        else
            error "Configuración Nginx inválida, restaurando backup..."
            cp /etc/nginx/sites-available/fiestaco.backup.* /etc/nginx/sites-available/fiestaco 2>/dev/null || true
        fi
    else
        success "Nginx ya apunta al puerto correcto ($PORT)"
    fi
else
    warning "Configuración Nginx no encontrada en /etc/nginx/sites-available/fiestaco"
    log "   Crear manualmente o usar proxy inverso"
fi

# 9. VERIFICAR PRODUCCIÓN
log "9. Verificando producción..."
sleep 3

PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/dashboard 2>/dev/null || echo "ERR")
if [ "$PROD_STATUS" = "200" ]; then
    success "✅ PRODUCCIÓN: Dashboard accesible en https://$DOMAIN/dashboard"
elif [ "$PROD_STATUS" = "502" ]; then
    warning "⚠️ PRODUCCIÓN: 502 Bad Gateway - Nginx necesita recargar o hay conflicto"
elif [ "$PROD_STATUS" = "ERR" ]; then
    warning "⚠️ PRODUCCIÓN: No se pudo conectar - Verificar DNS/SSL"
else
    log "PRODUCCIÓN status: $PROD_STATUS"
fi

# 10. RESUMEN FINAL
echo ""
echo "============================================"
echo "🎉 DEPLOY COMPLETADO"
echo "============================================"
echo ""
echo "📊 COMPONENTES:"
echo "  • ✅ Contenedor: $CONTAINER_NAME"
echo "  • ✅ Imagen: $IMAGE_NAME"
echo "  • ✅ Puerto: $PORT"
echo "  • ✅ Salud: OK"
echo ""
echo "🌐 URLs:"
echo "  • Local: http://localhost:$PORT"
echo "  • Dashboard: http://localhost:$PORT/dashboard"
echo "  • Producción: https://$DOMAIN/dashboard"
echo ""
echo "🔐 CREDENCIALES:"
echo "  • Dashboard: fiestaco2024"
echo "  • API Token: Generado automáticamente"
echo ""
echo "📈 PRUEBAS RÁPIDAS:"
echo "  • Salud: curl http://localhost:$PORT/health"
echo "  • API: curl -X POST http://localhost:$PORT/api/analytics"
echo "  • Dashboard: Abrir http://localhost:$PORT/dashboard"
echo ""
echo "⚠️  SI HAY PROBLEMAS EN PRODUCCIÓN:"
echo "  1. Verificar Nginx: nginx -t && systemctl reload nginx"
echo "  2. Verificar logs: docker logs $CONTAINER_NAME"
echo "  3. Verificar puerto: netstat -tulpn | grep $PORT"
echo ""
echo "🕐 Finalizado: $(date)"
echo "============================================"