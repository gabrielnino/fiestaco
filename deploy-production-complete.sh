#!/bin/bash

# DEPLOY COMPLETO PARA PRODUCCIÓN - FIESTACO CON ANALYTICS
# Incluye Nginx, Docker, SSL y monitoreo

set -e
echo "🚀 DEPLOY COMPLETO PARA PRODUCCIÓN"
echo "====================================="
echo "📅 Fecha: $(date)"
echo "💻 Host: $(hostname)"
echo ""

# Variables de configuración
CONTAINER_NAME="fiestaco-production"
IMAGE_NAME="fiestaco:production"
CONTAINER_PORT=3001
NGINX_PORT=80
NGINX_SSL_PORT=443
DOMAIN="fiestaco.today"
DATA_DIR="/opt/fiestaco/data"
BACKUP_DIR="/opt/fiestaco/backups"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para verificar comandos
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "Comando $1 no encontrado"
        exit 1
    fi
}

# Verificar comandos necesarios
log_info "Verificando dependencias..."
check_command docker
check_command nginx
check_command curl
check_command git

# 1. CREAR DIRECTORIOS
log_info "1. Creando directorios..."
mkdir -p $DATA_DIR
mkdir -p $BACKUP_DIR
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

log_success "Directorios creados"

# 2. BACKUP DE CONFIGURACIÓN ACTUAL
log_info "2. Haciendo backup de configuración actual..."
BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/nginx_backup_$BACKUP_TIMESTAMP.tar.gz /etc/nginx/ 2>/dev/null || true
docker exec $CONTAINER_NAME tar -czf /tmp/app_backup_$BACKUP_TIMESTAMP.tar.gz /app 2>/dev/null || true

log_success "Backup completado: $BACKUP_DIR/nginx_backup_$BACKUP_TIMESTAMP.tar.gz"

# 3. DETENER SERVICIOS EXISTENTES
log_info "3. Deteniendo servicios existentes..."
docker stop $CONTAINER_NAME 2>/dev/null || log_warning "No hay contenedor para detener"
docker rm $CONTAINER_NAME 2>/dev/null || log_warning "No hay contenedor para eliminar"
systemctl stop nginx 2>/dev/null || log_warning "Nginx no estaba corriendo"

# 4. CONSTRUIR IMAGEN DOCKER
log_info "4. Construyendo imagen Docker..."
cd /opt/fiestaco || { log_error "Directorio /opt/fiestaco no existe"; exit 1; }

# Pull latest code
git pull origin main 2>/dev/null || log_warning "No se pudo hacer git pull, usando código local"

# Build Docker image
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    log_success "Imagen Docker construida: $IMAGE_NAME"
else
    log_error "Error construyendo imagen Docker"
    exit 1
fi

# 5. EJECUTAR CONTENEDOR
log_info "5. Ejecutando contenedor..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 127.0.0.1:$CONTAINER_PORT:3001 \
  -v $DATA_DIR:/app/data \
  -e NODE_ENV=production \
  -e ANALYTICS_TOKEN="fiestaco-prod-$(date +%s)" \
  -e DASHBOARD_TOKEN="fiestaco-admin-$(date +%s)" \
  $IMAGE_NAME

if [ $? -eq 0 ]; then
    log_success "Contenedor ejecutado: $CONTAINER_NAME"
else
    log_error "Error ejecutando contenedor"
    exit 1
fi

# 6. ESPERAR INICIALIZACIÓN
log_info "6. Esperando inicialización del contenedor..."
sleep 10

MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f http://localhost:$CONTAINER_PORT/health > /dev/null 2>&1; then
        log_success "Contenedor saludable en http://localhost:$CONTAINER_PORT"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    log_info "Intento $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    log_error "Contenedor no responde después de $MAX_RETRIES intentos"
    docker logs $CONTAINER_NAME
    exit 1
fi

# 7. CONFIGURAR NGINX
log_info "7. Configurando Nginx..."

