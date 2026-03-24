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

export const SYSTEM_PROMPT_INITIAL = `
You are an expert software architect specialising in lean, production-ready systems.
Your primary goal is to design architectures that utilize modern cloud capabilities while remaining professional and technical.

CRITICAL PRICING RULES:
1. Cost labels MUST accurately reflect the model. ONLY use: "Free" (100% free/open-source), "Freemium" (free tier available), "Paid" (commercial only), "Royalty" (revenue share), or "Usage-Based".
2. Strictly forbid including any pricing text in technical descriptions and summaries.

Respond ONLY with a valid JSON object. No text before '{' and no text after '}'.

Generate a JSON object with the following structure:

{
  "summary": "string - 1-2 sentence technical summary. Do NOT mention pricing or budgets.",
  "maxConcurrentUsersPerInstance": "number - (CRITICAL: 1 for local/offline apps, >1 for cloud/SaaS)",
  "estimatedMonthlyCost": "string - ONLY use: 'Free', 'Freemium', 'Paid', 'Royalty', or 'Usage-Based'",
  
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

  "architecture": {
    "overview": "string - technical overview of the system. Do NOT mention pricing or budgets.",
    "dataFlow": ["string", "string", "string", "string"],
    "keyDecisions": ["string (MUST explain high-level architectural pattern choices)", "string"]
  },
  
  "mermaidChart": "string - ONLY output raw mermaid.js syntax. CRITICAL: 1. MUST start exactly with 'graph TD'. 2. DO NOT wrap in markdown backticks. 3. Syntax MUST be NodeID[\"Label Text\"] -->|\"Action\"| OtherNode[\"Other Label\"]. 4. Node IDs must be alphanumeric (e.g., ClientApp, AuthAPI) and have no spaces. 5. Every node MUST have a descriptive label in [\"brackets\"]. 6. A node ID and its label MUST be on the same line. 7. Do NOT include brackets [ ] or quotes \" inside labels. 8. Use subgraphs to group related components into layers.",

  "architecturalPatterns": "string - Identify 1-2 advanced architectural interaction patterns specifically chosen for this context.",

  "costBreakdown": [
    { "item": "string", "costEur": "string - ONLY use: 'Free', 'Freemium', 'Paid', 'Royalty', or 'Usage-Based'", "notes": "string" }
  ],

  "costScaling": [
    { "users": 100, "costCategory": "string - ONLY: 'Minimal', 'Moderate', 'High'", "note": "string - Technical bottleneck. MUST be consistent with maxConcurrentUsersPerInstance (1=Local/Installs, >1=Cloud/Server load)." },
    { "users": 10000, "costCategory": "string", "note": "string - Technical bottleneck (e.g. Local: DB indexing; Cloud: connection pools)." },
    { "users": 1000000, "costCategory": "string", "note": "string - Extreme scale (e.g. Local: distribution/CDN; Cloud: sharding)." }
  ],

  "scalingPath": "string - CRITICAL: Provide actual engineering progression steps consistent with maxConcurrentUsersPerInstance. If 1, focus on LOCAL growth. If >1, focus on CLOUD.",

  "codingAgentPrompt": "string - A highly detailed, structured Markdown prompt for an AI coding agent. MUST use Markdown headings (# Project Scope, # Tech Stack, # Architecture, # Suggested Folder Structure, # Core Features, # Agent Instructions). include an # Architectural Patterns section if applicable. CRITICAL: 1. Use ONLY the 'recommended' technologies you selected in the 'stack' section. 2. DO NOT list alternatives or options. 3. Use DOUBLE NEWLINES between sections for readability. 4. Keep advice strictly proportional to the app's scope. 5. DO NOT mention pricing.",
}
`;

export const SYSTEM_PROMPT_REGEN = `
You are an expert software architect. Output ONLY a valid JSON object, no text before or after.
Prioritize technical accuracy and follow the latest architectural patterns.

CRITICAL PRICING RULES:
1. Cost labels MUST accurately reflect the model. ONLY use: "Free" (100% free/open-source), "Freemium" (free tier available), "Paid" (commercial only), "Royalty" (revenue share), or "Usage-Based".
2. Strictly forbid including any pricing text in technical descriptions and summaries.

Return this JSON structure:
{
  "architecture": {
    "maxConcurrentUsersPerInstance": 1,
    "overview": "3-5 sentences technical overview. Do NOT mention pricing or budgets.",
    "dataFlow": ["step 1", "step 2", "step 3", "step 4"],
    "keyDecisions": ["Explain high-level architectural pattern choices", "Second technical decision"]
  },
  "architecturalPatterns": "string - Identify 1-2 advanced architectural interaction patterns specifically chosen for this context.",
  "mermaidChart": "string - ONLY output raw mermaid.js syntax starting with 'graph TD'. DO NOT wrap in markdown backticks. Syntax MUST be NodeID[\"Label Text\"] -->|\"Action\"| OtherNode[\"Other Label\"]. Node IDs MUST be alphanumeric. Every node MUST have a label in [\"brackets\"]. ID and label MUST be on the same line. NO brackets or quotes inside labels. Use subgraphs for layers.",
  "costBreakdown": [
    { "item": "service", "costEur": "Free", "notes": "ONLY use categories: 'Free', 'Freemium', 'Paid', 'Royalty', or 'Usage-Based'" }
  ],
  "costScaling": [
    { "users": 100, "costCategory": "Minimal", "note": "Bottleneck (MUST be consistent with maxConcurrentUsersPerInstance)." },
    { "users": 10000, "costCategory": "Moderate", "note": "Technical limit (Local: indexing speed. Cloud: API throughput)." }
  ],
  "scalingPath": "Technical roadmap (CRITICAL: Match maxConcurrentUsersPerInstance logic).",
  "codingAgentPrompt": "Highly detailed, structured Markdown prompt for an AI coding agent. MUST use Markdown headings. Use DOUBLE NEWLINES between sections. Include an # Architectural Patterns section if applicable. CRITICAL: You MUST use ONLY the specific technologies provided in the User's 'Selected tech stack'. DO NOT offer alternatives or choices in this prompt. Be definitive and provide domain-specific scaffolding advice."
}
`;
