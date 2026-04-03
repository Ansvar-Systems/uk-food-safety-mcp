import { buildMeta } from '../metadata.js';
import { SUPPORTED_JURISDICTIONS } from '../jurisdiction.js';

export function handleAbout() {
  return {
    name: 'UK Food Safety MCP',
    description:
      'UK food safety and traceability regulations. Covers direct sales rules, labelling requirements, ' +
      'raw milk legality by devolved administration, assurance schemes (Red Tractor, SALSA, Soil Association), ' +
      'HACCP and hygiene requirements, and traceability obligations for farm-to-fork compliance.',
    version: '0.1.0',
    jurisdiction: [...SUPPORTED_JURISDICTIONS],
    data_sources: [
      'Food Standards Agency (FSA)',
      'Food Standards Scotland (FSS)',
      'DEFRA',
      'Food Safety and Hygiene (England) Regulations 2013',
      'Food Information Regulations 2014',
      'The Honey (England) Regulations 2015',
    ],
    tools_count: 11,
    links: {
      homepage: 'https://ansvar.eu/open-agriculture',
      repository: 'https://github.com/Ansvar-Systems/uk-food-safety-mcp',
      mcp_network: 'https://ansvar.ai/mcp',
    },
    _meta: buildMeta(),
  };
}
