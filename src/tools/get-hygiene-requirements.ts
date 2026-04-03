import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface HygieneArgs {
  activity: string;
  premises_type?: string;
  jurisdiction?: string;
}

interface HygieneRow {
  id: number;
  activity: string;
  premises_type: string | null;
  registration_type: string | null;
  haccp_required: number;
  temperature_controls: string | null;
  cleaning_requirements: string | null;
  regulation_ref: string | null;
}

export function handleGetHygieneRequirements(db: Database, args: HygieneArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const activity = args.activity.toLowerCase();

  let sql = 'SELECT * FROM hygiene_rules WHERE LOWER(activity) LIKE ? AND jurisdiction = ?';
  const params: unknown[] = [`%${activity}%`, jv.jurisdiction];

  if (args.premises_type) {
    sql += ' AND LOWER(premises_type) LIKE ?';
    params.push(`%${args.premises_type.toLowerCase()}%`);
  }

  const rules = db.all<HygieneRow>(sql, params);

  if (rules.length === 0) {
    return {
      error: 'no_rules_found',
      message: `No hygiene rules found for activity "${args.activity}". Try broader terms like "dairy", "butchery", "baking", or "market".`,
      _meta: buildMeta(),
    };
  }

  return {
    activity: args.activity,
    premises_type: args.premises_type ?? 'all',
    jurisdiction: jv.jurisdiction,
    rules: rules.map(r => ({
      activity: r.activity,
      premises_type: r.premises_type,
      registration_type: r.registration_type,
      haccp_required: r.haccp_required === 1,
      temperature_controls: r.temperature_controls,
      cleaning_requirements: r.cleaning_requirements,
      regulation_ref: r.regulation_ref,
    })),
    _meta: buildMeta(),
  };
}
