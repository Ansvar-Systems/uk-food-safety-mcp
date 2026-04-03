/**
 * Update coverage.json from the current database.
 * Run: npx tsx scripts/update-coverage.ts
 */

import { createDatabase } from '../src/db.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'database.db');

const db = createDatabase(DB_PATH);
const today = new Date().toISOString().split('T')[0];

const productCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM products');
const requirementCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM product_requirements');
const schemeCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM assurance_schemes');
const hygieneCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM hygiene_rules');
const rawMilkCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM raw_milk_rules');
const labellingCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM labelling_rules');
const ftsCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM search_index');

const coverage = {
  mcp_name: 'UK Food Safety MCP',
  jurisdiction: 'GB',
  build_date: today,
  products: productCount?.cnt ?? 0,
  product_requirements: requirementCount?.cnt ?? 0,
  assurance_schemes: schemeCount?.cnt ?? 0,
  hygiene_rules: hygieneCount?.cnt ?? 0,
  raw_milk_rules: rawMilkCount?.cnt ?? 0,
  labelling_rules: labellingCount?.cnt ?? 0,
  fts_entries: ftsCount?.cnt ?? 0,
};

writeFileSync(
  join(__dirname, '..', 'data', 'coverage.json'),
  JSON.stringify(coverage, null, 2) + '\n'
);

console.log('Coverage updated:', coverage);
db.close();
