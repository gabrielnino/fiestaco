#!/bin/bash

# Deploy simple y rápido para Fiestaco con analytics

set -e
echo "🚀 DEPLOY SIMPLE - FIESTACO CON ANALYTICS"
echo "=========================================="

# Variables
CONTAINER_NAME="fiestaco-analytics"
IMAGE_NAME="fiestaco:latest"
PORT=3101

echo "📛 Contenedor: ${CONTAINER_NAME}"
echo "🐳 Imagen: ${IMAGE_NAME}"
echo "🔌 Puerto: ${PORT}"
echo "🕐 Inicio: $(date)"

# 1. Detener contenedor existente si existe
echo ""
echo "🛑 1. LIMPIANDO CONTENEDOR ANTERIOR..."
docker stop ${CONTAINER_NAME} 2>/dev/null || echo "   ℹ️  No hay contenedor para detener"
docker rm ${CONTAINER_NAME} 2>/dev/null || echo "   ℹ️  No hay contenedor para eliminar"

# 2. Construir nueva imagen
echo ""
echo "🔨 2. CONSTRUYENDO IMAGEN CON ANALYTICS..."
docker build -t ${IMAGE_NAME} .

# 3. Crear directorio para datos de analytics si no existe
echo ""
echo "📁 3. PREPARANDO VOLUMEN DE DATOS..."
mkdir -p ./data
chmod 777 ./data 2>/dev/null || true

# 4. Ejecutar nuevo contenedor
echo ""
echo "🐳 4. INICIANDO CONTENEDOR NUEVO..."
docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${PORT}:3001 \
  -e NODE_ENV=production \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  ${IMAGE_NAME}

# 5. Esperar y verificar
echo ""
echo "⏳ 5. ESPERANDO INICIALIZACIÓN..."
sleep 10

# 6. Verificar salud
echo ""
echo "🏥 6. VERIFICANDO SALUD..."
MAX_RETRIES=20
RETRY_COUNT=0

while [ ${RETRY_COUNT} -lt ${MAX_RETRIES} ]; do
    if curl -s -f "http://localhost:${PORT}/" > /dev/null; then
        echo "   ✅ Aplicación funcionando en http://localhost:${PORT}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "   ⏳ Intento ${RETRY_COUNT}/${MAX_RETRIES}..."
        sleep 3
    fi
done

if [ ${RETRY_COUNT} -eq ${MAX_RETRIES} ]; then
    echo "   ❌ ERROR: Aplicación no responde"
    echo "   📋 Ver logs: docker logs ${CONTAINER_NAME}"
    exit 1
fi

# 7. Verificar dashboard
echo ""
echo "📊 7. VERIFICANDO DASHBOARD..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/dashboard" || echo "000")

if [ "$DASHBOARD_STATUS" = "200" ]; then
    echo "   ✅ Dashboard cargando correctamente (status: ${DASHBOARD_STATUS})"
elif [ "$DASHBOARD_STATUS" = "404" ]; then
    echo "   ❌ ERROR: Dashboard no encontrado (404)"
    echo "   🔍 Verificar build: npm run build"
    exit 1
else
    echo "   ⚠️  Dashboard status: ${DASHBOARD_STATUS}"
fi

# 8. Verificar API analytics
echo ""
echo "🔧 8. VERIFICANDO API ANALYTICS..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:${PORT}/api/analytics" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","eventName":"test","pagePath":"/"}' || echo "000")

if [ "$API_STATUS" = "200" ]; then
    echo "   ✅ API Analytics funcionando (status: ${API_STATUS})"
else
    echo "   ⚠️  API Analytics status: ${API_STATUS}"
fi

# 9. Resumen
echo ""
echo "=========================================="
echo "🎉 DEPLOY COMPLETADO EXITOSAMENTE"
echo "=========================================="
echo ""
echo "🌐 ACCESOS:"
echo "   • Sitio: http://localhost:${PORT}"
echo "   • Dashboard: http://localhost:${PORT}/dashboard"
echo "   • Contraseña dashboard: fiestaco2024"
echo ""
echo "🔧 COMANDOS ÚTILES:"
echo "   • Ver logs: docker logs ${CONTAINER_NAME} -f"
echo "   • Detener: docker stop ${CONTAINER_NAME}"
echo "   • Eliminar: docker rm ${CONTAINER_NAME}"
echo "   • Shell: docker exec -it ${CONTAINER_NAME} sh"
echo ""
echo "📊 DATOS ANALYTICS:"
echo "   • Base de datos: ./data/analytics.db"
echo "   • Monitoreo: node scripts/monitor-analytics.js"
echo ""
echo "🕐 Finalizado: $(date)"
echo "=========================================="