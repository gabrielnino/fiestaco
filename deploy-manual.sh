#!/bin/bash
# DEPLOY MANUAL - Sin Docker
# Para cuando Docker falla completamente

set -e

echo "========================================="
echo "🚀 DEPLOY MANUAL FIESTACO"
echo "========================================="

echo "📦 Instalando dependencias..."
npm ci --legacy-peer-deps

echo "🔧 Configurando entorno..."
export NODE_ENV=production
export DISABLE_SQLITE_ANALYTICS=true
export NEXT_TELEMETRY_DISABLED=1

echo "🏗️  Construyendo aplicación..."
npm run build

echo "✅ Build completado!"

echo ""
echo "========================================="
echo "🎯 OPCIONES DE EJECUCIÓN:"
echo "========================================="
echo ""
echo "1. 🚀 EJECUTAR EN PRIMER PLANO:"
echo "   PORT=3001 HOSTNAME=0.0.0.0 npm start"
echo ""
echo "2. 📊 EJECUTAR EN BACKGROUND:"
echo "   PORT=3001 HOSTNAME=0.0.0.0 npm start > server.log 2>&1 &"
echo "   echo $! > server.pid"
echo ""
echo "3. 🔍 VER LOGS:"
echo "   tail -f server.log"
echo ""
echo "4. 🛑 DETENER:"
echo "   kill \$(cat server.pid) 2>/dev/null || pkill -f \"node.*server.js\""
echo ""
echo "5. 📋 VERIFICAR:"
echo "   curl http://localhost:3001"
echo ""
echo "========================================="
echo "✅ Cambios del guacamole YA aplicados:"
echo "   - Error tipográfico corregido"
echo "   - Mejor manejo de URLs externas"
echo "   - Componentes actualizados"
echo "   - SQLite deshabilitado"
echo "========================================="