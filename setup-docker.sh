#!/bin/bash
# Script para configurar y arrancar Docker rootless

echo "🚀 Configurando Docker rootless..."

# Configurar PATH
export PATH="$HOME/.local/bin:$PATH"
echo "✓ PATH actualizado"

# Configurar variables de entorno para Docker rootless
export DOCKER_HOST="unix://$HOME/.docker/run/docker.sock"
export DOCKER_CONFIG="$HOME/.docker"
echo "✓ Variables de entorno configuradas"

# Crear directorios necesarios
mkdir -p ~/.docker/run ~/.docker/data ~/.docker/containerd

echo "🔧 Iniciando dockerd en modo rootless..."

# Matar cualquier proceso dockerd existente
pkill -f "dockerd" 2>/dev/null || true

# Iniciar dockerd en segundo plano
nohup dockerd \
  --data-root="$HOME/.docker/data" \
  --exec-root="$HOME/.docker/run" \
  --host="$DOCKER_HOST" \
  --containerd="/run/user/$(id -u)/containerd/containerd.sock" \
  --pidfile="$HOME/.docker/run/docker.pid" \
  > "$HOME/.docker/dockerd.log" 2>&1 &

# Esperar a que dockerd inicie
echo "⏳ Esperando que dockerd inicie..."
sleep 5

# Verificar si dockerd está corriendo
if pgrep -f "dockerd" > /dev/null; then
    echo "✅ dockerd iniciado correctamente"
else
    echo "❌ Error: dockerd no se pudo iniciar"
    echo "Revisar logs en: $HOME/.docker/dockerd.log"
    exit 1
fi

# Probar Docker
echo "🧪 Probando Docker..."
if docker version > /dev/null 2>&1; then
    echo "✅ Docker funcionando correctamente"
    echo "🖥️  Cliente: $(docker version --format '{{.Client.Version}}')"
else
    echo "❌ Error: No se puede conectar a Docker"
    exit 1
fi

echo ""
echo "🎉 Docker configurado exitosamente en modo rootless!"
echo ""
echo "Para usar Docker en futuras sesiones, ejecuta:"
echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
echo "  export DOCKER_HOST=\"unix://\$HOME/.docker/run/docker.sock\""
echo "  source $PWD/setup-docker.sh"
echo ""
echo "Comandos útiles:"
echo "  docker version          # Verificar versión"
echo "  docker run hello-world  # Probar con imagen de prueba"
echo "  docker ps               # Listar contenedores"
echo ""