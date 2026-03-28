#!/bin/bash

# Script SIMPLE para crear contenedor NUEVO
# Sin complicaciones, solo lo esencial

set -e
echo "🚀 CREANDO CONTENEDOR NUEVO - MÉTODO DIRECTO"

# Variables ÚNICAS
CONTAINER_NAME="fiestaco-fresh-$(date +%s)"
PORT_NUEVO=3101  # Puerto COMPLETAMENTE NUEVO

echo "📛 Nombre: ${CONTAINER_NAME}"
echo "🔌 Puerto: ${PORT_NUEVO}"
echo "🕐 Inicio: $(date)"

# 1. VERIFICAR PUERTO
echo ""
echo "🔍 1. Verificando puerto ${PORT_NUEVO}..."
if lsof -i :${PORT_NUEVO} > /dev/null 2>&1; then
    echo "   ❌ Puerto en uso. Probando 3102..."
    PORT_NUEVO=3102
    if lsof -i :${PORT_NUEVO} > /dev/null 2>&1; then
        echo "   ❌ 3102 también en uso. Probando 3103..."
        PORT_NUEVO=3103
    fi
fi
echo "   ✅ Usando puerto: ${PORT_NUEVO}"

# 2. CONSTRUIR LOCALMENTE PRIMERO
echo ""
echo "🏗️ 2. Construyendo aplicación localmente..."
npm run build

# 3. CREAR DOCKERFILE SIMPLE
echo ""
echo "📝 3. Creando Dockerfile temporal..."
cat > Dockerfile.temp << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# 4. CONSTRUIR IMAGEN
echo ""
echo "🐳 4. Construyendo imagen..."
docker build -f Dockerfile.temp -t ${CONTAINER_NAME}-img .

# 5. CREAR CONTENEDOR
echo ""
echo "📦 5. Creando contenedor..."
docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${PORT_NUEVO}:3000 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  ${CONTAINER_NAME}-img

# 6. VERIFICAR
echo ""
echo "✅ 6. Verificando creación..."
sleep 5
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 7. PROBAR
echo ""
echo "🔍 7. Probando contenedor..."
for i in {1..10}; do
    if curl -s -f "http://localhost:${PORT_NUEVO}/" > /dev/null 2>&1; then
        echo "   ✅ ¡Funciona! en intento ${i}"
        echo ""
        echo "🌐 URL: http://localhost:${PORT_NUEVO}"
        echo "📛 Contenedor: ${CONTAINER_NAME}"
        echo "🐳 Imagen: ${CONTAINER_NAME}-img"
        echo ""
        echo "🎉 CONTENEDOR NUEVO CREADO EXITOSAMENTE"
        exit 0
    fi
    echo "   ⏳ Intento ${i}/10..."
    sleep 3
done

echo "❌ No responde después de 10 intentos"
docker logs ${CONTAINER_NAME} --tail 20
exit 1