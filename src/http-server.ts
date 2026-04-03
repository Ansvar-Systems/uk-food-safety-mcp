import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { createDatabase, type Database } from './db.js';
import { handleAbout } from './tools/about.js';
import { handleListSources } from './tools/list-sources.js';
import { handleCheckFreshness } from './tools/check-freshness.js';
import { handleSearchFoodSafety } from './tools/search-food-safety.js';
import { handleGetProductRequirements } from './tools/get-product-requirements.js';
import { handleGetTraceabilityRules } from './tools/get-traceability-rules.js';
import { handleCheckDirectSalesRules } from './tools/check-direct-sales-rules.js';
import { handleGetLabellingRequirements } from './tools/get-labelling-requirements.js';
import { handleGetAssuranceSchemeRequirements } from './tools/get-assurance-scheme-requirements.js';
import { handleGetHygieneRequirements } from './tools/get-hygiene-requirements.js';
import { handleCheckRawMilkRules } from './tools/check-raw-milk-rules.js';

const SERVER_NAME = 'uk-food-safety-mcp';
const SERVER_VERSION = '0.1.0';
const PORT = parseInt(process.env.PORT ?? '3000', 10);

const SearchArgsSchema = z.object({
  query: z.string(),
  product_type: z.string().optional(),
  jurisdiction: z.string().optional(),
  limit: z.number().optional(),
});

