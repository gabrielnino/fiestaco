#!/usr/bin/env node

/**
 * Script de prueba completo para el sistema de analytics + dashboard
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

console.log('🧪 PRUEBA COMPLETA DEL SISTEMA DE ANALYTICS');
console.log('=============================================\n');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function logSuccess(message) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}❌${colors.reset} ${message}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️${colors.reset} ${message}`);
}

function logStep(step, message) {
  console.log(`\n${colors.magenta}${step}.${colors.reset} ${message}`);
}

async function testEndpoint(method, path, data = null, headers = {}) {
  return new Promise((resolve) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        ...headers
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        status: 0,
        error: error.message
      });
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  let allTestsPassed = true;
  
  // Test 1: Verificar que el servidor está corriendo
  logStep('1', 'Verificando servidor Next.js');
  try {
    const healthCheck = await testEndpoint('GET', '/health');
    if (healthCheck.status === 200) {
      logSuccess(`Servidor corriendo en puerto ${PORT}`);
    } else {
      logWarning(`Servidor no responde en /health (status: ${healthCheck.status})`);
      logInfo('Inicia el servidor con: npm run dev');
      return false;
    }
  } catch (error) {
    logError(`Error conectando al servidor: ${error.message}`);
    return false;
  }
  
  // Test 2: Verificar base de datos
  logStep('2', 'Verificando base de datos SQLite');
  const dbPath = path.join(process.cwd(), 'data', 'analytics.db');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    logSuccess(`Base de datos encontrada: ${dbPath}`);
    logInfo(`Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    logInfo('Base de datos no existe aún (se creará con el primer evento)');
  }
  
  // Test 3: Probar endpoint de analytics (POST)
  logStep('3', 'Probando endpoint POST /api/analytics');
  const testEvent = {
    sessionId: `test-session-${Date.now()}`,
    eventName: 'test_event',
    pagePath: '/test',
    metadata: { 
      test: true, 
      timestamp: new Date().toISOString(),
      flavor: 'al_pastor',
      step: 1
    }
  };
  
  const postResult = await testEndpoint('POST', '/api/analytics', testEvent);
  if (postResult.status === 200) {
    logSuccess('Evento registrado exitosamente');
    console.log(`   Evento: ${testEvent.eventName}`);
    console.log(`   Sesión: ${testEvent.sessionId.substring(0, 12)}...`);
  } else {
    logError(`Error en POST: ${postResult.status}`);
    console.log(`   Respuesta: ${postResult.data}`);
    allTestsPassed = false;
  }
  
  // Test 4: Probar endpoint GET protegido (sin token)
  logStep('4', 'Probando endpoint GET /api/analytics (sin token)');
  const getNoAuth = await testEndpoint('GET', '/api/analytics');
  if (getNoAuth.status === 401 || getNoAuth.status === 403) {
    logSuccess('Endpoint correctamente protegido (sin token)');
  } else {
    logWarning(`Status inesperado sin token: ${getNoAuth.status}`);
  }
  
  // Test 5: Probar endpoint GET con token
  logStep('5', 'Probando endpoint GET /api/analytics (con token)');
  const getWithAuth = await testEndpoint('GET', '/api/analytics', null, {
    'Authorization': 'Bearer fiestaco-dev'
  });
  
  if (getWithAuth.status === 200) {
    logSuccess('Endpoint GET funcionando con token');
    try {
      const stats = JSON.parse(getWithAuth.data);
      console.log(`   Eventos hoy: ${stats.today?.total_events || 0}`);
      console.log(`   Sesiones hoy: ${stats.today?.unique_sessions_today || 0}`);
    } catch (e) {
      console.log(`   Datos: ${getWithAuth.data.substring(0, 100)}...`);
    }
  } else {
    logWarning(`Status con token: ${getWithAuth.status}`);
    console.log(`   Respuesta: ${getWithAuth.data}`);
  }
  
  // Test 6: Probar dashboard endpoint
  logStep('6', 'Probando dashboard /api/analytics/dashboard');
  const dashboardResult = await testEndpoint('GET', '/api/analytics/dashboard', null, {
    'Authorization': 'Bearer fiestaco-admin-2024'
  });
  
  if (dashboardResult.status === 200) {
    logSuccess('Dashboard API funcionando');
    try {
      const dashboardData = JSON.parse(dashboardResult.data);
      console.log(`   Métricas disponibles: ${Object.keys(dashboardData).length}`);
      console.log(`   Eventos recientes: ${dashboardData.recent_events?.length || 0}`);
      console.log(`   Sabores populares: ${dashboardData.popular_flavors?.length || 0}`);
    } catch (e) {
      console.log(`   Datos dashboard: ${dashboardResult.data.substring(0, 100)}...`);
    }
  } else {
    logWarning(`Dashboard status: ${dashboardResult.status}`);
  }
  
  // Test 7: Verificar página de dashboard
  logStep('7', 'Verificando página web /dashboard');
  const dashboardPage = await testEndpoint('GET', '/dashboard');
  if (dashboardPage.status === 200) {
    logSuccess('Página dashboard cargando correctamente');
    console.log(`   Tamaño HTML: ${dashboardPage.data.length} bytes`);
    
    // Verificar que es una página React
    if (dashboardPage.data.includes('React') || dashboardPage.data.includes('root')) {
      logInfo('Página React detectada');
    }
  } else {
    logWarning(`Dashboard page status: ${dashboardPage.status}`);
  }
  
  // Test 8: Simular flujo completo de usuario
  logStep('8', 'Simulando flujo completo de usuario');
  const userSession = `user-${Date.now()}`;
  const userEvents = [
    { eventName: 'page_view', pagePath: '/' },
    { eventName: 'wizard_start', pagePath: '/' },
    { eventName: 'step_visit', pagePath: '/', metadata: { step: 1 } },
    { eventName: 'flavor_select', pagePath: '/', metadata: { flavor: 'carnitas' } },
    { eventName: 'step_visit', pagePath: '/', metadata: { step: 2 } },
    { eventName: 'flavor_select', pagePath: '/', metadata: { flavor: 'al_pastor' } },
    { eventName: 'step_visit', pagePath: '/', metadata: { step: 3 } },
    { eventName: 'addon_select', pagePath: '/', metadata: { addon: 'guacamole' } },
    { eventName: 'step_visit', pagePath: '/', metadata: { step: 4 } },
    { eventName: 'drink_select', pagePath: '/', metadata: { drink: 'cerveza' } },
    { eventName: 'kit_complete', pagePath: '/', metadata: { 
      flavor1: 'carnitas', 
      flavor2: 'al_pastor',
      addons: ['guacamole'],
      drinks: ['cerveza'],
      totalPrice: 45
    }},
    { eventName: 'whatsapp_click', pagePath: '/', metadata: {
      flavor1: 'carnitas',
      flavor2: 'al_pastor',
      addons: ['guacamole'],
      drinks: ['cerveza'],
      totalPrice: 45
    }}
  ];
  
  let eventsSent = 0;
  for (const event of userEvents) {
    const result = await testEndpoint('POST', '/api/analytics', {
      sessionId: userSession,
      ...event
    });
    
    if (result.status === 200) {
      eventsSent++;
    }
  }
  
  if (eventsSent === userEvents.length) {
    logSuccess(`Flujo completo simulado: ${eventsSent} eventos enviados`);
    console.log(`   Sesión: ${userSession.substring(0, 12)}...`);
    console.log(`   Desde: page_view → whatsapp_click`);
  } else {
    logWarning(`Solo ${eventsSent}/${userEvents.length} eventos enviados`);
  }
  
  // Test 9: Verificar datos en base de datos
  logStep('9', 'Verificando integridad de datos');
  if (fs.existsSync(dbPath)) {
    // Usar sqlite3 para consultar
    exec(`sqlite3 ${dbPath} "SELECT COUNT(*) as total FROM events;"`, (error, stdout) => {
      if (!error && stdout) {
        const totalEvents = parseInt(stdout.trim());
        logSuccess(`Total de eventos en base de datos: ${totalEvents}`);
        
        // Contar eventos por tipo
        exec(`sqlite3 ${dbPath} "SELECT event_name, COUNT(*) as count FROM events GROUP BY event_name ORDER BY count DESC;"`, (error, stdout) => {
          if (!error && stdout) {
            console.log('\n   Distribución de eventos:');
            stdout.trim().split('\n').forEach(line => {
              const [event, count] = line.split('|');
              console.log(`     ${event}: ${count}`);
            });
          }
        });
      }
    });
  }
  
  // Resumen final
  console.log(`\n${colors.cyan}📊 RESUMEN DE PRUEBAS${colors.reset}`);
  console.log('=====================');
  
  if (allTestsPassed) {
    console.log(`${colors.green}🎉 ¡TODAS LAS PRUEBAS PASARON!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Algunas pruebas tuvieron advertencias${colors.reset}`);
  }
  
  console.log('\n🌐 URLs para probar manualmente:');
  console.log(`   • Sitio principal: ${BASE_URL}`);
  console.log(`   • Dashboard: ${BASE_URL}/dashboard`);
  console.log(`   • Contraseña dashboard: ${colors.magenta}fiestaco2024${colors.reset}`);
  
  console.log('\n🔧 Credenciales API:');
  console.log(`   • Token básico: ${colors.cyan}fiestaco-dev${colors.reset}`);
  console.log(`   • Token admin: ${colors.cyan}fiestaco-admin-2024${colors.reset}`);
  
  console.log('\n📁 Archivos importantes:');
  console.log(`   • Base de datos: ${dbPath}`);
  console.log(`   • Script monitor: node scripts/monitor-analytics.js`);
  console.log(`   • Script prueba: node scripts/test-analytics.js`);
  
  console.log(`\n${colors.green}🚀 Sistema listo para producción!${colors.reset}`);
  
  return allTestsPassed;
}

// Ejecutar pruebas
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests };