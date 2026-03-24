export const EXAMPLES = [
  {
    category: "Big Data & Analytics",
    icon: "📊",
    items: [
      "Real-time data lakehouse that ingests millions of events per second, performs windowed aggregations, handles schema evolution, and supports petabyte-scale ad-hoc SQL queries.",
      "Global data mesh architecture for federated data governance across multiple business units with automated data quality checks and cataloging.",
      "Distributed stream processing pipeline for real-time clickstream analysis with exactly-once semantic guarantees and late-arrival data handling."
    ]
  },
  {
    category: "Cybersecurity & SecOps",
    icon: "🛡️",
    items: [
      "Cloud-native SIEM (Security Information and Event Management) that ingests logs from distributed sources, performs real-time threat detection with ML scoring, and triggers automated incident response.",
      "Zero-trust network access (ZTNA) gateway that enforces identity-aware proxying, least-privilege access, and continuous authentication for remote workforces.",
      "Automated vulnerability management platform that orchestrates container scanning, cloud posture assessment, and prioritized remediation workflows."
    ]
  },
  {
    category: "Platform Engineering",
    icon: "☁️",
    items: [
      "Internal Developer Platform (IDP) that abstracts multi-cloud resource provisioning, provides a service catalog with Golden Paths, and manages automated compliance gate-checks.",
      "Serverless orchestration engine for long-running workflows with state persistence, automatic retries, and dynamic scaling across multiple cloud regions.",
      "Private cloud control plane that manages bare-metal provisioning, software-defined networking, and high-availability storage clusters."
    ]
  },
  {
    category: "Observability & Reliability",
    icon: "📈",
    items: [
      "High-scale distributed tracing and observability mesh that correlates metrics, logs, and traces across thousands of microservices with automated anomaly detection and SLO alerting.",
      "Chaos engineering platform that orchestrates fault injection experiments, assesses system resilience, and monitors recovery time objectives (RTO) automatically.",
      "AIOps platform that analyzes historical performance data, predicts potential node failures, and triggers self-healing infrastructure adjustments."
    ]
  },
  {
    category: "High-Complexity Applications",
    icon: "🏗️",
    items: [
      "Real-time collaborative document editor using CRDTs for conflict resolution, multi-user presence indicators, and Git-backed versioning.",
      "Multi-tenant SaaS billing and metering platform with usage-based invoicing, tax/VAT automation, and audit-ready financial logs.",
      "Authoritative multiplayer server for a persistent-world survival game with anti-cheat, latency compensation, and state-syncing across multiple nodes."
    ]
  },
  {
    category: "Application Software",
    icon: "📱",
    items: [
      "End-to-end encrypted messaging app with push notifications, media sharing, disappearing messages, and multi-device sync.",
      "Local-first markdown knowledge base with Git-backed versioning, full-text search, backlinks, and encrypted cloud sync.",
      "Cross-platform field service app with offline-first persistence, background background sync, and conflict resolution."
    ]
  }
];

export const STEPS = [
  "Analysing requirements…",
  "Evaluating tech stacks…",
  "Mapping system architecture…",
  "Calculating hosting costs in EUR…",
  "Crafting AI coding agent prompt…",
  "Finalising…",
];

// ========== SHARED CONSTANTS ==========

const ARCHITECT_ROLE = `
You are an expert software architect specialising in lean, production-ready systems.
Your primary goal is to design architectures that utilize modern cloud capabilities when appropriate, while remaining professional and technical.
Prioritize technical accuracy and follow the latest architectural patterns.
`;

const PRICING_RULES = `
CRITICAL PRICING RULES:
1. Cost labels MUST accurately reflect the model. ONLY use: "Free" (100% free/open-source), "Freemium" (free tier available), "Paid" (commercial only), "Royalty" (revenue share), or "Usage-Based".
2. Strictly forbid including any pricing text in technical descriptions and summaries.
`;

