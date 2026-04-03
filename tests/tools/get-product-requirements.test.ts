import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetProductRequirements } from '../../src/tools/get-product-requirements.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-product-reqs.db';

describe('get_product_requirements tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns requirements for eggs', () => {
    const result = handleGetProductRequirements(db, { product: 'eggs' });
    expect(result).toHaveProperty('product');
    if ('product' in result) {
      expect(result.product.name).toBe('Eggs');
      expect(result.requirements.length).toBeGreaterThan(0);
    }
  });

  test('filters by sales channel', () => {
    const result = handleGetProductRequirements(db, { product: 'eggs', sales_channel: 'farm_gate' });
    if ('requirements' in result) {
      expect(result.requirements).toHaveLength(1);
      expect(result.requirements[0].sales_channel).toBe('farm_gate');
    }
  });

  test('raw milk farm gate shows registration required but not approval', () => {
    const result = handleGetProductRequirements(db, { product: 'raw-milk', sales_channel: 'farm_gate' });
    if ('requirements' in result) {
      expect(result.requirements[0].registration_required).toBe(true);
      expect(result.requirements[0].approval_required).toBe(false);
    }
  });

  test('meat-beef shows approval required', () => {
    const result = handleGetProductRequirements(db, { product: 'meat-beef' });
    if ('requirements' in result) {
      for (const req of result.requirements) {
        expect(req.approval_required).toBe(true);
      }
    }
  });

  test('returns error for unknown product', () => {
    const result = handleGetProductRequirements(db, { product: 'unicorn-steaks' });
    expect(result).toHaveProperty('error', 'product_not_found');
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleGetProductRequirements(db, { product: 'eggs', jurisdiction: 'US' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('includes _meta with disclaimer', () => {
    const result = handleGetProductRequirements(db, { product: 'honey' });
    expect(result).toHaveProperty('_meta');
  });
});
