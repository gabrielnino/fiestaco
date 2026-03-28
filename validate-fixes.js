// Script para validar las correcciones aplicadas al API
const http = require('http');

console.log('🧪 VALIDACIÓN DE CORRECCIONES APLICADAS');
console.log('=====================================');
console.log('');

const testCases = [
  // Casos que deberían PASAR ahora
  {
    id: 'VALID-001',
    description: 'Caso válido mínimo',
    body: { sessionId: 'user-123', eventName: 'page_view', pagePath: '/' },
    expectedStatus: 200
  },
  {
    id: 'VALID-002', 
    description: 'Caso válido con metadata',
    body: { 
      sessionId: 'user-456', 
      eventName: 'flavor_select', 
      pagePath: '/wizard',
      metadata: { flavor: 'al_pastor', step: 1 }
    },
    expectedStatus: 200
  },
  
  // Casos que deberían FALLAR (corregidos)
  {
    id: 'FIXED-001',
    description: 'sessionId como número (antes pasaba, ahora debe fallar)',
    body: { sessionId: 12345, eventName: 'page_view', pagePath: '/' },
    expectedStatus: 400
  },
  {
    id: 'FIXED-002',
    description: 'eventName como booleano (antes pasaba, ahora debe fallar)',
    body: { sessionId: 'test', eventName: true, pagePath: '/' },
    expectedStatus: 400
  },
  {
    id: 'FIXED-003',
    description: 'sessionId string vacío',
    body: { sessionId: '', eventName: 'page_view', pagePath: '/' },
    expectedStatus: 400
  },
  {
    id: 'FIXED-004',
    description: 'sessionId solo espacios',
    body: { sessionId: '   ', eventName: 'page_view', pagePath: '/' },
    expectedStatus: 400
  },
  {
    id: 'FIXED-005',
    description: 'sessionId demasiado largo (>255 chars)',
    body: { 
      sessionId: 'x'.repeat(300), 
      eventName: 'page_view', 
      pagePath: '/' 
    },
    expectedStatus: 400
  },
  {
    id: 'FIXED-006',
    description: 'sessionId con caracteres inválidos (SQL injection)',
    body: { 
      sessionId: "test'; DROP TABLE events; --", 
      eventName: 'page_view', 
      pagePath: '/' 
    },
    expectedStatus: 400
  },
  {
    id: 'FIXED-007',
    description: 'eventName con caracteres inválidos',
    body: { 
      sessionId: 'test', 
      eventName: 'page-view',  // guión no permitido
      pagePath: '/' 
    },
    expectedStatus: 400
  },
  {
    id: 'FIXED-008',
    description: 'pagePath no empieza con /',
    body: { 
      sessionId: 'test', 
      eventName: 'page_view', 
      pagePath: 'invalid-path' 
    },
    expectedStatus: 400
  },
  {
    id: 'FIXED-009',
    description: 'metadata como string (debe ser objeto)',
    body: { 
      sessionId: 'test', 
      eventName: 'page_view', 
      pagePath: '/',
      metadata: 'esto debería ser objeto'
    },
    expectedStatus: 400
  },
  {
    id: 'FIXED-010',
    description: 'metadata demasiado grande (>5000 chars)',
    body: { 
      sessionId: 'test', 
      eventName: 'page_view', 
      pagePath: '/',
      metadata: { large: 'x'.repeat(6000) }
    },
    expectedStatus: 400
  },
  {
    id: 'FIXED-011',
    description: 'JSON malformado (antes 500, ahora 400)',
    body: '{sessionId: "test", eventName: "test"',
    expectedStatus: 400,
    rawBody: true
  },
  {
    id: 'FIXED-012',
    description: 'Body vacío (antes 500, ahora 400)',
    body: '',
    expectedStatus: 400,
    rawBody: true
  }
];

let passed = 0;
let failed = 0;

function runTest(testCase) {
  return new Promise((resolve) => {
    const body = testCase.rawBody ? testCase.body : JSON.stringify(testCase.body);
    
    const req = http.request({
      hostname: 'localhost',
      port: 3022,
      path: '/api/analytics',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === testCase.expectedStatus;
        
        if (success) {
          console.log(`✅ ${testCase.id}: ${testCase.description}`);
          console.log(`   Status: ${res.statusCode} (esperado ${testCase.expectedStatus})`);
          passed++;
        } else {
          console.log(`❌ ${testCase.id}: ${testCase.description}`);
          console.log(`   Status: ${res.statusCode} (esperado ${testCase.expectedStatus})`);
          console.log(`   Respuesta: ${data.substring(0, 150)}`);
          failed++;
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${testCase.id}: ${testCase.description}`);
      console.log(`   Error: ${error.message}`);
      failed++;
      resolve();
    });
    
    req.write(body);
    req.end();
  });
}

async function runAllTests() {
  console.log('🚀 Iniciando servidor de prueba...');
  
  // Iniciar servidor en un proceso separado
  const { spawn } = require('child_process');
  const server = spawn('npx', ['next', 'dev', '-p', '3022'], {
    cwd: process.cwd(),
    stdio: 'pipe'
  });
  
  // Esperar a que el servidor esté listo
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  console.log('✅ Servidor iniciado en puerto 3022');
  console.log('');
  
  // Ejecutar pruebas
  for (const testCase of testCases) {
    await runTest(testCase);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Detener servidor
  server.kill();
  
  // Resultados
  console.log('\n📊 RESULTADOS DE VALIDACIÓN:');
  console.log('==========================');
  console.log(`✅ Pruebas pasadas: ${passed}`);
  console.log(`❌ Pruebas falladas: ${failed}`);
  console.log(`📊 Total: ${testCases.length}`);
  console.log(`🎯 Tasa de éxito: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡TODAS LAS CORRECCIONES VALIDADAS EXITOSAMENTE!');
  } else {
    console.log(`\n⚠️  ${failed} corrección(es) necesitan revisión`);
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error('❌ Error ejecutando validación:', error);
  process.exit(1);
});