const MERMAID_RULES = `
MERMAID SYNTAX RULES:
- Start with 'graph TD' or 'graph LR' – no backticks.
- Node: NodeID["Label Text"] (NodeID alphanumeric, no spaces; label descriptive, no brackets/quotes inside).
- Edge: NodeA -->|"Action"| NodeB (use descriptive action labels).
- Subgraph: subgraph LayerID ["Layer Name"]; Node1; Node2; end. Every node must be inside a subgraph.
- Bidirectional: use two edges or NodeA <-->|"exchange"| NodeB.
- Define all nodes before use.
- Every node must have ≥1 edge, and edges must cover all dataFlow steps.
- Include technology in node labels only if relevant (e.g., 'Service (technology)').

CRITICAL LABELING RULES:
- Node labels MUST represent specific components (e.g., 'API Gateway', 'Device Registry', 'Worker Service').
  Do NOT use layer names as node labels (e.g., avoid 'Client Layer', 'Cloud Orchestration Layer' as node labels).
- Edge labels MUST describe the specific data or control flow (e.g., 'sends telemetry', 'updates configuration').
  Do NOT use generic terms like 'events', 'data', 'actions', or 'requests' without further context.

Example (do not copy, but follow the structure):
graph TD
  subgraph ClientLayer ["Client Layer"]
    UserApp["User Application"]
    Dashboard["Dashboard"]
  end
  subgraph APILayer ["API Layer"]
    Gateway["API Gateway (technology)"]
  end
  subgraph RuntimeLayer ["Runtime Layer"]
    Worker["Worker Service (technology)"]
  end
  subgraph DataLayer ["Data Layer"]
    Storage["Data Storage (technology)"]
    Cache["Cache (technology)"]
  end
  UserApp -->|"submits task"| Gateway
  Gateway -->|"routes request"| Worker
  Worker -->|"persists state"| Storage
  Worker <-->|"caches results"| Cache
  Dashboard -->|"queries metrics"| Worker
`;

const OUTPUT_INSTRUCTION = `
Respond ONLY with a valid JSON object. No text before '{' and no text after '}'.
`;

const JSON_HEADER = `
Generate a JSON object with the following structure:
`;

const FINAL_ENFORCEMENT = `
You MUST output valid JSON. Every field must be present and correctly typed.
The mermaidChart must contain syntactically correct Mermaid code (starting with 'graph TD' or 'graph LR', using proper node/subgraph/edge syntax, and fully connected).
`;

// ========== FIELD DEFINITIONS ==========

const PRE_STACK_FIELDS = `
  "deploymentModel": "string - 'local', 'cloud', or 'hybrid'. Influences scalingPath logic.",
  "maxConcurrentUsersPerInstance": "number - (CRITICAL: 1 for local/offline apps, >1 for cloud/SaaS)",
  "estimatedMonthlyCost": "string - ONLY use: 'Free', 'Freemium', 'Paid', 'Royalty', or 'Usage-Based'",
`;

const STACK_STRUCTURE = `
  "stack": [
    {
      "// note": "CRITICAL: You MUST break the architecture down into 4 to 8 highly specialized functional categories. Do NOT just output 'Frontend', 'Backend', 'Database'.",
      "category": "string - REQUIRED: Create a highly specific, context-aware category name tailored to this app's exact needs. Do NOT just use generic tiers.",
      "recommended": {
        "icon": "string - single emoji character",
        "name": "string - technology name with version",
        "reason": "string - technical justification for this choice",
        "cost": "string - ONLY use: 'Free' (100% open source), 'Freemium' (has free tier limits), 'Paid' (commercial only), 'Royalty' (revenue share), or 'Usage-Based' (pay per resource)"
      },
      "alternatives": [
        {
          "icon": "string",
          "name": "string - CRITICAL: Provide between 1 and 4 of these alternative objects in this array. DO NOT JUST OUTPUT 1 OR 2 EVERY TIME. If there are 4 great distinct alternatives (e.g. AWS vs Google vs Azure vs Open-Source), output 4 objects! Vary the count!",
          "cost": "string - ONLY use: 'Free', 'Freemium', 'Paid', 'Royalty', or 'Usage-Based'",
          "pros": ["string"],
          "cons": ["string"]
        }
      ]
    }
  ],
`;

