/**
 * Database Client - SQLite database operations
 */

import {open} from '@op-engineering/op-sqlite';
import {createTablesSQL, seedDataSQL, SCHEMA_VERSION} from './schema';

const DB_NAME = 'voicefx.db';

class DatabaseClient {
  private db: any;
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.db = open({name: DB_NAME});

      // Enable foreign keys
      this.db.execute('PRAGMA foreign_keys = ON;');

      // Check schema version
      const versionResult = this.db.execute(
        'PRAGMA user_version;'
      );
      const currentVersion = versionResult.rows?._array?.[0]?.user_version || 0;

      if (currentVersion < SCHEMA_VERSION) {
        await this.migrate(currentVersion, SCHEMA_VERSION);
      }

      this.initialized = true;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async migrate(fromVersion: number, toVersion: number): Promise<void> {
    console.log(`Migrating database from v${fromVersion} to v${toVersion}`);

    // Create tables
    await this.executeBatch(createTablesSQL);

    // Seed initial data
    await this.executeBatch(seedDataSQL);

    // Update schema version
    this.db.execute(`PRAGMA user_version = ${toVersion};`);

    console.log('✅ Database migration completed');
  }

  private async executeBatch(sql: string): Promise<void> {
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        this.db.execute(statement);
      } catch (error) {
        console.error('Failed to execute statement:', statement);
        throw error;
      }
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    try {
      const result = this.db.execute(sql, params);
      return result.rows?._array || [];
    } catch (error) {
      console.error('Query failed:', sql, params, error);
      throw error;
    }
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    try {
      this.db.execute(sql, params);
    } catch (error) {
      console.error('Execute failed:', sql, params, error);
      throw error;
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    if (!this.initialized) {
      throw new Error('Database not initialized');
    }

    try {
      this.db.execute('BEGIN TRANSACTION;');
      const result = await callback();
      this.db.execute('COMMIT;');
      return result;
    } catch (error) {
      this.db.execute('ROLLBACK;');
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.initialized = false;
    }
  }
}

export const db = new DatabaseClient();
