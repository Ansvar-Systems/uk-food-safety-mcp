/**
 * Build the UK Food Safety MCP database with comprehensive seed data.
 * Run: npx tsx scripts/build-db.ts
 */

import { createDatabase } from '../src/db.js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'database.db');

const db = createDatabase(DB_PATH);
const today = new Date().toISOString().split('T')[0];

// ── Products (29 entries) ────────────────────────────────────────────

const products = [
  { id: 'raw-milk', name: 'Raw Milk', product_type: 'dairy', species: 'cattle' },
  { id: 'pasteurised-milk', name: 'Pasteurised Milk', product_type: 'dairy', species: 'cattle' },
  { id: 'butter', name: 'Butter', product_type: 'dairy', species: 'cattle' },
  { id: 'cheese-hard', name: 'Hard Cheese', product_type: 'dairy', species: 'cattle' },
  { id: 'cheese-soft', name: 'Soft Cheese', product_type: 'dairy', species: 'cattle' },
  { id: 'yogurt', name: 'Yogurt', product_type: 'dairy', species: 'cattle' },
  { id: 'cheese-goat-sheep', name: 'Goat and Sheep Cheese', product_type: 'dairy', species: 'goats_sheep' },
  { id: 'ice-cream', name: 'Ice Cream', product_type: 'dairy', species: 'cattle' },
  { id: 'eggs', name: 'Eggs', product_type: 'eggs', species: 'poultry' },
  { id: 'meat-beef', name: 'Beef', product_type: 'meat', species: 'cattle' },
  { id: 'meat-lamb', name: 'Lamb', product_type: 'meat', species: 'sheep' },
  { id: 'meat-pork', name: 'Pork', product_type: 'meat', species: 'pigs' },
  { id: 'meat-poultry', name: 'Poultry Meat', product_type: 'meat', species: 'poultry' },
  { id: 'meat-venison', name: 'Venison', product_type: 'meat', species: 'deer' },
  { id: 'meat-wild-boar', name: 'Wild Boar', product_type: 'meat', species: 'wild_boar' },
  { id: 'sausages-burgers', name: 'Sausages and Burgers', product_type: 'processed_meat', species: null },
  { id: 'meat-pies-pastries', name: 'Meat Pies and Pastries', product_type: 'processed_meat', species: null },
  { id: 'smoked-products', name: 'Smoked Products (Fish and Meat)', product_type: 'processed_meat', species: null },
  { id: 'ready-meals', name: 'Ready Meals', product_type: 'processed_food', species: null },
  { id: 'honey', name: 'Honey', product_type: 'honey', species: null },
  { id: 'jam-preserves', name: 'Jam and Preserves', product_type: 'preserves', species: null },
  { id: 'chutney-pickles', name: 'Chutney and Pickles', product_type: 'preserves', species: null },
  { id: 'baked-goods', name: 'Baked Goods', product_type: 'bakery', species: null },
  { id: 'fresh-pasta', name: 'Fresh Pasta', product_type: 'bakery', species: null },
  { id: 'fresh-fruit-veg', name: 'Fresh Fruit and Vegetables', product_type: 'produce', species: null },
  { id: 'apple-juice-cider', name: 'Apple Juice and Cider', product_type: 'beverages', species: null },
  { id: 'cider-perry', name: 'Cider and Perry', product_type: 'alcohol', species: null },
  { id: 'dog-treats-pet-food', name: 'Dog Treats and Pet Food', product_type: 'animal_feed', species: null },
  { id: 'yoghurt', name: 'Yoghurt (Flavoured)', product_type: 'dairy', species: 'cattle' },
];

for (const p of products) {
  db.run(
    'INSERT OR REPLACE INTO products (id, name, product_type, species, jurisdiction) VALUES (?, ?, ?, ?, ?)',
    [p.id, p.name, p.product_type, p.species, 'GB']
  );
}

// ── Product Requirements (multiple sales channels per product) ────────

interface Requirement {
  product_id: string;
  sales_channel: string;
  registration_required: number;
  approval_required: number;
  temperature_control: string | null;
  traceability_requirements: string;
  labelling_requirements: string;
  regulation_ref: string;
}

