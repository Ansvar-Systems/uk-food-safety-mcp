import { buildMeta } from '../metadata.js';
import type { Database } from '../db.js';

interface Source {
  name: string;
  authority: string;
  official_url: string;
  retrieval_method: string;
  update_frequency: string;
  license: string;
  coverage: string;
  last_retrieved?: string;
}

export function handleListSources(db: Database): { sources: Source[]; _meta: ReturnType<typeof buildMeta> } {
  const lastIngest = db.get<{ value: string }>('SELECT value FROM db_metadata WHERE key = ?', ['last_ingest']);

  const sources: Source[] = [
    {
      name: 'Food Standards Agency Guidance',
      authority: 'Food Standards Agency',
      official_url: 'https://www.food.gov.uk/',
      retrieval_method: 'MANUAL_EXTRACTION',
      update_frequency: 'as_amended',
      license: 'Open Government Licence v3',
      coverage: 'Food hygiene, registration, HACCP, direct sales, raw milk rules for England, Wales, and NI',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Food Standards Scotland',
      authority: 'Food Standards Scotland',
      official_url: 'https://www.foodstandards.gov.scot/',
      retrieval_method: 'MANUAL_EXTRACTION',
      update_frequency: 'as_amended',
      license: 'Open Government Licence v3',
      coverage: 'Scottish food safety regulations including raw milk ban',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Food Information Regulations 2014',
      authority: 'UK Government',
      official_url: 'https://www.legislation.gov.uk/uksi/2014/1855/contents',
      retrieval_method: 'LEGISLATION_EXTRACTION',
      update_frequency: 'as_amended',
      license: 'Open Government Licence v3',
      coverage: 'Labelling requirements for pre-packed and non-pre-packed food',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Food Safety and Hygiene (England) Regulations 2013',
      authority: 'UK Government',
      official_url: 'https://www.legislation.gov.uk/uksi/2013/2996/contents',
      retrieval_method: 'LEGISLATION_EXTRACTION',
      update_frequency: 'as_amended',
      license: 'Open Government Licence v3',
      coverage: 'Hygiene rules, registration, approval, temperature controls',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'The Honey (England) Regulations 2015',
      authority: 'UK Government',
      official_url: 'https://www.legislation.gov.uk/uksi/2015/1348/contents',
      retrieval_method: 'LEGISLATION_EXTRACTION',
      update_frequency: 'as_amended',
      license: 'Open Government Licence v3',
      coverage: 'Honey-specific labelling and composition standards',
      last_retrieved: lastIngest?.value,
    },
    {
      name: 'Assurance Scheme Websites',
      authority: 'Various (Red Tractor, RSPCA Assured, Soil Association, SALSA, QMS)',
      official_url: 'https://redtractor.org.uk/',
      retrieval_method: 'MANUAL_EXTRACTION',
      update_frequency: 'annual',
      license: 'Public information',
      coverage: 'Standards, audit frequency, cost indications for major UK farm assurance schemes',
      last_retrieved: lastIngest?.value,
    },
  ];

  return {
    sources,
    _meta: buildMeta({ source_url: 'https://www.food.gov.uk/' }),
  };
}
