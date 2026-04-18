# GUÍA DE MIGRACIÓN RÁPIDA - MODO GUERRA

## 🚨 Cambios Críticos Realizados

### Componentes Eliminados (Duplicados)
- `AddonToggle.tsx` → Reemplazado por `components/ui/addon-toggle.tsx`
- `AddonToggleOptimized.tsx` → Reemplazado por `components/ui/addon-toggle.tsx`
- `FlavorCard.tsx` → Reemplazado por `components/ui/flavor-card.tsx`
- `FlavorCardOptimized.tsx` → Reemplazado por `components/ui/flavor-card.tsx`

### Componentes Migrados
- `SkullLogo.tsx` → `components/ui/skull-logo.tsx` (actualizado con Next.js Image)

### Nueva Estructura
```
components/ui/           # Componentes UI primitivos
  ├── addon-toggle.tsx   # Unificado y optimizado
  ├── flavor-card.tsx    # Con TypeScript estricto
  └── skull-logo.tsx     # Con Next.js Image
```

## 🔄 Actualizar Imports

### De:
```typescript
import AddonToggle from "../components/AddonToggle";
import FlavorCard from "../components/FlavorCard";
import SkullLogo from "../components/SkullLogo";
```

### A:
```typescript
import { AddonToggle, FlavorCard, SkullLogo } from "@/components/ui";
```

## 🎯 Mejoras Implementadas

### 1. **Performance**
- Memoización de estilos CSS
- Next.js Image para optimización automática
- Lazy loading de imágenes

### 2. **TypeScript Estricto**
- Tipos específicos (`Addon`, `Flavor`, `Drink`)
- Sin tipos `any`
- Props interfaces explícitas

### 3. **Accesibilidad**
- ARIA labels y roles
- Soporte de teclado (Enter/Space)
- Semántica correcta

### 4. **Mantenibilidad**
- Código unificado sin duplicación
- Estructura consistente
- Documentación integrada

## 🚀 Acciones Inmediatas

### 1. **Actualizar app/page.tsx**
```bash
# Buscar y reemplazar imports obsoletos
sed -i 's|import AddonToggle from "\.\./components/AddonToggle";|import { AddonToggle } from "@/components/ui";|g' app/page.tsx
sed -i 's|import FlavorCard from "\.\./components/FlavorCard";|import { FlavorCard } from "@/components/ui";|g' app/page.tsx
```

### 2. **Actualizar componentes de steps**
Los componentes `Step1Flavor`, `Step2Flavor`, etc. deben usar los nuevos imports.

### 3. **Verificar builds**
```bash
npm run type-check
npm run build
```

## ⚠️ Posibles Problemas

### 1. **Props diferentes**
- `AddonToggle` ahora usa `item` en lugar de `addon`
- Tipos más estrictos pueden requerir ajustes

### 2. **Estilos CSS**
- Algunos estilos pueden variar ligeramente
- Verificar visualmente después de cambios

### 3. **Imports circulares**
- Usar siempre `@/` para imports absolutos
- Evitar imports relativos profundos

## 📊 Métricas de Mejora

### ANTES:
- 4 componentes duplicados
- Tipos `any` en props
- Sin memoización
- Accesibilidad limitada

### DESPUÉS:
- 2 componentes unificados
- TypeScript estricto
- Performance optimizada
- Accesibilidad completa

## 🆘 Soporte Rápido

### Error: "Module not found"
```typescript
// Usar path absoluto
import { AddonToggle } from "@/components/ui";
```

### Error: "Property X does not exist"
```typescript
// Verificar tipos en @/types/fiesta.types.ts
// Asegurar que los objetos tengan las propiedades correctas
```

### Error: Type mismatch
```typescript
// Cast explícito si necesario
const item = data as Addon;
```

---

**Última actualización**: 2026-04-17  
**Modo**: Guerra - Maximizar valor, minimizar deuda técnica