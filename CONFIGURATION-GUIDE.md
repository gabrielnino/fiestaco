# Guía de Configuración de Desarrollo

Esta guía describe la configuración de herramientas de calidad de código implementadas en el proyecto.

## 🛠 Herramientas Configuradas

### 1. **ESLint** - Análisis estático de código
- **Configuración**: `eslint.config.mjs`
- **Reglas principales**:
  - TypeScript estricto (no `any`, tipos explícitos)
  - React hooks y mejores prácticas
  - Calidad de código (sonarjs, complexity)
  - Import/export organizado
  - Seguridad básica

### 2. **Prettier** - Formateo automático
- **Configuración**: `.prettierrc.json`
- **Características**:
  - Formato consistente en todo el proyecto
  - Integración con ESLint
  - Format on save en VS Code

### 3. **TypeScript** - Tipado estricto
- **Configuración**: `tsconfig.json`
- **Nuevas reglas**:
  - `noUnusedLocals`: true
  - `noUnusedParameters`: true
  - `noImplicitReturns`: true
  - `strictNullChecks`: true

### 4. **VS Code Settings** - Configuración del editor
- **Ubicación**: `.vscode/settings.json`
- **Características**:
  - Format on save automático
  - Fix ESLint on save
  - Organización de imports
  - Exclusión de archivos innecesarios

## 📋 Comandos NPM Disponibles

### Linting y Formateo
```bash
# Lint estricto (0 warnings permitidos)
npm run lint

# Lint con auto-fix
npm run lint:fix

# Formatear todo el código
npm run format

# Verificar formato sin aplicar cambios
npm run format:check

# Verificación de tipos TypeScript
npm run type-check

# Validación completa (lint + format + types)
npm run validate
```

### Testing
```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run coverage

# Tests específicos por categoría
npm run test:unit
npm run test:integration
npm run test:critical
```

## 🔧 Configuración del Editor

### VS Code Extensions Recomendadas
1. **ESLint** - Integración ESLint
2. **Prettier** - Formateo automático
3. **Error Lens** - Errores en línea
4. **Pretty TypeScript Errors** - Mejores errores TS
5. **Import Cost** - Costo de imports
6. **Code Spell Checker** - Corrector ortográfico

### Configuración Automática
El archivo `.vscode/settings.json` configura automáticamente:
- Format on save
- ESLint auto-fix on save
- Organización automática de imports
- Exclusión de carpetas innecesarias

## 🚀 Workflow Recomendado

### Desarrollo Diario
1. **Antes de empezar**: Ejecutar `npm install` si hay cambios en dependencias
2. **Durante desarrollo**: VS Code formatea y corrige automáticamente
3. **Antes de commit**: Ejecutar `npm run validate`
4. **Si falla**: Corregir errores con `npm run lint:fix` y `npm run format`

### Git Hooks (Recomendado)
Configurar husky para validación automática:
```bash
npx husky-init && npm install
npx husky add .husky/pre-commit "npm run validate"
```

### CI/CD Pipeline
Incluir en el pipeline:
```yaml
steps:
  - name: Validate Code Quality
    run: npm run validate
  
  - name: Run Tests
    run: npm run test:ci
```

## 🎯 Reglas de Calidad Principales

### TypeScript
- **Prohibido**: Uso de `any` (error)
- **Requerido**: Tipos de retorno en funciones públicas
- **Recomendado**: Type imports separados

### React
- **Requerido**: Keys únicas en listas
- **Requerido**: Alt text en imágenes
- **Recomendado**: Self-closing tags

### Código en General
- **Límite**: 300 líneas por archivo (warning)
- **Límite**: Complejidad ciclomática 20 (warning)
- **Prohibido**: console.log en producción

## 🔍 Solución de Problemas

### ESLint no encuentra plugins
```bash
npm install --save-dev --legacy-peer-deps [plugin-faltante]
```

### Conflictos de formato
```bash
# Limpiar caché
rm -rf node_modules/.cache

# Reinstalar
npm install --legacy-peer-deps
```

### Errores de TypeScript
```bash
# Ver errores detallados
npx tsc --noEmit

# Actualizar tipos
npm install @types/react @types/react-dom @types/node --save-dev
```

## 📈 Métricas de Calidad

### Para Monitorear
1. **Errores ESLint**: Deben tender a 0
2. **Cobertura de tests**: Objetivo >80%
3. **Complejidad**: Promedio <15 por función
4. **Tamaño de archivos**: <300 líneas

### Herramientas Adicionales
- **SonarQube**: Integración con sonarjs plugin
- **Bundle Analyzer**: Para optimización de bundle
- **Lighthouse**: Performance y accesibilidad

---

**Última actualización**: 2026-04-17  
**Mantenedor**: Equipo de Desarrollo Fiestaco