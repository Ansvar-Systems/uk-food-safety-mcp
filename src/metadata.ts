export interface Meta {
  disclaimer: string;
  data_age: string;
  source_url: string;
  copyright: string;
  server: string;
  version: string;
}

const DISCLAIMER =
  'This server provides general guidance on UK food safety regulations. Requirements vary by ' +
  'local authority and devolved administration. Always consult your local Environmental Health ' +
  'Officer for site-specific requirements. This is not a substitute for professional food ' +
  'safety advice.';

export function buildMeta(overrides?: Partial<Meta>): Meta {
  return {
    disclaimer: DISCLAIMER,
    data_age: overrides?.data_age ?? 'unknown',
    source_url: overrides?.source_url ?? 'https://www.food.gov.uk/',
    copyright: 'Data: Crown Copyright and FSA. Server: Apache-2.0 Ansvar Systems.',
    server: 'uk-food-safety-mcp',
    version: '0.1.0',
    ...overrides,
  };
}
