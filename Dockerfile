# Dockerfile para Fiestaco - Sitio optimizado
# USO: Solo para staging/testing - NO para producción directa

# Etapa 1: Builder
FROM node:20-alpine AS builder

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY package-lock.json* ./

# Instalar dependencias
RUN npm ci --only=production --ignore-scripts

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa 2: Runner
FROM node:20-alpine AS runner

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios del builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambiar permisos
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3001

# Variables de entorno
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV="production"

# Comando de inicio
CMD ["node", "server.js"]