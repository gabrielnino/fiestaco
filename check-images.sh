#!/bin/bash
# Script para verificar todas las imágenes referenciadas en ImageOptimized.tsx

echo "🔍 Verificando imágenes referenciadas en ImageOptimized.tsx..."
echo ""

# Extraer rutas únicas de imágenes
IMAGE_PATHS=$(grep -o "'/images/[^']*'" components/ImageOptimized.tsx | sed "s/'//g" | sort -u)

echo "📋 Imágenes a verificar:"
echo "$IMAGE_PATHS"
echo ""
echo "🧪 Verificando acceso a cada imagen..."
echo ""

FAILED=0
TOTAL=0

for image in $IMAGE_PATHS; do
    TOTAL=$((TOTAL + 1))
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001$image 2>/dev/null)

    if [ "$STATUS" = "200" ]; then
        echo "✅ $image - OK (HTTP $STATUS)"
    else
        echo "❌ $image - FALLO (HTTP $STATUS)"
        FAILED=$((FAILED + 1))

        # Verificar si el archivo existe localmente
        LOCAL_PATH="public$image"
        if [ -f "$LOCAL_PATH" ]; then
            echo "   📁 Existe localmente: $LOCAL_PATH"
            # Verificar tamaño
            SIZE=$(stat -c%s "$LOCAL_PATH" 2>/dev/null || stat -f%z "$LOCAL_PATH" 2>/dev/null || echo "?")
            echo "   📏 Tamaño: $SIZE bytes"
        else
            echo "   ⚠️  NO existe localmente: $LOCAL_PATH"
            # Buscar archivos similares
            DIR=$(dirname "$LOCAL_PATH")
            BASE=$(basename "$LOCAL_PATH" .webp)
            BASE=$(basename "$BASE" .jpg)
            BASE=$(basename "$BASE" .png)
            BASE=$(basename "$BASE" .jpeg)

            echo "   🔍 Buscando alternativas en $DIR:"
            find "$DIR" -name "$BASE.*" 2>/dev/null | while read alt; do
                echo "   🗂️  Alternativa: $alt"
            done
        fi
    fi
done

echo ""
echo "📊 Resumen:"
echo "✅ Imágenes accesibles: $((TOTAL - FAILED))/$TOTAL"
echo "❌ Imágenes fallidas: $FAILED/$TOTAL"

if [ $FAILED -eq 0 ]; then
    echo "🎉 ¡Todas las imágenes funcionan correctamente!"
else
    echo "🔧 Algunas imágenes necesitan atención."
fi