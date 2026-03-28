// Prueba exhaustiva del API de Analytics
const http = require('http');

const API_URL = 'localhost';
const API_PORT = 3010;
const BASE_URL = `http://${API_URL}:${API_PORT}`;

console.log('🧪 PRUEBA EXHAUSTIVA DEL API DE ANALYTICS');
console.log('========================================');
console.log('');

let passedTests = 0;
let failedTests = 0;
let totalTests = 0;

function runTest(name, options, expectedStatus, validateResponse) {
  totalTests++;
  
  return new Promise((resolve) => {
    const req = http.request({
      hostname: API_URL,
      port: API_PORT,
      path: options.path,
      method: options.method,
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const success = res.statusCode === expectedStatus && 
                       (!validateResponse || validateResponse(data));
        
        if (success) {
          console.log(`✅ ${name}: ${res.statusCode} (esperado ${expectedStatus})`);
          passedTests++;
        } else {
          console.log(`❌ ${name}: ${res.statusCode} (esperado ${expectedStatus})`);
          if (data) console.log(`   Respuesta: ${data.substring(0, 100)}`);
          failedTests++;
        }
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${name}: Error - ${error.message}`);
      failedTests++;
      resolve();
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runAllTests() {
  console.log('📋 1. PRUEBAS DEL ENDPOINT /api/analytics (POST)');
  console.log('----------------------------------------------');
  
  // Caso 1: Evento básico válido
  await runTest('Evento básico (page_view)', {
    method: 'POST',
    path: '/api/analytics',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test-session-001',
      eventName: 'page_view',
      pagePath: '/'
    })
  }, 200);
  
  // Caso 2: Evento con metadata
  await runTest('Evento con metadata', {
    method: 'POST',
    path: '/api/analytics',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test-session-001',
      eventName: 'flavor_select',
      pagePath: '/',
      metadata: { flavor: 'al_pastor', step: 1 }
    })
  }, 200);
  
  // Caso 3: Todos los eventos del wizard
  const wizardEvents = ['wizard_start', 'step_visit', 'addon_select', 'drink_select', 'kit_complete', 'whatsapp_click'];
  for (const event of wizardEvents) {
    await runTest(`Evento wizard: ${event}`, {
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'wizard-session-001',
        eventName: event,
        pagePath: '/wizard',
        metadata: { step: 1, flavor: 'al_pastor' }
      })
    }, 200);
  }
  
  // Caso 4: Campos faltantes
  await runTest('Sin sessionId (error)', {
    method: 'POST',
    path: '/api/analytics',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: 'page_view',
      pagePath: '/'
    })
  }, 400);
  
  await runTest('Sin eventName (error)', {
    method: 'POST',
    path: '/api/analytics',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test',
      pagePath: '/'
    })
  }, 400);
  
  await runTest('Sin pagePath (error)', {
    method: 'POST',
    path: '/api/analytics',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test',
      eventName: 'page_view'
    })
  }, 400);
  
  // Caso 5: Content-Type incorrecto
  await runTest('Sin Content-Type (error)', {
    method: 'POST',
    path: '/api/analytics',
    body: JSON.stringify({
      sessionId: 'test',
      eventName: 'test',
      pagePath: '/'
    })
  }, 400);
  
  console.log('\n🔐 2. PRUEBAS DEL ENDPOINT /api/analytics (GET)');
  console.log('---------------------------------------------');
  
  // Caso 6: Sin autenticación
  await runTest('GET sin token (error)', {
    method: 'GET',
    path: '/api/analytics'
  }, 401);
  
  // Caso 7: Token incorrecto
  await runTest('GET con token incorrecto (error)', {
    method: 'GET',
    path: '/api/analytics',
    headers: { 'Authorization': 'Bearer token-incorrecto' }
  }, 403);
  
  // Caso 8: Token correcto
  await runTest('GET con token básico', {
    method: 'GET',
    path: '/api/analytics',
    headers: { 'Authorization': 'Bearer fiestaco-dev' }
  }, 200, (data) => {
    try {
      const json = JSON.parse(data);
      return json.message && json.status;
    } catch {
      return false;
    }
  });
  
  // Caso 9: Token admin
  await runTest('GET con token admin', {
    method: 'GET',
    path: '/api/analytics/dashboard',
    headers: { 'Authorization': 'Bearer fiestaco-admin-2024' }
  }, 200);
  
  console.log('\n📈 3. PRUEBAS DE VOLUMEN Y ESTRÉS');
  console.log('--------------------------------');
  
  // Caso 10: Múltiples eventos rápidos
  const parallelPromises = [];
  for (let i = 1; i <= 5; i++) {
    parallelPromises.push(runTest(`Evento paralelo ${i}`, {
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'stress-test',
        eventName: `click_${i}`,
        pagePath: '/',
        metadata: { iteration: i }
      })
    }, 200));
  }
  await Promise.all(parallelPromises);
  console.log('✅ 5 eventos enviados en paralelo');
  
  // Caso 11: Evento grande
  await runTest('Evento con metadata extensa', {
    method: 'POST',
    path: '/api/analytics',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'large-data',
      eventName: 'large_event',
      pagePath: '/',
      metadata: {
        array: ['item1', 'item2', 'item3', 'item4', 'item5'],
        object: { nested: { deep: { value: 'test' } } },
        numbers: [1,2,3,4,5,6,7,8,9,10],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }
    })
  }, 200);
  
  console.log('\n🔍 4. PRUEBAS DE VALIDACIÓN DE DATOS');
  console.log('-----------------------------------');
  
  // Caso 12: Tipos de datos
  const dataTypes = [
    { type: 'string', value: 'test' },
    { type: 'number', value: 42.5 },
    { type: 'boolean', value: true },
    { type: 'null', value: null },
    { type: 'array', value: [1,2,3] },
    { type: 'object', value: { nested: 'data' } }
  ];
  
  for (const dataType of dataTypes) {
    await runTest(`Metadata tipo ${dataType.type}`, {
      method: 'POST',
      path: '/api/analytics',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'type-test',
        eventName: `data_type_${dataType.type}`,
        pagePath: '/',
        metadata: { type: dataType.type, value: dataType.value }
      })
    }, 200);
  }
  
  console.log('\n📊 5. PRUEBAS DE ENDPOINTS RELACIONADOS');
  console.log('-------------------------------------');
  
  // Caso 13: Health check
  await runTest('Health check', {
    method: 'GET',
    path: '/health'
  }, 200, (data) => {
    try {
      const json = JSON.parse(data);
      return json.status === 'healthy';
    } catch {
      return false;
    }
  });
  
  // Caso 14: Dashboard
  await runTest('Dashboard (sin auth web)', {
    method: 'GET',
    path: '/dashboard'
  }, 200);
  
  // Caso 15: Sitemap
  await runTest('Sitemap', {
    method: 'GET',
    path: '/sitemap.xml'
  }, 200);
  
  // Caso 16: Robots.txt
  await runTest('Robots.txt', {
    method: 'GET',
    path: '/robots.txt'
  }, 200);
  
  console.log('\n📋 RESUMEN FINAL DE PRUEBAS');
  console.log('==========================');
  console.log(`✅ Pruebas pasadas: ${passedTests}`);
  console.log(`❌ Pruebas falladas: ${failedTests}`);
  console.log(`📊 Total pruebas: ${totalTests}`);
  console.log(`🎯 Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
  } else {
    console.log(`\n⚠️  ${failedTests} prueba(s) fallaron`);
    process.exit(1);
  }
}

// Iniciar pruebas
runAllTests().catch(console.error);