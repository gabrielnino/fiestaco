# Dockerfile optimizado para Fiestaco - Contenedor NUEVO
# Node.js 20 + Next.js 15 + Build optimizado

FROM node:20-alpine AS base

# 1. INSTALAR DEPENDENCIAS
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ linux-headers py3-pip
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set registry https://registry.npmjs.org/ && \
    npm ci --legacy-peer-deps

# 2. CONSTRUIR APLICACIÓN
FROM base AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 3. IMAGEN FINAL
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar solo lo necesario
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Permisos
RUN chown -R nextjs:nodejs /app

# Usuario no-root
USER nextjs

# Puerto
EXPOSE 3001

# Comando optimizado
CMD ["node", "server.js"]