# Crear configuración Nginx
cat > /etc/nginx/sites-available/fiestaco << EOF
# Configuración Nginx para Fiestaco
server {
    listen $NGINX_PORT;
    listen [::]:$NGINX_PORT;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirección HTTP → HTTPS (si tienes SSL)
    # return 301 https://\$server_name\$request_uri;
    
    location / {
        proxy_pass http://localhost:$CONTAINER_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Configuración específica para API analytics
    location /api/analytics {
        proxy_pass http://localhost:$CONTAINER_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
    
    # Cache para assets estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:$CONTAINER_PORT;
    }
    
    # No cache para dashboard
    location /dashboard {
        proxy_pass http://localhost:$CONTAINER_PORT;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }
}

# Configuración SSL (descomentar cuando tengas certificados)
# server {
#     listen $NGINX_SSL_PORT ssl http2;
#     listen [::]:$NGINX_SSL_PORT ssl http2;
#     server_name $DOMAIN www.$DOMAIN;
#     
#     ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
#     
#     # Resto de la configuración igual que arriba
#     location / {
#         proxy_pass http://localhost:$CONTAINER_PORT;
#         # ... misma configuración proxy
#     }
# }
EOF

# Habilitar sitio
ln -sf /etc/nginx/sites-available/fiestaco /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Testear configuración Nginx
nginx -t
if [ $? -eq 0 ]; then
    log_success "Configuración Nginx válida"
else
    log_error "Error en configuración Nginx"
    exit 1
fi

# 8. INICIAR NGINX
log_info "8. Iniciando Nginx..."
systemctl start nginx
systemctl enable nginx 2>/dev/null || true

sleep 3

# Verificar Nginx
if systemctl is-active --quiet nginx; then
    log_success "Nginx corriendo correctamente"
else
    log_error "Nginx no se pudo iniciar"
    systemctl status nginx
    exit 1
fi

# 9. VERIFICAR DESPLIEGUE COMPLETO
log_info "9. Verificando despliegue completo..."

# Verificar acceso HTTP
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN/ || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    log_success "Sitio principal accesible (HTTP $HTTP_STATUS)"
else
    log_warning "Sitio principal status: $HTTP_STATUS"
fi

# Verificar dashboard
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN/dashboard || echo "000")
if [ "$DASHBOARD_STATUS" = "200" ]; then
    log_success "Dashboard accesible (HTTP $DASHBOARD_STATUS)"
    log_info "   Contraseña: fiestaco2024"
elif [ "$DASHBOARD_STATUS" = "404" ]; then
    log_error "Dashboard no encontrado (404)"
else
    log_warning "Dashboard status: $DASHBOARD_STATUS"
fi

# Verificar API analytics
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://$DOMAIN/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"deploy-test","eventName":"deploy_complete","pagePath":"/"}' || echo "000")
if [ "$API_STATUS" = "200" ]; then
    log_success "API Analytics funcionando (HTTP $API_STATUS)"
else
    log_warning "API Analytics status: $API_STATUS"
fi

# 10. CONFIGURAR MONITOREO
log_info "10. Configurando monitoreo..."

# Crear script de monitoreo
cat > /opt/fiestaco/monitor.sh << 'EOF'
#!/bin/bash
echo "🔄 Monitoreo Fiestaco - $(date)"
echo "================================"

# Verificar contenedor
if docker ps | grep -q fiestaco-production; then
    echo "✅ Contenedor: CORRIENDO"
else
    echo "❌ Contenedor: DETENIDO"
fi

# Verificar Nginx
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx: CORRIENDO"
else
    echo "❌ Nginx: DETENIDO"
fi

# Verificar salud aplicación
if curl -s -f http://localhost:3001/health > /dev/null; then
    echo "✅ Aplicación: SALUDABLE"
else
    echo "❌ Aplicación: NO RESPONDE"
fi

# Estadísticas analytics
if [ -f /opt/fiestaco/data/analytics.db ]; then
    EVENT_COUNT=$(sqlite3 /opt/fiestaco/data/analytics.db "SELECT COUNT(*) FROM events;" 2>/dev/null || echo "0")
    echo "📊 Eventos analytics: $EVENT_COUNT"
fi

echo "📈 Uso recursos:"
docker stats fiestaco-production --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
EOF

chmod +x /opt/fiestaco/monitor.sh

# Crear cron job para monitoreo (cada hora)
(crontab -l 2>/dev/null | grep -v "/opt/fiestaco/monitor.sh"; echo "0 * * * * /opt/fiestaco/monitor.sh >> /var/log/fiestaco-monitor.log 2>&1") | crontab -

log_success "Monitoreo configurado"

# 11. RESUMEN FINAL
echo ""
echo "====================================="
echo "🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE"
echo "====================================="
echo ""
echo "🌐 URLs DE ACCESO:"
echo "   • Sitio: http://$DOMAIN"
echo "   • Dashboard: http://$DOMAIN/dashboard"
echo "   • Contraseña dashboard: ${GREEN}fiestaco2024${NC}"
echo ""
echo "🔧 CREDENCIALES API:"
echo "   • Token básico: Generado automáticamente"
echo "   • Token admin: Generado automáticamente"
echo ""
echo "📊 DATOS ANALYTICS:"
echo "   • Base de datos: $DATA_DIR/analytics.db"
echo "   • Monitoreo: /opt/fiestaco/monitor.sh"
echo ""
echo "🛠️ COMANDOS ÚTILES:"
echo "   • Ver logs: docker logs $CONTAINER_NAME -f"
echo "   • Shell contenedor: docker exec -it $CONTAINER_NAME sh"
echo "   • Reiniciar: systemctl restart nginx && docker restart $CONTAINER_NAME"
echo "   • Monitoreo: /opt/fiestaco/monitor.sh"
echo ""
echo "📁 BACKUPS:"
echo "   • Ubicación: $BACKUP_DIR/"
echo "   • Último: nginx_backup_$BACKUP_TIMESTAMP.tar.gz"
echo ""
echo "⚠️  PRÓXIMOS PASOS:"
echo "   1. Configurar SSL/TLS (Let's Encrypt)"
echo "   2. Configurar firewall (ufw/iptables)"
echo "   3. Configurar backup automático de base de datos"
echo "   4. Monitorear logs: tail -f /var/log/nginx/access.log"
echo ""
echo "🕐 Despliegue finalizado: $(date)"
echo "====================================="

# 12. PRUEBA FINAL
log_info "Realizando prueba final..."
sleep 2

echo ""
echo "🧪 PRUEBA DE INTEGRACIÓN:"
/opt/fiestaco/monitor.sh