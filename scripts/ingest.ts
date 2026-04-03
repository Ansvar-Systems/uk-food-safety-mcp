/**
 * Ingestion script -- wraps build-db.ts for the CI/CD ingest workflow.
 * Run: npx tsx scripts/ingest.ts
 */

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Running food safety data ingestion...');
execSync(`npx tsx ${join(__dirname, 'build-db.ts')}`, { stdio: 'inherit' });
console.log('Ingestion complete.');
