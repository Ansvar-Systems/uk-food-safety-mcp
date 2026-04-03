import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface ProductRequirementsArgs {
  product: string;
  sales_channel?: string;
  jurisdiction?: string;
}

interface RequirementRow {
  product_id: string;
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
  species: string | null;
}

export function handleGetProductRequirements(db: Database, args: ProductRequirementsArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const productId = args.product.toLowerCase().replace(/\s+/g, '-');

  const product = db.get<ProductRow>(
    'SELECT id, name, product_type, species FROM products WHERE id = ? OR LOWER(name) = ? AND jurisdiction = ?',
    [productId, args.product.toLowerCase(), jv.jurisdiction]
  );

  if (!product) {
    return {
      error: 'product_not_found',
      message: `No product found matching "${args.product}". Use search_food_safety to find available products.`,
      _meta: buildMeta(),
    };
  }

  let sql = 'SELECT * FROM product_requirements WHERE product_id = ? AND jurisdiction = ?';
  const params: unknown[] = [product.id, jv.jurisdiction];

  if (args.sales_channel) {
    sql += ' AND sales_channel = ?';
    params.push(args.sales_channel.toLowerCase().replace(/\s+/g, '_'));
  }

  const requirements = db.all<RequirementRow>(sql, params);

  return {
    product: {
      id: product.id,
      name: product.name,
      product_type: product.product_type,
      species: product.species,
    },
    jurisdiction: jv.jurisdiction,
    requirements: requirements.map(r => ({
      sales_channel: r.sales_channel,
      registration_required: r.registration_required === 1,
      approval_required: r.approval_required === 1,
      temperature_control: r.temperature_control,
      traceability_requirements: r.traceability_requirements,
      labelling_requirements: r.labelling_requirements,
      regulation_ref: r.regulation_ref,
    })),
    _meta: buildMeta(),
  };
}
