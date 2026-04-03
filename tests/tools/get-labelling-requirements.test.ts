import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleGetLabellingRequirements } from '../../src/tools/get-labelling-requirements.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-labelling.db';

describe('get_labelling_requirements tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns general pre-packed requirements', () => {
    const result = handleGetLabellingRequirements(db, { product: 'baked-goods' });
    if ('general_requirements' in result) {
      expect(result.general_requirements.length).toBeGreaterThan(0);
      const fields = result.general_requirements.map(r => r.field);
      expect(fields).toContain('name_of_food');
      expect(fields).toContain('allergens');
    }
  });

  test('returns egg-specific labelling rules', () => {
    const result = handleGetLabellingRequirements(db, { product: 'eggs' });
    if ('product_specific_requirements' in result) {
      expect(result.product_specific_requirements.length).toBeGreaterThan(0);
      const fields = result.product_specific_requirements.map(r => r.field);
      expect(fields).toContain('farming_method_code');
    }
  });

  test('returns honey-specific labelling rules', () => {
    const result = handleGetLabellingRequirements(db, { product: 'honey' });
    if ('product_specific_requirements' in result) {
      expect(result.product_specific_requirements.length).toBeGreaterThan(0);
      const fields = result.product_specific_requirements.map(r => r.field);
      expect(fields).toContain('country_of_origin');
    }
  });

  test('returns beef origin labelling', () => {
    const result = handleGetLabellingRequirements(db, { product: 'meat-beef' });
    if ('product_specific_requirements' in result) {
      const fields = result.product_specific_requirements.map(r => r.field);
      expect(fields).toContain('country_of_birth');
    }
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleGetLabellingRequirements(db, { product: 'eggs', jurisdiction: 'JP' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });
});
