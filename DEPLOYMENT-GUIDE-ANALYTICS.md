# Guía de Despliegue - Sistema de Analytics

## 📋 Resumen de Cambios

Se ha implementado un sistema de analytics ligero y privado para Fiestaco que:

### ✅ **Nuevos Archivos:**
1. `/lib/db/index.ts` - Conexión a SQLite
2. `/app/api/analytics/route.ts` - Endpoint de analytics
3. `/lib/analytics.ts` - Cliente frontend
4. `/components/AnalyticsProvider.tsx` - Provider React
5. `/scripts/test-analytics.js` - Script de prueba
6. `/scripts/monitor-analytics.js` - Script de monitoreo

### ✅ **Archivos Modificados:**
1. `/app/layout.tsx` - Agregado AnalyticsProvider
2. `/app/page.tsx` - Integración de tracking en wizard

### ✅ **Dependencias Agregadas:**
- `sqlite3` ^5.1.6
- `sqlite` ^5.1.1

## 🚀 Pasos para Desplegar en Producción

### **Paso 1: Verificar Build Local**
```bash
cd ./fiestaco
npm run build
```

### **Paso 2: Probar Localmente**
```bash
# Iniciar servidor de desarrollo
npm run dev

# En otra terminal, probar analytics
node scripts/test-analytics.js
```

### **Paso 3: Reconstruir Imagen Docker**
```bash
# Si usas Docker, reconstruir la imagen
docker build -t fiestaco:latest .

# O usar tu script de deploy existente
./deploy-staging.sh  # Primero en staging
./deploy-new-container.sh  # Luego en producción
```

### **Paso 4: Verificar en Producción**
1. Visitar `https://fiestaco.today`
2. Abrir DevTools → Console
3. Verificar que no hay errores
4. Completar un flujo de compra
5. Verificar que se crea `data/analytics.db`

## 🧪 Pruebas Post-Despliegue

### **Prueba 1: Endpoint de Analytics**
```bash
# Probar que el endpoint responde
curl -X POST https://fiestaco.today/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "eventName": "test",
    "pagePath": "/test"
  }'
```

### **Prueba 2: Flujo Completo**
1. Visitar la página principal
2. Hacer clic en "Build Your Kit"
3. Seleccionar 2 sabores
4. Agregar add-ons
5. Seleccionar bebidas
6. Hacer clic en "Order via WhatsApp"
7. Verificar que todos los eventos se registran

## 📊 Acceso a los Datos

### **Método 1: Script de Monitoreo**
```bash
cd ./fiestaco
node scripts/monitor-analytics.js
```

### **Método 2: SQLite Directo**
```bash
# Conectarse a la base de datos
sqlite3 data/analytics.db

# Consultas útiles:
SELECT COUNT(*) FROM events;  # Total de eventos
SELECT * FROM events ORDER BY created_at DESC LIMIT 10;  # Eventos recientes
SELECT event_name, COUNT(*) FROM events GROUP BY event_name;  # Eventos por tipo
```

### **Método 3: API Protegida**
```bash
# Obtener estadísticas (requiere token)
curl -H "Authorization: Bearer fiestaco-dev" \
  https://fiestaco.today/api/analytics
```

## 🔧 Configuración de Entorno

### **Variables Opcionales:**
```bash
# En tu entorno de producción
export ANALYTICS_TOKEN="tu-token-secreto"  # Para proteger el endpoint GET
```

### **Configuración de Base de Datos:**
- La base de datos se crea automáticamente en `data/analytics.db`
- No requiere configuración adicional
- Se mantiene entre reinicios del contenedor

## 🛠️ Mantenimiento

### **Backup de Datos:**
```bash
# Backup manual
cp data/analytics.db data/analytics.db.backup-$(date +%Y%m%d)

# Backup automático (agregar a cron)
0 2 * * * cd /ruta/a/fiestaco && cp data/analytics.db data/analytics.db.backup-$(date +\%Y\%m\%d)
```

### **Limpieza de Datos:**
```sql
-- Eliminar eventos antiguos (más de 90 días)
DELETE FROM events WHERE created_at < DATETIME('now', '-90 days');

-- Optimizar base de datos
VACUUM;
```

## 📈 Métricas Clave a Monitorear

### **Diariamente:**
1. **Total de visitas:** `page_view` events
2. **Wizards iniciados:** `wizard_start` events  
3. **Conversiones:** `whatsapp_click` events
4. **Tasa de conversión:** `whatsapp_clicks / page_views`

### **Semanalmente:**
1. **Funnel de conversión:** 
   - Página → Wizard → Step 1 → Step 2 → Step 3 → Step 4 → WhatsApp
2. **Sabores populares:** `flavor_select` events
3. **Add-ons populares:** `addon_select` events
4. **Puntos de abandono:** Donde los usuarios dejan el flujo

## 🚨 Solución de Problemas

### **Problema: No se crea la base de datos**
```bash
# Verificar permisos
ls -la data/

# Verificar que SQLite puede escribir
touch data/test.txt
rm data/test.txt
```

### **Problema: Errores en la consola**
1. Verificar que `sqlite3` está instalado en el contenedor
2. Verificar permisos de escritura en `data/`
3. Revisar logs del contenedor: `docker logs <container_id>`

### **Problema: Eventos no se registran**
1. Verificar conexión a internet
2. Verificar que el endpoint `/api/analytics` responde
3. Revisar errores en DevTools → Network

## 🔄 Rollback (Si es Necesario)

### **Rollback Completo:**
```bash
# 1. Restaurar layout original
cp ./app/layout.tsx.backup-* ./app/layout.tsx

# 2. Restaurar página principal
cp ./app/page.tsx.backup-* ./app/page.tsx

# 3. Eliminar archivos nuevos
rm -rf ./lib/db ./lib/analytics.ts ./components/AnalyticsProvider.tsx
rm -rf ./scripts/test-analytics.js ./scripts/monitor-analytics.js

# 4. Reconstruir
npm run build
```

### **Rollback Parcial (solo analytics):**
```bash
# Solo deshabilitar analytics manteniendo código
# Editar layout.tsx y comentar <AnalyticsProvider />
```

## 🎯 Próximos Pasos (Opcionales)

### **Mejoras Futuras:**
1. **Dashboard web** para ver estadísticas
2. **Exportación a CSV** de los datos
3. **Integración con Slack** para notificaciones
4. **Análisis de cohortes** por fecha
5. **Segmentación** por dispositivo/ubicación

### **Escalabilidad:**
- Actualmente soporta ~10,000 eventos/día
- Para más tráfico, considerar migrar a PostgreSQL
- Implementar rotación de tablas mensuales

## 📞 Soporte

### **Para Problemas Técnicos:**
1. Revisar logs: `docker logs <container_id>`
2. Verificar base de datos: `sqlite3 data/analytics.db ".schema"`
3. Probar endpoint: `curl -X POST https://fiestaco.today/api/analytics ...`

### **Para Preguntas:**
- Documentación: Ver `ANALYTICS.md`
- Código: Revisar implementación en `/lib/analytics.ts`
- Ejemplos: Ver `/scripts/test-analytics.js`

---

**✅ El sistema está listo para producción.**
**🚀 Despliega con confianza y monitorea los resultados.**