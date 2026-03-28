# 🚀 INSTRUCCIONES PARA DESPLEGAR EN PRODUCCIÓN AHORA

## 📍 UBICACIÓN ACTUAL
- **Estás en:** Servidor de desarrollo/testing (vmi3154655)
- **Producción es:** 45.137.194.230 (fiestaco.today)

## 🔧 PASOS PARA DESPLEGAR EN PRODUCCIÓN

### **PASO 1: CONECTAR AL SERVIDOR DE PRODUCCIÓN**
```bash
# Conéctate a tu servidor de producción
ssh usuario@45.137.194.230
# o
ssh usuario@tu-servidor
```

### **PASO 2: ACTUALIZAR CÓDIGO**
```bash
# Ir al directorio de Fiestaco
cd /opt/fiestaco

# Actualizar código desde GitHub
git pull origin main

# Si hay cambios locales, hacer backup primero
cp -r app/ app.backup.$(date +%s)/
```

### **PASO 3: EJECUTAR DEPLOY COMPLETO**
```bash
# Dar permisos de ejecución
chmod +x deploy-now.sh

# Ejecutar deploy
./deploy-now.sh
```

### **PASO 4: VERIFICAR DESPLIEGUE**
```bash
# Verificar contenedor
docker ps | grep fiestaco

# Verificar logs
docker logs fiestaco-production --tail 20

# Probar localmente en el servidor
curl http://localhost:3001/health
curl http://localhost:3001/dashboard

# Probar producción
curl https://fiestaco.today/dashboard
```

## 🐳 COMANDOS MANUALES (ALTERNATIVA)

Si el script no funciona, ejecuta estos comandos manualmente:

### **1. Construir imagen:**
```bash
cd /opt/fiestaco
docker build -t fiestaco:production-$(date +%s) .
```

### **2. Detener contenedor viejo:**
```bash
docker stop fiestaco-production 2>/dev/null || true
docker rm fiestaco-production 2>/dev/null || true
```

### **3. Ejecutar nuevo contenedor:**
```bash
docker run -d \
  --name fiestaco-production \
  --restart unless-stopped \
  -p 127.0.0.1:3001:3001 \
  -v /opt/fiestaco/data:/app/data \
  -e NODE_ENV=production \
  fiestaco:production-$(date +%s)
```

### **4. Configurar Nginx:**
```bash
# Verificar configuración actual
cat /etc/nginx/sites-available/fiestaco

# Debe tener esta línea:
# proxy_pass http://localhost:3001;

# Si no es el puerto 3001, actualizar:
sudo sed -i 's|proxy_pass http://localhost:[0-9]*;|proxy_pass http://localhost:3001;|g' /etc/nginx/sites-available/fiestaco

# Recargar Nginx
sudo nginx -t && sudo systemctl reload nginx
```

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Error: "502 Bad Gateway"**
```bash
# 1. Verificar contenedor
docker ps | grep fiestaco

# 2. Verificar logs
docker logs fiestaco-production

# 3. Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# 4. Verificar puerto
sudo netstat -tulpn | grep 3001
```

### **Error: "Port already in use"**
```bash
# Verificar qué usa el puerto 3001
sudo lsof -i :3001

# Si hay conflicto, usar puerto diferente
# Cambiar en docker run: -p 127.0.0.1:3002:3001
# Y en Nginx: proxy_pass http://localhost:3002;
```

### **Error: "Cannot connect to database"**
```bash
# Verificar permisos
sudo chmod 777 /opt/fiestaco/data

# Verificar archivo de base de datos
ls -la /opt/fiestaco/data/analytics.db
```

## 📞 VERIFICACIÓN POST-DEPLOY

### **Pruebas obligatorias:**
1. **Sitio principal:** https://fiestaco.today
2. **Dashboard:** https://fiestaco.today/dashboard
3. **Contraseña:** `fiestaco2024`
4. **API:** `curl -X POST https://fiestaco.today/api/analytics`

### **Comandos de verificación:**
```bash
# En el servidor de producción
cd /opt/fiestaco

# 1. Verificar salud
curl http://localhost:3001/health

# 2. Probar dashboard local
curl http://localhost:3001/dashboard | grep -o "<title>.*</title>"

# 3. Probar API
curl -X POST http://localhost:3001/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"prod-test","eventName":"deploy_verify","pagePath":"/"}'

# 4. Verificar producción
curl -I https://fiestaco.today/dashboard
```

## 🎯 RESUMEN RÁPIDO

### **Para desplegar AHORA, ejecuta en tu servidor:**
```bash
ssh usuario@45.137.194.230
cd /opt/fiestaco
git pull origin main
chmod +x deploy-now.sh
./deploy-now.sh
```

### **Credenciales después del deploy:**
- **Dashboard:** https://fiestaco.today/dashboard
- **Contraseña:** `fiestaco2024`
- **API Token:** Generado automáticamente (ver logs)

### **Si algo falla:**
1. Revisar logs: `docker logs fiestaco-production`
2. Verificar Nginx: `nginx -t`
3. Probar manualmente: `curl http://localhost:3001/health`

---

**🚀 ¡Ejecuta estos comandos en tu servidor de producción para tener el dashboard funcionando en minutos!**