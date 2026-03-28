#!/bin/bash

# Comando SSH listo para copiar y pegar
# Ejecuta ESTE comando en tu terminal LOCAL para desplegar en producción

echo "📋 COPIA Y PEGA ESTE COMANDO EN TU TERMINAL LOCAL:"
echo "=================================================="
echo ""
echo "ssh root@45.137.194.230 'cd /opt/fiestaco && git pull origin main && chmod +x deploy-now.sh && ./deploy-now.sh'"
echo ""
echo "🔑 Si usas un usuario diferente a 'root', cambia 'root' por tu usuario."
echo ""
echo "📝 O si prefieres hacerlo paso a paso:"
echo "1. Conectar: ssh tu-usuario@45.137.194.230"
echo "2. Navegar: cd /opt/fiestaco"
echo "3. Actualizar: git pull origin main"
echo "4. Ejecutar: chmod +x deploy-now.sh"
echo "5. Desplegar: ./deploy-now.sh"
echo ""
echo "⏱️  El proceso tomará 2-3 minutos."
echo "✅ Al finalizar, el dashboard estará en: https://fiestaco.today/dashboard"
echo "🔐 Contraseña: fiestaco2024"