# Estructura del Proyecto Fiestaco

Esta documentación describe la organización del proyecto siguiendo mejores prácticas de Next.js y arquitectura modular.

## 📁 Estructura de Directorios

```
fiestaco/
├── app/                    # Next.js App Router
│   ├── (routes)           # Rutas agrupadas (opcional)
│   ├── api/              # API Routes
│   ├── dashboard/        # Dashboard (ruta protegida)
│   └── layout.tsx        # Layout raíz
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes UI primitivos
│   ├── layout/          # Componentes de layout
│   └── shared/          # Componentes compartidos entre features
├── features/            # Funcionalidades por dominio
│   ├── orders/          # Gestión de pedidos
│   ├── analytics/       # Análisis y métricas
│   ├── configurator/    # Configurador de tacos
│   └── auth/           # Autenticación (futuro)
├── lib/                 # Lógica de negocio y utilidades
│   ├── api/            # Clients API, tipos
│   ├── utils/          # Funciones utilitarias
│   ├── constants/      # Constantes del proyecto
│   └── hooks/          # Custom hooks (alternativa a /hooks)
├── hooks/              # Custom hooks (ubicación alternativa)
├── types/              # Tipos TypeScript globales
├── styles/             # Estilos globales y temas
│   ├── globals.css     # Estilos globales
│   ├── themes/         # Temas de diseño
│   └── components/     # Estilos por componente
├── utils/              # Funciones utilitarias puras
├── tests/              # Tests automatizados
│   ├── unit/          # Tests unitarios
│   ├── integration/    # Tests de integración
│   └── e2e/           # Tests end-to-end
└── public/             # Archivos estáticos
```

## 🎯 Principios de Organización

### 1. **Colocación por Feature**
- Agrupar archivos relacionados por funcionalidad
- Cada feature es independiente y autocontenido
- Minimizar imports entre features

### 2. **Jerarquía de Componentes**
- **UI Primitivos**: Botones, inputs, cards (altamente reutilizables)
- **Componentes Compuestos**: Combinaciones de primitivos
- **Componentes de Página**: Componentes específicos de rutas
- **Componentes de Feature**: Lógica de negocio específica

### 3. **Separación de Responsabilidades**
- **Components**: Solo presentación y eventos
- **Lib**: Lógica de negocio y estado
- **Hooks**: Lógica reusable con estado
- **Utils**: Funciones puras sin estado

## 🔄 Migración desde Estructura Actual

### Componentes a Reorganizar

#### Desde `/components/` a `/components/ui/`:
- `AddonToggle.tsx` → `components/ui/addon-toggle.tsx`
- `FlavorCard.tsx` → `components/ui/flavor-card.tsx`
- `SkullLogo.tsx` → `components/ui/skull-logo.tsx`

#### Desde `/components/` a `/features/configurator/`:
- `Step1Flavor.tsx` → `features/configurator/steps/step-1-flavor.tsx`
- `Step2Flavor.tsx` → `features/configurator/steps/step-2-flavor.tsx`
- `Step3Addons.tsx` → `features/configurator/steps/step-3-addons.tsx`
- `Step4Drinks.tsx` → `features/configurator/steps/step-4-drinks.tsx`

#### Desde `/lib/` a `/features/`:
- `analytics.ts` → `features/analytics/lib/analytics.ts`
- `wizard-context.ts` → `features/configurator/context/wizard-context.ts`

### Archivos a Eliminar (Duplicados)
- `AddonToggleOptimized.tsx` (unificar con AddonToggle)
- `FlavorCardOptimized.tsx` (unificar con FlavorCard)

## 📝 Convenciones de Nomenclatura

### Archivos TypeScript/React
- **Componentes**: PascalCase (ej. `UserProfile.tsx`)
- **Hooks**: camelCase con prefijo "use" (ej. `useUserData.ts`)
- **Utils/Helpers**: camelCase (ej. `formatPrice.ts`)
- **Types/Interfaces**: PascalCase (ej. `UserTypes.ts`)

### Directorios
- **Singular para features**: `feature/` no `features/`
- **Plural para colecciones**: `components/`, `utils/`
- **Kebab-case para rutas**: `user-profile/`, `order-history/`

### Imports
```typescript
// Correcto - rutas relativas dentro del mismo feature
import { UserCard } from './components/user-card'
import { useUser } from '../hooks/use-user'

// Correcto - imports absolutos desde root
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

// Incorrecto - imports profundos entre features
import { something } from '../../../other-feature'
```

## 🧪 Estructura de Testing

```
tests/
├── unit/                    # Tests unitarios
│   ├── components/         # Tests de componentes
│   ├── lib/               # Tests de utilidades
│   └── hooks/             # Tests de hooks
├── integration/            # Tests de integración
│   ├── api/               # Tests de API routes
│   └── features/          # Tests de features completas
├── e2e/                   # Tests end-to-end
│   └── flows/             # Flujos de usuario
└── fixtures/              # Datos de prueba
```

## 🔧 Configuración y Build

### Archivos de Configuración en Raíz
- `.eslintrc.js` - Reglas de linting
- `.prettierrc` - Formateo de código
- `tsconfig.json` - Configuración TypeScript
- `jest.config.js` - Configuración de tests
- `next.config.js` - Configuración Next.js

### Scripts NPM
- `dev` - Desarrollo con hot reload
- `build` - Build de producción
- `lint` - Validación de código
- `test` - Ejecución de tests
- `type-check` - Verificación de tipos

## 🚀 Guidelines de Implementación

### 1. **Nuevas Features**
1. Crear directorio en `/features/feature-name/`
2. Implementar componentes en `/components/`
3. Agregar tipos en `/types/` o localmente
4. Crear tests en `/tests/feature/feature-name/`

### 2. **Nuevos Componentes**
1. Evaluar si es UI primitivo o específico de feature
2. Colocar en `/components/ui/` o `/features/xxx/components/`
3. Exportar desde archivo `index.ts`
4. Crear stories/documentación

### 3. **Refactors**
1. Mantener compatibilidad con imports existentes
2. Usar alias `@/` para imports
3. Actualizar todos los imports afectados
4. Ejecutar tests después del cambio

---

**Última actualización**: 2026-04-17  
**Responsable**: Equipo de Arquitectura