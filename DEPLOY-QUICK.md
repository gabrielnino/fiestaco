# 🚀 DESPLIEGUE RÁPIDO - FIESTACO CON ANALYTICS

## 📋 RESUMEN DE CAMBIOS

Se ha implementado un sistema completo de analytics con dashboard que incluye:

### ✅ **Nuevas Funcionalidades:**
1. **📊 Analytics tracking** - SQLite-based, privacy-first
2. **🎯 Dashboard visual** - Métricas en tiempo real
3. **🪜 Funnel tracking** - Seguimiento completo del usuario
4. **🔧 API endpoints** - `/api/analytics` y `/api/analytics/dashboard`
5. **📈 Scripts de monitoreo** - Herramientas de diagnóstico

### ✅ **Archivos Principales:**
- `app/dashboard/` - Dashboard completo
- `app/api/analytics/` - Endpoints de analytics
- `lib/analytics.ts` - Cliente frontend
- `lib/db/` - Base de datos SQLite
- `scripts/` - Herramientas de prueba/monitoreo

## 🚀 PASOS PARA DESPLEGAR EN PRODUCCIÓN

### **Opción 1: Despliegue Automático (Recomendado)**
```bash
# 1. Conectar al servidor de producción
ssh usuario@tu-servidor

# 2. Clonar/actualizar repositorio
cd /opt
git clone https://github.com/gabrielnino/fiestaco.git || cd fiestaco && git pull

# 3. Ejecutar despliegue completo
cd fiestaco
chmod +x deploy-production-complete.sh
./deploy-production-complete.sh
```

### **Opción 2: Despliegue Manual**
```bash
# 1. Construir imagen Docker
docker build -t fiestaco:production .

# 2. Ejecutar contenedor
docker run -d \
  --name fiestaco-production \
  -p 3001:3001 \
  -v ./data:/app/data \
  -e NODE_ENV=production \
  fiestaco:production

# 3. Configurar Nginx (ejemplo)
# Editar /etc/nginx/sites-available/fiestaco
# Ver deploy-production-complete.sh para configuración completa

# 4. Reiniciar Nginx
systemctl restart nginx
```

### **Opción 3: Despliegue Local (Testing)**
```bash
# Ya está hecho - verificar con:
curl http://localhost:3101/dashboard
# Contraseña: fiestaco2024
```

## 🌐 URLs DE ACCESO

### **Después del Despliegue:**
- **Sitio principal:** `https://fiestaco.today`
- **Dashboard analytics:** `https://fiestaco.today/dashboard`
- **Contraseña dashboard:** `fiestaco2024`
- **API analytics:** `https://fiestaco.today/api/analytics`

## 🔐 CREDENCIALES

### **Dashboard Web:**
- **URL:** `/dashboard`
- **Contraseña:** `fiestaco2024`

### **API Tokens:**
- **Básico:** Generado automáticamente (ver logs del contenedor)
- **Admin:** Generado automáticamente (ver logs del contenedor)

### **Personalizar Credenciales:**
```bash
# Variables de entorno al ejecutar contenedor
-e DASHBOARD_PASSWORD="tu-contraseña"
-e ANALYTICS_TOKEN="tu-token"
-e DASHBOARD_TOKEN="tu-token-admin"
```

## 📊 VERIFICACIÓN POST-DEPLOY

### **Pruebas Básicas:**
```bash
# 1. Verificar sitio principal
curl -I https://fiestaco.today

# 2. Verificar dashboard
curl -I https://fiestaco.today/dashboard

# 3. Probar API analytics
curl -X POST https://fiestaco.today/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","eventName":"test","pagePath":"/"}'

# 4. Verificar base de datos
docker exec fiestaco-production ls -la /app/data/
```

### **Scripts de Verificación:**
```bash
# Monitoreo completo
node scripts/test-complete-system.js

# Monitoreo básico
node scripts/monitor-analytics.js

# Prueba endpoints
node scripts/test-analytics.js
```

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error 502 Bad Gateway:**
```bash
# 1. Verificar contenedor
docker ps | grep fiestaco

# 2. Verificar logs
docker logs fiestaco-production

# 3. Verificar Nginx
nginx -t
systemctl status nginx

# 4. Verificar conexión
curl http://localhost:3001/health
```

### **Dashboard no carga:**
1. Verificar build: `npm run build`
2. Verificar ruta: `ls -la .next/server/app/dashboard/`
3. Verificar autenticación: Contraseña `fiestaco2024`
4. Verificar console del navegador (F12)

### **No hay datos en analytics:**
1. Completar flujo de compra en el sitio
2. Esperar 1-2 minutos
3. Verificar base de datos: `sqlite3 data/analytics.db "SELECT COUNT(*) FROM events;"`

## 📈 MÉTRICAS DISPONIBLES

### **En Dashboard:**
1. 👥 **Visitas únicas** - Hoy
2. 🎯 **Wizards iniciados** - Conversión inicial
3. 💰 **Pedidos WhatsApp** - Conversiones finales
4. 🪜 **Funnel completo** - Abandono por paso
5. 🌮 **Sabores populares** - Ranking
6. ⏰ **Eventos recientes** - Stream en tiempo real

### **Consultas SQL Directas:**
```sql
-- Eventos por día
SELECT DATE(created_at), COUNT(*) FROM events GROUP BY DATE(created_at);

-- Funnel de conversión
SELECT event_name, COUNT(DISTINCT session_id) 
FROM events WHERE event_name IN ('page_view','wizard_start','whatsapp_click')
GROUP BY event_name;

-- Sabores populares
SELECT json_extract(metadata, '$.flavor'), COUNT(*)
FROM events WHERE event_name = 'flavor_select'
GROUP BY json_extract(metadata, '$.flavor')
ORDER BY COUNT(*) DESC;
```

## 🛡️ SEGURIDAD

### **Recomendaciones:**
1. **Cambiar contraseñas** por defecto
2. **Configurar SSL/TLS** (Let's Encrypt)
3. **Restringir acceso** al dashboard por IP
4. **Monitorear logs** regularmente
5. **Hacer backups** de la base de datos

### **Backup Automático:**
```bash
# Agregar a cron (diario a las 2 AM)
0 2 * * * cd /opt/fiestaco && tar -czf /backups/fiestaco-analytics-$(date +\%Y\%m\%d).tar.gz data/analytics.db
```

## 📞 SOPORTE

### **Para Problemas:**
1. **Verificar logs:** `docker logs fiestaco-production -f`
2. **Probar endpoints:** Usar scripts en `scripts/`
3. **Verificar build:** `npm run build`
4. **Consultar documentación:** `ANALYTICS.md`, `DASHBOARD-README.md`

### **Recursos:**
- **Documentación analytics:** `ANALYTICS.md`
- **Guía dashboard:** `DASHBOARD-README.md`
- **Guía despliegue:** `DEPLOYMENT-GUIDE-ANALYTICS.md`
- **Scripts:** Directorio `scripts/`

---

**🎯 ¡Sistema listo para producción!**
**🚀 Despliega y comienza a tomar decisiones basadas en datos.**