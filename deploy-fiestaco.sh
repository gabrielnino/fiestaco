#!/bin/bash
# Script simplificado para construir y desplegar FiestaCo en Docker

set -e

echo "🚀 Construyendo y desplegando FiestaCo en Docker..."

# 1. Verificar que tenemos el build de Next.js
if [ ! -d ".next/standalone" ]; then
    echo "❌ Error: No se encontró el build de Next.js (.next/standalone)"
    echo "   Ejecuta primero: npm run build"
    exit 1
fi

echo "✅ Build de Next.js encontrado"

# 2. Construir imagen Docker
echo "🔨 Construyendo imagen Docker..."
docker build -t fiestaco:latest -f Dockerfile.stable .

# 3. Detener contenedor anterior si existe
CONTAINER_NAME="fiestaco"
if docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "🛑 Deteniendo contenedor existente..."
    docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
    docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
    echo "✅ Contenedor anterior detenido y eliminado"
fi

# 4. Ejecutar nuevo contenedor
echo "🐳 Iniciando contenedor..."
docker run -d \
    --name $CONTAINER_NAME \
    -p 3001:3001 \
    --restart unless-stopped \
    fiestaco:latest

# 5. Esperar y verificar
echo "⏳ Esperando que la aplicación inicie..."
sleep 5

# 6. Verificar estado
if docker ps --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "✅ Contenedor iniciado exitosamente"
    echo "🌐 La aplicación está disponible en: http://localhost:3001"

    # Verificar respuesta HTTP
    if curl -s -f http://localhost:3001 > /dev/null; then
        echo "✅ Aplicación responde correctamente"
    else
        echo "⚠️  Advertencia: La aplicación no responde como se esperaba"
        echo "📋 Últimos logs:"
        docker logs --tail 20 $CONTAINER_NAME
    fi
else
    echo "❌ Error: No se pudo iniciar el contenedor"
    echo "📋 Logs del contenedor:"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
echo "🎉 ¡FiestaCo está corriendo en Docker!"
echo ""
echo "Comandos útiles:"
echo "  docker logs -f $CONTAINER_NAME        # Seguir logs en tiempo real"
echo "  docker stop $CONTAINER_NAME           # Detener aplicación"
echo "  docker start $CONTAINER_NAME          # Iniciar aplicación nuevamente"
echo "  docker exec -it $CONTAINER_NAME sh    # Acceder al contenedor"
echo "  docker rm $CONTAINER_NAME             # Eliminar contenedor"
echo "  ./deploy-fiestaco.sh                 # Reconstruir y redeployar"