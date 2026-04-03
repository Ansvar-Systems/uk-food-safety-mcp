import BetterSqlite3 from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface Database {
  get<T>(sql: string, params?: unknown[]): T | undefined;
  all<T>(sql: string, params?: unknown[]): T[];
  run(sql: string, params?: unknown[]): void;
  close(): void;
  readonly instance: BetterSqlite3.Database;
}

export function createDatabase(dbPath?: string): Database {
  const resolvedPath =
    dbPath ??
    join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'database.db');
  const db = new BetterSqlite3(resolvedPath);

  db.pragma('journal_mode = DELETE');
  db.pragma('foreign_keys = ON');

  initSchema(db);

  return {
    get<T>(sql: string, params: unknown[] = []): T | undefined {
      return db.prepare(sql).get(...params) as T | undefined;
    },
    all<T>(sql: string, params: unknown[] = []): T[] {
      return db.prepare(sql).all(...params) as T[];
    },
    run(sql: string, params: unknown[] = []): void {
      db.prepare(sql).run(...params);
    },
    close(): void {
      db.close();
    },
    get instance() {
      return db;
    },
  };
}

function initSchema(db: BetterSqlite3.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      product_type TEXT,
      species TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS product_requirements (
      id INTEGER PRIMARY KEY,
      product_id TEXT REFERENCES products(id),
      sales_channel TEXT,
      registration_required INTEGER,
      approval_required INTEGER,
      temperature_control TEXT,
      traceability_requirements TEXT,
      labelling_requirements TEXT,
      regulation_ref TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS assurance_schemes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      product_types TEXT,
      standards_summary TEXT,
      audit_frequency TEXT,
      cost_indication TEXT,
      url TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS hygiene_rules (
      id INTEGER PRIMARY KEY,
      activity TEXT NOT NULL,
      premises_type TEXT,
      registration_type TEXT,
      haccp_required INTEGER,
      temperature_controls TEXT,
      cleaning_requirements TEXT,
      regulation_ref TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS raw_milk_rules (
      id INTEGER PRIMARY KEY,
      country TEXT NOT NULL,
      permitted INTEGER NOT NULL,
      sales_methods TEXT,
      conditions TEXT,
      warning_label_required INTEGER,
      regulation_ref TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE TABLE IF NOT EXISTS labelling_rules (
      id INTEGER PRIMARY KEY,
      product_type TEXT NOT NULL,
      field TEXT NOT NULL,
      mandatory INTEGER NOT NULL,
      format TEXT,
      regulation_ref TEXT,
      jurisdiction TEXT NOT NULL DEFAULT 'GB'
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
      title, body, product_type, jurisdiction
    );

    CREATE TABLE IF NOT EXISTS db_metadata (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    INSERT OR IGNORE INTO db_metadata (key, value) VALUES ('schema_version', '1.0');
    INSERT OR IGNORE INTO db_metadata (key, value) VALUES ('mcp_name', 'UK Food Safety MCP');
    INSERT OR IGNORE INTO db_metadata (key, value) VALUES ('jurisdiction', 'GB');
  `);
}

export function ftsSearch(
  db: Database,
  query: string,
  limit: number = 20
): { title: string; body: string; product_type: string; jurisdiction: string; rank: number }[] {
  return db.all(
    `SELECT title, body, product_type, jurisdiction, rank
     FROM search_index
     WHERE search_index MATCH ?
     ORDER BY rank
     LIMIT ?`,
    [query, limit]
  );
}
