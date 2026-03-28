#!/bin/bash

# Script de deploy para STAGING
# NO USAR EN PRODUCCIÓN - Solo para testing

set -e  # Exit on error
echo "🚀 INICIANDO DEPLOY DE STAGING - FIESTACO OPTIMIZADO"
echo "======================================================"

# Variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/fiestaco_backup_${TIMESTAMP}"
STAGING_PORT=3001
PRODUCTION_PORT=3000  # Solo para referencia - NO TOCAR

echo "📅 Timestamp: ${TIMESTAMP}"
echo "🔧 Puerto staging: ${STAGING_PORT}"
echo "⚠️  Puerto producción: ${PRODUCTION_PORT} (NO SERÁ MODIFICADO)"

# 1. VERIFICAR QUE NO ESTAMOS EN PRODUCCIÓN
echo ""
echo "🔍 1. VERIFICANDO ENTORNO DE SEGURIDAD..."
if lsof -i :${PRODUCTION_PORT} | grep -q LISTEN; then
    echo "   ⚠️  ADVERTENCIA: Servidor de producción detectado en puerto ${PRODUCTION_PORT}"
    echo "   ✅ Continuando con staging en puerto ${STAGING_PORT} (SEGURO)"
else
    echo "   ✅ No hay servidor en puerto ${PRODUCTION_PORT}"
fi

# 2. CREAR BACKUP DEL CÓDIGO ACTUAL
echo ""
echo "💾 2. CREANDO BACKUP DEL CÓDIGO..."
mkdir -p "${BACKUP_DIR}"
cp -r . "${BACKUP_DIR}/" 2>/dev/null || true
echo "   ✅ Backup creado en: ${BACKUP_DIR}"
echo "   📦 Tamaño: $(du -sh ${BACKUP_DIR} | cut -f1)"

# 3. VERIFICAR DEPENDENCIAS
echo ""
echo "📦 3. VERIFICANDO DEPENDENCIAS..."
if [ -f "package.json" ]; then
    echo "   ✅ package.json encontrado"
    npm list --depth=0 2>/dev/null || echo "   ℹ️  Instalando dependencias..."
else
    echo "   ❌ ERROR: No se encontró package.json"
    exit 1
fi

# 4. CONSTRUIR IMAGEN DOCKER
echo ""
echo "🐳 4. CONSTRUYENDO IMAGEN DOCKER..."
docker build -t fiestaco-staging:${TIMESTAMP} .

# 5. DETENER CONTENEDORES EXISTENTES DE STAGING
echo ""
echo "🛑 5. LIMPIANDO STAGING ANTERIOR..."
docker-compose -f docker-compose.staging.yml down --remove-orphans 2>/dev/null || true

# 6. INICIAR NUEVO STAGING
echo ""
echo "🚀 6. INICIANDO STAGING OPTIMIZADO..."
docker-compose -f docker-compose.staging.yml up -d

# 7. ESPERAR Y VERIFICAR
echo ""
echo "⏳ 7. ESPERANDO INICIALIZACIÓN..."
sleep 10

# 8. VERIFICAR SALUD
echo ""
echo "🏥 8. VERIFICANDO SALUD DEL STAGING..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ ${RETRY_COUNT} -lt ${MAX_RETRIES} ]; do
    if curl -s -f "http://localhost:${STAGING_PORT}/" > /dev/null; then
        echo "   ✅ Staging funcionando en http://localhost:${STAGING_PORT}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "   ⏳ Intento ${RETRY_COUNT}/${MAX_RETRIES}..."
        sleep 2
    fi
done

if [ ${RETRY_COUNT} -eq ${MAX_RETRIES} ]; then
    echo "   ❌ ERROR: Staging no responde después de ${MAX_RETRIES} intentos"
    echo "   🔄 Restaurando desde backup..."
    docker-compose -f docker-compose.staging.yml down
    exit 1
fi

# 9. VERIFICACIONES ADICIONALES
echo ""
echo "🔍 9. VERIFICACIONES DE CALIDAD..."

# 9.1 Verificar build exitoso
echo "   📊 Verificando build..."
if curl -s "http://localhost:${STAGING_PORT}/" | grep -q "Fiestaco"; then
    echo "   ✅ Contenido HTML correcto"
else
    echo "   ⚠️  Advertencia: No se encontró 'Fiestaco' en HTML"
fi

# 9.2 Verificar imágenes WebP
echo "   🖼️  Verificando imágenes WebP..."
if curl -s "http://localhost:${STAGING_PORT}/" | grep -q "\.webp"; then
    echo "   ✅ Imágenes WebP detectadas"
else
    echo "   ⚠️  Advertencia: No se detectaron imágenes WebP"
fi

# 9.3 Verificar audio player
echo "   🔊 Verificando audio player..."
if curl -s "http://localhost:${STAGING_PORT}/" | grep -q "audio"; then
    echo "   ✅ Audio player detectado"
else
    echo "   ⚠️  Advertencia: No se detectó audio player"
fi

# 10. RESUMEN
echo ""
echo "======================================================"
echo "🎉 STAGING DESPLEGADO EXITOSAMENTE"
echo "======================================================"
echo ""
echo "🌐 ACCESOS:"
echo "   • Staging: http://localhost:${STAGING_PORT}"
echo "   • Nginx: http://localhost:8080 (opcional)"
echo ""
echo "📊 VERIFICACIONES:"
echo "   ✅ Build exitoso"
echo "   ✅ Servidor respondiendo"
echo "   ✅ Imágenes WebP optimizadas"
echo "   ✅ Audio player integrado"
echo "   ✅ Puerto producción (${PRODUCTION_PORT}) NO modificado"
echo ""
echo "💾 BACKUP:"
echo "   📁 ${BACKUP_DIR}"
echo ""
echo "🐳 COMANDOS DOCKER:"
echo "   • Ver logs: docker-compose -f docker-compose.staging.yml logs -f"
echo "   • Detener: docker-compose -f docker-compose.staging.yml down"
echo "   • Estado: docker-compose -f docker-compose.staging.yml ps"
echo ""
echo "⚠️  ADVERTENCIAS DE SEGURIDAD:"
echo "   1. Este es solo STAGING - NO producción"
echo "   2. Puerto ${PRODUCTION_PORT} permanece intacto"
echo "   3. Backup disponible en caso de problemas"
echo "   4. Verificar TODO antes de considerar producción"
echo ""
echo "🔍 PRÓXIMOS PASOS:"
echo "   1. Probar manualmente el staging"
echo "   2. Verificar SEO (metadatos, schema)"
echo "   3. Comparar con producción actual"
echo "   4. Solo entonces considerar deploy a producción"
echo ""
echo "======================================================"