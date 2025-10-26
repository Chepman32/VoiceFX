/**
 * Database Schema - SQLite table definitions
 */

export const SCHEMA_VERSION = 1;

export const createTablesSQL = `
  -- Projects table
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL DEFAULT 0,
    file_uri TEXT NOT NULL,
    thumbnail_uri TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    tags TEXT
  );

  -- Effects table
  CREATE TABLE IF NOT EXISTS effects (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    parameters TEXT NOT NULL,
    is_pro INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- Project Effects junction table
  CREATE TABLE IF NOT EXISTS project_effects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT NOT NULL,
    effect_id TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (effect_id) REFERENCES effects (id) ON DELETE CASCADE
  );

  -- Preferences table
  CREATE TABLE IF NOT EXISTS preferences (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- IAP Purchases table
  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    purchase_date TEXT NOT NULL,
    transaction_id TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
  );

  -- Notifications table
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    scheduled_date TEXT NOT NULL,
    is_recurring INTEGER NOT NULL DEFAULT 0,
    recurrence_pattern TEXT,
    created_at TEXT NOT NULL,
    is_sent INTEGER NOT NULL DEFAULT 0
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_projects_is_favorite ON projects(is_favorite);
  CREATE INDEX IF NOT EXISTS idx_project_effects_project ON project_effects(project_id);
  CREATE INDEX IF NOT EXISTS idx_project_effects_effect ON project_effects(effect_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_date);
`;

export const dropTablesSQL = `
  DROP TABLE IF EXISTS notifications;
  DROP TABLE IF EXISTS purchases;
  DROP TABLE IF EXISTS preferences;
  DROP TABLE IF EXISTS project_effects;
  DROP TABLE IF EXISTS effects;
  DROP TABLE IF EXISTS projects;
`;

export const seedDataSQL = `
  -- Seed default voice effects
  INSERT OR IGNORE INTO effects (id, name, type, parameters, is_pro, created_at, updated_at) VALUES
    ('effect_pitch_high', 'High Pitch', 'pitch', '{"pitch": 2.0, "formant": 1.5}', 0, datetime('now'), datetime('now')),
    ('effect_pitch_low', 'Low Pitch', 'pitch', '{"pitch": 0.5, "formant": 0.75}', 0, datetime('now'), datetime('now')),
    ('effect_robot', 'Robot Voice', 'formant', '{"formant": 0.3, "resonance": 0.8}', 0, datetime('now'), datetime('now')),
    ('effect_echo', 'Echo', 'echo', '{"delay": 300, "feedback": 0.5, "mix": 0.4}', 0, datetime('now'), datetime('now')),
    ('effect_reverb_small', 'Small Room', 'reverb', '{"roomSize": 0.3, "damping": 0.5, "mix": 0.3}', 0, datetime('now'), datetime('now')),
    ('effect_reverb_large', 'Large Hall', 'reverb', '{"roomSize": 0.9, "damping": 0.3, "mix": 0.5}', 1, datetime('now'), datetime('now')),
    ('effect_distortion', 'Distortion', 'distortion', '{"drive": 0.7, "tone": 0.5, "mix": 0.6}', 1, datetime('now'), datetime('now')),
    ('effect_alien', 'Alien Voice', 'custom', '{"pitch": 1.5, "formant": 0.4, "modulation": 0.8}', 1, datetime('now'), datetime('now'));

  -- Seed default preferences
  INSERT OR IGNORE INTO preferences (key, value, updated_at) VALUES
    ('theme_mode', '"system"', datetime('now')),
    ('dynamic_type_size', '1.0', datetime('now')),
    ('haptics_enabled', 'true', datetime('now')),
    ('sound_effects_enabled', 'true', datetime('now')),
    ('analytics_enabled', 'false', datetime('now')),
    ('onboarding_completed', 'false', datetime('now'));
`;
