#!/bin/bash
# Script simplificado de despliegue para FiestaCo

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Despliegue de FiestaCo en Docker${NC}"
echo "========================================"

# Verificar dependencias
echo -e "${YELLOW}🔍 Verificando dependencias...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker disponible${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm disponible${NC}"

# Paso 1: Construir aplicación
echo -e "\n${YELLOW}📦 Paso 1: Construyendo aplicación...${NC}"
if ! npm run build 2>/dev/null; then
    echo -e "${RED}❌ Error al construir la aplicación${NC}"
    echo "Ejecuta 'npm run build' manualmente para ver errores"
    exit 1
fi
echo -e "${GREEN}✅ Aplicación construida${NC}"

# Paso 2: Construir imagen Docker
echo -e "\n${YELLOW}🐳 Paso 2: Construyendo imagen Docker...${NC}"
if ! docker build -t fiestaco:latest -f Dockerfile.standalone . 2>/dev/null; then
    echo -e "${RED}❌ Error al construir imagen Docker${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Imagen Docker construida${NC}"

# Paso 3: Detener contenedor existente
echo -e "\n${YELLOW}🛑 Paso 3: Limpiando contenedor anterior...${NC}"
if docker ps -a --filter "name=fiestaco" --format "{{.Names}}" | grep -q "^fiestaco$"; then
    docker stop fiestaco > /dev/null 2>&1 || true
    docker rm fiestaco > /dev/null 2>&1 || true
    echo -e "${GREEN}✅ Contenedor anterior eliminado${NC}"
else
    echo -e "${BLUE}ℹ️  No hay contenedor anterior${NC}"
fi

# Paso 4: Ejecutar nuevo contenedor
echo -e "\n${YELLOW}▶️  Paso 4: Iniciando contenedor...${NC}"
if ! docker run -d --name fiestaco -p 3001:3001 --restart unless-stopped fiestaco:latest 2>/dev/null; then
    echo -e "${RED}❌ Error al iniciar contenedor${NC}"
    exit 1
fi

# Esperar a que la aplicación inicie
echo -e "${BLUE}⏳ Esperando que la aplicación inicie...${NC}"
sleep 5

# Paso 5: Verificar
echo -e "\n${YELLOW}✅ Paso 5: Verificando despliegue...${NC}"

# Verificar que el contenedor está corriendo
if docker ps --filter "name=fiestaco" --format "{{.Names}}" | grep -q "^fiestaco$"; then
    echo -e "${GREEN}✅ Contenedor corriendo${NC}"
else
    echo -e "${RED}❌ Contenedor no está corriendo${NC}"
    echo "Logs:"
    docker logs fiestaco
    exit 1
fi

# Verificar health check
echo -e "${BLUE}🧪 Probando health check...${NC}"
if curl -s http://localhost:3001/health 2>/dev/null | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check OK${NC}"
else
    echo -e "${YELLOW}⚠️  Health check falló (la aplicación podría estar iniciando)${NC}"
fi

# Mostrar información
echo -e "\n${GREEN}🎉 ¡FiestaCo desplegado exitosamente!${NC}"
echo "========================================"
echo -e "${BLUE}🌐 URL:${NC} http://localhost:3001"
echo -e "${BLUE}🔍 Health:${NC} http://localhost:3001/health"
echo -e "${BLUE}📊 Logs:${NC} docker logs -f fiestaco"
echo -e "${BLUE}🛑 Detener:${NC} docker stop fiestaco"
echo -e "${BLUE}▶️  Iniciar:${NC} docker start fiestaco"
echo -e "${BLUE}🗑️  Eliminar:${NC} docker rm fiestaco"
echo "========================================"
echo -e "${YELLOW}📝 Nota: SQLite analytics está deshabilitado en Docker${NC}"
echo -e "${YELLOW}    Para habilitarlo, modifica Dockerfile.standalone${NC}"
echo ""

# Mostrar logs iniciales
echo -e "${BLUE}📋 Últimos logs:${NC}"
docker logs --tail 5 fiestaco