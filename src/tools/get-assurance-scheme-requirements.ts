import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface AssuranceArgs {
  scheme?: string;
  product_type?: string;
  jurisdiction?: string;
}

interface SchemeRow {
  id: string;
  name: string;
  product_types: string;
  standards_summary: string;
  audit_frequency: string;
  cost_indication: string;
  url: string;
}

export function handleGetAssuranceSchemeRequirements(db: Database, args: AssuranceArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  let schemes: SchemeRow[];

  if (args.scheme) {
    const schemeId = args.scheme.toLowerCase().replace(/\s+/g, '-');
    schemes = db.all<SchemeRow>(
      'SELECT * FROM assurance_schemes WHERE id = ? OR LOWER(name) LIKE ? AND jurisdiction = ?',
      [schemeId, `%${args.scheme.toLowerCase()}%`, jv.jurisdiction]
    );
  } else if (args.product_type) {
    schemes = db.all<SchemeRow>(
      'SELECT * FROM assurance_schemes WHERE LOWER(product_types) LIKE ? AND jurisdiction = ?',
      [`%${args.product_type.toLowerCase()}%`, jv.jurisdiction]
    );
  } else {
    schemes = db.all<SchemeRow>(
      'SELECT * FROM assurance_schemes WHERE jurisdiction = ?',
      [jv.jurisdiction]
    );
  }

  return {
    jurisdiction: jv.jurisdiction,
    schemes_count: schemes.length,
    schemes: schemes.map(s => ({
      id: s.id,
      name: s.name,
      product_types: s.product_types,
      standards_summary: s.standards_summary,
      audit_frequency: s.audit_frequency,
      cost_indication: s.cost_indication,
      url: s.url,
    })),
    _meta: buildMeta(),
  };
}
