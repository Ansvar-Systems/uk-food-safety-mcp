import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleSearchFoodSafety } from '../../src/tools/search-food-safety.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-search-food.db';

describe('search_food_safety tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns results for raw milk query', () => {
    const result = handleSearchFoodSafety(db, { query: 'raw milk' });
    expect(result).toHaveProperty('results_count');
    expect((result as { results_count: number }).results_count).toBeGreaterThan(0);
  });

  test('returns results for HACCP query', () => {
    const result = handleSearchFoodSafety(db, { query: 'HACCP' });
    expect(result).toHaveProperty('results_count');
    expect((result as { results_count: number }).results_count).toBeGreaterThan(0);
  });

  test('respects product_type filter', () => {
    const result = handleSearchFoodSafety(db, { query: 'labelling', product_type: 'eggs' });
    if ('results' in result) {
      for (const r of result.results as { product_type: string }[]) {
        expect(r.product_type).toBe('eggs');
      }
    }
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleSearchFoodSafety(db, { query: 'milk', jurisdiction: 'FR' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('returns _meta with disclaimer', () => {
    const result = handleSearchFoodSafety(db, { query: 'eggs' });
    expect(result).toHaveProperty('_meta');
    if ('_meta' in result) {
      expect(result._meta).toHaveProperty('disclaimer');
    }
  });
});
