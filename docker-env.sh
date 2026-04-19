#!/bin/bash
# Configuración de entorno para Docker rootless

echo "🐳 Configurando entorno Docker rootless..."

# Configurar PATH para incluir binarios de Docker
if [[ ":$PATH:" != *":$HOME/bin:"* ]]; then
    export PATH="$HOME/bin:$PATH"
    echo "✓ PATH actualizado: $HOME/bin agregado"
fi

# Configurar DOCKER_HOST para rootless
export DOCKER_HOST="unix:///run/user/$(id -u)/docker.sock"
echo "✓ DOCKER_HOST configurado: $DOCKER_HOST"

# Verificar que Docker esté funcionando
if command -v docker &> /dev/null; then
    echo "✓ Docker CLI disponible: $(docker --version | head -1)"

    if docker version &> /dev/null; then
        echo "✅ Docker funcionando correctamente"
        echo "   Cliente: $(docker version --format '{{.Client.Version}}')"
        echo "   Servidor: $(docker version --format '{{.Server.Version}}')"
    else
        echo "⚠️  Docker CLI encontrado pero no se puede conectar al daemon"
        echo "   Ejecuta: systemctl --user start docker.service"
    fi
else
    echo "❌ Docker CLI no encontrado en PATH"
    echo "   Asegúrate de que $HOME/bin esté en tu PATH"
fi

echo ""
echo "Para hacer esta configuración permanente, agrega al final de ~/.bashrc:"
echo "export PATH=\"\$HOME/bin:\$PATH\""
echo "export DOCKER_HOST=\"unix:///run/user/\$(id -u)/docker.sock\""
echo ""
echo "Comandos útiles:"
echo "  systemctl --user start docker.service    # Iniciar Docker"
echo "  systemctl --user stop docker.service     # Detener Docker"
echo "  systemctl --user status docker.service   # Estado de Docker"
echo "  sudo loginctl enable-linger $(whoami)   # Mantener Docker después de cerrar sesión"
echo ""