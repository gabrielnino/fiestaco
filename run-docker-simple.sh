#!/bin/bash
# Script simplificado para ejecutar FiestaCo en Docker

set -e

echo "🚀 Iniciando FiestaCo en Docker..."

# Detener contenedor existente si existe
if docker ps -a --filter "name=fiestaco" --format "{{.Names}}" | grep -q "^fiestaco$"; then
    echo "🛑 Deteniendo contenedor existente..."
    docker stop fiestaco > /dev/null 2>&1 || true
    docker rm fiestaco > /dev/null 2>&1 || true
    echo "✅ Contenedor anterior detenido y eliminado"
fi

# Verificar que la imagen existe
if ! docker image inspect fiestaco:latest > /dev/null 2>&1; then
    echo "❌ Error: La imagen 'fiestaco:latest' no existe."
    echo "   Construye la imagen primero con: docker build -t fiestaco:latest -f Dockerfile ."
    exit 1
fi

echo "✅ Imagen encontrada: fiestaco:latest"

# Ejecutar nuevo contenedor
echo "🐳 Iniciando contenedor..."
docker run -d \
    --name fiestaco \
    -p 3001:3001 \
    --restart unless-stopped \
    fiestaco:latest

echo "✅ Contenedor iniciado en http://localhost:3001"
echo "📊 Ver logs: docker logs -f fiestaco"
echo "🛑 Detener: docker stop fiestaco"