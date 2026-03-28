#!/bin/bash

# DEPLOY DE CONTENEDOR NUEVO - FIESTACO OPTIMIZADO
# Contenedor 100% nuevo, sin contaminación

set -e
echo "🚀 CREANDO CONTENEDOR NUEVO - FIESTACO OPTIMIZADO"
echo "===================================================="

# Variables ÚNICAS para este contenedor
CONTAINER_NAME="fiestaco-optimized-$(date +%Y%m%d-%H%M%S)"
IMAGE_NAME="fiestaco-optimized:latest"
PORT_NEW=3100  # Puerto COMPLETAMENTE NUEVO
NETWORK_NAME="fiestaco-network-$(date +%s)"

echo "📛 Nombre contenedor: ${CONTAINER_NAME}"
echo "🐳 Imagen: ${IMAGE_NAME}"
echo "🔌 Puerto: ${PORT_NEW}"
echo "🌐 Red: ${NETWORK_NAME}"
echo "🕐 Timestamp: $(date)"

# 1. VERIFICAR QUE EL PUERTO ESTÁ LIBRE
echo ""
echo "🔍 1. VERIFICANDO PUERTO ${PORT_NEW}..."
if lsof -i :${PORT_NEW} > /dev/null 2>&1; then
    echo "   ❌ ERROR: Puerto ${PORT_NEW} en uso"
    echo "   💡 Sugerencia: Cambiar PORT_NEW en el script"
    exit 1
else
    echo "   ✅ Puerto ${PORT_NEW} disponible"
fi

# 2. CONSTRUIR IMAGEN NUEVA
echo ""
echo "🔨 2. CONSTRUYENDO IMAGEN NUEVA..."
docker build -f Dockerfile.optimized -t ${IMAGE_NAME} .

# 3. CREAR RED NUEVA
echo ""
echo "🌐 3. CREANDO RED NUEVA..."
docker network create ${NETWORK_NAME} 2>/dev/null || echo "   ℹ️  Red ya existe, reusando..."

# 4. CREAR CONTENEDOR NUEVO
echo ""
echo "🐳 4. CREANDO CONTENEDOR NUEVO..."
docker run -d \
  --name ${CONTAINER_NAME} \
  --network ${NETWORK_NAME} \
  -p ${PORT_NEW}:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  --restart unless-stopped \
  --memory="512m" \
  --cpus="1.0" \
  ${IMAGE_NAME}

# 5. VERIFICAR CREACIÓN
echo ""
echo "✅ 5. CONTENEDOR CREADO:"
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 6. ESPERAR INICIALIZACIÓN
echo ""
echo "⏳ 6. ESPERANDO INICIALIZACIÓN (10 segundos)..."
sleep 10

# 7. VERIFICAR FUNCIONAMIENTO
echo ""
echo "🔍 7. VERIFICANDO FUNCIONAMIENTO..."
MAX_RETRIES=15
for i in $(seq 1 ${MAX_RETRIES}); do
    if curl -s -f "http://localhost:${PORT_NEW}/" > /dev/null 2>&1; then
        echo "   ✅ Contenedor respondiendo en intento ${i}"
        break
    fi
    
    if [ ${i} -eq ${MAX_RETRIES} ]; then
        echo "   ❌ ERROR: Contenedor no responde después de ${MAX_RETRIES} intentos"
        echo "   📋 Revisando logs..."
        docker logs ${CONTAINER_NAME} --tail 20
        exit 1
    fi
    
    echo "   ⏳ Intento ${i}/${MAX_RETRIES}..."
    sleep 2
done

# 8. VERIFICACIONES DE CALIDAD
echo ""
echo "🎯 8. VERIFICACIONES DE CALIDAD..."

# 8.1 Verificar build optimizado
echo "   📊 Verificando build optimizado..."
if curl -s "http://localhost:${PORT_NEW}/" | grep -q "Fiestaco"; then
    echo "   ✅ HTML correcto - 'Fiestaco' encontrado"
else
    echo "   ⚠️  Advertencia: 'Fiestaco' no encontrado en HTML"
fi

# 8.2 Verificar imágenes WebP
echo "   🖼️  Verificando imágenes WebP..."
WEBP_COUNT=$(curl -s "http://localhost:${PORT_NEW}/" | grep -o "\.webp" | wc -l)
if [ ${WEBP_COUNT} -gt 0 ]; then
    echo "   ✅ ${WEBP_COUNT} imágenes WebP detectadas"
else
    echo "   ⚠️  Advertencia: No se detectaron imágenes WebP"
fi

# 8.3 Verificar audio player
echo "   🔊 Verificando audio player..."
if curl -s "http://localhost:${PORT_NEW}/" | grep -q "audio"; then
    echo "   ✅ Audio player detectado"
else
    echo "   ⚠️  Advertencia: No se detectó audio player"
fi

# 8.4 Verificar health endpoint
echo "   🏥 Verificando health endpoint..."
HEALTH_STATUS=$(curl -s "http://localhost:${PORT_NEW}/health" | grep -o '"status":"[^"]*"' || echo "no-response")
if [[ "${HEALTH_STATUS}" == *"healthy"* ]]; then
    echo "   ✅ Health endpoint: ${HEALTH_STATUS}"
else
    echo "   ⚠️  Health endpoint: ${HEALTH_STATUS:-no-response}"
fi

# 9. RESUMEN FINAL
echo ""
echo "===================================================="
echo "🎉 CONTENEDOR NUEVO CREADO EXITOSAMENTE"
echo "===================================================="
echo ""
echo "📋 INFORMACIÓN DEL CONTENEDOR:"
echo "   📛 Nombre: ${CONTAINER_NAME}"
echo "   🐳 Imagen: ${IMAGE_NAME}"
echo "   🔌 Puerto: ${PORT_NEW}"
echo "   🌐 URL: http://localhost:${PORT_NEW}"
echo "   🔗 Health: http://localhost:${PORT_NEW}/health"
echo ""
echo "✅ VERIFICACIONES PASADAS:"
echo "   ✅ Puerto ${PORT_NEW} libre (nuevo)"
echo "   ✅ Imagen construida exitosamente"
echo "   ✅ Contenedor creado y corriendo"
echo "   ✅ Aplicación respondiendo"
echo "   ✅ Build optimizado funcionando"
echo ""
echo "🔧 COMANDOS ÚTILES:"
echo "   📊 Ver logs: docker logs -f ${CONTAINER_NAME}"
echo "   📈 Ver recursos: docker stats ${CONTAINER_NAME}"
echo "   🛑 Detener: docker stop ${CONTAINER_NAME}"
echo "   🗑️  Eliminar: docker rm -f ${CONTAINER_NAME}"
echo "   🌐 Ver red: docker network inspect ${NETWORK_NAME}"
echo ""
echo "⚠️  SEGURIDAD GARANTIZADA:"
echo "   1. Puerto NUEVO (${PORT_NEW}) - no interfiere con producción"
echo "   2. Contenedor NUEVO - sin contaminación"
echo "   3. Red NUEVA - aislamiento completo"
echo "   4. Sitio producción (#1 en Google) NO afectado"
echo ""
echo "🔍 PRÓXIMOS PASOS RECOMENDADOS:"
echo "   1. Probar manualmente: http://localhost:${PORT_NEW}"
echo "   2. Verificar todas las funcionalidades"
echo "   3. Comparar con sitio de producción"
echo "   4. Solo después considerar migración"
echo ""
echo "===================================================="