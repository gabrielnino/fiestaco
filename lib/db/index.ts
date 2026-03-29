import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: any = null;

export async function getDb() {
  if (!db) {
    const dbDir = path.join(process.cwd(), 'data');
    const dbPath = path.join(dbDir, 'analytics.db');

    // Ensure the data directory exists (handles first-time start or fresh clone)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`📁 Directorio de datos creado: ${dbDir}`);
    }

    console.log(`📊 Inicializando SQLite en: ${dbPath}`);

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Inicializar esquema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        event_name TEXT NOT NULL,
        page_path TEXT NOT NULL,
        metadata TEXT,
        user_agent TEXT,
        referrer TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
      CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
      CREATE INDEX IF NOT EXISTS idx_events_name ON events(event_name);

      -- Tabla de órdenes reales (cierra el funnel whatsapp_click → venta)
      CREATE TABLE IF NOT EXISTS orders (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id   TEXT UNIQUE NOT NULL,   -- FCO-MMDD-XXXX (aparece en WhatsApp)
        session_id TEXT,
        status     TEXT DEFAULT 'pending', -- pending | won | lost
        intended_price REAL,              -- lo que el cliente vio en el sitio
        final_price    REAL,              -- lo que realmente pagó (puede diferir)
        reason     TEXT,                  -- lost: price | no_response | changed_mind | other
        flavor1    TEXT,
        flavor2    TEXT,
        utm_source TEXT,
        notes      TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
    `);

    
    console.log('✅ Base de datos de analytics inicializada');
  }
  return db;
}

// Función para obtener estadísticas básicas
export async function getBasicStats(days: number = 7) {
  const db = await getDb();
  
  const stats = await db.get(`
    SELECT 
      COUNT(*) as total_events,
      COUNT(DISTINCT session_id) as unique_sessions,
      SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) as page_views,
      SUM(CASE WHEN event_name = 'wizard_start' THEN 1 ELSE 0 END) as wizard_starts,
      SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks
    FROM events
    WHERE created_at >= DATETIME('now', ?)
  `, [`-${days} days`]);
  
  return stats;
}