import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface LabellingArgs {
  product: string;
  jurisdiction?: string;
}

interface LabellingRow {
  product_type: string;
  field: string;
  mandatory: number;
  format: string | null;
  regulation_ref: string | null;
}

export function handleGetLabellingRequirements(db: Database, args: LabellingArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const productType = args.product.toLowerCase().replace(/\s+/g, '-');

  // Try exact match first, then partial match
  let rules = db.all<LabellingRow>(
    'SELECT product_type, field, mandatory, format, regulation_ref FROM labelling_rules WHERE LOWER(product_type) = ? AND jurisdiction = ?',
    [productType, jv.jurisdiction]
  );

  if (rules.length === 0) {
    rules = db.all<LabellingRow>(
      'SELECT product_type, field, mandatory, format, regulation_ref FROM labelling_rules WHERE LOWER(product_type) LIKE ? AND jurisdiction = ?',
      [`%${productType}%`, jv.jurisdiction]
    );
  }

  // Also get general pre-packed rules if not already included
  const generalRules = db.all<LabellingRow>(
    'SELECT product_type, field, mandatory, format, regulation_ref FROM labelling_rules WHERE product_type = ? AND jurisdiction = ?',
    ['all-pre-packed', jv.jurisdiction]
  );

  const productSpecific = rules.filter(r => r.product_type !== 'all-pre-packed');
  const general = generalRules.length > 0 ? generalRules : rules.filter(r => r.product_type === 'all-pre-packed');

  return {
    product: args.product,
    jurisdiction: jv.jurisdiction,
    general_requirements: general.map(r => ({
      field: r.field,
      mandatory: r.mandatory === 1,
      format: r.format,
      regulation_ref: r.regulation_ref,
    })),
    product_specific_requirements: productSpecific.map(r => ({
      product_type: r.product_type,
      field: r.field,
      mandatory: r.mandatory === 1,
      format: r.format,
      regulation_ref: r.regulation_ref,
    })),
    _meta: buildMeta(),
  };
}
