# 🐳 Despliegue de FiestaCo en Docker

Esta guía explica cómo desplegar FiestaCo en un contenedor Docker.

## 🚀 Despliegue Rápido

### 1. Construir la aplicación
```bash
npm run build
```

### 2. Construir imagen Docker (modo standalone - RECOMENDADO)
```bash
docker build -t fiestaco:latest -f Dockerfile.standalone .
```

### 3. Ejecutar contenedor
```bash
docker run -d --name fiestaco -p 3001:3001 --restart unless-stopped fiestaco:latest
```

### 4. Verificar
- Aplicación: http://localhost:3001
- Health check: http://localhost:3001/health
- Logs: `docker logs -f fiestaco`

## 📦 Opciones de Dockerfile

### `Dockerfile.standalone` (RECOMENDADO)
- **Tamaño**: ~200MB
- **Rendimiento**: Óptimo
- **Requisitos**: Necesita `npm run build` primero
- **Uso**: Para producción

### `Dockerfile.final`
- **Tamaño**: ~3.5GB
- **Rendimiento**: Bueno
- **Requisitos**: Construye todo en el contenedor
- **Uso**: Para desarrollo/testing

## 🔧 Configuración

### Variables de entorno
```bash
NODE_ENV=production
PORT=3001
HOSTNAME=0.0.0.0
NEXT_TELEMETRY_DISABLED=1
DISABLE_SQLITE_ANALYTICS=true  # Deshabilita SQLite para Docker
```

### Puertos
- **3001**: Aplicación principal
- Cambiable con `-p <puerto-externo>:3001`

## 🐳 Comandos Docker útiles

### Gestión de contenedores
```bash
# Iniciar
docker start fiestaco

# Detener
docker stop fiestaco

# Reiniciar
docker restart fiestaco

# Eliminar
docker rm fiestaco

# Ver logs
docker logs -f fiestaco
```

### Gestión de imágenes
```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi fiestaco:latest

# Limpiar imágenes sin uso
docker image prune -a
```

### Inspección
```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores
docker ps -a

# Acceder al contenedor
docker exec -it fiestaco sh
```

## 🧪 Verificación

### Health check
```bash
curl http://localhost:3001/health
```
Debería devolver:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "service": "fiestaco-staging",
  "version": "1.0.0-optimized"
}
```

### Página principal
```bash
curl -I http://localhost:3001/
```
Debería devolver `HTTP/1.1 200 OK`.

## 🚨 Solución de problemas

### Puerto ya en uso
```bash
# Ver qué usa el puerto 3001
netstat -tulpn | grep :3001

# Usar puerto diferente
docker run -d --name fiestaco -p 3002:3001 fiestaco:latest
```

### Contenedor se reinicia
```bash
# Ver logs de error
docker logs fiestaco

# Ejecutar en modo interactivo para debug
docker run --rm -it -p 3001:3001 fiestaco:latest
```

### Imagen no se construye
1. Verificar que `npm run build` funciona
2. Asegurar que existe `.next/standalone/`
3. Revisar permisos de archivos

## 📊 Monitoreo

### Logs en tiempo real
```bash
docker logs -f fiestaco
```

### Estadísticas del contenedor
```bash
docker stats fiestaco
```

### Uso de recursos
```bash
docker container inspect fiestaco | grep -A5 "State"
```

## 🔒 Seguridad

### Usuario no-root
La imagen usa usuario `nextjs` (UID 1001) en lugar de root.

### Headers de seguridad
La aplicación incluye:
- HSTS (HTTP Strict Transport Security)
- X-Content-Type-Options
- X-Frame-Options

### Actualizaciones
```bash
# Reconstruir con cambios
npm run build
docker build -t fiestaco:latest -f Dockerfile.standalone .
docker stop fiestaco && docker rm fiestaco
docker run -d --name fiestaco -p 3001:3001 fiestaco:latest
```

## 🎯 Producción

Para entornos de producción:
1. Usar `Dockerfile.standalone`
2. Configurar reverse proxy (nginx/apache)
3. Implementar SSL/TLS
4. Configurar monitoreo
5. Establecer políticas de reinicio
6. Usar orquestador (Docker Compose, Kubernetes)

## 📞 Soporte

Problemas comunes:
1. **SQLite no funciona en Docker** → Usar `DISABLE_SQLITE_ANALYTICS=true`
2. **Puerto en uso** → Cambiar puerto externo
3. **Falta memoria** → Aumentar recursos del contenedor
4. **Permisos** → Verificar ownership de `/app`

Para más ayuda, revisar los logs del contenedor.