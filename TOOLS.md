# Tools Reference

## Meta Tools

### `about`

Get server metadata: name, version, coverage, data sources, and links.

**Parameters:** None

**Returns:** Server name, version, jurisdiction list, data source names, tool count, homepage/repository links.

---

### `list_sources`

List all data sources with authority, URL, license, and freshness info.

**Parameters:** None

**Returns:** Array of data sources, each with `name`, `authority`, `official_url`, `retrieval_method`, `update_frequency`, `license`, `coverage`, `last_retrieved`.

---

### `check_data_freshness`

Check when data was last ingested, staleness status, and how to trigger a refresh.

**Parameters:** None

**Returns:** `status` (fresh/stale/unknown), `last_ingest`, `days_since_ingest`, `staleness_threshold_days`, `refresh_command`.

---

## Domain Tools

### `search_food_safety`

Full-text search across all food safety data: regulations, labelling rules, hygiene requirements, and product guidance.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Free-text search query |
| `product_type` | string | No | Filter by product type (e.g. dairy, eggs, meat) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |
| `limit` | number | No | Max results (default: 20, max: 50) |

**Example:** `{ "query": "raw milk farm gate" }`

---

### `get_product_requirements`

Get food safety requirements for a specific product by sales channel. Returns registration, approval, temperature, traceability, and labelling requirements.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | Yes | Product ID or name (e.g. raw-milk, eggs, honey) |
| `sales_channel` | string | No | Sales channel: farm_gate, farmers_market, retail, online |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Product details plus requirements per sales channel.

**Example:** `{ "product": "eggs", "sales_channel": "farm_gate" }`

---

### `get_traceability_rules`

Get traceability requirements for a product type. Returns record-keeping obligations, retention periods, and one-step-back-one-step-forward rules.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product_type` | string | Yes | Product type (e.g. dairy, eggs, meat, honey) |
| `species` | string | No | Animal species if applicable (e.g. cattle, sheep, poultry) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** General traceability principles (one-step-back/forward, retention period) plus product-specific requirements by sales channel.

---

### `check_direct_sales_rules`

Check rules for selling food directly from farm gate, farmers market, or online. Covers registration, exemptions, and volume thresholds.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | Yes | Product ID or name (e.g. eggs, honey, baked-goods) |
| `sales_method` | string | No | Sales method: farm_gate, farmers_market, online |
| `volume` | string | No | Production volume description for exemption checks |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Example:** `{ "product": "eggs", "sales_method": "farm_gate", "volume": "under 50 birds" }`

---

### `get_labelling_requirements`

Get mandatory labelling fields for a product. Returns both general pre-packed requirements and product-specific rules.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | Yes | Product name or type (e.g. eggs, honey, meat-beef) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** General pre-packed requirements (name, ingredients, allergens, weight, date, etc.) plus product-specific fields (e.g. egg farming method code, honey country of origin, beef country of birth/rearing/slaughter).

**Example:** `{ "product": "honey" }`

---

### `get_assurance_scheme_requirements`

Get details on UK farm assurance schemes. Covers Red Tractor, RSPCA Assured, Soil Association Organic, SALSA, and QMS.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scheme` | string | No | Scheme name or ID (e.g. red-tractor, salsa) |
| `product_type` | string | No | Filter schemes by product type |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Scheme name, product types covered, standards summary, audit frequency, cost indication, and URL. If no filter, returns all schemes.

**Example:** `{ "scheme": "salsa" }`

---

### `get_hygiene_requirements`

Get hygiene and HACCP requirements for a food business activity. Covers registration vs approval, temperature controls, cleaning, and staff training.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `activity` | string | Yes | Food business activity (e.g. dairy processing, baking, butchery, market stall) |
| `premises_type` | string | No | Premises type (e.g. farm shop, commercial kitchen, mobile) |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** Activity, premises type, registration type, HACCP requirement, temperature controls, cleaning requirements, and regulation reference.

**Example:** `{ "activity": "dairy processing" }`

---

### `check_raw_milk_rules`

Check raw (unpasteurised) milk sale rules by UK devolved administration. Returns whether sale is permitted, conditions, and warning label requirements.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `country` | string | No | Devolved administration: England, Scotland, Wales, Northern Ireland |
| `sales_method` | string | No | Intended sales method for applicability note |
| `jurisdiction` | string | No | ISO 3166-1 alpha-2 code (default: GB) |

**Returns:** For each devolved administration: permitted status, allowed sales methods, conditions, warning label requirement, and regulation reference. If no country specified, returns all four.

**Example:** `{ "country": "Scotland" }`
