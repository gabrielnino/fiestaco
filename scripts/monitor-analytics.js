#!/usr/bin/env node

/**
 * Script para monitorear analytics en producción
 * Uso: node scripts/monitor-analytics.js
 */

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function monitorAnalytics() {
  console.log('📊 Monitor de Analytics - Fiestaco');
  console.log('==================================\n');
  
  const dbPath = path.join(process.cwd(), 'data', 'analytics.db');
  
  // Verificar si la base de datos existe
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Base de datos no encontrada:', dbPath);
    console.log('💡 El sistema de analytics se inicializará con el primer evento');
    return;
  }
  
  try {
    // Conectar a la base de datos
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // 1. Estadísticas generales
    console.log('1. 📈 ESTADÍSTICAS GENERALES');
    console.log('----------------------------');
    
    const totalStats = await db.get(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions,
        MIN(created_at) as first_event,
        MAX(created_at) as last_event
      FROM events
    `);
    
    console.log(`   • Eventos totales: ${totalStats.total_events}`);
    console.log(`   • Sesiones únicas: ${totalStats.unique_sessions}`);
    console.log(`   • Primer evento: ${totalStats.first_event || 'N/A'}`);
    console.log(`   • Último evento: ${totalStats.last_event || 'N/A'}`);
    
    // 2. Eventos por tipo (hoy)
    console.log('\n2. 🎯 EVENTOS HOY');
    console.log('----------------');
    
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await db.get(`
      SELECT 
        COUNT(*) as events_today,
        COUNT(DISTINCT session_id) as sessions_today,
        SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) as page_views,
        SUM(CASE WHEN event_name = 'wizard_start' THEN 1 ELSE 0 END) as wizard_starts,
        SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks
      FROM events
      WHERE DATE(created_at) = ?
    `, [today]);
    
    console.log(`   • Eventos hoy: ${todayStats.events_today || 0}`);
    console.log(`   • Sesiones hoy: ${todayStats.sessions_today || 0}`);
    console.log(`   • Vistas de página: ${todayStats.page_views || 0}`);
    console.log(`   • Wizards iniciados: ${todayStats.wizard_starts || 0}`);
    console.log(`   • Clics WhatsApp: ${todayStats.whatsapp_clicks || 0}`);
    
    if (todayStats.page_views > 0) {
      const conversionRate = ((todayStats.whatsapp_clicks / todayStats.page_views) * 100).toFixed(2);
      console.log(`   • Tasa conversión: ${conversionRate}%`);
    }
    
    // 3. Funnel de conversión
    console.log('\n3. 🪜 FUNNEL DE CONVERSIÓN (últimos 7 días)');
    console.log('------------------------------------------');
    
    const funnel = await db.all(`
      SELECT 
        event_name,
        COUNT(DISTINCT session_id) as users
      FROM events
      WHERE event_name IN ('page_view', 'wizard_start', 'step_visit', 'whatsapp_click')
        AND created_at >= DATETIME('now', '-7 days')
      GROUP BY event_name
      ORDER BY 
        CASE event_name
          WHEN 'page_view' THEN 1
          WHEN 'wizard_start' THEN 2
          WHEN 'step_visit' THEN 3
          WHEN 'whatsapp_click' THEN 4
        END
    `);
    
    funnel.forEach(row => {
      console.log(`   • ${row.event_name}: ${row.users} usuarios`);
    });
    
    // 4. Sabores más populares
    console.log('\n4. 🌮 SABORES MÁS POPULARES (últimos 7 días)');
    console.log('-------------------------------------------');
    
    const popularFlavors = await db.all(`
      SELECT 
        json_extract(metadata, '$.flavor') as flavor,
        COUNT(*) as selections
      FROM events
      WHERE event_name = 'flavor_select'
        AND created_at >= DATETIME('now', '-7 days')
        AND json_extract(metadata, '$.flavor') IS NOT NULL
      GROUP BY flavor
      ORDER BY selections DESC
      LIMIT 5
    `);
    
    if (popularFlavors.length > 0) {
      popularFlavors.forEach((flavor, index) => {
        console.log(`   ${index + 1}. ${flavor.flavor}: ${flavor.selections} selecciones`);
      });
    } else {
      console.log('   ℹ️  No hay datos de sabores aún');
    }
    
    // 5. Eventos recientes
    console.log('\n5. ⏰ EVENTOS RECIENTES (últimos 10)');
    console.log('-----------------------------------');
    
    const recentEvents = await db.all(`
      SELECT 
        session_id,
        event_name,
        page_path,
        created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    recentEvents.forEach((event, index) => {
      const timeAgo = new Date(event.created_at).toLocaleTimeString();
      console.log(`   ${index + 1}. [${timeAgo}] ${event.event_name} (${event.session_id.substring(0, 8)}...)`);
    });
    
    // 6. Verificación de integridad
    console.log('\n6. ✅ VERIFICACIÓN DE INTEGRIDAD');
    console.log('-------------------------------');
    
    const tableInfo = await db.all(`PRAGMA table_info(events)`);
    console.log(`   • Tabla 'events' tiene ${tableInfo.length} columnas`);
    
    const indexes = await db.all(`SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'events'`);
    console.log(`   • Índices creados: ${indexes.length}`);
    
    console.log('\n✅ Monitor completado');
    console.log('\n💡 Comandos útiles:');
    console.log('   • Ver todos los eventos: sqlite3 data/analytics.db "SELECT * FROM events ORDER BY created_at DESC LIMIT 20;"');
    console.log('   • Ver estadísticas diarias: sqlite3 data/analytics.db "SELECT DATE(created_at) as date, COUNT(*) as events, COUNT(DISTINCT session_id) as sessions FROM events GROUP BY date ORDER BY date DESC;"');
    console.log('\n🌐 Dashboard Web:');
    console.log('   • URL: http://localhost:3001/dashboard');
    console.log('   • Contraseña: fiestaco2024');
    console.log('   • Token API: fiestaco-admin-2024');
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Error en monitor:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  monitorAnalytics();
}

module.exports = { monitorAnalytics };