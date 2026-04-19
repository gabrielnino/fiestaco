#!/bin/bash
# Script para desplegar FiestaCo en Docker

set -e

echo "🚀 Iniciando despliegue de FiestaCo en Docker..."

# 1. Verificar que la aplicación esté construida
if [ ! -d ".next" ]; then
    echo "❌ Error: La aplicación no está construida. Ejecuta 'npm run build' primero."
    exit 1
fi

echo "✅ Aplicación ya construida"

# 2. Construir imagen Docker
echo "📦 Construyendo imagen Docker..."
docker build -t fiestaco:deploy -f Dockerfile.deploy-only .

# 3. Verificar que la imagen se construyó
if ! docker image inspect fiestaco:deploy > /dev/null 2>&1; then
    echo "❌ Error: No se pudo construir la imagen Docker"
    exit 1
fi

echo "✅ Imagen Docker construida: fiestaco:deploy"

# 4. Detener contenedor existente si existe
if docker ps -a --filter "name=fiestaco-app" --format "{{.Names}}" | grep -q "fiestaco-app"; then
    echo "🛑 Deteniendo contenedor existente..."
    docker stop fiestaco-app > /dev/null 2>&1 || true
    docker rm fiestaco-app > /dev/null 2>&1 || true
    echo "✅ Contenedor anterior detenido y eliminado"
fi

# 5. Ejecutar nuevo contenedor
echo "🐳 Iniciando contenedor..."
docker run -d \
    --name fiestaco-app \
    -p 3001:3001 \
    --restart unless-stopped \
    fiestaco:deploy

# 6. Verificar que el contenedor está corriendo
sleep 3
if docker ps --filter "name=fiestaco-app" --format "{{.Names}}" | grep -q "fiestaco-app"; then
    echo "✅ Contenedor iniciado exitosamente: fiestaco-app"
    echo "🌐 La aplicación está disponible en: http://localhost:3001"
    echo "🔍 Health check: http://localhost:3001/health"

    # Verificar health check
    echo "🧪 Verificando health check..."
    sleep 2
    if curl -s http://localhost:3001/health | grep -q "healthy"; then
        echo "✅ Health check exitoso"
    else
        echo "⚠️  Health check no responde como se esperaba"
    fi
else
    echo "❌ Error: No se pudo iniciar el contenedor"
    echo "📋 Logs del contenedor:"
    docker logs fiestaco-app
    exit 1
fi

echo ""
echo "🎉 ¡Despliegue completado exitosamente!"
echo ""
echo "Comandos útiles:"
echo "  docker logs fiestaco-app        # Ver logs"
echo "  docker stop fiestaco-app        # Detener aplicación"
echo "  docker start fiestaco-app       # Iniciar aplicación"
echo "  docker rm fiestaco-app          # Eliminar contenedor"
echo "  docker image rm fiestaco:deploy # Eliminar imagen"