const requirements: Requirement[] = [
  // Raw milk
  { product_id: 'raw-milk', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Must be kept below 8C. Sold on day of milking or day after.', traceability_requirements: 'Herd health records, TB testing, brucellosis-free herd status. Individual animal identification. Batch records linking milk to specific milking sessions.', labelling_requirements: 'Warning label required: "This milk has not been heat-treated and may contain organisms harmful to health." Producer name and address.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6' },
  { product_id: 'raw-milk', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Must be kept below 8C. Cold chain maintained during transport and display.', traceability_requirements: 'Herd health records, batch records, transport temperature log.', labelling_requirements: 'Warning label required. Producer name and address. Must be sold by the producer (not a third party).', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6' },
  { product_id: 'raw-milk', sales_channel: 'retail', registration_required: 0, approval_required: 0, temperature_control: null, traceability_requirements: 'NOT PERMITTED. Raw milk cannot be sold through retail shops in England, Wales, or Northern Ireland.', labelling_requirements: 'NOT PERMITTED for retail sale.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6' },
  { product_id: 'raw-milk', sales_channel: 'online', registration_required: 0, approval_required: 0, temperature_control: null, traceability_requirements: 'NOT PERMITTED. Raw milk cannot be sold online or by mail order.', labelling_requirements: 'NOT PERMITTED for online/distance sale.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, Schedule 6' },

  // Eggs
  { product_id: 'eggs', sales_channel: 'farm_gate', registration_required: 0, approval_required: 0, temperature_control: 'Store in cool dry place. No refrigeration required if sold within 21 days of laying.', traceability_requirements: 'Flock records, laying dates. Exempt from grading/stamping if <50 birds and sold at farm gate.', labelling_requirements: 'If <50 birds: no labelling required at farm gate. If >50 birds: must display farming method at point of sale.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained), The Eggs and Chicks (England) Regulations 2009' },
  { product_id: 'eggs', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Store in cool dry place away from direct sunlight. Sell within 21 days of laying.', traceability_requirements: 'Flock records, laying date records, sales records. If >350 birds must register as packing centre.', labelling_requirements: 'If >350 birds: eggs must be graded, stamped with producer code, and labelled with class, weight grade, number, packing date, best before, farming method.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_id: 'eggs', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Store in cool dry place. Best before date: 28 days from laying.', traceability_requirements: 'Must be registered packing centre. Full traceability from flock to consumer. Producer code stamped on each egg.', labelling_requirements: 'Class A grading. Weight grade (S/M/L/XL). Packing centre number. Best before date. Farming method code on egg (0=organic, 1=free-range, 2=barn, 3=cage). Number of eggs. Name and address of packer.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_id: 'eggs', sales_channel: 'online', registration_required: 1, approval_required: 1, temperature_control: 'Must ensure eggs arrive within 21 days of laying. Packaging must protect against damage.', traceability_requirements: 'Packing centre registration. Full traceability. Delivery records.', labelling_requirements: 'Same as retail: graded, stamped, full labelling. Distance selling regulations also apply.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained), Consumer Contracts Regulations 2013' },

  // Meat (beef as representative)
  { product_id: 'meat-beef', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at 0-4C. Cold chain must not be broken. Display temperature must not exceed 7C.', traceability_requirements: 'Cattle passport/CPH number. Slaughter records from approved abattoir. Cutting plant records if cut on-site. Kill dates, batch numbers, hanging/aging records.', labelling_requirements: 'Country of birth, rearing, and slaughter. Cut name. Weight. Use-by date. Storage instructions. Business name and address.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, EC 853/2004 (retained), Beef and Veal Labelling Regulations' },
  { product_id: 'meat-beef', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-4C throughout transport and display. Temperature log required. Refrigerated display or cool boxes with ice packs.', traceability_requirements: 'Slaughter at FSA-approved premises. Full chain from farm to market stall: cattle passport, kill date, cutting records, transport temperature log.', labelling_requirements: 'Country of birth, rearing, slaughter. Cut name. Weight. Use-by date. Storage temp. Name and address.', regulation_ref: 'EC 853/2004 (retained), Beef and Veal Labelling Regulations' },
  { product_id: 'meat-beef', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated display at 0-4C. Cold chain documentation required.', traceability_requirements: 'Full traceability: farm CPH, abattoir approval number, cutting plant, batch/lot tracking. HACCP records.', labelling_requirements: 'Full pre-packed labelling: name, ingredients, allergens, net weight, use-by, storage, origin (born/reared/slaughtered), lot number, business name/address, nutrition info.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Beef and Veal Labelling Regulations' },
  { product_id: 'meat-beef', sales_channel: 'online', registration_required: 1, approval_required: 1, temperature_control: 'Insulated packaging with ice packs. Must arrive at 0-4C. Delivery within 24 hours of dispatch.', traceability_requirements: 'Same as retail plus delivery chain records. Temperature monitoring during transit.', labelling_requirements: 'Same as retail. Distance selling info must be available before purchase.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Consumer Contracts Regulations 2013' },

  // Meat (lamb)
  { product_id: 'meat-lamb', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at 0-4C.', traceability_requirements: 'Flock records, movement licences, slaughter at approved abattoir. EID tag records.', labelling_requirements: 'Species, cut name, weight, use-by date, storage instructions, origin, business name/address.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, EC 853/2004 (retained)' },
  { product_id: 'meat-lamb', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-4C. Temperature log required.', traceability_requirements: 'Approved abattoir records, flock ID, kill date, cutting records.', labelling_requirements: 'Species, cut name, weight, use-by date, storage temp, origin, business name/address.', regulation_ref: 'EC 853/2004 (retained)' },

  // Meat (pork)
  { product_id: 'meat-pork', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at 0-4C.', traceability_requirements: 'Herd records, movement licences (eAML2), slaughter at approved abattoir.', labelling_requirements: 'Species, cut name, weight, use-by date, storage instructions, business name/address.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, EC 853/2004 (retained)' },
  { product_id: 'meat-pork', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-4C. Temperature log required.', traceability_requirements: 'Approved abattoir records, herd ID, kill date, cutting records.', labelling_requirements: 'Species, cut name, weight, use-by date, storage temp, business name/address.', regulation_ref: 'EC 853/2004 (retained)' },

  // Meat (poultry)
  { product_id: 'meat-poultry', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Must be stored at 0-4C. Exempt from approval if <10,000 birds/year slaughtered on-farm and sold direct.', traceability_requirements: 'Flock records, slaughter records. On-farm slaughter permitted for <10,000 birds/year if sold direct to consumer or local retail.', labelling_requirements: 'Species, weight, use-by or best before date, storage instructions, business name/address.', regulation_ref: 'EC 853/2004 Annex III Section II (retained), Poultry Meat Marketing Standards' },
  { product_id: 'meat-poultry', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Must maintain 0-4C. Temperature log during transport.', traceability_requirements: 'Flock records, slaughter records. On-farm slaughter exemption applies if <10,000 birds/year.', labelling_requirements: 'Species, weight, use-by date, storage temp, business name/address, farming method if claimed.', regulation_ref: 'EC 853/2004 (retained), Poultry Meat Marketing Standards' },
  { product_id: 'meat-poultry', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 0-4C. Frozen at -18C or below.', traceability_requirements: 'FSA-approved slaughterhouse. Full traceability. Lot/batch tracking.', labelling_requirements: 'Full pre-packed labelling. Marketing class (A or B). Farming method terms regulated (free-range, traditional free-range, etc).', regulation_ref: 'EC 853/2004 (retained), Poultry Meat Marketing Standards, Food Information Regulations 2014' },

  // Honey
  { product_id: 'honey', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Store in cool dry place away from direct sunlight. No refrigeration needed.', traceability_requirements: 'Apiary records, harvest dates, extraction records, batch/lot numbers.', labelling_requirements: 'Product name (must use "honey"). Country of origin. Net weight. Lot number. Best before date. Name and address of producer. Type if specific (e.g. heather honey).', regulation_ref: 'The Honey (England) Regulations 2015, Food Information Regulations 2014' },
  { product_id: 'honey', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Store in cool dry place. Protect from direct sunlight.', traceability_requirements: 'Apiary records, harvest dates, extraction batch records.', labelling_requirements: 'Product name. Country of origin (or "blend of EU/non-EU honeys" if blended). Net weight. Lot number. Best before date. Name and address.', regulation_ref: 'The Honey (England) Regulations 2015' },
  { product_id: 'honey', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Ambient storage. Protect from heat and sunlight.', traceability_requirements: 'Full batch traceability. Apiary records. If blending: source records for each origin.', labelling_requirements: 'Full pre-packed labelling: product name, ingredients (if flavoured), country of origin, net weight, lot number, best before date, name/address, nutritional info (if >10 staff or claimed).', regulation_ref: 'The Honey (England) Regulations 2015, Food Information Regulations 2014' },
  { product_id: 'honey', sales_channel: 'online', registration_required: 1, approval_required: 0, temperature_control: 'Package to prevent damage. Ambient.', traceability_requirements: 'Same as retail. Delivery records.', labelling_requirements: 'Same as retail. Distance selling info available pre-purchase.', regulation_ref: 'The Honey (England) Regulations 2015, Consumer Contracts Regulations 2013' },

  // Baked goods
  { product_id: 'baked-goods', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Ambient for shelf-stable products. Chilled for cream/custard-filled items (below 8C).', traceability_requirements: 'Ingredient sourcing records, batch records, production date records.', labelling_requirements: 'If pre-packed: full labelling including allergens in bold. If sold loose: allergen information must be available (written or verbal).', regulation_ref: 'Food Information Regulations 2014, Food Safety and Hygiene (England) Regulations 2013' },
  { product_id: 'baked-goods', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Ambient for shelf-stable. Chilled display for perishable items.', traceability_requirements: 'Ingredient records, batch records, production date.', labelling_requirements: 'Allergen information must be provided (at minimum). If pre-packed: full labelling. Ingredient list recommended.', regulation_ref: 'Food Information Regulations 2014' },
  { product_id: 'baked-goods', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Product-dependent. Ambient or chilled.', traceability_requirements: 'Full ingredient traceability. Batch tracking. Production records.', labelling_requirements: 'Full pre-packed labelling: name, ingredients, allergens (bold), net weight, best before/use-by, storage, business name/address, lot number, nutritional info (if business has >10 employees).', regulation_ref: 'Food Information Regulations 2014' },
  { product_id: 'baked-goods', sales_channel: 'online', registration_required: 1, approval_required: 0, temperature_control: 'Packaging must maintain product quality. Chilled items need cold chain.', traceability_requirements: 'Same as retail. Delivery records.', labelling_requirements: 'Same as retail. Allergen and ingredient info must be available before purchase (website/listing).', regulation_ref: 'Food Information Regulations 2014, Consumer Contracts Regulations 2013' },

  // Fresh fruit and veg
  { product_id: 'fresh-fruit-veg', sales_channel: 'farm_gate', registration_required: 0, approval_required: 0, temperature_control: 'Keep cool where appropriate. No specific temp requirements for whole unprocessed produce.', traceability_requirements: 'Minimal for whole unprocessed produce sold direct. Field/plot records recommended.', labelling_requirements: 'Minimal for loose whole unprocessed produce. Origin recommended but not always mandatory for farm gate. Variety for certain products (apples, pears, citrus).', regulation_ref: 'Marketing Standards for Fresh Fruit and Vegetables (retained EU)' },
  { product_id: 'fresh-fruit-veg', sales_channel: 'farmers_market', registration_required: 0, approval_required: 0, temperature_control: 'Keep cool where appropriate. Protect from sun and heat.', traceability_requirements: 'Field/plot records. Spray records if asked. Harvest date records.', labelling_requirements: 'Display variety (where applicable), origin, class (if graded). Price per kg/unit.', regulation_ref: 'Marketing Standards for Fresh Fruit and Vegetables (retained EU)' },
  { product_id: 'fresh-fruit-veg', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Product-dependent. Leafy greens and berries: refrigerated.', traceability_requirements: 'Supplier records. Batch/lot tracking. Country of origin records.', labelling_requirements: 'If pre-packed: name, origin, class, weight, lot number, business name/address. Loose: origin and variety display required for specified products.', regulation_ref: 'Marketing Standards for Fresh Fruit and Vegetables (retained EU), Food Information Regulations 2014' },

  // Cheese (hard -- raw milk cheese legal if aged >60 days)
  { product_id: 'cheese-hard', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored below 8C for soft/semi-hard. Hard aged cheese: ambient OK if below 15C.', traceability_requirements: 'Milk source records, starter culture batch, production date, aging duration, batch number. If made from raw milk: must be aged minimum 60 days.', labelling_requirements: 'Product name, ingredients (including milk type), allergens (milk in bold), weight, best before/use-by, storage, business name/address. State if made from raw milk.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'cheese-hard', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Chilled display. Hard aged cheese may be displayed at ambient if below 15C.', traceability_requirements: 'Same as farm gate. Approved dairy premises required.', labelling_requirements: 'Same as farm gate. Must declare raw milk if applicable.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'cheese-hard', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated display. Hard cheese: below 8C.', traceability_requirements: 'Approved dairy. Full batch traceability. HACCP records. Microbiological testing records.', labelling_requirements: 'Full pre-packed labelling. Raw milk declaration if applicable. Nutritional information.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Cheese (soft)
  { product_id: 'cheese-soft', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored below 8C at all times.', traceability_requirements: 'Milk source, pasteurisation records (if pasteurised), starter culture batch, production date, batch number. Listeria testing recommended.', labelling_requirements: 'Product name, ingredients, allergens (milk), weight, use-by date, storage instructions, business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'cheese-soft', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 2-5C.', traceability_requirements: 'Approved dairy. Full batch traceability. HACCP. Regular microbiological testing including Listeria monocytogenes.', labelling_requirements: 'Full pre-packed labelling. Nutritional info. Raw milk declaration if applicable.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Jam/preserves
  { product_id: 'jam-preserves', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Ambient storage once sealed. Refrigerate after opening.', traceability_requirements: 'Ingredient records, batch numbers, production dates.', labelling_requirements: 'Product name (must comply with jam definitions if using "jam"), ingredients, fruit content %, net weight, best before, storage, business name/address, lot number.', regulation_ref: 'The Jam and Similar Products (England) Regulations 2003, Food Information Regulations 2014' },
  { product_id: 'jam-preserves', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Ambient.', traceability_requirements: 'Ingredient records, batch records.', labelling_requirements: 'Same as farm gate.', regulation_ref: 'The Jam and Similar Products (England) Regulations 2003' },
  { product_id: 'jam-preserves', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Ambient.', traceability_requirements: 'Full batch traceability. Ingredient sourcing records.', labelling_requirements: 'Full pre-packed labelling including nutritional info (if >10 staff). Fruit content percentage. Jam grade if applicable.', regulation_ref: 'The Jam and Similar Products (England) Regulations 2003, Food Information Regulations 2014' },

  // Apple juice/cider
  { product_id: 'apple-juice-cider', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Fresh juice: refrigerate below 5C, consume within 5 days. Pasteurised: ambient. Cider: ambient.', traceability_requirements: 'Apple source records, pressing dates, pasteurisation records (if applicable). Cider: fermentation records, alcohol content testing.', labelling_requirements: 'Product name, ingredients, net volume, best before date, storage, business name/address. Cider: alcohol content (if >1.2% ABV), lot number.', regulation_ref: 'Food Information Regulations 2014, Cider and Perry Regulations 2010 (if >1.2% ABV)' },
  { product_id: 'apple-juice-cider', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Fresh juice: chilled display. Pasteurised/cider: ambient.', traceability_requirements: 'Same as farm gate.', labelling_requirements: 'Same as farm gate. Alcohol content required for cider.', regulation_ref: 'Food Information Regulations 2014' },

  // Pasteurised milk
  { product_id: 'pasteurised-milk', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored below 8C. Sell within use-by date.', traceability_requirements: 'Herd records, pasteurisation batch records (time/temp), bottling records.', labelling_requirements: 'Product name, fat content (whole/semi/skimmed), use-by date, storage instructions, pasteurised statement, business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'pasteurised-milk', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 2-5C.', traceability_requirements: 'Approved dairy establishment. Full batch traceability. HACCP. Pasteurisation records.', labelling_requirements: 'Full pre-packed labelling. Fat content. Nutritional info. Use-by date.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Butter
  { product_id: 'butter', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored below 8C.', traceability_requirements: 'Milk source, churning records, batch numbers, production date.', labelling_requirements: 'Product name, fat content (min 80% for butter), ingredients, weight, use-by/best before, storage, business name/address.', regulation_ref: 'Spreadable Fats (Marketing Standards) Regulations, Food Information Regulations 2014' },

  // Yogurt
  { product_id: 'yogurt', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored below 5C.', traceability_requirements: 'Milk source, culture batch records, incubation time/temp records, batch numbers.', labelling_requirements: 'Product name, ingredients, allergens (milk), net weight, use-by date, storage instructions, business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'yogurt', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 2-5C.', traceability_requirements: 'Approved dairy. Full batch traceability. HACCP. Culture records.', labelling_requirements: 'Full pre-packed labelling. Nutritional info. Live culture claims must be substantiated.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Goat/sheep cheese
  { product_id: 'cheese-goat-sheep', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Soft cheese below 8C. Hard aged cheese: ambient OK if below 15C.', traceability_requirements: 'Milk source records (goat/sheep herd), starter culture batch, production date, aging duration, batch number. Raw milk cheese must be aged minimum 60 days. Goat and sheep raw milk is legal for direct sale even in Scotland (unlike cow raw milk).', labelling_requirements: 'Product name, ingredients (specify goat/sheep milk), allergens (milk in bold), weight, best before/use-by, storage, business name/address. Must state if made from raw milk.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Dairy Products (Hygiene) (Scotland) Regulations 1995' },
  { product_id: 'cheese-goat-sheep', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Chilled display for soft cheese. Hard aged cheese may be displayed at ambient if below 15C.', traceability_requirements: 'Approved dairy premises required. Same records as farm gate. Full batch traceability.', labelling_requirements: 'Same as farm gate. Must declare species (goat or sheep) and raw milk if applicable.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'cheese-goat-sheep', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated display below 8C.', traceability_requirements: 'Approved dairy. Full batch traceability. HACCP records. Microbiological testing including Listeria monocytogenes.', labelling_requirements: 'Full pre-packed labelling. Species declaration. Raw milk declaration if applicable. Nutritional information.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Ice cream
  { product_id: 'ice-cream', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at -18C or below. Display freezers must maintain -18C. Transport in insulated containers with dry ice or equivalent.', traceability_requirements: 'Milk source records, pasteurisation records (if pasteurised base), ingredient batch records, production date, batch numbers. Raw milk ice cream: must carry warning if base not pasteurised.', labelling_requirements: 'Product name, ingredients, allergens (milk, may also include eggs, nuts, gluten, soya depending on recipe), net weight, best before date, storage instructions (-18C), business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Ice Cream Regulations (retained)' },
  { product_id: 'ice-cream', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain -18C throughout transport and display. Generator-powered freezer or insulated containers with temp monitoring.', traceability_requirements: 'Approved dairy premises. Pasteurisation records. Full batch traceability.', labelling_requirements: 'Same as farm gate. Allergen information must be clearly displayed if sold loose (scooped).', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'ice-cream', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Freezer display at -18C or below.', traceability_requirements: 'Approved dairy establishment. Full batch traceability. HACCP. Pasteurisation records.', labelling_requirements: 'Full pre-packed labelling. Allergens. Nutritional information. "Dairy ice cream" requires minimum milk fat content.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Sausages and burgers
  { product_id: 'sausages-burgers', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Must be stored at 0-4C. Fresh sausages/burgers are high-risk products. Cold chain must not be broken.', traceability_requirements: 'Meat source records (species, abattoir approval number), ingredient records (rusk, seasoning), batch numbers, production dates. HACCP plan covering mincing/mixing as critical control point.', labelling_requirements: 'Product name, ingredients list (must declare meat content percentage), allergens (gluten from rusk/breadcrumbs, sulphites if used as preservative, milk, mustard, celery, eggs depending on recipe), net weight, use-by date, storage instructions, business name/address.', regulation_ref: 'Food Safety and Hygiene (England) Regulations 2013, Food Information Regulations 2014, Meat Products (England) Regulations 2003' },
  { product_id: 'sausages-burgers', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Must maintain 0-4C. Temperature log required. Refrigerated display or cool boxes.', traceability_requirements: 'Meat source records, ingredient records, batch tracking. If selling cooked: cooking temperature records (core temp 75C).', labelling_requirements: 'Allergen information must be provided. Meat content percentage. If pre-packed: full labelling.', regulation_ref: 'Food Information Regulations 2014, Meat Products (England) Regulations 2003' },
  { product_id: 'sausages-burgers', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Refrigerated at 0-4C. Frozen at -18C.', traceability_requirements: 'Full batch traceability. Meat source. Ingredient records. HACCP.', labelling_requirements: 'Full pre-packed labelling: name, ingredients with meat content %, allergens (bold), net weight, use-by date, storage, lot number, nutrition info, business name/address.', regulation_ref: 'Food Information Regulations 2014, Meat Products (England) Regulations 2003' },
  { product_id: 'sausages-burgers', sales_channel: 'online', registration_required: 1, approval_required: 0, temperature_control: 'Insulated packaging with ice packs. Must arrive at 0-4C.', traceability_requirements: 'Same as retail plus delivery chain records.', labelling_requirements: 'Same as retail. Distance selling info pre-purchase.', regulation_ref: 'Food Information Regulations 2014, Consumer Contracts Regulations 2013' },

  // Meat pies and pastries
  { product_id: 'meat-pies-pastries', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Hot pies: above 63C if sold hot, or cooled to below 5C within 90 minutes. Cold pies: below 5C. Ambient pies (e.g. pork pies): temperature controlled during production, ambient display with best before date.', traceability_requirements: 'Meat source records (approved abattoir), ingredient records, batch numbers, production dates, cooking temperature records (core temp 75C minimum).', labelling_requirements: 'Product name, ingredients with meat content %, allergens (gluten from pastry, may include milk, eggs, mustard, celery), net weight, use-by or best before, storage, business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Meat Products (England) Regulations 2003' },
  { product_id: 'meat-pies-pastries', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Hot hold above 63C or chilled below 5C. Temperature monitoring required.', traceability_requirements: 'Approved premises for manufacture. Meat source records. Cooking records.', labelling_requirements: 'Allergen info required. Meat content percentage. If pre-packed: full labelling.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'meat-pies-pastries', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 0-5C for fresh. Frozen at -18C. Ambient for shelf-stable (e.g. cured pork pies with appropriate best before).', traceability_requirements: 'Full batch traceability. Approved production premises. HACCP. Cooking records.', labelling_requirements: 'Full pre-packed labelling. Meat content %. Allergens. Nutrition info.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Meat Products (England) Regulations 2003' },

  // Smoked products
  { product_id: 'smoked-products', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Cold smoked products (e.g. smoked salmon): below 4C at all times. Hot smoked products: cooled to below 5C within 90 minutes of smoking. Storage at 0-4C.', traceability_requirements: 'Source records for raw material (fish/meat), smoking temperature and time logs, wood/smoke source records, batch numbers. Listeria monocytogenes monitoring plan required for ready-to-eat smoked products.', labelling_requirements: 'Product name, ingredients, allergens (fish if smoked fish, may include sulphites), net weight, use-by date, storage instructions, business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Safety and Hygiene (England) Regulations 2013, Commission Regulation (EC) 2073/2005 (retained) on microbiological criteria' },
  { product_id: 'smoked-products', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-4C. Chilled display required.', traceability_requirements: 'Approved premises. Full smoking process records. Listeria testing records.', labelling_requirements: 'Allergen info. If pre-packed: full labelling.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'smoked-products', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 0-4C.', traceability_requirements: 'Approved establishment. Full batch traceability. HACCP covering smoking as CCP. Regular microbiological testing.', labelling_requirements: 'Full pre-packed labelling. PAH (polycyclic aromatic hydrocarbon) limits must be met in production (not on label).', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014, Commission Regulation (EC) 1881/2006 (retained) on PAH limits' },

  // Venison
  { product_id: 'meat-venison', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at 0-4C. Carcass must be chilled to below 7C internal within required time.', traceability_requirements: 'Game dealer licence required if selling. Trained hunter status (competent person certificate) for wild deer. Approved Game Handling Establishment (AGHE) for wild game. Farmed deer: treated as livestock with holding register. Kill records including location, date, species, sex.', labelling_requirements: 'Species name (venison/deer), cut name, weight, use-by date, storage instructions, business name/address. If wild: "wild game" declaration.', regulation_ref: 'EC 853/2004 Annex III Section IV (retained), The Deer Act 1991, Game Dealers Licensing (England and Wales)' },
  { product_id: 'meat-venison', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-4C. Temperature log required.', traceability_requirements: 'Game dealer licence. Kill records. Approved slaughter/processing. Wild game: primary inspection by trained person before entering food chain.', labelling_requirements: 'Species, cut, weight, use-by date, storage temp, business name/address.', regulation_ref: 'EC 853/2004 (retained), Game Dealers Licensing' },
  { product_id: 'meat-venison', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 0-4C. Frozen at -18C.', traceability_requirements: 'Full traceability: game dealer licence, AGHE approval, trained hunter records, kill date/location, processing records.', labelling_requirements: 'Full pre-packed labelling. Species. Wild/farmed declaration. Origin where known.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Wild boar
  { product_id: 'meat-wild-boar', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at 0-4C. Carcass must be chilled to below 7C internal within required time.', traceability_requirements: 'Game dealer licence required. Trained hunter status. Approved Game Handling Establishment (AGHE). Species identification records (visual and if necessary DNA) to confirm wild boar vs domestic pig hybrid. Trichinella testing required for wild boar (not required for farmed pigs). Kill records: location, date, species confirmation.', labelling_requirements: 'Species name (wild boar), cut name, weight, use-by date, storage instructions, business name/address. "Wild game" declaration.', regulation_ref: 'EC 853/2004 Annex III Section IV (retained), Commission Regulation (EC) 2015/1375 (retained) on Trichinella, Game Dealers Licensing' },
  { product_id: 'meat-wild-boar', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-4C. Temperature log required.', traceability_requirements: 'Game dealer licence. Kill records. Species identification. Trichinella test results. AGHE processing.', labelling_requirements: 'Species (wild boar), cut, weight, use-by date, storage temp, business name/address.', regulation_ref: 'EC 853/2004 (retained), Game Dealers Licensing' },
  { product_id: 'meat-wild-boar', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 0-4C. Frozen at -18C.', traceability_requirements: 'Full traceability: game dealer licence, AGHE, trained hunter records, species ID, Trichinella test certificate, kill date/location.', labelling_requirements: 'Full pre-packed labelling. Species. Wild game declaration.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },

  // Ready meals
  { product_id: 'ready-meals', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Chilled ready meals: below 5C. Frozen: -18C. Must be cooked to core temp 75C during production. Cooling to below 5C within 90 minutes.', traceability_requirements: 'All ingredient source records, batch numbers, production dates, cooking time/temp records, cooling records. HACCP plan covering all critical control points. Batch recall system with ability to identify and withdraw specific batches within 24 hours.', labelling_requirements: 'Product name, full ingredients list, allergens (all 14 allergens must be checked and declared), net weight, use-by date, storage instructions, cooking/reheating instructions, nutritional information, lot number, business name/address.', regulation_ref: 'EC 852/2004 (retained), EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'ready-meals', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Chilled below 5C, frozen at -18C, hot-held above 63C. Temperature monitoring throughout.', traceability_requirements: 'Approved premises. Full ingredient and batch traceability. HACCP.', labelling_requirements: 'Full allergen declaration. Ingredients. If pre-packed: complete labelling.', regulation_ref: 'EC 852/2004 (retained), EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'ready-meals', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Chilled at 0-5C. Frozen at -18C.', traceability_requirements: 'Approved establishment. Full batch traceability. Batch recall system. HACCP. Supplier auditing.', labelling_requirements: 'Full pre-packed labelling: name, ingredients, allergens (bold), net weight, use-by, storage, cooking instructions, nutrition (mandatory -- no small business exemption for ready meals with nutrition claims), lot number, business name/address.', regulation_ref: 'EC 852/2004 (retained), EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'ready-meals', sales_channel: 'online', registration_required: 1, approval_required: 1, temperature_control: 'Insulated packaging. Must arrive below 5C (chilled) or -18C (frozen). Delivery within 24 hours.', traceability_requirements: 'Same as retail plus delivery chain temperature records.', labelling_requirements: 'Same as retail. Full allergen and ingredient info available before purchase on website.', regulation_ref: 'EC 852/2004 (retained), Food Information Regulations 2014, Consumer Contracts Regulations 2013' },

  // Chutney and pickles
  { product_id: 'chutney-pickles', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Ambient storage once sealed (high acid/sugar preservation). Refrigerate after opening.', traceability_requirements: 'Ingredient sourcing records, batch numbers, production dates, pH testing records (target pH <4.6 for safe ambient storage).', labelling_requirements: 'Product name, ingredients list (descending weight order), allergens (mustard, celery, sulphites common in chutneys), net weight, best before date, storage instructions, lot number, business name/address.', regulation_ref: 'Food Information Regulations 2014, Food Safety and Hygiene (England) Regulations 2013' },
  { product_id: 'chutney-pickles', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Ambient.', traceability_requirements: 'Ingredient records, batch records, production dates.', labelling_requirements: 'Same as farm gate. Allergen info must be available.', regulation_ref: 'Food Information Regulations 2014' },
  { product_id: 'chutney-pickles', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Ambient.', traceability_requirements: 'Full batch traceability. Ingredient sourcing. pH records.', labelling_requirements: 'Full pre-packed labelling: name, ingredients, allergens (bold), net weight, best before, storage, lot number, nutrition info (if >10 staff), business name/address.', regulation_ref: 'Food Information Regulations 2014' },
  { product_id: 'chutney-pickles', sales_channel: 'online', registration_required: 1, approval_required: 0, temperature_control: 'Ambient. Package to prevent breakage.', traceability_requirements: 'Same as retail. Delivery records.', labelling_requirements: 'Same as retail. Allergen and ingredient info available before purchase.', regulation_ref: 'Food Information Regulations 2014, Consumer Contracts Regulations 2013' },

  // Fresh pasta
  { product_id: 'fresh-pasta', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Must be stored at 0-5C. Fresh pasta is a high-risk perishable product. Short shelf life (typically 2-5 days).', traceability_requirements: 'Ingredient records (flour source, egg source), batch numbers, production dates.', labelling_requirements: 'Product name, ingredients, allergens (cereals containing gluten -- wheat, eggs, may also include milk), net weight, use-by date, storage instructions, business name/address.', regulation_ref: 'Food Information Regulations 2014, Food Safety and Hygiene (England) Regulations 2013' },
  { product_id: 'fresh-pasta', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Must maintain 0-5C. Chilled display. Temperature log.', traceability_requirements: 'Ingredient records, batch tracking, production date.', labelling_requirements: 'Allergen information (gluten, eggs) must be provided. If pre-packed: full labelling.', regulation_ref: 'Food Information Regulations 2014' },
  { product_id: 'fresh-pasta', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Refrigerated at 0-5C.', traceability_requirements: 'Full batch traceability. Ingredient sourcing records. Production records.', labelling_requirements: 'Full pre-packed labelling: name, ingredients, allergens (bold -- wheat/gluten, eggs), net weight, use-by date, storage, lot number, nutrition info, business name/address.', regulation_ref: 'Food Information Regulations 2014' },

  // Cider and perry (alcoholic)
  { product_id: 'cider-perry', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Ambient storage. Keep cool and away from direct sunlight.', traceability_requirements: 'Fruit source records, pressing dates, fermentation records, alcohol content testing records. Duty records if >1.2% ABV. Small producer records if claiming Small Producer Relief (<8,500 litres pure alcohol per year).', labelling_requirements: 'Product name ("cider" or "perry"), alcohol by volume (ABV %) if >1.2% ABV, net volume, allergens (sulphites if >10mg/kg or 10mg/litre SO2), lot number, business name/address. Premises licence required for retail sale.', regulation_ref: 'Cider and Perry Regulations 2010, Licensing Act 2003, Alcoholic Liquor Duties Act 1979, Food Information Regulations 2014' },
  { product_id: 'cider-perry', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Ambient. Keep cool.', traceability_requirements: 'Same as farm gate. Premises licence or Temporary Event Notice (TEN) required for market sales of alcohol.', labelling_requirements: 'Same as farm gate. ABV %. Allergens (sulphites). Premises licence or TEN for alcohol sales.', regulation_ref: 'Cider and Perry Regulations 2010, Licensing Act 2003' },
  { product_id: 'cider-perry', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Ambient.', traceability_requirements: 'Full batch traceability. Duty records. Premises licence. Challenge 25 age verification policy.', labelling_requirements: 'Product name, ABV %, net volume, allergens (sulphites), lot number, business name/address. Voluntary: units of alcohol, pregnancy warning, Chief Medical Officer guidelines.', regulation_ref: 'Cider and Perry Regulations 2010, Licensing Act 2003, Food Information Regulations 2014' },
  { product_id: 'cider-perry', sales_channel: 'online', registration_required: 1, approval_required: 0, temperature_control: 'Ambient. Secure packaging.', traceability_requirements: 'Premises licence covering online sales. Age verification at point of delivery. Duty records. Batch traceability.', labelling_requirements: 'Same as retail. Age verification statement on website. ABV and allergen info available pre-purchase.', regulation_ref: 'Cider and Perry Regulations 2010, Licensing Act 2003, Consumer Contracts Regulations 2013' },

  // Dog treats and pet food
  { product_id: 'dog-treats-pet-food', sales_channel: 'farm_gate', registration_required: 1, approval_required: 0, temperature_control: 'Product-dependent. Dried treats: ambient. Raw pet food: below 4C. Frozen raw: -18C.', traceability_requirements: 'Registration as a feed business operator with local authority (separate from food business registration). Animal By-Products (ABP) Regulations compliance. Category 3 ABP materials only for pet food. TSE (Transmissible Spongiform Encephalopathy) controls: specified risk material must be excluded. Supplier records for all animal-derived ingredients.', labelling_requirements: 'Labelled as "pet food" or "complementary pet food" or "complete pet food". Composition (ingredients in descending weight), analytical constituents (protein, fat, fibre, ash), additives, species/category of animal for which intended, batch number, best before date, net weight, manufacturer name/address. NOT subject to human food allergen rules.', regulation_ref: 'Animal By-Products (Enforcement) (England) Regulations 2013, The Feed (Hygiene and Enforcement) (England) Regulations 2005, EC Regulation 1069/2009 (retained)' },
  { product_id: 'dog-treats-pet-food', sales_channel: 'farmers_market', registration_required: 1, approval_required: 0, temperature_control: 'Same as farm gate. Raw pet food requires cold chain.', traceability_requirements: 'Feed business registration. ABP compliance. Category 3 materials only. TSE controls.', labelling_requirements: 'Same as farm gate. Clear "pet food" labelling to avoid confusion with human food products.', regulation_ref: 'Animal By-Products (Enforcement) (England) Regulations 2013, Feed (Hygiene and Enforcement) (England) Regulations 2005' },
  { product_id: 'dog-treats-pet-food', sales_channel: 'retail', registration_required: 1, approval_required: 0, temperature_control: 'Product-dependent. Dried: ambient. Raw: refrigerated or frozen.', traceability_requirements: 'Feed business registration. Full batch traceability. ABP documentation. TSE compliance.', labelling_requirements: 'Full pet food labelling per retained EU regulation. Composition, analytical constituents, additives, target species, batch, best before, weight, manufacturer.', regulation_ref: 'EC Regulation 767/2009 (retained) on feed marketing, EC 1069/2009 (retained)' },
  { product_id: 'dog-treats-pet-food', sales_channel: 'online', registration_required: 1, approval_required: 0, temperature_control: 'Secure packaging. Raw pet food: insulated with ice packs.', traceability_requirements: 'Same as retail. Delivery records. ABP transport documentation.', labelling_requirements: 'Same as retail. Product info available before purchase.', regulation_ref: 'EC 767/2009 (retained), Consumer Contracts Regulations 2013' },

  // Flavoured yoghurt
  { product_id: 'yoghurt', sales_channel: 'farm_gate', registration_required: 1, approval_required: 1, temperature_control: 'Must be stored at 0-5C. Cold chain must not be broken.', traceability_requirements: 'Pasteurised milk base records, culture batch records, fruit/flavouring ingredient records, incubation time/temp records, batch numbers.', labelling_requirements: 'Product name, ingredients (including fruit content % if named flavour), allergens (milk, may include gluten/nuts/soya depending on additions), net weight, use-by date, storage instructions, business name/address.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'yoghurt', sales_channel: 'farmers_market', registration_required: 1, approval_required: 1, temperature_control: 'Must maintain 0-5C. Chilled display.', traceability_requirements: 'Approved dairy premises. Pasteurisation records. Ingredient and batch traceability.', labelling_requirements: 'Allergen info required. If pre-packed: full labelling.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
  { product_id: 'yoghurt', sales_channel: 'retail', registration_required: 1, approval_required: 1, temperature_control: 'Refrigerated at 2-5C.', traceability_requirements: 'Approved dairy. Full batch traceability. HACCP. Pasteurisation and culture records.', labelling_requirements: 'Full pre-packed labelling. Nutritional info. Fruit content % if named. Live culture claims must be substantiated.', regulation_ref: 'EC 853/2004 (retained), Food Information Regulations 2014' },
];

for (const r of requirements) {
  db.run(
    `INSERT INTO product_requirements (product_id, sales_channel, registration_required, approval_required, temperature_control, traceability_requirements, labelling_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [r.product_id, r.sales_channel, r.registration_required, r.approval_required, r.temperature_control, r.traceability_requirements, r.labelling_requirements, r.regulation_ref, 'GB']
  );
}

// ── Assurance Schemes (9 entries: Red Tractor, RSPCA Assured, Soil Association, SALSA, QMS, OF&G, LEAF Marque, BEIC Lion Code, Free Range Egg) ──

const schemes = [
  {
    id: 'red-tractor',
    name: 'Red Tractor Assured Food Standards',
    product_types: 'dairy, meat, eggs, produce, cereals',
    standards_summary: 'Covers food safety, animal welfare, environmental protection, and traceability. Integrates HACCP. Recognised by major UK retailers. Members display Red Tractor logo on products.',
    audit_frequency: 'Annual on-farm inspection plus unannounced spot checks',
    cost_indication: 'GBP 400-700 per year depending on farm size and sectors',
    url: 'https://redtractor.org.uk',
  },
  {
    id: 'rspca-assured',
    name: 'RSPCA Assured',
    product_types: 'meat, eggs, dairy',
    standards_summary: 'Animal welfare focused. Higher welfare standards than legal minimum. Covers housing, handling, transport, and slaughter. Recognised welfare label by consumers.',
    audit_frequency: 'Annual assessment plus unannounced visits',
    cost_indication: 'GBP 300-500 per year depending on species and herd/flock size',
    url: 'https://www.rspcaassured.org.uk',
  },
  {
    id: 'soil-association-organic',
    name: 'Soil Association Organic',
    product_types: 'dairy, meat, eggs, produce, cereals, honey, bakery, beverages',
    standards_summary: 'Organic certification body. Standards exceed EU organic baseline. Covers soil health, biodiversity, animal welfare, no routine antibiotics, no synthetic pesticides. License to use organic label.',
    audit_frequency: 'Annual inspection of all certified operations',
    cost_indication: 'GBP 500-1500 per year depending on operation size and complexity. Conversion period: 2-3 years.',
    url: 'https://www.soilassociation.org',
  },
  {
    id: 'salsa',
    name: 'SALSA (Safe and Local Supplier Approval)',
    product_types: 'all food products (aimed at small producers)',
    standards_summary: 'Food safety management standard for small food producers selling to food service, local retailers, or larger supply chains. Covers HACCP, traceability, allergen management, hygiene, pest control. Recognised by many UK buyers as entry-level approval.',
    audit_frequency: 'Assessment every 2 years',
    cost_indication: 'GBP 550 for initial 2-year approval. Renewal: GBP 475.',
    url: 'https://www.salsafood.co.uk',
  },
  {
    id: 'qms',
    name: 'Quality Meat Scotland (QMS)',
    product_types: 'meat (beef, lamb, pork -- Scotland only)',
    standards_summary: 'Scottish meat quality assurance. Covers animal welfare, feed, medicines, environment, traceability. Scotch Beef PGI, Scotch Lamb PGI, Specially Selected Pork labels. Required for Scotch brand premium pricing. Members participate in whole-chain assurance from birth to processing.',
    audit_frequency: 'Annual on-farm inspection',
    cost_indication: 'GBP 400-600 per year. Membership via levy contribution plus assessment costs.',
    url: 'https://www.qmscotland.co.uk',
  },
  {
    id: 'ofg-organic',
    name: 'Organic Farmers & Growers (OF&G)',
    product_types: 'dairy, meat, eggs, produce, cereals, honey, bakery, beverages',
    standards_summary: 'Organic certification body with a focus on smaller and mixed-farming producers. Licensed by DEFRA as an organic control body. Certifies to UK organic standards (retained EU organic regulation). Annual audit covering soil management, animal welfare, input records, and traceability. Members may use the UK organic logo and OF&G certification mark.',
    audit_frequency: 'Annual on-farm audit plus documentation review',
    cost_indication: 'GBP 500-800 per year depending on operation size. Conversion period: 2-3 years (reduced for some land types).',
    url: 'https://ofgorganic.org',
  },
  {
    id: 'leaf-marque',
    name: 'LEAF Marque (Linking Environment And Farming)',
    product_types: 'produce, cereals, dairy, meat',
    standards_summary: 'Integrated Farm Management (IFM) standard with an environmental and sustainability focus. Covers soil management, crop protection, energy efficiency, water management, landscape, and biodiversity. LEAF Marque certified produce carries the LEAF Marque logo on packs. Recognised by major retailers. Does not replace food safety certification but complements it.',
    audit_frequency: 'Annual audit against IFM standard',
    cost_indication: 'GBP 300-500 per year depending on farm size. Group certification available.',
    url: 'https://leafuk.org',
  },
  {
    id: 'beic-lion-code',
    name: 'British Egg Industry Council Lion Code',
    product_types: 'eggs',
    standards_summary: 'The Lion Code covers approximately 90% of UK eggs. Requirements: Salmonella Enteritidis vaccination of all flocks, traceability from farm to pack, on-farm hygiene standards, feed standards, best before dating (28 days from lay), egg stamping with farm code. Eggs meeting the standard carry the British Lion mark. Recognised by the FSA as meeting higher safety standards -- Lion eggs are considered safe to eat runny/raw by vulnerable groups.',
    audit_frequency: 'Annual audit plus unannounced spot checks',
    cost_indication: 'GBP 200-400 per year. Costs vary by flock size. Levy-funded elements.',
    url: 'https://www.egginfo.co.uk/british-lion-eggs',
  },
  {
    id: 'free-range-egg-beic',
    name: 'Free Range Egg Standards (BEIC)',
    product_types: 'eggs',
    standards_summary: 'Free range egg production under BEIC Lion Code plus additional welfare requirements. Hens must have continuous daytime access to outdoor range with vegetation. Maximum stocking density: 2,500 birds per hectare of outdoor range. Indoor density: max 9 hens per m2. Pop holes providing outdoor access. Eggs stamped with "1" prefix (free-range code). Combined with Lion Code vaccination and traceability requirements.',
    audit_frequency: 'Annual audit with unannounced visits',
    cost_indication: 'GBP 200-400 per year (included in Lion Code membership for free-range members)',
    url: 'https://www.egginfo.co.uk/egg-types-and-டmarkings/free-range-eggs',
  },
];

for (const s of schemes) {
  db.run(
    'INSERT OR REPLACE INTO assurance_schemes (id, name, product_types, standards_summary, audit_frequency, cost_indication, url, jurisdiction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [s.id, s.name, s.product_types, s.standards_summary, s.audit_frequency, s.cost_indication, s.url, 'GB']
  );
}

// ── Hygiene Rules (13 entries) ───────────────────────────────────────

const hygieneRules = [
  {
    activity: 'farm shop retail',
    premises_type: 'farm shop',
    registration_type: 'Registration with local authority (minimum 28 days before opening)',
    haccp_required: 1,
    temperature_controls: 'Chilled products below 8C (recommend 5C). Frozen below -18C. Hot hold above 63C. Temperature checks at least twice daily. Calibrated thermometer required.',
    cleaning_requirements: 'Documented cleaning schedule. Food-contact surfaces cleaned and disinfected between uses. Separate areas or procedures for raw and ready-to-eat foods. Pest control plan. Staff hand-washing facilities with hot water, soap, and disposable towels.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013',
  },
  {
    activity: 'farmers market stall',
    premises_type: 'market stall',
    registration_type: 'Registration with home local authority (covers all market locations)',
    haccp_required: 1,
    temperature_controls: 'Cold chain maintained from base to market. Chilled items below 8C. Use insulated containers, cool boxes with ice packs, or refrigerated display. Temperature log for each market day.',
    cleaning_requirements: 'Clean equipment and surfaces before and after each market. Hand-washing facilities (minimum: water container with tap, soap, paper towels). Separate handling of raw and ready-to-eat products. Waste disposal plan.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013',
  },
  {
    activity: 'dairy processing',
    premises_type: 'on-farm dairy',
    registration_type: 'APPROVAL required from local authority (not just registration). FSA approval for dairy establishments handling raw milk.',
    haccp_required: 1,
    temperature_controls: 'Pasteurisation: 72C for 15 seconds (HTST) or 63C for 30 minutes (batch). Post-pasteurisation storage below 6C. Cheese aging rooms: temperature monitored and recorded. Raw milk for cheesemaking: below 6C before processing.',
    cleaning_requirements: 'CIP (Clean In Place) or full manual cleaning of all dairy equipment after each production run. Sanitiser residue testing. Water quality testing (private supply). Monthly microbiological swab testing. Separate clean and dirty areas.',
    regulation_ref: 'EC 853/2004 (retained), EC 852/2004 (retained)',
  },
  {
    activity: 'butchery and meat cutting',
    premises_type: 'on-farm cutting room',
    registration_type: 'APPROVAL required. Cutting plant must be approved by FSA. Slaughter must occur at FSA-approved abattoir (or on-farm for poultry <10,000/year).',
    haccp_required: 1,
    temperature_controls: 'Carcass chilling to below 7C (internal) within required time. Cutting room below 12C. Storage at 0-4C. Frozen storage at -18C. Continuous temperature monitoring and recording.',
    cleaning_requirements: 'Clean and disinfect all cutting equipment, surfaces, and rooms after each session. Knife sterilisation at 82C. Separate areas for raw material receipt, cutting, packing. Boot wash. Hair nets and dedicated work clothing.',
    regulation_ref: 'EC 853/2004 Annex III (retained), EC 852/2004 (retained)',
  },
  {
    activity: 'egg packing',
    premises_type: 'packing centre',
    registration_type: 'Registration as packing centre with APHA if >350 birds. Under 350 birds: exempt from packing centre registration for direct sales.',
    haccp_required: 1,
    temperature_controls: 'Eggs must not be washed (removes cuticle). Store in cool, dry, consistent temperature. Avoid condensation. Do not refrigerate then return to ambient.',
    cleaning_requirements: 'Clean packing area regularly. Egg grading equipment maintained. Candling equipment operational. Pest control in storage areas.',
    regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained), The Eggs and Chicks (England) Regulations 2009',
  },
  {
    activity: 'commercial kitchen and baking',
    premises_type: 'commercial kitchen',
    registration_type: 'Registration with local authority (minimum 28 days before opening)',
    haccp_required: 1,
    temperature_controls: 'Cooking to safe core temperatures (75C for 30 seconds). Cooling within 90 minutes to below 8C. Chilled storage below 5C. Reheating to 75C. Two-hour rule for food at ambient.',
    cleaning_requirements: 'Documented cleaning schedule covering all surfaces, equipment, and utensils. Allergen management procedures: separate utensils/areas or thorough cleaning between allergen and allergen-free production. Staff food hygiene training (Level 2 minimum). Pest control contract.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013',
  },
  {
    activity: 'mobile catering at farm events',
    premises_type: 'mobile unit',
    registration_type: 'Registration with home local authority. Some local authorities require notification of event locations.',
    haccp_required: 1,
    temperature_controls: 'Same temperature requirements as fixed premises. Generator backup if using refrigeration. Hot hold above 63C. Cold chain during transport.',
    cleaning_requirements: 'Clean potable water supply (mains connection or certified tank). Waste water containment. Hand-washing station. Clean-as-you-go during service. Full clean between events. LPG gas safety certificate if using gas equipment.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013',
  },
  {
    activity: 'home baking for sale',
    premises_type: 'domestic kitchen',
    registration_type: 'Registration with local authority required. Domestic kitchen can be registered as food premises.',
    haccp_required: 1,
    temperature_controls: 'Same food safety temperatures as commercial premises. Separate storage for domestic and business food recommended. Refrigerated items below 5C.',
    cleaning_requirements: 'Kitchen must be clean and in good repair. Separate or time-separated preparation from domestic cooking. Allergen labelling mandatory for pre-packed items. Ingredient records. Pet access controlled during food preparation. Environmental health officer may inspect.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013',
  },
  {
    activity: 'farmhouse cheese making',
    premises_type: 'on-farm cheese dairy',
    registration_type: 'APPROVAL required from local authority. FSA-approved dairy establishment. Higher standard than registration due to raw milk handling and ready-to-eat product risk.',
    haccp_required: 1,
    temperature_controls: 'Pasteurisation: 72C for 15 seconds (HTST) or 63C for 30 minutes (batch). Raw milk cheese must be aged minimum 60 days at controlled temperature. Cheese storage below 8C (soft) or below 15C (hard aged). Starter culture storage per manufacturer specification. Brining solution temperature monitored.',
    cleaning_requirements: 'Full CIP or manual cleaning of all dairy equipment after each batch. Listeria monocytogenes environmental sampling programme required (monthly minimum for soft cheese, quarterly for hard cheese). Swab testing of drains, surfaces, and equipment. Separate clean and dirty zones. Staff changing facilities. Water quality testing if private supply. Mould management in aging rooms.',
    regulation_ref: 'EC 853/2004 Annex III Section IX (retained), EC 852/2004 (retained), Commission Regulation (EC) 2073/2005 (retained) on microbiological criteria',
  },
  {
    activity: 'smoking operation (fish and meat)',
    premises_type: 'smoking facility',
    registration_type: 'APPROVAL required. Smoking of fish or meat requires FSA-approved establishment under EC 853/2004.',
    haccp_required: 1,
    temperature_controls: 'Cold smoking: product temperature must remain below 30C throughout (typically 20-25C). Hot smoking: core temperature must reach 62-72C depending on product. Post-smoking cooling to below 5C within 90 minutes. Storage at 0-4C. Smoking time and temperature logs required for each batch.',
    cleaning_requirements: 'Smokehouse cleaning between batches. PAH (polycyclic aromatic hydrocarbon) monitoring required -- maximum limits: 12 micrograms/kg benzo(a)pyrene and 30 micrograms/kg sum of 4 PAHs for smoked meat; 5 micrograms/kg benzo(a)pyrene and 30 micrograms/kg sum of 4 PAHs for smoked fish. Only permitted wood types (no painted, treated, or resinous softwoods). Listeria monocytogenes testing programme required for ready-to-eat smoked products.',
    regulation_ref: 'EC 853/2004 (retained), Commission Regulation (EC) 1881/2006 (retained) on PAH maximum levels, EC 2073/2005 (retained) on microbiological criteria',
  },
  {
    activity: 'farm events and wedding catering',
    premises_type: 'farm venue / temporary event',
    registration_type: 'Registration as food business with local authority. Premises licence under Licensing Act 2003 if selling alcohol. Temporary Event Notice (TEN) for one-off or occasional events (max 15 per year per premises).',
    haccp_required: 1,
    temperature_controls: 'Same temperature requirements as fixed commercial kitchen. Hot hold above 63C. Cold chain below 8C. Cooking to 75C core. Must plan for power supply (generator if no mains). Contingency for equipment failure. Buffer food held at ambient must be served within 2 hours.',
    cleaning_requirements: 'Potable water supply (mains or tested private supply). Hot water for hand-washing. Separate hand-wash station from food prep sinks. Waste disposal plan for event scale. Allergen management procedures (written allergen matrix for menu items). Staff food hygiene training (Level 2 minimum). Food safety management documentation available for inspection.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013, Licensing Act 2003',
  },
  {
    activity: 'egg grading and packing',
    premises_type: 'egg packing centre',
    registration_type: 'Registration as packing centre with APHA (Animal and Plant Health Agency) required if flock size exceeds 350 birds. Under 350 birds: exempt from packing centre registration for direct sales to consumers. 50-349 birds: must display farming method at point of sale but no grading/stamping required for direct sales.',
    haccp_required: 1,
    temperature_controls: 'Eggs must NOT be washed (washing removes the cuticle and increases Salmonella risk). Store in cool, dry, consistent temperature (ideally 15-18C). Avoid condensation (do not refrigerate then return to ambient). Best before: 28 days from laying. Sell-by: 21 days from laying.',
    cleaning_requirements: 'Clean packing area regularly. Grading and candling equipment maintained and calibrated. Pest control in storage areas. Nest box hygiene programme. Dirty or cracked eggs must not be graded as Class A. Floor eggs separated from nest eggs.',
    regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained), The Eggs and Chicks (England) Regulations 2009',
  },
  {
    activity: 'farm vending machines',
    premises_type: 'vending machine (on-farm or off-site)',
    registration_type: 'Registration with local authority as food business. Each vending machine location may need separate registration. Raw milk vending machines: currently permitted in England and Wales under the same rules as farm gate sales, but machine must be on the farm or at a farmers market attended by the producer.',
    haccp_required: 1,
    temperature_controls: 'Chilled products: vending machine must maintain below 8C (recommended 5C). Temperature monitoring and recording (continuous or at minimum every 4 hours). Alarm system for temperature excursion recommended. Raw milk machines: milk below 8C, dispensed within 24 hours of milking. Stock rotation system (oldest dispensed first).',
    cleaning_requirements: 'Daily cleaning of dispensing mechanism. Regular deep clean of entire machine. Raw milk vending machines: full CIP clean between fills. Machine exterior kept clean and free from contamination. Waste collection (drip tray). Machine must be clearly labelled with business name, product info, allergens, use-by dates, and storage instructions.',
    regulation_ref: 'EC 852/2004 (retained), Food Safety and Hygiene (England) Regulations 2013',
  },
];

for (const h of hygieneRules) {
  db.run(
    `INSERT INTO hygiene_rules (activity, premises_type, registration_type, haccp_required, temperature_controls, cleaning_requirements, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [h.activity, h.premises_type, h.registration_type, h.haccp_required, h.temperature_controls, h.cleaning_requirements, h.regulation_ref, 'GB']
  );
}

// ── Raw Milk Rules (4 entries -- devolved administrations) ───────────
// CRITICAL: These rules determine whether a farmer commits a criminal offence.

const rawMilkRules = [
  {
    country: 'england',
    permitted: 1,
    sales_methods: 'Farm gate (direct to consumer at the farm), farmers markets (where producer is present). Raw cream also permitted under same conditions.',
    conditions: 'Must display warning label: "This milk has not been heat-treated and may contain organisms harmful to health." Sold by the producer or their employee only. Must come from brucellosis-free and TB-tested herds. Cannot be sold through shops, restaurants, online, or by mail order. Cannot be sold through vending machines.',
    warning_label_required: 1,
    regulation_ref: 'The Food Safety and Hygiene (England) Regulations 2013, Schedule 6; FSA guidance on raw drinking milk and cream',
  },
  {
    country: 'scotland',
    permitted: 0,
    sales_methods: 'NONE. Sale of raw cows milk for direct human consumption is BANNED in Scotland.',
    conditions: 'The sale of raw (unpasteurised) cows milk direct to consumers has been prohibited in Scotland since 1983. Raw milk may only be sold to authorised distributors who will pasteurise it. This applies to cows milk only -- raw goats and sheep milk is permitted at farm gate in Scotland.',
    warning_label_required: 0,
    regulation_ref: 'The Dairy Products (Hygiene) (Scotland) Regulations 1995 (as retained); Food Standards Scotland guidance',
  },
  {
    country: 'wales',
    permitted: 1,
    sales_methods: 'Farm gate (direct to consumer at the farm), farmers markets (where producer is present). Raw cream also permitted under same conditions.',
    conditions: 'Same conditions as England. Must display warning label. Sold by the producer only. Brucellosis-free and TB-tested herds. Cannot be sold through shops, restaurants, or online.',
    warning_label_required: 1,
    regulation_ref: 'The Food Safety and Hygiene (Wales) Regulations 2006; FSA Wales guidance',
  },
  {
    country: 'northern ireland',
    permitted: 0,
    sales_methods: 'NONE. Sale of raw milk direct to consumers is PROHIBITED in Northern Ireland.',
    conditions: 'The sale of raw cows milk, goats milk, and sheep milk direct to consumers is prohibited in Northern Ireland. All milk for sale must be heat-treated. This is a stricter regime than England/Wales (which permit farm gate sales) and Scotland (which bans only cows milk).',
    warning_label_required: 0,
    regulation_ref: 'The Food Safety (Northern Ireland) Order 1991; DAERA (Department of Agriculture, Environment and Rural Affairs) guidance',
  },
];

for (const r of rawMilkRules) {
  db.run(
    `INSERT INTO raw_milk_rules (country, permitted, sales_methods, conditions, warning_label_required, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [r.country, r.permitted, r.sales_methods, r.conditions, r.warning_label_required, r.regulation_ref, 'GB']
  );
}

// ── Labelling Rules ──────────────────────────────────────────────────

interface LabellingRule {
  product_type: string;
  field: string;
  mandatory: number;
  format: string;
  regulation_ref: string;
}

const labellingRules: LabellingRule[] = [
  // General pre-packed requirements
  { product_type: 'all-pre-packed', field: 'name_of_food', mandatory: 1, format: 'Legal name, customary name, or descriptive name', regulation_ref: 'Food Information Regulations 2014, Article 17' },
  { product_type: 'all-pre-packed', field: 'ingredients_list', mandatory: 1, format: 'Descending order by weight. Must include water if >5% of finished product.', regulation_ref: 'Food Information Regulations 2014, Article 18-20' },
  { product_type: 'all-pre-packed', field: 'allergens', mandatory: 1, format: 'Emphasised in ingredients list (bold, italic, or contrasting). 14 major allergens: celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, nuts, peanuts, sesame, soybeans, sulphur dioxide (>10mg/kg).', regulation_ref: 'Food Information Regulations 2014, Article 21, Annex II' },
  { product_type: 'all-pre-packed', field: 'net_quantity', mandatory: 1, format: 'Weight (g or kg) or volume (ml or l). Minimum font size varies by pack size.', regulation_ref: 'Food Information Regulations 2014, Article 23' },
  { product_type: 'all-pre-packed', field: 'date_mark', mandatory: 1, format: '"Best before" for shelf-stable or "Use by" for perishable. Day/month/year format.', regulation_ref: 'Food Information Regulations 2014, Article 24' },
  { product_type: 'all-pre-packed', field: 'storage_conditions', mandatory: 1, format: 'Required where special storage needed to support date mark. E.g. "Keep refrigerated below 5C".', regulation_ref: 'Food Information Regulations 2014, Article 25' },
  { product_type: 'all-pre-packed', field: 'business_name_address', mandatory: 1, format: 'Name and address of the food business operator responsible for the product in GB.', regulation_ref: 'Food Information Regulations 2014, Article 8' },
  { product_type: 'all-pre-packed', field: 'lot_number', mandatory: 1, format: 'Preceded by "L" or clearly identifiable. Enables batch recall.', regulation_ref: 'The Food (Lot Marking) Regulations 1996' },
  { product_type: 'all-pre-packed', field: 'nutritional_information', mandatory: 1, format: 'Per 100g/100ml: energy (kJ/kcal), fat, saturates, carbohydrate, sugars, protein, salt. Exemptions for businesses with <10 staff and <EUR 2m turnover (but only if not making nutrition/health claims).', regulation_ref: 'Food Information Regulations 2014, Article 30, Annex XV' },
  { product_type: 'all-pre-packed', field: 'country_of_origin', mandatory: 0, format: 'Mandatory only for specific products (beef, fresh fruit/veg, honey, olive oil, wine, fish, organic). Required if omission would mislead consumer.', regulation_ref: 'Food Information Regulations 2014, Article 26' },

  // Eggs
  { product_type: 'eggs', field: 'class_grade', mandatory: 1, format: 'Class A (retail) or Class B (industry). Must be stamped on egg.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_type: 'eggs', field: 'weight_grade', mandatory: 1, format: 'S (<53g), M (53-63g), L (63-73g), XL (>73g)', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_type: 'eggs', field: 'number_of_eggs', mandatory: 1, format: 'Number of eggs in pack', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_type: 'eggs', field: 'packing_centre_number', mandatory: 1, format: 'Registered packing centre identification number', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_type: 'eggs', field: 'best_before_date', mandatory: 1, format: '28 days from date of laying', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_type: 'eggs', field: 'farming_method_code', mandatory: 1, format: 'Stamped on each egg: 0 = organic, 1 = free range, 2 = barn, 3 = colony/enriched cage. Code followed by country (UK) and farm ID.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },
  { product_type: 'eggs', field: 'farming_method_text', mandatory: 1, format: 'On pack: "Free Range Eggs", "Barn Eggs", "Eggs from caged hens", or "Organic Eggs". Terms are legally defined.', regulation_ref: 'Egg Marketing Regulations (EC 589/2008 retained)' },

  // Honey
  { product_type: 'honey', field: 'product_name', mandatory: 1, format: '"Honey" or specific type: "Blossom honey", "Honeydew honey", "Heather honey", etc.', regulation_ref: 'The Honey (England) Regulations 2015, Reg 5' },
  { product_type: 'honey', field: 'country_of_origin', mandatory: 1, format: 'Country name. If blended: "Blend of EU honeys", "Blend of non-EU honeys", or "Blend of EU and non-EU honeys".', regulation_ref: 'The Honey (England) Regulations 2015, Reg 8' },
  { product_type: 'honey', field: 'net_weight', mandatory: 1, format: 'In grams or kilograms', regulation_ref: 'The Honey (England) Regulations 2015' },
  { product_type: 'honey', field: 'lot_number', mandatory: 1, format: 'Batch identification for traceability', regulation_ref: 'The Food (Lot Marking) Regulations 1996' },
  { product_type: 'honey', field: 'best_before_date', mandatory: 1, format: 'Typically 2 years from extraction. Day/month/year or month/year.', regulation_ref: 'Food Information Regulations 2014' },

  // Meat (beef specifically has extra origin requirements)
  { product_type: 'meat-beef', field: 'species_name', mandatory: 1, format: '"Beef" or specific cut name', regulation_ref: 'Food Information Regulations 2014' },
  { product_type: 'meat-beef', field: 'country_of_birth', mandatory: 1, format: 'Country where animal was born', regulation_ref: 'Beef and Veal Labelling Regulations' },
  { product_type: 'meat-beef', field: 'country_of_rearing', mandatory: 1, format: 'Country where animal was reared', regulation_ref: 'Beef and Veal Labelling Regulations' },
  { product_type: 'meat-beef', field: 'country_of_slaughter', mandatory: 1, format: 'Country where animal was slaughtered', regulation_ref: 'Beef and Veal Labelling Regulations' },
  { product_type: 'meat-beef', field: 'cut_name', mandatory: 1, format: 'Standard cut name (e.g. sirloin, ribeye, mince)', regulation_ref: 'Food Information Regulations 2014' },
  { product_type: 'meat-beef', field: 'use_by_date', mandatory: 1, format: 'Use-by date (perishable product)', regulation_ref: 'Food Information Regulations 2014' },
  { product_type: 'meat-beef', field: 'storage_temperature', mandatory: 1, format: '"Keep refrigerated below 5C" or similar', regulation_ref: 'Food Information Regulations 2014' },

  // Baked goods
  { product_type: 'baked-goods', field: 'allergen_declaration', mandatory: 1, format: 'All 14 allergens emphasised in bold in ingredients list. For non-pre-packed: written notice or verbal communication with documented procedure.', regulation_ref: 'Food Information Regulations 2014, Article 21' },
  { product_type: 'baked-goods', field: 'ingredients_list', mandatory: 1, format: 'Full ingredients in descending weight order. Must include processing aids if allergenic.', regulation_ref: 'Food Information Regulations 2014' },

  // ── 14 Mandatory Allergens (individual rules) ───────────────────────
  { product_type: 'allergen', field: 'cereals_containing_gluten', mandatory: 1, format: 'Wheat, rye, barley, oats, spelt, kamut or their hybridised strains and products thereof. Must be emphasised (bold/italic/contrasting) in ingredients list. Name the specific cereal (e.g. "wheat flour" not just "cereal flour").', regulation_ref: 'Food Information Regulations 2014, Annex II (1)' },
  { product_type: 'allergen', field: 'crustaceans', mandatory: 1, format: 'Crabs, lobsters, prawns, shrimp, crayfish, langoustines and products thereof. Must be emphasised in ingredients list.', regulation_ref: 'Food Information Regulations 2014, Annex II (2)' },
  { product_type: 'allergen', field: 'eggs', mandatory: 1, format: 'Eggs and products thereof. Includes egg lecithin, lysozyme, albumin. Must be emphasised in ingredients list.', regulation_ref: 'Food Information Regulations 2014, Annex II (3)' },
  { product_type: 'allergen', field: 'fish', mandatory: 1, format: 'Fish and products thereof. Includes fish sauce, fish oil, fish gelatine. Must be emphasised in ingredients list. Exception: fish gelatine used as carrier for vitamins/carotenoids, and isinglass used in beer/wine fining.', regulation_ref: 'Food Information Regulations 2014, Annex II (4)' },
  { product_type: 'allergen', field: 'peanuts', mandatory: 1, format: 'Peanuts (groundnuts) and products thereof. Includes peanut oil (refined peanut oil is exempt in some jurisdictions but must still be declared in UK). Must be emphasised in ingredients list.', regulation_ref: 'Food Information Regulations 2014, Annex II (5)' },
  { product_type: 'allergen', field: 'soybeans', mandatory: 1, format: 'Soybeans and products thereof. Includes soya lecithin, soya protein, tofu, tempeh. Must be emphasised in ingredients list. Exception: fully refined soybean oil and certain soya-derived tocopherols.', regulation_ref: 'Food Information Regulations 2014, Annex II (6)' },
  { product_type: 'allergen', field: 'milk', mandatory: 1, format: 'Milk and products thereof (including lactose). Includes butter, cheese, cream, casein, whey, lactalbumin. Must be emphasised in ingredients list.', regulation_ref: 'Food Information Regulations 2014, Annex II (7)' },
  { product_type: 'allergen', field: 'tree_nuts', mandatory: 1, format: 'Almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia (Queensland) nuts and products thereof. Must name the specific nut. Must be emphasised in ingredients list.', regulation_ref: 'Food Information Regulations 2014, Annex II (8)' },
  { product_type: 'allergen', field: 'celery', mandatory: 1, format: 'Celery and products thereof. Includes celeriac, celery salt, celery seed. Must be emphasised in ingredients list. Common in soups, stocks, sauces, chutneys.', regulation_ref: 'Food Information Regulations 2014, Annex II (9)' },
  { product_type: 'allergen', field: 'mustard', mandatory: 1, format: 'Mustard and products thereof. Includes mustard seeds, mustard powder, mustard oil, mustard flour. Must be emphasised in ingredients list. Common in sauces, marinades, chutneys, curry powder.', regulation_ref: 'Food Information Regulations 2014, Annex II (10)' },
  { product_type: 'allergen', field: 'sesame', mandatory: 1, format: 'Sesame seeds and products thereof. Includes tahini, sesame oil. Must be emphasised in ingredients list. Common in bread, hummus, salad dressings.', regulation_ref: 'Food Information Regulations 2014, Annex II (11)' },
  { product_type: 'allergen', field: 'sulphur_dioxide_sulphites', mandatory: 1, format: 'Sulphur dioxide and sulphites at concentrations of more than 10 mg/kg or 10 mg/litre expressed as SO2. Must be emphasised in ingredients list. Common in dried fruit, wine, cider, sausages, soft drinks, vinegar. Declare as "sulphur dioxide" or "sulphites".', regulation_ref: 'Food Information Regulations 2014, Annex II (12)' },
  { product_type: 'allergen', field: 'lupin', mandatory: 1, format: 'Lupin and products thereof. Includes lupin flour, lupin seeds, lupin protein. Must be emphasised in ingredients list. Cross-reactivity with peanuts common. Used in some gluten-free and high-protein foods.', regulation_ref: 'Food Information Regulations 2014, Annex II (13)' },
  { product_type: 'allergen', field: 'molluscs', mandatory: 1, format: 'Molluscs and products thereof. Includes mussels, clams, oysters, snails, squid, octopus, scallops. Must be emphasised in ingredients list. Includes oyster sauce, squid ink.', regulation_ref: 'Food Information Regulations 2014, Annex II (14)' },

  // ── Country of Origin ─────────────────────────────────────────────────
  { product_type: 'origin-beef', field: 'country_of_origin_beef', mandatory: 1, format: 'Mandatory for beef and veal. Must declare three separate stages: country of birth, country of rearing, and country of slaughter. If all three are the same, may use "Origin: [Country]". If different, each must be stated separately. Applies to pre-packed and non-pre-packed beef.', regulation_ref: 'Beef and Veal Labelling Regulations (retained), Commission Regulation (EC) 1760/2000 (retained)' },
  { product_type: 'origin-honey', field: 'country_of_origin_honey', mandatory: 1, format: 'Mandatory for honey. Single origin: state country name. Blended: "Blend of EU honeys", "Blend of non-EU honeys", or "Blend of EU and non-EU honeys". Post-Brexit: "Blend of honeys from more than one country" acceptable. Cannot omit origin.', regulation_ref: 'The Honey (England) Regulations 2015, Reg 8' },
  { product_type: 'origin-olive-oil', field: 'country_of_origin_olive_oil', mandatory: 1, format: 'Mandatory for virgin and extra virgin olive oil. Must state the origin of the olives. Single EU country, third country, or "Blend of olive oils of European Union origin" / "Blend of olive oils not of European Union origin" / "Blend of olive oils of European Union origin and not of European Union origin".', regulation_ref: 'Commission Regulation (EU) 29/2012 (retained), Olive Oil Marketing Standards' },

  // ── Date Marks ────────────────────────────────────────────────────────
  { product_type: 'date-marks', field: 'use_by_date', mandatory: 1, format: '"Use by" [date]: applies to perishable foods where safety is a concern after the date (e.g. fresh meat, fish, dairy, ready meals). It is a CRIMINAL OFFENCE to sell food after its use-by date under Food Safety and Hygiene (England) Regulations 2013. Date format: day/month or day/month/year.', regulation_ref: 'Food Information Regulations 2014, Article 24; Food Safety and Hygiene (England) Regulations 2013 Reg 30' },
  { product_type: 'date-marks', field: 'best_before_date', mandatory: 1, format: '"Best before" [date]: applies to foods where quality degrades but safety is not a concern (e.g. canned goods, dried pasta, biscuits). NOT an offence to sell after best-before date provided food is still safe. Date format: day/month/year or month/year (if shelf life >3 months) or year only (if shelf life >18 months). "Best before end" may be used.', regulation_ref: 'Food Information Regulations 2014, Article 24' },
  { product_type: 'date-marks', field: 'display_until_date', mandatory: 0, format: '"Display until" or "Sell by": NOT a legal requirement. Used for stock management by retailers only. Has no legal standing and is not defined in food law. Can be removed or ignored by consumers. Only "use by" and "best before" are legally defined date marks.', regulation_ref: 'FSA guidance -- not a legal requirement' },

  // ── Storage Instructions ──────────────────────────────────────────────
  { product_type: 'storage', field: 'storage_instructions', mandatory: 1, format: 'Mandatory where specific storage conditions are needed to support the date mark or ensure food safety. Examples: "Keep refrigerated below 5C", "Store in a cool dry place", "Once opened, refrigerate and use within 3 days", "Keep frozen at -18C or below". Must appear on the same field of vision as the date mark where possible.', regulation_ref: 'Food Information Regulations 2014, Article 25' },
  { product_type: 'storage', field: 'conditions_of_use', mandatory: 1, format: 'Required where specific conditions are needed to use the product correctly. Includes cooking instructions (temperature, time), defrosting instructions, "suitable for freezing" declarations, and microwave instructions where applicable.', regulation_ref: 'Food Information Regulations 2014, Article 27' },

  // ── Alcohol Labelling ─────────────────────────────────────────────────
  { product_type: 'alcohol', field: 'abv_percentage', mandatory: 1, format: 'Mandatory for drinks >1.2% ABV. Expressed as "X% vol" or "X% ABV". Tolerance: +/- 0.5% for beer/cider, +/- 0.3% for wine, +/- 0.3% for spirits. Must appear on label.', regulation_ref: 'The Food Information Regulations 2014, retained EU Regulation 1169/2011 Article 28' },
  { product_type: 'alcohol', field: 'allergen_sulphites', mandatory: 1, format: 'Sulphites must be declared if >10mg/litre SO2 (common in wine and cider). Other allergens must also be declared (e.g. milk/egg if used in fining). "Contains sulphites" or listed in ingredients as "sulphur dioxide".', regulation_ref: 'Food Information Regulations 2014, Annex II (12)' },
  { product_type: 'alcohol', field: 'volume', mandatory: 1, format: 'Net volume in ml or cl. Wine: 750ml standard (regulated sizes apply). Beer/cider: no regulated sizes but volume must be stated.', regulation_ref: 'The Weights and Measures (Packaged Goods) Regulations 2006' },

  // ── Nutrition Declaration ─────────────────────────────────────────────
  { product_type: 'nutrition', field: 'mandatory_nutrition_declaration', mandatory: 1, format: 'Per 100g or per 100ml (mandatory). May additionally show per portion. Seven mandatory elements in this order: energy (kJ and kcal), fat (g), of which saturates (g), carbohydrate (g), of which sugars (g), protein (g), salt (g). Fibre, vitamins, and minerals are voluntary unless a claim is made.', regulation_ref: 'Food Information Regulations 2014, Article 30, Annex XV' },
  { product_type: 'nutrition', field: 'small_business_exemption', mandatory: 0, format: 'Businesses with fewer than 10 employees AND less than EUR 2 million annual turnover are exempt from mandatory nutrition declaration UNLESS they make a nutrition or health claim on the product. If exempt, may still provide voluntarily. If providing voluntarily, must include all 7 mandatory elements.', regulation_ref: 'Food Information Regulations 2014, Annex V' },
  { product_type: 'nutrition', field: 'reference_intake', mandatory: 0, format: 'Voluntary "Reference Intake" (formerly GDA) labelling. If used, must state "Reference intake of an average adult (8400 kJ/2000 kcal)". Front-of-pack traffic light labelling (red/amber/green) is voluntary in the UK but widely adopted by retailers.', regulation_ref: 'Food Information Regulations 2014, Annex XIII; FSA front-of-pack labelling guidance' },
];

for (const l of labellingRules) {
  db.run(
    `INSERT INTO labelling_rules (product_type, field, mandatory, format, regulation_ref, jurisdiction)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [l.product_type, l.field, l.mandatory, l.format, l.regulation_ref, 'GB']
  );
}

// ── FTS5 Search Index ────────────────────────────────────────────────

interface SearchEntry {
  title: string;
  body: string;
  product_type: string;
}

const searchEntries: SearchEntry[] = [
  { title: 'Raw Milk Direct Sales Rules', body: 'Raw milk can only be sold at farm gate or farmers markets in England and Wales. Scotland bans raw cows milk sale. Northern Ireland prohibits all raw milk sale. Warning label required. Must come from TB-tested and brucellosis-free herds.', product_type: 'dairy' },
  { title: 'Raw Milk Warning Label', body: 'Required text: "This milk has not been heat-treated and may contain organisms harmful to health." Must be displayed prominently at point of sale.', product_type: 'dairy' },
  { title: 'Egg Labelling and Grading', body: 'Eggs for retail must be graded (Class A), weight-graded (S/M/L/XL), stamped with producer code and farming method (0=organic, 1=free-range, 2=barn, 3=cage). Packing centre registration required if >350 birds.', product_type: 'eggs' },
  { title: 'Egg Small Producer Exemption', body: 'Producers with fewer than 50 birds may sell eggs at farm gate without grading or stamping. Producers with 50-349 birds can sell direct but must display farming method. Over 350 birds requires packing centre registration.', product_type: 'eggs' },
  { title: 'Meat Cold Chain Requirements', body: 'Fresh meat must be stored at 0-4C. Frozen meat at -18C or below. Cold chain must not be broken during transport. Temperature logs required. All meat for sale must come from FSA-approved slaughterhouse (poultry exemption: <10,000 birds/year on-farm slaughter for direct sale).', product_type: 'meat' },
  { title: 'Beef Origin Labelling', body: 'Beef must show country of birth, rearing, and slaughter. This is stricter than other meats. "Born, reared and slaughtered in the UK" is a common compliant label. Each stage may be a different country and must be declared separately.', product_type: 'meat' },
  { title: 'Honey Labelling Requirements', body: 'Honey must show: product name, country of origin, net weight, lot number, best before date. If blended: "Blend of EU honeys", "Blend of non-EU honeys", or "Blend of EU and non-EU honeys". Cannot be called "honey" if adulterated with sugar.', product_type: 'honey' },
  { title: 'HACCP Requirements', body: 'All food businesses must have a food safety management system based on HACCP principles. This includes identifying hazards, critical control points, critical limits, monitoring procedures, corrective actions, verification, and documentation. Simplified approaches available for low-risk businesses.', product_type: 'general' },
  { title: 'Food Business Registration', body: 'All food businesses must register with their local authority at least 28 days before starting to trade. Registration is free. Some activities (dairy processing, meat cutting) require APPROVAL, not just registration. Approval involves a pre-opening inspection.', product_type: 'general' },
  { title: 'Allergen Labelling Rules', body: 'Pre-packed food must list all 14 major allergens emphasised (bold) in the ingredients list. The 14 allergens: celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, nuts, peanuts, sesame, soybeans, sulphur dioxide.', product_type: 'general' },
  { title: 'Red Tractor Assurance Scheme', body: 'Red Tractor covers food safety, animal welfare, environmental protection, and traceability. Annual audit plus spot checks. Cost GBP 400-700/year. Required by most major UK supermarkets. Covers dairy, meat, eggs, produce, cereals.', product_type: 'general' },
  { title: 'SALSA Certification', body: 'Safe and Local Supplier Approval. Aimed at small food producers selling to food service or retail. Covers HACCP, traceability, allergen management, hygiene, pest control. GBP 550 for 2-year approval. Recognised by many UK buyers.', product_type: 'general' },
  { title: 'Soil Association Organic Certification', body: 'Organic certification exceeding EU baseline. Covers soil health, biodiversity, animal welfare, no routine antibiotics, no synthetic pesticides. 2-3 year conversion period. GBP 500-1500/year. License to use organic label.', product_type: 'general' },
  { title: 'Farm Gate Sales Rules', body: 'Selling food direct from the farm gate. Most products require food business registration. Exemptions: whole unprocessed fruit/veg and eggs from <50 birds. Products must meet same safety standards as retail. Local authority can inspect.', product_type: 'general' },
  { title: 'Cheese from Raw Milk', body: 'Hard cheese made from raw (unpasteurised) milk is legal to sell in England and Wales if aged for a minimum of 60 days. Maker must have approved dairy premises, HACCP plan covering raw milk risks, starter culture records, and temperature monitoring during aging.', product_type: 'dairy' },
  { title: 'Traceability One Step Forward One Step Back', body: 'EC Regulation 178/2002 Article 18 requires all food businesses to identify their immediate supplier (one step back) and immediate customer (one step forward). Records must be kept for 5 years. Must be able to provide information to authorities on demand.', product_type: 'general' },
  { title: 'Temperature Control Regulations', body: 'Chilled food must be held at or below 8C (legal maximum in England). Recommended: 5C or below. Hot food: above 63C. Reheating: to 75C core temperature. Cooling: within 90 minutes to below 8C. Two-hour rule: food at ambient must be used within 2 hours or discarded.', product_type: 'general' },
  { title: 'Poultry On-Farm Slaughter', body: 'Small producers may slaughter up to 10,000 birds per year on-farm without FSA-approved slaughterhouse, if sold direct to final consumers or to local retail establishments within the local area. Must still meet hygiene requirements and register with local authority.', product_type: 'meat' },
  { title: 'Food Hygiene Rating Scheme', body: 'Local authority Environmental Health Officers inspect food businesses and award a hygiene rating from 0 (urgent improvement necessary) to 5 (very good). Ratings are published on the FSA website. Display is mandatory in Wales and Northern Ireland, voluntary in England.', product_type: 'general' },
  { title: 'Jam and Preserve Regulations', body: 'Products labelled as "jam" must meet minimum fruit content requirements (typically 35-45% depending on fruit). Extra jam: minimum 45%. Reduced sugar jam has specific rules. Must list fruit content percentage. The Jam and Similar Products (England) Regulations 2003.', product_type: 'preserves' },
  { title: 'Cider and Apple Juice Safety', body: 'Fresh unpasteurised apple juice must be refrigerated below 5C and consumed within 5 days. Pasteurised juice: ambient storage OK. Cider over 1.2% ABV must show alcohol content and comply with Cider and Perry Regulations 2010. Food business registration required for production.', product_type: 'beverages' },
  { title: 'Pre-packed Food Nutritional Labelling', body: 'Mandatory nutritional declaration per 100g/100ml: energy (kJ and kcal), fat, saturates, carbohydrate, sugars, protein, salt. Small businesses (<10 employees and <EUR 2m turnover) exempt UNLESS making nutrition or health claims.', product_type: 'general' },

  // New FTS entries for allergens, labelling detail, hygiene
  { title: '14 Mandatory Allergens', body: 'The 14 allergens that must be declared on food labels in the UK are: (1) cereals containing gluten (wheat, rye, barley, oats, spelt, kamut), (2) crustaceans, (3) eggs, (4) fish, (5) peanuts, (6) soybeans, (7) milk (including lactose), (8) tree nuts (almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia), (9) celery, (10) mustard, (11) sesame, (12) sulphur dioxide and sulphites (>10mg/kg or 10mg/litre), (13) lupin, (14) molluscs. All must be emphasised (bold, italic, or contrasting) in the ingredients list.', product_type: 'general' },
  { title: 'Country of Origin Labelling Rules', body: 'Country of origin is mandatory for: beef (born, reared, slaughtered separately), honey (single country or blend declaration), olive oil (virgin/extra virgin), fresh fruit and vegetables (specified products), fish (catch area), wine, organic products. For other foods, origin is mandatory only if omission would mislead the consumer.', product_type: 'general' },
  { title: 'Use-By vs Best-Before Date Marks', body: 'Use-by date: applies to perishable foods where safety is a concern. It is a CRIMINAL OFFENCE to sell food after its use-by date. Best-before date: applies to shelf-stable foods where quality degrades but safety is not a concern. It is NOT an offence to sell food after its best-before date if still safe. Display-until (sell-by) dates have no legal standing and are used for stock management only.', product_type: 'general' },
  { title: 'Alcohol Labelling for Farm Producers', body: 'Drinks over 1.2% ABV must show alcohol content as percentage ABV. Sulphites must be declared if over 10mg/litre SO2 (common in wine and cider). Premises licence required for retail sale of alcohol. Age verification policy required (Challenge 25). Small Producer Relief for cider/perry under 8,500 litres pure alcohol per year.', product_type: 'alcohol' },
  { title: 'Farmhouse Cheese Making Hygiene', body: 'Farmhouse cheese production requires FSA-approved dairy premises (not just registration). HACCP plan must cover raw milk risks, Listeria monocytogenes environmental sampling (monthly for soft cheese, quarterly for hard), starter culture management, and aging room temperature control. Raw milk cheese must be aged minimum 60 days.', product_type: 'dairy' },
  { title: 'Smoking Operation Food Safety', body: 'Smoking of fish or meat requires FSA-approved establishment. PAH (polycyclic aromatic hydrocarbon) limits must be met: max 12 micrograms/kg benzo(a)pyrene for smoked meat, 5 micrograms/kg for smoked fish. Only permitted wood types (no painted, treated, or resinous softwoods). Listeria testing programme required for ready-to-eat smoked products.', product_type: 'processed_meat' },
  { title: 'Farm Events and Wedding Catering', body: 'Farm event catering requires food business registration and may need a premises licence or Temporary Event Notice (TEN) for alcohol sales. Maximum 15 TENs per year per premises. Same food safety temperatures as commercial kitchen apply. Written allergen matrix required for menu items. Staff need Level 2 food hygiene training.', product_type: 'general' },
  { title: 'Egg Grading 350 Bird Threshold', body: 'Farms with fewer than 50 birds may sell eggs at farm gate without grading or stamping. Farms with 50-349 birds can sell direct but must display farming method. Over 350 birds requires registration as a packing centre with APHA, full grading (Class A), weight grading (S/M/L/XL), and stamping with producer code.', product_type: 'eggs' },
  { title: 'Farm Vending Machines', body: 'Farm vending machines require food business registration with local authority. Raw milk vending machines are permitted in England and Wales under the same rules as farm gate sales. Machine must maintain chilled products below 8C with temperature monitoring. Raw milk must be dispensed within 24 hours of milking. Machine must display business name, product info, allergens, use-by dates, and storage instructions.', product_type: 'general' },
  { title: 'OF&G Organic Certification', body: 'Organic Farmers and Growers (OF&G) is a DEFRA-licensed organic control body. Certification covers soil management, animal welfare, input records, and traceability. Annual audit. Cost GBP 500-800/year. Conversion period 2-3 years. Members may use the UK organic logo and OF&G certification mark.', product_type: 'general' },
  { title: 'LEAF Marque Certification', body: 'LEAF Marque certifies Integrated Farm Management (IFM). Covers soil management, crop protection, energy efficiency, water management, landscape, and biodiversity. Annual audit. Cost GBP 300-500/year. Recognised by major retailers. Complements food safety certification.', product_type: 'general' },
  { title: 'British Lion Code Egg Standard', body: 'The British Lion Code covers approximately 90% of UK eggs. Requirements include Salmonella Enteritidis vaccination, traceability, hygiene standards, feed standards, best before dating (28 days), and egg stamping. Lion-marked eggs are recognised by the FSA as safe to eat runny or raw by vulnerable groups. Annual audit plus unannounced spot checks. Cost GBP 200-400/year.', product_type: 'eggs' },
  { title: 'Nutrition Declaration Details', body: 'Mandatory nutrition declaration per 100g/100ml in this order: energy (kJ and kcal), fat (g), saturates (g), carbohydrate (g), sugars (g), protein (g), salt (g). May also show per portion. Front-of-pack traffic light labelling (red/amber/green) is voluntary but widely used in UK. Reference intake: 8400 kJ / 2000 kcal for an average adult.', product_type: 'general' },
  { title: 'Storage Instructions on Labels', body: 'Storage instructions are mandatory where specific conditions are needed to support the date mark. Examples: keep refrigerated below 5C, store in a cool dry place, once opened refrigerate and use within 3 days, keep frozen at -18C. Must appear near the date mark where possible. Conditions of use (cooking instructions) also mandatory where needed.', product_type: 'general' },
];

for (const e of searchEntries) {
  db.run(
    'INSERT INTO search_index (title, body, product_type, jurisdiction) VALUES (?, ?, ?, ?)',
    [e.title, e.body, e.product_type, 'GB']
  );
}

// ── Metadata ─────────────────────────────────────────────────────────

db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', ?)", [today]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', ?)", [today]);
db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('schema_version', '1.0')", []);

// ── Coverage stats ───────────────────────────────────────────────────

const productCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM products');
const requirementCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM product_requirements');
const schemeCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM assurance_schemes');
const hygieneCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM hygiene_rules');
const rawMilkCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM raw_milk_rules');
const labellingCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM labelling_rules');
const ftsCount = db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM search_index');

const coverage = {
  mcp_name: 'UK Food Safety MCP',
  jurisdiction: 'GB',
  build_date: today,
  products: productCount?.cnt ?? 0,
  product_requirements: requirementCount?.cnt ?? 0,
  assurance_schemes: schemeCount?.cnt ?? 0,
  hygiene_rules: hygieneCount?.cnt ?? 0,
  raw_milk_rules: rawMilkCount?.cnt ?? 0,
  labelling_rules: labellingCount?.cnt ?? 0,
  fts_entries: ftsCount?.cnt ?? 0,
};

console.log('Database built:', coverage);

writeFileSync(
  join(__dirname, '..', 'data', 'coverage.json'),
  JSON.stringify(coverage, null, 2) + '\n'
);

db.close();
