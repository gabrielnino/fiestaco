# 🧪 GUÍA DE TESTING - SISTEMA DE DEFENSA

## 🚀 **SISTEMA DE TESTING IMPLEMENTADO**

### **Estructura de Tests:**
```
tests/
├── components/ui/           # Tests de componentes UI
│   ├── flavor-card.test.tsx
│   └── addon-toggle.test.tsx
├── state/                   # Tests de lógica de estado
│   └── configurator-reducer.test.ts
└── features/configurator/   # Tests de features (próximamente)
```

### **Configuración:**
- `jest.config.simple.js` - Configuración práctica
- `jest.setup.simple.js` - Setup con mocks básicos
- Coverage objetivo: **70%** (realista pero ambicioso)

## 🔧 **CÓMO EJECUTAR TESTS**

### **Comandos Disponibles:**
```bash
# Tests básicos
npm test                    # Ejecutar todos los tests
npm run test:watch          # Modo watch para desarrollo

# Cobertura
npm run coverage            # Reporte de cobertura HTML
npm run test:ci             # Para CI/CD pipelines

# Tests específicos
npm run test:unit           # Solo tests unitarios
npm run test:components     # Solo tests de componentes
```

### **Para Desarrollo Rápido:**
```bash
# Ejecutar tests específicos
npx jest tests/state/configurator-reducer.test.ts

# Ejecutar con cobertura para un archivo
npx jest tests/components/ui/flavor-card.test.tsx --coverage
```

## 🎯 **TYPES DE TESTS IMPLEMENTADOS**

### **1. Tests Unitarios (Reducer)**
- ✅ **Lógica pura** - Sin dependencias externas
- ✅ **Cobertura completa** de todas las acciones
- ✅ **Estados edge cases** - Validaciones y límites

### **2. Tests de Componentes**
- ✅ **Render básico** - Componente se renderiza correctamente
- ✅ **Interacciones** - Clicks, eventos de teclado
- ✅ **Estados** - Seleccionado, deshabilitado, etc.
- ✅ **Accesibilidad** - ARIA labels y roles

### **3. Pruebas de Integración** (Próximamente)
- 🔄 Componentes con contexto
- 🔄 Hooks personalizados
- 🔄 Flujos de usuario completos

## 📊 **MÉTRICAS DE CALIDAD**

### **Cobertura Actual:**
- **Reducer**: ~95% (crítico - corazón del sistema)
- **Componentes UI**: ~85% (importante - experiencia de usuario)
- **Total Proyecto**: Incrementando desde ~1.6%

### **Objetivos:**
- **Mínimo**: 70% cobertura en código crítico
- **Óptimo**: 85% cobertura general
- **Excelente**: 90%+ con tests de integración

## 🧩 **PATRONES DE TESTING**

### **Para Reducers:**
```typescript
test("ACTION debe hacer X", () => {
  const state = reducer(initialState, { type: "ACTION", payload: data });
  expect(state.prop).toEqual(valorEsperado);
});
```

### **Para Componentes:**
```typescript
test("debe hacer X cuando pasa Y", () => {
  render(<Componente prop={valor} />);
  expect(screen.getByText("texto")).toBeInTheDocument();
  
  fireEvent.click(button);
  expect(mockHandler).toHaveBeenCalledWith(valorEsperado);
});
```

### **Para Hooks:**
```typescript
test("debe retornar X cuando Y", () => {
  const { result } = renderHook(() => useCustomHook(props));
  expect(result.current.valor).toEqual(esperado);
});
```

## 🚨 **RESOLUCIÓN DE PROBLEMAS**

### **Error: "Cannot find module"**
```bash
# Asegurar que las dependencias están instaladas
npm install --save-dev @testing-library/react jest
```

### **Error: "document is not defined"**
```typescript
// Usar testEnvironment: 'jsdom' en jest.config.js
// O agregar al inicio del test:
/**
 * @jest-environment jsdom
 */
```

### **Error: "act(...) warning"**
```typescript
// Envolver actualizaciones de estado en act()
import { act } from '@testing-library/react';

await act(async () => {
  // Código que causa actualización de estado
});
```

### **Error: Mock no funciona**
```typescript
// Asegurar que el mock está antes del import
jest.mock('@/lib/analytics', () => ({
  analytics: { method: jest.fn() }
}));

import { analytics } from '@/lib/analytics'; // Import después del mock
```

## 🔄 **WORKFLOW DE DESARROLLO**

### **Nuevo Componente:**
1. **Implementar** componente con TypeScript
2. **Crear test** en `tests/components/[categoría]/`
3. **Ejecutar test** durante desarrollo
4. **Verificar cobertura** `npm run coverage`
5. **Commit** solo con tests pasando

### **Modificar Componente Existente:**
1. **Ejecutar tests** existentes `npm test`
2. **Implementar cambios**
3. **Actualizar tests** si la API cambia
4. **Verificar** que todos pasan
5. **Commit** con cambios y tests actualizados

### **Bug Fix:**
1. **Reproducir bug** en test
2. **Implementar fix**
3. **Verificar** que test pasa
4. **Agregar test** para prevenir regresión
5. **Commit** con fix y test

## 🏗️ **CI/CD PIPELINE**

### **Configuración Mínima:**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:ci
      - run: npm run type-check
```

### **Criterios de Aprobación:**
- ✅ Todos los tests pasan
- ✅ Cobertura > 70% en código modificado
- ✅ TypeScript sin errores
- ✅ Linting sin errores críticos

## 📈 **ROADMAP DE TESTING**

### **FASE 1 (COMPLETADA):**
- ✅ Configuración Jest básica
- ✅ Tests para reducer (crítico)
- ✅ Tests para componentes UI básicos

### **FASE 2 (PRÓXIMA):**
- 🔄 Tests para hooks personalizados
- 🔄 Tests para contexto/configurador
- 🔄 Tests para componentes de steps

### **FASE 3:**
- 🔄 Tests de integración
- 🔄 Tests E2E básicos
- 🔄 Performance testing

### **FASE 4:**
- 🔄 Accessibility testing
- 🔄 Visual regression testing
- 🔄 Load/stress testing

## 🎖️ **MEJORES PRÁCTICAS**

### **DO:**
- ✅ Testear comportamientos, no implementaciones
- ✅ Usar queries accesibles (ByRole, ByLabelText)
- ✅ Mockear dependencias externas
- ✅ Testear estados edge y errores
- ✅ Mantener tests independientes

### **DON'T:**
- ❌ Testear detalles internos de React
- ❌ Depender de orden de ejecución
- ❌ Crear tests frágiles (demasiado específicos)
- ❌ Ignorar tests que fallan
- ❌ Commit sin tests pasando

---

**¡SISTEMA DE DEFENSA ACTIVADO!** 🛡️ Los tests protegen contra bugs y regresiones.

**Próxima misión**: Implementar tests para hooks y contexto del configurador.