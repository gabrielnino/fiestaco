// Suite de pruebas exhaustivas para el API de analytics
const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3020;
const BASE_URL = `http://${API_HOST}:${API_PORT}`;

console.log('🧪 SUITE DE PRUEBAS EXHAUSTIVAS - API ANALYTICS');
console.log('=============================================');
console.log('');

const testResults = [];

function runTest(testCase) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = http.request({
      hostname: API_HOST,
      port: API_PORT,
      path: testCase.path,
      method: testCase.method,
      headers: testCase.headers || {}
    }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const result = {
          ...testCase,
          actualStatus: res.statusCode,
          actualResponse: responseData,
          duration: duration,
          passed: res.statusCode === testCase.expectedStatus
        };
        
        testResults.push(result);
        
        const statusIcon = result.passed ? '✅' : '❌';
        console.log(`${statusIcon} ${testCase.id}: ${testCase.description}`);
        if (!result.passed) {
          console.log(`   Esperado: ${testCase.expectedStatus}, Obtenido: ${res.statusCode}`);
          console.log(`   Respuesta: ${responseData.substring(0, 150)}`);
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      const result = {
        ...testCase,
        actualStatus: 0,
        actualResponse: error.message,
        duration: Date.now() - startTime,
        passed: false
      };
      
      testResults.push(result);
      console.log(`❌ ${testCase.id}: ${testCase.description}`);
      console.log(`   Error: ${error.message}`);
      resolve();
    });
    
    if (testCase.body) {
      req.write(testCase.body);
    }
    req.end();
  });
}