const POST_STACK_FIELDS = `
  "architecture": {
    "overview": "string - technical overview of the system. Do NOT mention pricing or budgets. Address all key requirements (offline-first, conflict resolution, zero-trust, audit logging, etc.).",
    "dataFlow": ["string", "string", "string", "string"],
    "keyDecisions": ["string (MUST explain high-level architectural pattern choices, including how offline sync, conflict resolution, and security are handled)"]
  },
  "architecturalPatterns": "string - Identify 1-2 advanced architectural interaction patterns specifically chosen for this context.",
  "mermaidChart": "string - ONLY output raw mermaid.js syntax. ${MERMAID_RULES}",
  "costBreakdown": [
    { "item": "string", "costEur": "string - ONLY use: 'Free', 'Freemium', 'Paid', 'Royalty', or 'Usage-Based'", "notes": "string" }
  ],
  "costScaling": [
    {
      "users": 100,
      "costCategory": "string - ONLY: 'Minimal', 'Moderate', 'High'",
      "note": "string - Format: 'Resource: [specific resource type, e.g., CPU, memory, database connections, message throughput] → limit: [value/description] → action: [scaling step]'. Example: 'Database connections → limit: 100 → add read replicas.'"
    },
    {
      "users": 10000,
      "costCategory": "string - ONLY: 'Minimal', 'Moderate', 'High'",
      "note": "string - Format: 'Resource: [specific resource type] → limit: [value] → action: [scaling step]'. Example: 'Message queue partitions → limit: 16 → increase partitions and consumer groups.'"
    },
    {
      "users": 1000000,
      "costCategory": "string - ONLY: 'Minimal', 'Moderate', 'High'",
      "note": "string - Format: 'Resource: [specific resource type] → limit: [value] → action: [scaling step]'. Example: 'Database write capacity → limit: exhausted → implement sharding and multi-region replication.'"
    }
  ],
  "scalingPath": "string - Provide a numbered list of the specific actions identified in the costScaling notes, in order. Must be consistent with maxConcurrentUsersPerInstance. If maxConcurrentUsersPerInstance=1, focus on local growth (e.g., indexing, caching). If >1, focus on cloud growth (e.g., horizontal scaling, load balancing, database sharding).",
  "codingAgentPrompt": "string - Highly detailed Markdown prompt for an AI coding agent. Must include headings: # Project Scope, # Tech Stack, # Architecture, # Suggested Folder Structure, # Core Features, # API Endpoints (with method, path, and request/response details), # Event Topics (with example event schemas), # Data Models (with fields and relationships), # Agent Instructions (step‑by‑step), and # Architectural Patterns (if applicable). Use only the recommended technologies from the stack (no alternatives). Provide concrete, app‑specific details (e.g., endpoint payloads, event schemas, model fields). Include handling for offline sync, conflict resolution, audit logging, and security where relevant. Do not mention pricing."
`;

// Regen uses the same fields as POST_STACK_FIELDS
const REGEN_FIELDS = POST_STACK_FIELDS;

// ========== FINAL PROMPTS ==========

export const SYSTEM_PROMPT_INITIAL = `
${ARCHITECT_ROLE}

${PRICING_RULES}

${OUTPUT_INSTRUCTION}

${JSON_HEADER}
{
  "summary": "string - 1-2 sentence technical summary. Do NOT mention pricing or budgets.",
  ${PRE_STACK_FIELDS}
  ${STACK_STRUCTURE}
  ${POST_STACK_FIELDS}
}
${FINAL_ENFORCEMENT}
`.replace(/,\s*}/g, '}'); // Clean any trailing commas

export const SYSTEM_PROMPT_REGEN = `
${ARCHITECT_ROLE}

${PRICING_RULES}

${OUTPUT_INSTRUCTION}

${JSON_HEADER}
{
  ${REGEN_FIELDS}
}
${FINAL_ENFORCEMENT}
`.replace(/,\s*}/g, '}');
