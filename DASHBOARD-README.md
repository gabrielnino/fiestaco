# 📊 Dashboard de Analytics - Fiestaco

## 🎯 Descripción

Dashboard interno para visualizar métricas de analytics en tiempo real. Proporciona insights sobre el comportamiento de los usuarios, funnel de conversión y popularidad de productos.

## 🌐 Acceso

### URL de Producción
```
https://fiestaco.today/dashboard
```

### Credenciales
- **Contraseña:** `fiestaco2024`
- **Token API:** `fiestaco-admin-2024`

### Acceso Local (Desarrollo)
```
http://localhost:3001/dashboard
```

## 📈 Métricas Disponibles

### 1. **Métricas Principales (Hoy)**
- 👥 **Visitas únicas** - Usuarios distintos hoy
- 🎯 **Wizards iniciados** - Usuarios que comenzaron a armar su kit
- 💰 **Pedidos WhatsApp** - Conversiones completadas
- 📊 **Tasa de conversión** - % de visitas que convierten

### 2. **🪜 Funnel de Conversión**
Visualización paso a paso del journey del usuario:
1. **Visita la página** → 2. **Inicia wizard** → 3. **Completa pasos** → 4. **Hace pedido**

### 3. **🌮 Sabores Más Populares**
Ranking de los sabores más seleccionados por los usuarios.

### 4. **⏰ Eventos Recientes**
Stream en tiempo real de los últimos eventos registrados.

## 🔧 Configuración

### Variables de Entorno (Opcional)
```bash
# En producción, puedes personalizar:
export ANALYTICS_TOKEN="tu-token-secreto"
export DASHBOARD_TOKEN="tu-token-admin"
export DASHBOARD_PASSWORD="tu-contraseña-segura"
```

### Seguridad
- ✅ Autenticación por contraseña
- ✅ Tokens JWT-style para API
- ✅ No indexado por motores de búsqueda
- ✅ Solo acceso interno

## 🚀 Uso Rápido

### 1. Acceder al Dashboard
1. Visitar `https://fiestaco.today/dashboard`
2. Ingresar contraseña: `fiestaco2024`
3. Explorar métricas

### 2. Consultar API Directamente
```bash
# Obtener estadísticas
curl -H "Authorization: Bearer fiestaco-admin-2024" \
  https://fiestaco.today/api/analytics/dashboard

# Obtener estadísticas básicas
curl -H "Authorization: Bearer fiestaco-dev" \
  https://fiestaco.today/api/analytics
```

### 3. Scripts de Utilidad
```bash
# Monitoreo desde terminal
node scripts/monitor-analytics.js

# Prueba completa del sistema
node scripts/test-complete-system.js

# Prueba básica
node scripts/test-analytics.js
```

## 📊 Ejemplos de Consultas SQL

### Eventos Totales por Día
```sql
SELECT 
  DATE(created_at) as fecha,
  COUNT(*) as eventos,
  COUNT(DISTINCT session_id) as sesiones
FROM events
GROUP BY fecha
ORDER BY fecha DESC;
```

### Funnel Detallado
```sql
WITH user_journey AS (
  SELECT 
    session_id,
    MAX(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) as visited,
    MAX(CASE WHEN event_name = 'wizard_start' THEN 1 ELSE 0 END) as started_wizard,
    MAX(CASE WHEN event_name LIKE 'step_visit%' THEN 1 ELSE 0 END) as completed_steps,
    MAX(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as converted
  FROM events
  WHERE created_at >= DATE('now', '-7 days')
  GROUP BY session_id
)
SELECT 
  COUNT(*) as total_visitors,
  SUM(started_wizard) as started_wizard,
  SUM(completed_steps) as completed_steps,
  SUM(converted) as converted,
  ROUND(100.0 * SUM(converted) / COUNT(*), 2) as conversion_rate
FROM user_journey;
```

### Sabores por Popularidad
```sql
SELECT 
  json_extract(metadata, '$.flavor') as sabor,
  COUNT(*) as selecciones,
  COUNT(DISTINCT session_id) as usuarios_unicos
FROM events
WHERE event_name = 'flavor_select'
  AND created_at >= DATE('now', '-30 days')
GROUP BY sabor
ORDER BY selecciones DESC
LIMIT 10;
```

## 🛠️ Mantenimiento

### Backup de Datos
```bash
# Backup manual
cp data/analytics.db data/analytics.db.backup-$(date +%Y%m%d)

# Backup automático (cron)
0 2 * * * cd /ruta/a/fiestaco && cp data/analytics.db data/analytics.db.backup-$(date +\%Y\%m\%d)
```

### Limpieza de Datos Antiguos
```sql
-- Eliminar eventos mayores a 90 días
DELETE FROM events WHERE created_at < DATETIME('now', '-90 days');

-- Optimizar base de datos
VACUUM;
```

### Monitoreo de Espacio
```bash
# Ver tamaño de base de datos
ls -lh data/analytics.db

# Ver crecimiento diario
sqlite3 data/analytics.db "SELECT DATE(created_at), COUNT(*) FROM events GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 7;"
```

## 🔍 Solución de Problemas

### Problema: Dashboard no carga
1. Verificar que el servidor está corriendo
2. Revisar consola del navegador (F12 → Console)
3. Verificar logs del servidor
4. Probar endpoint API directamente

### Problema: No hay datos
1. Verificar que analytics está funcionando
2. Completar un flujo de compra en el sitio
3. Esperar 1-2 minutos para procesamiento
4. Verificar base de datos: `sqlite3 data/analytics.db "SELECT COUNT(*) FROM events;"`

### Problema: Error de autenticación
1. Verificar contraseña: `fiestaco2024`
2. Limpiar localStorage del navegador
3. Verificar token en solicitudes API

## 📱 Responsive Design

El dashboard es completamente responsive:
- **Desktop:** Layout de 4 columnas
- **Tablet:** Layout de 2 columnas  
- **Mobile:** Layout de 1 columna

## 🎨 Personalización

### Cambiar Colores
Editar `./lib/analytics-config.ts`:
```typescript
CHART_COLORS: {
  primary: '#ff6b35',    // Naranja Fiestaco
  secondary: '#4361ee',  // Azul
  success: '#38b000',    // Verde
  // ...
}
```

### Agregar Nuevas Métricas
1. Agregar consulta en `./app/api/analytics/dashboard/route.ts`
2. Actualizar tipos en `./app/dashboard/page.tsx`
3. Agregar visualización en el dashboard

## 🔄 Actualizaciones Futuras

### Planeadas:
1. **Exportación a CSV/Excel**
2. **Notificaciones Slack/Email**
3. **Comparativas día vs día**
4. **Segmentación por dispositivo**
5. **Mapa de calor de clicks**

### Mejoras Técnicas:
1. **Caché de consultas** para mejor performance
2. **WebSockets** para updates en tiempo real
3. **Gráficos interactivos** con Chart.js
4. **API más completa** con filtros avanzados

## 📞 Soporte

### Para Problemas Técnicos:
1. Revisar logs: `docker logs <container_id>`
2. Probar endpoints: `curl -X POST https://fiestaco.today/api/analytics ...`
3. Verificar base de datos: `sqlite3 data/analytics.db ".tables"`

### Para Preguntas:
- Revisar documentación en `DASHBOARD-README.md`
- Consultar código en `/app/dashboard/`
- Ver ejemplos en `/scripts/`

---

**🎉 ¡Dashboard listo para usar!**
**📊 Comienza a tomar decisiones basadas en datos hoy mismo.**