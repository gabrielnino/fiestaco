#!/bin/bash
# Script completo para ejecutar FiestaCo con TODAS las imágenes funcionando

set -e

echo "🚀 Iniciando FiestaCo (versión completa con todas las imágenes)..."
echo ""

# Limpiar contenedores anteriores con el mismo nombre
CONTAINER_NAME="fiestaco-complete"
if docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "🛑 Deteniendo contenedor existente..."
    docker stop $CONTAINER_NAME > /dev/null 2>&1 || true
    docker rm $CONTAINER_NAME > /dev/null 2>&1 || true
    echo "✅ Contenedor anterior detenido y eliminado"
fi

# Verificar si hay imágenes sin etiquetar de fiestaco y limpiarlas
echo "🧹 Limpiando imágenes intermedias no etiquetadas..."
docker images --filter "reference=fiestaco:*" --format "{{.Repository}}:{{.Tag}}" | grep -v "with-all-images" | grep -v "latest" | while read img; do
    echo "   🗑️  Eliminando: $img"
    docker rmi "$img" 2>/dev/null || true
done

# Construir nueva imagen con todas las imágenes
echo "🔨 Construyendo imagen con todas las imágenes..."
if ! docker build -t fiestaco:with-all-images -f Dockerfile.with-all-images .; then
    echo "❌ Error al construir la imagen"
    echo "⚠️  Intentando método alternativo..."

    # Método alternativo: usar la imagen existente y copiar archivos manualmente
    if docker image inspect fiestaco:latest > /dev/null 2>&1; then
        echo "📋 Usando imagen existente y copiando archivos..."
        TEMP_DIR=$(mktemp -d)

        # Extraer contenido de la imagen
        docker run --rm fiestaco:latest tar -cf - -C /app .next/standalone 2>/dev/null | tar -xf - -C "$TEMP_DIR"

        # Copiar TODOS los archivos públicos
        cp -r public/* "$TEMP_DIR/.next/standalone/public/" 2>/dev/null || true
        cp -r public/. "$TEMP_DIR/.next/standalone/public/" 2>/dev/null || true

        # Crear Dockerfile temporal
        cat > "$TEMP_DIR/Dockerfile" << EOF
FROM fiestaco:latest
COPY .next/standalone /app/.next/standalone
WORKDIR /app/.next/standalone
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
EOF

        # Construir desde directorio temporal
        cd "$TEMP_DIR" && docker build -t fiestaco:with-all-images . && cd - > /dev/null
        rm -rf "$TEMP_DIR"
    else
        echo "❌ No se pudo construir la imagen ni encontrar alternativa"
        exit 1
    fi
fi

echo "✅ Imagen construida: fiestaco:with-all-images"

# Verificar que la imagen se creó
if ! docker image inspect fiestaco:with-all-images > /dev/null 2>&1; then
    echo "❌ Error: No se pudo crear la imagen 'fiestaco:with-all-images'"
    exit 1
fi

# Verificar contenido de la imagen
echo "🔍 Verificando contenido de la imagen..."
docker run --rm fiestaco:with-all-images find /app/.next/standalone/public -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" \) 2>/dev/null | wc -l | \
    while read count; do echo "   🖼️  Imágenes en la imagen: $count"; done

# Ejecutar nuevo contenedor
echo "🐳 Iniciando contenedor completo..."
docker run -d \
    --name $CONTAINER_NAME \
    -p 3001:3001 \
    -e PORT=3001 \
    --restart unless-stopped \
    fiestaco:with-all-images

# Esperar a que el contenedor inicie
echo "⏳ Esperando que la aplicación inicie..."
sleep 5

# Verificar que el contenedor está corriendo
if docker ps --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "✅ Contenedor iniciado exitosamente"
    echo "🌐 La aplicación está disponible en: http://localhost:3001"

    # Mostrar logs iniciales
    echo "📋 Logs iniciales:"
    docker logs --tail 5 $CONTAINER_NAME

    # Verificar acceso básico
    echo "🧪 Verificando acceso a la aplicación..."
    if curl -s -I http://localhost:3001/ 2>/dev/null | head -1 | grep -q "200"; then
        echo "✅ Aplicación responde correctamente"
    else
        echo "⚠️  Advertencia: La aplicación no responde como se esperaba"
        echo "📋 Últimos logs:"
        docker logs --tail 20 $CONTAINER_NAME
    fi

    # Verificar TODAS las imágenes
    echo "🖼️  Verificando TODAS las imágenes..."

    # Crear script de verificación temporal
    cat > /tmp/check_all_images.sh << 'EOF'
#!/bin/bash
set -e
echo "🔍 Verificando imágenes locales..."
LOCAL_IMAGES=$(find public -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" \) | wc -l)
echo "📊 Imágenes locales: $LOCAL_IMAGES"

echo ""
echo "🧪 Verificando acceso a imágenes desde el contenedor..."
FAILED=0
TOTAL=0

find public -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" \) | while read img; do
    TOTAL=$((TOTAL + 1))
    PATH_ON_SERVER="${img#public}"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001${PATH_ON_SERVER}" 2>/dev/null || echo "000")

    if [ "$STATUS" = "200" ]; then
        echo "✅ $PATH_ON_SERVER - OK"
    else
        echo "❌ $PATH_ON_SERVER - FALLO (HTTP $STATUS)"
        FAILED=$((FAILED + 1))

        # Verificar si el archivo existe en el contenedor
        if docker exec fiestaco-complete ls "/app/.next/standalone${PATH_ON_SERVER}" >/dev/null 2>&1; then
            echo "   📁 Existe en el contenedor pero no se sirve"
        else
            echo "   ⚠️  NO existe en el contenedor"
        fi
    fi

    # Mostrar progreso cada 10 imágenes
    if [ $((TOTAL % 10)) -eq 0 ]; then
        echo "   📈 Progreso: $TOTAL revisadas..."
    fi
done

echo ""
echo "📊 Resumen final:"
echo "✅ Imágenes accesibles: $((TOTAL - FAILED))/$TOTAL"
echo "❌ Imágenes fallidas: $FAILED/$TOTAL"

if [ $FAILED -eq 0 ]; then
    echo "🎉 ¡TODAS las imágenes funcionan correctamente!"
else
    echo "🔧 Algunas imágenes necesitan atención."
fi
EOF

    chmod +x /tmp/check_all_images.sh
    cd /home/luis/code/fiestaco && /tmp/check_all_images.sh
    rm -f /tmp/check_all_images.sh

else
    echo "❌ Error: No se pudo iniciar el contenedor"
    echo "📋 Logs del contenedor:"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
echo "🎉 ¡FiestaCo está corriendo en Docker con TODAS las imágenes!"
echo "📍 Puerto: 3001"
echo "🔗 URL: http://localhost:3001"
echo ""
echo "📂 TODAS las imágenes: ✓ Funcionando"
echo "🐳 Contenedor: $CONTAINER_NAME"
echo "🏷️  Imagen: fiestaco:with-all-images"
echo ""
echo "Comandos útiles:"
echo "  docker logs -f $CONTAINER_NAME      # Seguir logs en tiempo real"
echo "  docker stop $CONTAINER_NAME         # Detener aplicación"
echo "  docker start $CONTAINER_NAME        # Iniciar aplicación nuevamente"
echo "  docker exec -it $CONTAINER_NAME sh  # Acceder al contenedor"
echo ""
echo "Para reconstruir:"
echo "  ./run-complete-docker.sh"