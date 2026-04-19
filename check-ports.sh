#!/bin/bash
# Script para verificar puertos y prevenir conflictos

echo "🔍 Verificando puertos..."

check_port() {
    local port=$1
    if ss -tulpn 2>/dev/null | grep -q ":$port " || netstat -tulpn 2>/dev/null | grep -q ":$port "; then
        echo "❌ Puerto $port está en uso"
        echo "   Procesos:"
        lsof -ti:$port 2>/dev/null | xargs ps -o pid,cmd -p 2>/dev/null || echo "   No se pudo obtener información detallada"
        return 1
    else
        echo "✅ Puerto $port está libre"
        return 0
    fi
}

echo ""
echo "=== PUERTOS DE FIESTACO ==="
check_port 3000
check_port 3001
check_port 3002

echo ""
echo "=== RECOMENDACIONES ==="
echo "• Para desarrollo local: puerto 3000"
echo "• Para Docker: puerto 3001"
echo "• Para pruebas: puerto 3002"
echo ""
echo "Para liberar un puerto:"
echo "  lsof -ti:3000 | xargs kill -9 2>/dev/null"