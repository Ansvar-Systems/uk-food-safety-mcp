# Coverage

## What Is Included

- **Product requirements** for 16 food products across 4 sales channels (farm gate, farmers market, retail, online): registration, approval, temperature control, traceability, labelling
- **Raw milk rules** for all 4 UK devolved administrations (England, Scotland, Wales, Northern Ireland) -- sale legality, conditions, warning labels
- **Labelling rules**: 34 field definitions covering general pre-packed requirements, eggs, honey, beef, and baked goods
- **Assurance schemes**: Red Tractor, RSPCA Assured, Soil Association Organic, SALSA, Quality Meat Scotland
- **Hygiene rules**: 8 activity types (farm shop, market stall, dairy, butchery, egg packing, commercial kitchen, mobile catering, home baking)
- **Full-text search** across 22 indexed guidance topics

## Jurisdictions

| Code | Country | Status |
|------|---------|--------|
| GB | Great Britain | Supported |

Note: Devolved administration differences (England, Scotland, Wales, Northern Ireland) are tracked within GB jurisdiction, particularly for raw milk rules.

## Products Covered

dairy (raw milk, pasteurised milk, butter, hard cheese, soft cheese, yogurt), eggs, meat (beef, lamb, pork, poultry), honey, jam/preserves, baked goods, fresh fruit/vegetables, apple juice/cider

## What Is NOT Included

- **Detailed local authority variations** -- each council may interpret rules differently
- **Export regulations** -- this covers domestic GB sale only
- **Feed hygiene regulations** -- animal feed is a separate regulatory area
- **Food supplements and health claims** -- separate legislation
- **Alcohol licensing** -- cider over 1.2% ABV has basic info but full licensing is separate
- **Water regulations** -- private water supply testing for food businesses
- **Pest control detail** -- covered at principle level, not specific protocols
- **Staff training syllabi** -- notes Level 2 requirement, does not contain training content
- **Welsh and Gaelic language labelling** -- covered in English only

## Known Gaps

1. Product requirements do not cover every possible product (e.g. shellfish, wild game, exotic meats not yet included)
2. Labelling rules focus on the most common products -- niche products may have additional rules
3. Assurance scheme costs are approximate and change annually
4. Scottish and Welsh equivalent legislation is referenced but not separately ingested
5. FTS5 search quality varies with query phrasing -- use specific product names for best results

## Data Freshness

Run `check_data_freshness` to see when data was last updated. The ingestion pipeline runs on a schedule; manual triggers available via `gh workflow run ingest.yml`.