const ProductRequirementsArgsSchema = z.object({
  product: z.string(),
  sales_channel: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const TraceabilityArgsSchema = z.object({
  product_type: z.string(),
  species: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const DirectSalesArgsSchema = z.object({
  product: z.string(),
  sales_method: z.string().optional(),
  volume: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const LabellingArgsSchema = z.object({
  product: z.string(),
  jurisdiction: z.string().optional(),
});

const AssuranceArgsSchema = z.object({
  scheme: z.string().optional(),
  product_type: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const HygieneArgsSchema = z.object({
  activity: z.string(),
  premises_type: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const RawMilkArgsSchema = z.object({
  country: z.string().optional(),
  sales_method: z.string().optional(),
  jurisdiction: z.string().optional(),
});

const TOOLS = [
  {
    name: 'about',
    description: 'Get server metadata: name, version, coverage, data sources, and links.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'list_sources',
    description: 'List all data sources with authority, URL, license, and freshness info.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'check_data_freshness',
    description: 'Check when data was last ingested, staleness status, and how to trigger a refresh.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'search_food_safety',
    description: 'Full-text search across all food safety data: regulations, labelling rules, hygiene requirements, and product guidance.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Free-text search query' },
        product_type: { type: 'string', description: 'Filter by product type (e.g. dairy, eggs, meat)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
        limit: { type: 'number', description: 'Max results (default: 20, max: 50)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_requirements',
    description: 'Get food safety requirements for a specific product by sales channel. Returns registration, approval, temperature, traceability, and labelling requirements.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        product: { type: 'string', description: 'Product ID or name (e.g. raw-milk, eggs, honey)' },
        sales_channel: { type: 'string', description: 'Sales channel: farm_gate, farmers_market, retail, online' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['product'],
    },
  },
  {
    name: 'get_traceability_rules',
    description: 'Get traceability requirements for a product type. Returns record-keeping obligations, retention periods, and one-step-back-one-step-forward rules.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        product_type: { type: 'string', description: 'Product type (e.g. dairy, eggs, meat, honey)' },
        species: { type: 'string', description: 'Animal species if applicable (e.g. cattle, sheep, poultry)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['product_type'],
    },
  },
  {
    name: 'check_direct_sales_rules',
    description: 'Check rules for selling food directly from farm gate, farmers market, or online. Covers registration, exemptions, and volume thresholds.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        product: { type: 'string', description: 'Product ID or name (e.g. eggs, honey, baked-goods)' },
        sales_method: { type: 'string', description: 'Sales method: farm_gate, farmers_market, online' },
        volume: { type: 'string', description: 'Production volume description for exemption checks' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['product'],
    },
  },
  {
    name: 'get_labelling_requirements',
    description: 'Get mandatory labelling fields for a product. Returns both general pre-packed requirements and product-specific rules (e.g. egg stamps, honey origin).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        product: { type: 'string', description: 'Product name or type (e.g. eggs, honey, meat-beef)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['product'],
    },
  },
  {
    name: 'get_assurance_scheme_requirements',
    description: 'Get details on UK farm assurance schemes: Red Tractor, RSPCA Assured, Soil Association, SALSA, QMS. Standards, audit frequency, costs.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        scheme: { type: 'string', description: 'Scheme name or ID (e.g. red-tractor, salsa)' },
        product_type: { type: 'string', description: 'Filter schemes by product type' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
    },
  },
  {
    name: 'get_hygiene_requirements',
    description: 'Get hygiene and HACCP requirements for a food business activity. Covers registration, temperature controls, cleaning, and staff training.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        activity: { type: 'string', description: 'Food business activity (e.g. dairy processing, baking, butchery, market stall)' },
        premises_type: { type: 'string', description: 'Premises type (e.g. farm shop, commercial kitchen, mobile)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
      required: ['activity'],
    },
  },
  {
    name: 'check_raw_milk_rules',
    description: 'Check raw (unpasteurised) milk sale rules by UK devolved administration. CRITICAL: England=permitted (restricted), Scotland=BANNED, Wales=permitted (restricted), Northern Ireland=PROHIBITED.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        country: { type: 'string', description: 'Devolved administration: England, Scotland, Wales, Northern Ireland' },
        sales_method: { type: 'string', description: 'Intended sales method (e.g. farm gate, farmers market, retail)' },
        jurisdiction: { type: 'string', description: 'ISO 3166-1 alpha-2 code (default: GB)' },
      },
    },
  },
];

function textResult(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message: string) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }], isError: true };
}

function registerTools(server: Server, db: Database): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    try {
      switch (name) {
        case 'about':
          return textResult(handleAbout());
        case 'list_sources':
          return textResult(handleListSources(db));
        case 'check_data_freshness':
          return textResult(handleCheckFreshness(db));
        case 'search_food_safety':
          return textResult(handleSearchFoodSafety(db, SearchArgsSchema.parse(args)));
        case 'get_product_requirements':
          return textResult(handleGetProductRequirements(db, ProductRequirementsArgsSchema.parse(args)));
        case 'get_traceability_rules':
          return textResult(handleGetTraceabilityRules(db, TraceabilityArgsSchema.parse(args)));
        case 'check_direct_sales_rules':
          return textResult(handleCheckDirectSalesRules(db, DirectSalesArgsSchema.parse(args)));
        case 'get_labelling_requirements':
          return textResult(handleGetLabellingRequirements(db, LabellingArgsSchema.parse(args)));
        case 'get_assurance_scheme_requirements':
          return textResult(handleGetAssuranceSchemeRequirements(db, AssuranceArgsSchema.parse(args)));
        case 'get_hygiene_requirements':
          return textResult(handleGetHygieneRequirements(db, HygieneArgsSchema.parse(args)));
        case 'check_raw_milk_rules':
          return textResult(handleCheckRawMilkRules(db, RawMilkArgsSchema.parse(args)));
        default:
          return errorResult(`Unknown tool: ${name}`);
      }
    } catch (err) {
      return errorResult(err instanceof Error ? err.message : String(err));
    }
  });
}

const db = createDatabase();
const sessions = new Map<string, { transport: StreamableHTTPServerTransport; server: Server }>();

function createMcpServer(): Server {
  const mcpServer = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
  );
  registerTools(mcpServer, db);
  return mcpServer;
}

async function handleMCPRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    await session.transport.handleRequest(req, res);
    return;
  }

  if (req.method === 'GET' || req.method === 'DELETE') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid or missing session ID' }));
    return;
  }

  const mcpServer = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  await mcpServer.connect(transport);

  transport.onclose = () => {
    if (transport.sessionId) {
      sessions.delete(transport.sessionId);
    }
    mcpServer.close().catch(() => {});
  };

  await transport.handleRequest(req, res);

  if (transport.sessionId) {
    sessions.set(transport.sessionId, { transport, server: mcpServer });
  }
}

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  if (url.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', server: SERVER_NAME, version: SERVER_VERSION }));
    return;
  }

  if (url.pathname === '/mcp' || url.pathname === '/') {
    try {
      await handleMCPRequest(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }));
      }
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

httpServer.listen(PORT, () => {
  console.log(`${SERVER_NAME} v${SERVER_VERSION} listening on port ${PORT}`);
});
