import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface DirectSalesArgs {
  product: string;
  sales_method?: string;
  volume?: string;
  jurisdiction?: string;
}

interface RequirementRow {
  sales_channel: string;
  registration_required: number;
  approval_required: number;
  temperature_control: string | null;
  traceability_requirements: string | null;
  labelling_requirements: string | null;
  regulation_ref: string | null;
}

interface ProductRow {
  id: string;
  name: string;
  product_type: string | null;
}

export function handleCheckDirectSalesRules(db: Database, args: DirectSalesArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const productId = args.product.toLowerCase().replace(/\s+/g, '-');

  const product = db.get<ProductRow>(
    'SELECT id, name, product_type FROM products WHERE id = ? OR LOWER(name) = ? AND jurisdiction = ?',
    [productId, args.product.toLowerCase(), jv.jurisdiction]
  );

  if (!product) {
    return {
      error: 'product_not_found',
      message: `No product found matching "${args.product}". Use search_food_safety to find available products.`,
      _meta: buildMeta(),
    };
  }

  const directChannels = ['farm_gate', 'farmers_market', 'online'];
  let channels = directChannels;
  if (args.sales_method) {
    const method = args.sales_method.toLowerCase().replace(/\s+/g, '_').replace(/'/, '');
    channels = directChannels.filter(c => c.includes(method) || method.includes(c));
    if (channels.length === 0) channels = directChannels;
  }

  const placeholders = channels.map(() => '?').join(',');
  const requirements = db.all<RequirementRow>(
    `SELECT sales_channel, registration_required, approval_required, temperature_control,
            traceability_requirements, labelling_requirements, regulation_ref
     FROM product_requirements
     WHERE product_id = ? AND jurisdiction = ? AND sales_channel IN (${placeholders})`,
    [product.id, jv.jurisdiction, ...channels]
  );

  return {
    product: product.name,
    product_type: product.product_type,
    jurisdiction: jv.jurisdiction,
    volume_note: args.volume
      ? 'Volume thresholds noted. Check specific exemptions with your local authority.'
      : 'Volume-based exemptions may apply (e.g. eggs: <50 birds exempt from grading).',
    direct_sales_rules: requirements.map(r => ({
      sales_channel: r.sales_channel,
      registration_required: r.registration_required === 1,
      approval_required: r.approval_required === 1,
      temperature_control: r.temperature_control,
      traceability: r.traceability_requirements,
      labelling: r.labelling_requirements,
      regulation_ref: r.regulation_ref,
    })),
    _meta: buildMeta(),
  };
}
