import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { handleCheckRawMilkRules } from '../../src/tools/check-raw-milk-rules.js';
import { createSeededDatabase } from '../helpers/seed-db.js';
import type { Database } from '../../src/db.js';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB = 'tests/test-raw-milk.db';

interface RawMilkResult {
  jurisdiction: string;
  important_notice: string;
  rules: {
    country: string;
    permitted: boolean;
    status: string;
    sales_methods: string | null;
    conditions: string | null;
    warning_label_required: boolean;
    regulation_ref: string | null;
  }[];
  _meta: { disclaimer: string };
}

describe('check_raw_milk_rules tool', () => {
  let db: Database;

  beforeAll(() => {
    db = createSeededDatabase(TEST_DB);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  test('returns all 4 devolved administrations when no country specified', () => {
    const result = handleCheckRawMilkRules(db, {}) as RawMilkResult;
    expect(result.rules).toHaveLength(4);
    const countries = result.rules.map(r => r.country);
    expect(countries).toContain('england');
    expect(countries).toContain('scotland');
    expect(countries).toContain('wales');
    expect(countries).toContain('northern ireland');
  });

  test('England: permitted with restrictions', () => {
    const result = handleCheckRawMilkRules(db, { country: 'England' }) as RawMilkResult;
    expect(result.rules).toHaveLength(1);
    const rule = result.rules[0];
    expect(rule.permitted).toBe(true);
    expect(rule.status).toContain('PERMITTED');
    expect(rule.warning_label_required).toBe(true);
  });

  test('Scotland: BANNED', () => {
    const result = handleCheckRawMilkRules(db, { country: 'Scotland' }) as RawMilkResult;
    expect(result.rules).toHaveLength(1);
    const rule = result.rules[0];
    expect(rule.permitted).toBe(false);
    expect(rule.status).toBe('PROHIBITED');
    expect(rule.sales_methods).toContain('BANNED');
  });

  test('Wales: permitted with restrictions', () => {
    const result = handleCheckRawMilkRules(db, { country: 'Wales' }) as RawMilkResult;
    expect(result.rules).toHaveLength(1);
    const rule = result.rules[0];
    expect(rule.permitted).toBe(true);
    expect(rule.status).toContain('PERMITTED');
    expect(rule.warning_label_required).toBe(true);
  });

  test('Northern Ireland: PROHIBITED', () => {
    const result = handleCheckRawMilkRules(db, { country: 'Northern Ireland' }) as RawMilkResult;
    expect(result.rules).toHaveLength(1);
    const rule = result.rules[0];
    expect(rule.permitted).toBe(false);
    expect(rule.status).toBe('PROHIBITED');
    expect(rule.sales_methods).toContain('PROHIBITED');
  });

  test('rejects unsupported jurisdiction', () => {
    const result = handleCheckRawMilkRules(db, { jurisdiction: 'DE' });
    expect(result).toHaveProperty('error', 'jurisdiction_not_supported');
  });

  test('includes important notice about criminal offence', () => {
    const result = handleCheckRawMilkRules(db, {}) as RawMilkResult;
    expect(result.important_notice).toContain('criminal offence');
  });
});
