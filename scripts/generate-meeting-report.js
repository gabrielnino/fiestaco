#!/usr/bin/env node
/**
 * Script para generar reportes de reuniones del equipo
 * Uso: node scripts/generate-meeting-report.js <tipo> <fecha>
 * Tipos: daily, sprint-planning, review, retrospective
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROJECT_ROOT = path.join(__dirname, '..');
const MEETINGS_DIR = path.join(PROJECT_ROOT, 'meetings');

// Crear directorio de reuniones si no existe
if (!fs.existsSync(MEETINGS_DIR)) {
  fs.mkdirSync(MEETINGS_DIR, { recursive: true });
}

// Tipos de reuniones
const MEETING_TYPES = {
  daily: {
    name: 'Daily Standup',
    duration: '15 minutos',
    template: 'daily-template.md'
  },
  'sprint-planning': {
    name: 'Sprint Planning',
    duration: '2 horas',
    template: 'sprint-planning-template.md'
  },
  review: {
    name: 'Sprint Review',
    duration: '1 hora',
    template: 'sprint-review-template.md'
  },
  retrospective: {
    name: 'Sprint Retrospective',
    duration: '1 hora',
    template: 'retrospective-template.md'
  }
};

// Plantillas de reuniones
const TEMPLATES = {
  'daily-template.md': `# 🏃‍♂️ Daily Standup - {date}

**Hora:** {time}
**Duración:** 15 minutos
**Participantes:** {participants}

## 📊 Estado del Sprint
**Sprint:** #{sprintNumber} ({sprintDates})
**Objetivo:** {sprintGoal}

## 🔄 Actualización por Persona

### @dev-frontend
**Ayer:**
**Hoy:**
**Bloqueos:**

### @dev-backend
**Ayer:**
**Hoy:**
**Bloqueos:**

### @qa-engineer
**Ayer:**
**Hoy:**
**Bloqueos:**

### @devops
**Ayer:**
**Hoy:**
**Bloqueos:**

## 📈 Métricas Rápidas
- **Tests pasando:** {testsPassed}/{testsTotal}
- **Deploy más reciente:** {lastDeploy}
- **Bugs críticos:** {criticalBugs}

## 🎯 Focus del Día
1.
2.
3.

## 🤝 Decisiones Tomadas
-

---
*Generado automáticamente - Revisar antes de la reunión*`,

  'sprint-planning-template.md': `# 🗺️ Sprint Planning - Sprint #{sprintNumber}

**Fecha:** {date}
**Duración:** 2 horas
**Participantes:** Todo el equipo

## 📋 Agenda
1. Revisar backlog del producto (15 min)
2. Revisar métricas sprint anterior (15 min)
3. Seleccionar historias para el sprint (45 min)
4. Estimación y descomposición (30 min)
5. Definición de ready/done (15 min)

## 🎯 Objetivo del Sprint
**Meta:** {sprintGoal}

## 📊 Métricas Sprint Anterior (#{prevSprint})
- **Velocidad:** {previousVelocity} puntos
- **Tasa de finalización:** {completionRate}%
- **Calidad:** {defectRate}% bugs

## 📦 Backlog Seleccionado

### 🎯 Must Have
| ID | Historia | Estimación | Responsable | Notas |
|----|----------|------------|-------------|-------|
|    |          |            |             |       |

### 📈 Should Have
| ID | Historia | Estimación | Responsable | Notas |
|----|----------|------------|-------------|-------|
|    |          |            |             |       |

### 💎 Could Have
| ID | Historia | Estimación | Responsable | Notas |
|----|----------|------------|-------------|-------|
|    |          |            |             |       |

## 🎪 Capacidad del Equipo
**Miembros disponibles:** {availableMembers}
**Días del sprint:** {sprintDays}
**Capacidad total:** {totalCapacity} puntos
**Compromiso:** {committedPoints} puntos

## 🚫 Riesgos Identificados
1.
2.
3.

## ✅ Criterios de Aceptación
- [ ] Todas las historias tienen definición de ready
- [ ] Todas las historias están estimadas
- [ ] Capacidad vs compromiso balanceados
- [ ] Riesgos identificados y mitigados

---
*Próxima reunión: Daily Standup (mañana 9:30 AM)*`,

  'sprint-review-template.md': `# 🎉 Sprint Review - Sprint #{sprintNumber}

**Fecha:** {date}
**Duración:** 1 hora
**Participantes:** Equipo + Stakeholders

## 🎯 Objetivo del Sprint Revisado
**Meta:** {sprintGoal}
**Logrado:** {goalAchieved}%

## 📊 Métricas del Sprint
- **Velocidad:** {velocity} puntos
- **Historias completadas:** {storiesCompleted}/{storiesPlanned}
- **Bugs encontrados:** {bugsFound}
- **Deuda técnica:** {techDebt} puntos

## 🏆 Demostraciones

### 🔥 Completado con Éxito
| Historia | Demostración | Impacto |
|----------|--------------|---------|
|          |              |         |

### ⚠️ Completado con Issues
| Historia | Issues | Resolución |
|----------|--------|------------|
|          |        |            |

### ❌ No Completado
| Historia | Razón | Nuevo ETA |
|----------|-------|-----------|
|          |       |           |

## 📈 Retroalimentación de Stakeholders
**Qué les gustó:**
1.
2.
3.

**Sugerencias de mejora:**
1.
2.
3.

## 🎯 Próximos Pasos
1.
2.
3.

## 📋 Acciones Pendientes
- [ ]
- [ ]
- [ ]

---
*Próxima reunión: Sprint Retrospective*`,

  'retrospective-template.md': `# 🔄 Sprint Retrospective - Sprint #{sprintNumber}

**Fecha:** {date}
**Duración:** 1 hora
**Participantes:** Equipo completo

## 📊 Contexto del Sprint
**Objetivo:** {sprintGoal}
**Éxito:** {successRate}/10
**Momento más destacado:** {highlight}

## 💚 Lo que salió bien (Continuar)
1.
2.
3.

## 💡 Oportunidades de mejora (Comenzar)
1.
2.
3.

## 🚫 Lo que no funcionó (Detener)
1.
2.
3.

## 📈 Análisis de Métricas
| Métrica | Valor | Tendencia | Análisis |
|---------|-------|-----------|----------|
| Velocidad | {velocity} puntos | {velocityTrend} | |
| Calidad | {qualityScore}/10 | {qualityTrend} | |
| Colaboración | {collaborationScore}/10 | {collaborationTrend} | |
| Predictibilidad | {predictability}% | {predictabilityTrend} | |

## 🎯 Acciones de Mejora para el próximo Sprint

### 🔧 Procesos
| Acción | Responsable | Fecha Límite |
|--------|-------------|--------------|
|        |             |              |

### 🛠️ Herramientas
| Acción | Responsable | Fecha Límite |
|--------|-------------|--------------|
|        |             |              |

### 👥 Colaboración
| Acción | Responsable | Fecha Límite |
|--------|-------------|--------------|
|        |             |              |

## 🏆 Reconocimientos
**MVP del Sprint:** @{mvp}
**Razón:** {mvpReason}

**Mejor colaboración:** @{bestCollab}
**Razón:** {collabReason}

## 🎉 Cierre
**Estado de ánimo del equipo:** {teamMood}/10
**Una palabra para resumir:** {summaryWord}

---
*Acciones a seguir en el próximo sprint planning*`
};

// Crear plantillas si no existen
Object.keys(TEMPLATES).forEach(templateName => {
  const templatePath = path.join(MEETINGS_DIR, templateName);
  if (!fs.existsSync(templatePath)) {
    fs.writeFileSync(templatePath, TEMPLATES[templateName]);
  }
});

// Función para interactuar con el usuario
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Generar reporte de reunión
async function generateMeetingReport(type, date = new Date().toISOString().split('T')[0]) {
  const meetingType = MEETING_TYPES[type];

  if (!meetingType) {
    console.error(`❌ Tipo de reunión no válido. Opciones: ${Object.keys(MEETING_TYPES).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n📝 Generando reporte para: ${meetingType.name}`);
  console.log(`📅 Fecha: ${date}`);
  console.log(`⏰ Duración: ${meetingType.duration}\n`);

  // Leer plantilla
  const templatePath = path.join(MEETINGS_DIR, meetingType.template);
  let template = fs.readFileSync(templatePath, 'utf8');

  // Reemplazar placeholders básicos
  const now = new Date();
  const replacements = {
    '{date}': date,
    '{time}': now.toLocaleTimeString(),
    '{datetime}': now.toLocaleString(),
    '{sprintNumber}': '3',
    '{sprintDates}': '2026-04-15 al 2026-04-29',
    '{sprintGoal}': 'Completar migración modular y arreglar tests críticos',
    '{participants}': '@dev-frontend, @dev-backend, @qa-engineer, @devops, @product-manager'
  };

  Object.entries(replacements).forEach(([key, value]) => {
    template = template.replace(new RegExp(key, 'g'), value);
  });

  // Preguntas específicas según el tipo
  switch (type) {
    case 'daily':
      template = await generateDailyReport(template);
      break;
    case 'sprint-planning':
      template = await generateSprintPlanningReport(template);
      break;
    case 'review':
      template = await generateSprintReviewReport(template);
      break;
    case 'retrospective':
      template = await generateRetrospectiveReport(template);
      break;
  }

  // Guardar archivo
  const fileName = `${date}-${type}-meeting.md`;
  const filePath = path.join(MEETINGS_DIR, fileName);
  fs.writeFileSync(filePath, template);

  console.log(`\n✅ Reporte generado exitosamente!`);
  console.log(`📄 Archivo: ${filePath}\n`);

  // Mostrar vista previa
  console.log('📋 VISTA PREVIA:');
  console.log('='.repeat(50));
  console.log(template.substring(0, 500) + '...');
  console.log('='.repeat(50));
}

// Funciones específicas para cada tipo
async function generateDailyReport(template) {
  console.log('📋 Responda las preguntas para el Daily Standup:\n');

  // Obtener información de tests
  const testCommand = 'npm test 2>&1 | tail -5 | grep -E "Tests:|passed|failed" || echo "Tests: 0 passed, 0 total"';
  const fs = require('fs');
  const { execSync } = require('child_process');

  let testInfo = 'Tests: 103 passed, 143 total';
  try {
    testInfo = execSync(testCommand, { cwd: PROJECT_ROOT, encoding: 'utf8' }).trim();
  } catch (e) {}

  const testsPassed = (testInfo.match(/(\d+)\s+passed/) || [])[1] || '103';
  const testsTotal = (testInfo.match(/(\d+)\s+total/) || [])[1] || '143';

  template = template
    .replace('{testsPassed}', testsPassed)
    .replace('{testsTotal}', testsTotal)
    .replace('{lastDeploy}', 'Ninguno hoy')
    .replace('{criticalBugs}', '0');

  return template;
}

async function generateSprintPlanningReport(template) {
  console.log('📋 Configurando Sprint Planning...\n');

  const previousVelocity = await askQuestion('📊 Velocidad del sprint anterior: ');
  const completionRate = await askQuestion('✅ Tasa de finalización (%): ');
  const defectRate = await askQuestion('🐛 Tasa de defectos (%): ');
  const sprintGoal = await askQuestion('🎯 Objetivo del nuevo sprint: ');

  template = template
    .replace('{previousVelocity}', previousVelocity || '15')
    .replace('{completionRate}', completionRate || '85')
    .replace('{defectRate}', defectRate || '5')
    .replace('{sprintGoal}', sprintGoal || 'Completar migración modular')
    .replace('{prevSprint}', '2')
    .replace('{availableMembers}', '5')
    .replace('{sprintDays}', '14')
    .replace('{totalCapacity}', '40')
    .replace('{committedPoints}', '35');

  return template;
}

async function generateSprintReviewReport(template) {
  console.log('📋 Configurando Sprint Review...\n');

  const velocity = await askQuestion('📊 Velocidad alcanzada: ');
  const storiesCompleted = await askQuestion('✅ Historias completadas: ');
  const storiesPlanned = await askQuestion('📋 Historias planeadas: ');
  const goalAchieved = await askQuestion('🎯 % objetivo alcanzado: ');

  template = template
    .replace('{velocity}', velocity || '15')
    .replace('{storiesCompleted}', storiesCompleted || '5')
    .replace('{storiesPlanned}', storiesPlanned || '6')
    .replace('{goalAchieved}', goalAchieved || '85')
    .replace('{bugsFound}', '2')
    .replace('{techDebt}', '5')
    .replace('{successRate}', '8')
    .replace('{highlight}', 'Refactor exitoso del hook useFiestaOrder');

  return template;
}

async function generateRetrospectiveReport(template) {
  console.log('📋 Configurando Retrospective...\n');

  const mvp = await askQuestion('🏆 MVP del sprint (@usuario): ');
  const mvpReason = await askQuestion('📝 Razón del MVP: ');
  const teamMood = await askQuestion('😊 Estado de ánimo del equipo (1-10): ');
  const summaryWord = await askQuestion('🔤 Una palabra para resumir: ');

  template = template
    .replace('{mvp}', mvp || '@dev-frontend')
    .replace('{mvpReason}', mvpReason || 'Refactor exitoso del hook useFiestaOrder')
    .replace('{bestCollab}', '@dev-backend')
    .replace('{collabReason}', 'Ayudó con problemas de mocks en tests')
    .replace('{teamMood}', teamMood || '8')
    .replace('{summaryWord}', summaryWord || 'Progreso')
    .replace('{velocityTrend}', '↗️')
    .replace('{qualityTrend}', '↗️')
    .replace('{collaborationTrend}', '→')
    .replace('{predictabilityTrend}', '↗️')
    .replace('{velocity}', '15')
    .replace('{qualityScore}', '8')
    .replace('{collaborationScore}', '7')
    .replace('{predictability}', '85');

  return template;
}

// Función principal
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📋 GENERADOR DE REPORTES DE REUNIÓN');
    console.log('='.repeat(40));
    console.log('Uso: node scripts/generate-meeting-report.js <tipo> [fecha]');
    console.log('\nTipos disponibles:');
    Object.entries(MEETING_TYPES).forEach(([key, value]) => {
      console.log(`  ${key.padEnd(20)} - ${value.name} (${value.duration})`);
    });
    console.log('\nEjemplos:');
    console.log('  node scripts/generate-meeting-report.js daily');
    console.log('  node scripts/generate-meeting-report.js sprint-planning 2026-04-19');
    console.log('  node scripts/generate-meeting-report.js retrospective');
    return;
  }

  const type = args[0];
  const date = args[1] || new Date().toISOString().split('T')[0];

  try {
    await generateMeetingReport(type, date);
  } catch (error) {
    console.error('❌ Error generando reporte:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { generateMeetingReport };