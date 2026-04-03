import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface RawMilkArgs {
  country?: string;
  sales_method?: string;
  jurisdiction?: string;
}

interface RawMilkRow {
  id: number;
  country: string;
  permitted: number;
  sales_methods: string | null;
  conditions: string | null;
  warning_label_required: number;
  regulation_ref: string | null;
}

export function handleCheckRawMilkRules(db: Database, args: RawMilkArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  let sql = 'SELECT * FROM raw_milk_rules WHERE jurisdiction = ?';
  const params: unknown[] = [jv.jurisdiction];

  if (args.country) {
    sql += ' AND LOWER(country) = ?';
    params.push(args.country.toLowerCase());
  }

  const rules = db.all<RawMilkRow>(sql, params);

  const result = {
    jurisdiction: jv.jurisdiction,
    important_notice: 'Raw milk sale legality varies by devolved administration within the UK. Selling raw milk where prohibited is a criminal offence.',
    rules: rules.map(r => ({
      country: r.country,
      permitted: r.permitted === 1,
      status: r.permitted === 1 ? 'PERMITTED (with restrictions)' : 'PROHIBITED',
      sales_methods: r.sales_methods,
      conditions: r.conditions,
      warning_label_required: r.warning_label_required === 1,
      regulation_ref: r.regulation_ref,
    })),
    _meta: buildMeta(),
  };

  // If sales_method filter was provided, add a note about applicability
  if (args.sales_method) {
    const method = args.sales_method.toLowerCase();
    for (const rule of result.rules) {
      const salesMethodsList = (rule.sales_methods ?? '').toLowerCase();
      if (rule.permitted && !salesMethodsList.includes(method)) {
        (rule as Record<string, unknown>).sales_method_note =
          `"${args.sales_method}" may not be a permitted sales method in ${rule.country}. Permitted methods: ${rule.sales_methods}`;
      }
    }
  }

  return result;
}
