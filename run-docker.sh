#!/bin/bash
# Script para ejecutar FiestaCo en Docker

set -e

echo "🚀 Iniciando FiestaCo en Docker..."

# Verificar que la imagen existe
if ! docker image inspect fiestaco:final > /dev/null 2>&1; then
    echo "❌ Error: La imagen 'fiestaco:final' no existe."
    echo "   Construye la imagen primero con: docker build -t fiestaco:final -f Dockerfile.final ."
    exit 1
fi

echo "✅ Imagen encontrada: fiestaco:final"

# Detener contenedor existente si existe
if docker ps -a --filter "name=fiestaco" --format "{{.Names}}" | grep -q "^fiestaco$"; then
    echo "🛑 Deteniendo contenedor existente..."
    docker stop fiestaco > /dev/null 2>&1 || true
    docker rm fiestaco > /dev/null 2>&1 || true
    echo "✅ Contenedor anterior detenido y eliminado"
fi

# Ejecutar nuevo contenedor
echo "🐳 Iniciando contenedor..."
docker run -d \
    --name fiestaco \
    -p 3001:3001 \
    --restart unless-stopped \
    fiestaco:final

# Esperar a que el contenedor inicie
echo "⏳ Esperando que la aplicación inicie..."
sleep 5

# Verificar que el contenedor está corriendo
if docker ps --filter "name=fiestaco" --format "{{.Names}}" | grep -q "^fiestaco$"; then
    echo "✅ Contenedor iniciado exitosamente"
    echo "🌐 La aplicación está disponible en: http://localhost:3001"
    echo "🔍 Health check: http://localhost:3001/health"

    # Mostrar logs iniciales
    echo "📋 Logs iniciales:"
    docker logs --tail 10 fiestaco

    # Verificar health check
    echo "🧪 Verificando health check..."
    if curl -s http://localhost:3001/health | grep -q "healthy"; then
        echo "✅ Health check exitoso"
    else
        echo "⚠️  Health check no responde como se esperaba"
        echo "📋 Últimos logs:"
        docker logs --tail 20 fiestaco
    fi
else
    echo "❌ Error: No se pudo iniciar el contenedor"
    echo "📋 Logs del contenedor:"
    docker logs fiestaco
    exit 1
fi

echo ""
echo "🎉 ¡FiestaCo está corriendo en Docker!"
echo ""
echo "Comandos útiles:"
echo "  docker logs -f fiestaco        # Seguir logs en tiempo real"
echo "  docker stop fiestaco           # Detener aplicación"
echo "  docker start fiestaco          # Iniciar aplicación nuevamente"
echo "  docker exec -it fiestaco sh    # Acceder al contenedor"
echo "  docker rm fiestaco             # Eliminar contenedor"
echo ""