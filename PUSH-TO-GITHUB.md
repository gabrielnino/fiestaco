# 📤 PUSH A GITHUB - INSTRUCCIONES

## 📋 ESTADO ACTUAL

✅ **Commit realizado localmente** con todos los cambios de analytics y dashboard.

## 🚀 PASOS PARA HACER PUSH

### **Opción 1: Usando HTTPS (Recomendado)**
```bash
cd /ruta/a/fiestaco

# Configurar credenciales (si no están configuradas)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Hacer push
git push origin main
```

**Cuando te pida credenciales:**
- **Usuario:** Tu nombre de usuario de GitHub
- **Contraseña:** Tu token de acceso personal (PAT)
  - Crear en: GitHub → Settings → Developer settings → Personal access tokens
  - Seleccionar scopes: `repo`, `workflow`

### **Opción 2: Usando SSH**
```bash
# 1. Generar clave SSH (si no tienes)
ssh-keygen -t ed25519 -C "tu@email.com"

# 2. Agregar clave a GitHub
cat ~/.ssh/id_ed25519.pub
# Copiar output y agregar en GitHub → Settings → SSH and GPG keys

# 3. Cambiar remote a SSH
git remote set-url origin git@github.com:gabrielnino/fiestaco.git

# 4. Hacer push
git push origin main
```

### **Opción 3: Usando GitHub CLI**
```bash
# Si tienes GitHub CLI instalado
gh auth login
git push origin main
```

## 📊 CAMBIOS INCLUIDOS EN EL COMMIT

### **Nuevos Directorios:**
```
app/dashboard/           # Dashboard completo
app/api/analytics/      # Endpoints de analytics
lib/db/                 # Base de datos SQLite
scripts/                # Herramientas de monitoreo
data/                   # Datos de analytics
```

### **Archivos Principales:**
- `app/dashboard/page.tsx` - Dashboard con autenticación
- `app/api/analytics/route.ts` - API de tracking
- `lib/analytics.ts` - Cliente frontend
- `deploy-*.sh` - Scripts de despliegue
- `*.md` - Documentación completa

### **Total de Cambios:**
- **103 archivos modificados**
- **11,224 líneas añadidas**
- **79 líneas eliminadas**

## 🔍 VERIFICACIÓN PRE-PUSH

```bash
# Verificar estado
git status

# Verificar cambios
git log --oneline -5

# Verificar diferencias
git diff --stat origin/main
```

## 🛠️ SI HAY CONFLICTOS

```bash
# 1. Pull latest changes
git pull origin main

# 2. Resolver conflictos (si los hay)
# Editar archivos con conflictos
# git add <archivos-resueltos>

# 3. Commit merge
git commit -m "Merge main"

# 4. Push
git push origin main
```

## 🌐 DESPUÉS DEL PUSH

### **1. Verificar en GitHub:**
- Ir a: https://github.com/gabrielnino/fiestaco
- Verificar que los cambios están en el repositorio
- Revisar archivos nuevos

### **2. Desplegar en Producción:**
```bash
# En tu servidor de producción
cd /opt/fiestaco
git pull origin main
./deploy-production-complete.sh
```

### **3. Verificar Despliegue:**
```bash
# Probar dashboard
curl https://fiestaco.today/dashboard

# Probar API
curl -X POST https://fiestaco.today/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","eventName":"test","pagePath":"/"}'
```

## 📞 SOLUCIÓN DE PROBLEMAS

### **Error: "fatal: could not read Username"**
```bash
# Solución: Configurar credenciales almacenadas
git config --global credential.helper store
# Luego hacer push (pedirá credenciales una vez)
```

### **Error: "Permission denied (publickey)"**
```bash
# Solución: Configurar SSH
ssh -T git@github.com  # Testear conexión
# Si falla, seguir Opción 2 arriba
```

### **Error: "Updates were rejected"**
```bash
# Solución: Forzar push (cuidado, sobrescribe remoto)
git push -f origin main
# Solo usar si estás seguro de que quieres sobrescribir
```

## 🎯 RESUMEN DE ACCIONES NECESARIAS

1. **✅ Commit hecho localmente**
2. **➡️ Necesitas hacer push a GitHub** (usando tus credenciales)
3. **➡️ Luego desplegar en servidor de producción**
4. **➡️ Finalmente probar en https://fiestaco.today/dashboard**

## 🔗 ENLACES ÚTILES

- **Tu repositorio:** https://github.com/gabrielnino/fiestaco
- **Crear PAT:** https://github.com/settings/tokens
- **SSH keys:** https://github.com/settings/keys
- **GitHub CLI:** https://cli.github.com/

---

**🚀 ¡Listo para hacer push! Ejecuta `git push origin main` con tus credenciales.**