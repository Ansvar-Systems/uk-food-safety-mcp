/**
 * Check data freshness for CI/CD monitoring.
 * Run: npx tsx scripts/check-freshness.ts
 */

import { createDatabase } from '../src/db.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'database.db');

const db = createDatabase(DB_PATH);

const lastIngest = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['last_ingest']);
const buildDate = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['build_date']);

if (!lastIngest?.value) {
  console.log('WARNING: No ingest date found. Database may not be built.');
  process.exit(1);
}

const ingestDate = new Date(lastIngest.value);
const now = new Date();
const daysSince = Math.floor((now.getTime() - ingestDate.getTime()) / (1000 * 60 * 60 * 24));

console.log(`Last ingest: ${lastIngest.value}`);
console.log(`Build date: ${buildDate?.value ?? 'unknown'}`);
console.log(`Days since ingest: ${daysSince}`);

if (daysSince > 90) {
  console.log('WARNING: Data is stale (>90 days). Run ingestion pipeline.');
  process.exit(1);
}

console.log('Data freshness: OK');
db.close();
