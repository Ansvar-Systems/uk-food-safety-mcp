import { buildMeta } from '../metadata.js';
import { validateJurisdiction } from '../jurisdiction.js';
import type { Database } from '../db.js';

interface TraceabilityArgs {
  product_type: string;
  species?: string;
  jurisdiction?: string;
}

interface RequirementRow {
  product_id: string;
  sales_channel: string;
  traceability_requirements: string | null;
  regulation_ref: string | null;
}

interface ProductRow {
  id: string;
  name: string;
  product_type: string | null;
  species: string | null;
}

export function handleGetTraceabilityRules(db: Database, args: TraceabilityArgs) {
  const jv = validateJurisdiction(args.jurisdiction);
  if (!jv.valid) return jv.error;

  const productType = args.product_type.toLowerCase();

  let productSql = 'SELECT id, name, product_type, species FROM products WHERE LOWER(product_type) = ? AND jurisdiction = ?';
  const productParams: unknown[] = [productType, jv.jurisdiction];

  if (args.species) {
    productSql += ' AND LOWER(species) = ?';
    productParams.push(args.species.toLowerCase());
  }

  const products = db.all<ProductRow>(productSql, productParams);

  if (products.length === 0) {
    // Fall back to searching by ID or name
    const fallback = db.all<ProductRow>(
      'SELECT id, name, product_type, species FROM products WHERE id LIKE ? OR LOWER(name) LIKE ? AND jurisdiction = ?',
      [`%${productType}%`, `%${productType}%`, jv.jurisdiction]
    );
    if (fallback.length === 0) {
      return {
        error: 'product_type_not_found',
        message: `No products found for type "${args.product_type}". Use search_food_safety to find available products.`,
        _meta: buildMeta(),
      };
    }
    products.push(...fallback);
  }

  const productIds = products.map(p => p.id);
  const placeholders = productIds.map(() => '?').join(',');
  const requirements = db.all<RequirementRow>(
    `SELECT product_id, sales_channel, traceability_requirements, regulation_ref
     FROM product_requirements
     WHERE product_id IN (${placeholders}) AND jurisdiction = ? AND traceability_requirements IS NOT NULL`,
    [...productIds, jv.jurisdiction]
  );

  const general_principles = {
    one_step_back_one_step_forward: 'All food businesses must be able to identify who supplied them (one step back) and who they supplied (one step forward). EC Regulation 178/2002 Article 18.',
    record_retention: 'Traceability records must be kept for 5 years (or product shelf life + 6 months if longer).',
    withdrawal_recall: 'If a product is found to be unsafe, the business must initiate withdrawal (from supply chain) or recall (from consumers) and notify the FSA.',
  };

  return {
    product_type: args.product_type,
    jurisdiction: jv.jurisdiction,
    general_principles,
    products: products.map(p => {
      const productReqs = requirements.filter(r => r.product_id === p.id);
      return {
        product: p.name,
        species: p.species,
        traceability_by_channel: productReqs.map(r => ({
          sales_channel: r.sales_channel,
          requirements: r.traceability_requirements,
          regulation_ref: r.regulation_ref,
        })),
      };
    }),
    _meta: buildMeta(),
  };
}