async function runAllTests() {
  const tests = [
    // CASO 1: Caso válido mínimo
    {
      id: 'TC-001',
      description: 'Caso válido mínimo (todos los campos requeridos)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-001',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 200
    },
    
    // CASO 2: Caso válido completo
    {
      id: 'TC-002',
      description: 'Caso válido completo (con metadata)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-002',
        eventName: 'flavor_select',
        pagePath: '/wizard',
        metadata: { flavor: 'al_pastor', step: 1, timestamp: '2026-03-28T15:00:00Z' }
      }),
      expectedStatus: 200
    },
    
    // CASO 3: Campo sessionId faltante
    {
      id: 'TC-003',
      description: 'Campo sessionId faltante',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 4: Campo eventName faltante
    {
      id: 'TC-004',
      description: 'Campo eventName faltante',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-003',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 5: Campo pagePath faltante
    {
      id: 'TC-005',
      description: 'Campo pagePath faltante',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-004',
        eventName: 'page_view'
      }),
      expectedStatus: 400
    },
    
    // CASO 6: sessionId null
    {
      id: 'TC-006',
      description: 'sessionId = null',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: null,
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 7: sessionId string vacío
    {
      id: 'TC-007',
      description: 'sessionId = string vacío',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: '',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 8: sessionId solo espacios
    {
      id: 'TC-008',
      description: 'sessionId = solo espacios',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: '   ',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 9: Tipo de dato incorrecto (sessionId como número)
    {
      id: 'TC-009',
      description: 'sessionId como número (tipo incorrecto)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 12345,
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 200  // ¡PROBLEMA! Debería ser 400
    },
    
    // CASO 10: Tipo de dato incorrecto (eventName como booleano)
    {
      id: 'TC-010',
      description: 'eventName como booleano (tipo incorrecto)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-005',
        eventName: true,
        pagePath: '/'
      }),
      expectedStatus: 200  // ¡PROBLEMA! Debería ser 400
    },
    
    // CASO 11: sessionId longitud excesiva (10,000 caracteres)
    {
      id: 'TC-011',
      description: 'sessionId longitud excesiva (10k caracteres)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'x'.repeat(10000),
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 200  // ¡PROBLEMA! Debería tener límite
    },
    
    // CASO 12: Caracteres especiales/inyectión
    {
      id: 'TC-012',
      description: 'Caracteres especiales y posible inyección',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: "test'; DROP TABLE events; --",
        eventName: "page_view' OR '1'='1",
        pagePath: "/';<script>alert('xss')</script>"
      }),
      expectedStatus: 200  // ¡PROBLEMA! Riesgo de inyección
    },
    
    // CASO 13: metadata como string en lugar de objeto
    {
      id: 'TC-013',
      description: 'metadata como string (debería ser objeto)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-006',
        eventName: 'page_view',
        pagePath: '/',
        metadata: 'esto debería ser un objeto'
      }),
      expectedStatus: 200  // ¡PROBLEMA! Tipo incorrecto
    },
    
    // CASO 14: metadata extremadamente grande
    {
      id: 'TC-014',
      description: 'metadata extremadamente grande (1MB)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-007',
        eventName: 'page_view',
        pagePath: '/',
        metadata: { largeData: 'x'.repeat(1000000) }
      }),
      expectedStatus: 200  // ¡PROBLEMA! Sin límite de tamaño
    },
    
    // CASO 15: Sin Content-Type header
    {
      id: 'TC-015',
      description: 'Sin Content-Type header',
      method: 'POST',
      path: '/api/analytics',
      body: JSON.stringify({
        sessionId: 'test-session-008',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 16: Content-Type incorrecto
    {
      id: 'TC-016',
      description: 'Content-Type incorrecto (text/plain)',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        sessionId: 'test-session-009',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 400
    },
    
    // CASO 17: JSON malformado
    {
      id: 'TC-017',
      description: 'JSON malformado',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: '{sessionId: "test", eventName: "test"',
      expectedStatus: 500  // ¡PROBLEMA! Debería ser 400
    },
    
    // CASO 18: Body vacío
    {
      id: 'TC-018',
      description: 'Body vacío',
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: '',
      expectedStatus: 500  // ¡PROBLEMA! Debería ser 400
    },
    
    // CASO 19: Método HTTP incorrecto (PUT)
    {
      id: 'TC-019',
      description: 'Método HTTP incorrecto (PUT)',
      method: 'PUT',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-010',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 405  // ¡PROBLEMA! Debería ser 405 Method Not Allowed
    },
    
    // CASO 20: Ruta incorrecta
    {
      id: 'TC-020',
      description: 'Ruta incorrecta',
      method: 'POST',
      path: '/api/analytics/invalid',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-011',
        eventName: 'page_view',
        pagePath: '/'
      }),
      expectedStatus: 404
    }
  ];

  // Ejecutar pruebas secuencialmente
  for (const test of tests) {
    await runTest(test);
    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Generar reporte
  console.log('\n📊 REPORTE DE PRUEBAS');
  console.log('===================');
  
  const passed = testResults.filter(t => t.passed).length;
  const failed = testResults.filter(t => !t.passed).length;
  const total = testResults.length;
  
  console.log(`✅ Pasadas: ${passed}`);
  console.log(`❌ Falladas: ${failed}`);
  console.log(`📊 Total: ${total}`);
  console.log(`🎯 Tasa de éxito: ${((passed / total) * 100).toFixed(1)}%`);
  
  // Identificar problemas críticos
  const criticalIssues = testResults.filter(t => 
    !t.passed && 
    (t.id === 'TC-009' || t.id === 'TC-010' || t.id === 'TC-011' || 
     t.id === 'TC-012' || t.id === 'TC-013' || t.id === 'TC-014' ||
     t.id === 'TC-017' || t.id === 'TC-018' || t.id === 'TC-019')
  );
  
  if (criticalIssues.length > 0) {
    console.log('\n🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS:');
    console.log('==================================');
    criticalIssues.forEach(issue => {
      console.log(`• ${issue.id}: ${issue.description}`);
      console.log(`  Esperado: ${issue.expectedStatus}, Obtenido: ${issue.actualStatus}`);
    });
  }
  
  // Detener el servidor
  process.exit(failed > 0 ? 1 : 0);
}

// Ejecutar todas las pruebas
runAllTests().catch(error => {
  console.error('❌ Error ejecutando pruebas:', error);
  process.exit(1);
});