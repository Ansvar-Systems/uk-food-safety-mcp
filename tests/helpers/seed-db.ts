import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // Products
  db.run(
    'INSERT INTO products (id, name, product_type, species, jurisdiction) VALUES (?, ?, ?, ?, ?)',
    ['raw-milk', 'Raw Milk', 'dairy', 'cattle', 'GB']
  );
  db.run(
    'INSERT INTO products (id, name, product_type, species, jurisdiction) VALUES (?, ?, ?, ?, ?)',
    ['eggs', 'Eggs', 'eggs', 'poultry', 'GB']
  );
  db.run(
    'INSERT INTO products (id, name, product_type, species, jurisdiction) VALUES (?, ?, ?, ?, ?)',
    ['honey', 'Honey', 'honey', null, 'GB']
  );
  db.run(
    'INSERT INTO products (id, name, product_type, species, jurisdiction) VALUES (?, ?, ?, ?, ?)',
    ['meat-beef', 'Beef', 'meat', 'cattle', 'GB']
  );
  db.run(
    'INSERT INTO products (id, name, product_type, species, jurisdiction) VALUES (?, ?, ?, ?, ?)',
    ['baked-goods', 'Baked Goods', 'bakery', null, 'GB']
  );

  // Product requirements
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['raw-milk', 'farm_gate', 1, 0, 'Below 8C', 'Herd health records, TB testing', 'Warning label required', 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['raw-milk', 'retail', 0, 0, null, 'NOT PERMITTED', 'NOT PERMITTED', 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['eggs', 'farm_gate', 0, 0, 'Cool dry place', 'Flock records', 'Exempt if <50 birds', 'Egg Marketing Regulations', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['eggs', 'retail', 1, 1, 'Cool dry place', 'Packing centre registration', 'Full grading and stamping', 'Egg Marketing Regulations', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['honey', 'farm_gate', 1, 0, 'Cool dry place', 'Apiary records', 'Country of origin, weight, lot number', 'The Honey (England) Regulations 2015', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['meat-beef', 'farm_gate', 1, 1, '0-4C', 'Cattle passport, slaughter records', 'Origin (born/reared/slaughtered), cut name, weight', 'EC 853/2004', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['meat-beef', 'farmers_market', 1, 1, '0-4C with temp log', 'Full chain traceability', 'Origin, cut, weight, use-by', 'EC 853/2004', 'GB']
  );
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['baked-goods', 'farmers_market', 1, 0, 'Ambient', 'Ingredient records', 'Allergen info required', 'Food Information Regulations 2014', 'GB']
  );

  // Raw milk rules (all 4 devolved admins)
  db.run(
    'INSERT INTO raw_milk_rules (country, permitted, sales_methods, conditions, warning_label_required, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['england', 1, 'Farm gate, farmers markets', 'Warning label required. Brucellosis-free herd.', 1, 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6', 'GB']
  );
  db.run(
    'INSERT INTO raw_milk_rules (country, permitted, sales_methods, conditions, warning_label_required, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['scotland', 0, 'NONE. Sale of raw cows milk is BANNED.', 'Prohibited since 1983. Raw goats/sheep milk permitted at farm gate.', 0, 'Dairy Products (Hygiene) (Scotland) Regulations 1995', 'GB']
  );
  db.run(
    'INSERT INTO raw_milk_rules (country, permitted, sales_methods, conditions, warning_label_required, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['wales', 1, 'Farm gate, farmers markets', 'Warning label required. Same conditions as England.', 1, 'Food Safety and Hygiene (Wales) Regulations 2006', 'GB']
  );
  db.run(
    'INSERT INTO raw_milk_rules (country, permitted, sales_methods, conditions, warning_label_required, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['northern ireland', 0, 'NONE. Sale is PROHIBITED.', 'All milk must be heat-treated. Stricter than Scotland.', 0, 'Food Safety (Northern Ireland) Order 1991', 'GB']
  );

  // Assurance schemes
  db.run(
    'INSERT INTO assurance_schemes (id, name, product_types, standards_summary, audit_frequency, cost_indication, url, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['red-tractor', 'Red Tractor', 'dairy, meat, eggs, produce', 'Food safety, animal welfare, traceability', 'Annual', 'GBP 400-700/year', 'https://redtractor.org.uk', 'GB']
  );
  db.run(
    'INSERT INTO assurance_schemes (id, name, product_types, standards_summary, audit_frequency, cost_indication, url, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['salsa', 'SALSA', 'all food products', 'HACCP, traceability, allergen management', 'Every 2 years', 'GBP 550 for 2 years', 'https://www.salsafood.co.uk', 'GB']
  );

  // Hygiene rules
  db.run(
    `INSERT INTO hygiene_rules (activity, premises_type, registration_type, haccp_required, temperature_controls, cleaning_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['dairy processing', 'on-farm dairy', 'Approval required', 1, 'Pasteurisation 72C/15s', 'CIP cleaning after each run', 'EC 853/2004', 'GB']
  );
  db.run(
    `INSERT INTO hygiene_rules (activity, premises_type, registration_type, haccp_required, temperature_controls, cleaning_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['baking', 'commercial kitchen', 'Registration with local authority', 1, 'Cooking to 75C core', 'Documented cleaning schedule', 'EC 852/2004', 'GB']
  );

  // Labelling rules
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['all-pre-packed', 'name_of_food', 1, 'Legal, customary, or descriptive name', 'Food Information Regulations 2014', 'GB']
  );
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['all-pre-packed', 'allergens', 1, 'Emphasised (bold) in ingredients list', 'Food Information Regulations 2014', 'GB']
  );
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['all-pre-packed', 'net_quantity', 1, 'Weight or volume', 'Food Information Regulations 2014', 'GB']
  );
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['eggs', 'farming_method_code', 1, '0=organic, 1=free-range, 2=barn, 3=cage', 'Egg Marketing Regulations', 'GB']
  );
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['eggs', 'weight_grade', 1, 'S/M/L/XL', 'Egg Marketing Regulations', 'GB']
  );
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['honey', 'country_of_origin', 1, 'Country name or blend declaration', 'The Honey (England) Regulations 2015', 'GB']
  );
  db.run(
    'INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction) VALUES (?, ?, ?, ?, ?, ?)',
    ['meat-beef', 'country_of_birth', 1, 'Country where animal was born', 'Beef and Veal Labelling Regulations', 'GB']
  );

  // FTS5 search index
  db.run(
    'INSERT INTO search_index (title, body, product_type, jurisdiction) VALUES (?, ?, ?, ?)',
    ['Raw Milk Rules', 'Raw milk sale rules differ by UK devolved administration. England and Wales permit farm gate sales. Scotland bans raw cows milk. Northern Ireland prohibits all raw milk sales.', 'dairy', 'GB']
  );
  db.run(
    'INSERT INTO search_index (title, body, product_type, jurisdiction) VALUES (?, ?, ?, ?)',
    ['Egg Labelling', 'Eggs must be graded, stamped with producer code and farming method. 0=organic, 1=free-range, 2=barn, 3=cage. Packing centre registration required over 350 birds.', 'eggs', 'GB']
  );
  db.run(
    'INSERT INTO search_index (title, body, product_type, jurisdiction) VALUES (?, ?, ?, ?)',
    ['HACCP Requirements', 'All food businesses must implement HACCP-based food safety management. Includes hazard analysis, critical control points, monitoring, corrective actions.', 'general', 'GB']
  );
  db.run(
    'INSERT INTO search_index (title, body, product_type, jurisdiction) VALUES (?, ?, ?, ?)',
    ['Honey Labelling', 'Honey must show country of origin, weight, lot number, best before date. Blended honey must declare blend origin.', 'honey', 'GB']
  );

  // Metadata
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', '2026-04-03')", []);
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', '2026-04-03')", []);

  return db;
}
