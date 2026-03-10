import { useState, useRef, useEffect, useCallback } from "react";

const EXAMPLES = [
  "A HIPAA-compliant telehealth platform enabling real-time video consultations, secure messaging, electronic health records integration, and automated insurance claim processing with end-to-end encryption and audit logging",
  "An algorithmic high-frequency trading system that processes market data streams in sub-millisecond latency, executes orders across multiple exchanges, and includes real-time risk checks and position management",
  "A blockchain-based supply chain traceability platform for pharmaceutical cold chains, with IoT sensor integration, tamper-proof audit trails, smart contract automation, and regulatory compliance reporting",
  "A federated learning platform for healthcare institutions to collaboratively train ML models on distributed patient data without centralizing sensitive information, with differential privacy and secure aggregation",
  "A real-time collaborative CAD system for engineering teams, featuring WebAssembly-powered 3D rendering, CRDT-based conflict-free replication, version control for binary assets, and offline sync",
  "A livestream shopping platform supporting 100K+ concurrent viewers with sub-second latency, featuring interactive polls, real-time inventory sync, fraud detection, and dynamic ad insertion",
  "A carbon accounting API that ingests data from ERP systems, calculates Scope 1-3 emissions using ML-based estimation models, generates audit-ready reports, and integrates with carbon credit marketplaces",
  "A drone fleet management system for emergency response, with real-time telemetry processing, no-fly zone enforcement, computer vision for obstacle avoidance, and mesh network communication",
  "A decentralized identity verification platform using zero-knowledge proofs, supporting biometric verification, government ID scanning, and reusable KYC credentials across multiple financial services",
  "An AI-powered legal document automation system that extracts clauses from contracts, suggests revisions based on jurisdiction, maintains version history with cryptographic signing, and integrates with e-signature platforms"
];

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ animation: "spin 0.9s linear infinite", flexShrink: 0 }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// ─── JSON extractor ───────────────────────────────────────────────────────────
function extractJSON(raw) {
  if (!raw) return null;
  const tryParse = s => {
    s = s.trim().replace(/,(\s*[}\]])/g, "$1");
    return JSON.parse(s);
  };
  const attempts = [
    () => tryParse(raw),
    () => { const m = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/); if (!m) throw 0; return tryParse(m[1]); },
    () => { const f = raw.indexOf("{"), l = raw.lastIndexOf("}"); if (f < 0 || l <= f) throw 0; return tryParse(raw.slice(f, l + 1)); },
    () => { const c = raw.split("\n").filter(x => !x.trim().startsWith("```")).join("\n"); const f = c.indexOf("{"), l = c.lastIndexOf("}"); if (f < 0 || l <= f) throw 0; return tryParse(c.slice(f, l + 1)); },
  ];
  for (const fn of attempts) { try { return fn(); } catch { } }
  return null;
}

// ─── Small components ─────────────────────────────────────────────────────────
function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2200); }}
      style={{ display: "flex", alignItems: "center", gap: "5px", background: copied ? "#f0faf4" : "#f5f5f7", border: `1px solid ${copied ? "#86efac" : "#e0e0e6"}`, color: copied ? "#16a34a" : "#666", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.18s", fontWeight: 500, whiteSpace: "nowrap" }}>
      {copied ? <CheckIcon /> : <CopyIcon />}{copied ? "Copied!" : label}
    </button>
  );
}

function Section({ title, badge, children, accentColor = "#2563eb", updating }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: "1px solid #e8e8ee", borderRadius: "12px", overflow: "hidden", marginBottom: "14px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0 18px", borderBottom: open ? "1px solid #f0f0f4" : "none" }}>
        <button onClick={() => setOpen(o => !o)} style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "14px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", minWidth: 0 }}>
          <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", background: accentColor + "14", color: accentColor, border: `1px solid ${accentColor}30`, padding: "2px 9px", borderRadius: "4px", letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>{badge}</span>
          <span style={{ color: "#111", fontWeight: 600, fontSize: "14px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
          <span style={{ color: "#bbb", flexShrink: 0 }}><ChevronIcon open={open} /></span>
        </button>
        {updating && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "12px", flexShrink: 0, color: accentColor, fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
            <SpinnerIcon /> Updating…
          </div>
        )}
      </div>
      {open && <div style={{ padding: "0 18px 20px" }}>{children}</div>}
    </div>
  );
}

// ─── Stack Option Card ────────────────────────────────────────────────────────
function OptionCard({ icon, name, cost, reason, pros, cons, isSelected, isRecommended, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      background: isSelected ? "#f0f6ff" : "#fff",
      border: `2px solid ${isSelected ? "#2563eb" : "#e8e8ee"}`,
      borderRadius: "10px", padding: "12px", cursor: "pointer",
      transition: "all 0.16s ease",
      boxShadow: isSelected ? "0 0 0 3px #2563eb14" : "none",
      display: "flex", flexDirection: "column", gap: "6px",
      minWidth: 0, overflow: "hidden",
    }}>
      {/* Top row: icon + badges */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", minWidth: 0 }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon || "🔧"}</span>
          {isRecommended && (
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", padding: "1px 5px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>Top pick</span>
          )}
        </div>
        {cost && (
          <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "#16a34a", background: "#f0faf4", border: "1px solid #bbf7d0", padding: "1px 6px", borderRadius: "4px", fontWeight: 600, flexShrink: 1, whiteSpace: "wrap" }}>{cost}</span>
        )}
      </div>

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: "12.5px", color: "#111", lineHeight: "1.3", wordBreak: "break-word" }}>{name}</div>

      {/* Reason (recommended) */}
      {reason && <p style={{ fontSize: "11.5px", color: "#666", margin: 0, lineHeight: "1.5" }}>{reason}</p>}

      {/* Pros/Cons (alternatives) */}
      {(pros || cons) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {(pros || []).map((p, i) => (
            <div key={`p${i}`} style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
              <span style={{ color: "#16a34a", fontSize: "11px", flexShrink: 0, marginTop: "1px", fontWeight: 700 }}>+</span>
              <span style={{ fontSize: "11.5px", color: "#444", lineHeight: "1.4" }}>{p}</span>
            </div>
          ))}
          {(cons || []).map((c, i) => (
            <div key={`c${i}`} style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
              <span style={{ color: "#dc2626", fontSize: "11px", flexShrink: 0, marginTop: "1px", fontWeight: 700 }}>−</span>
              <span style={{ fontSize: "11.5px", color: "#888", lineHeight: "1.4" }}>{c}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StackCategoryRow({ category, recommended, alternatives, selectedIdx, onSelect, minCardWidth }) {
  const alts = alternatives || [];
  return (
    <div style={{ background: "#fafafa", border: "1px solid #e8e8ee", borderRadius: "12px", padding: "14px", marginBottom: "12px", overflow: "hidden" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: "#aaa", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>{category}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`, gap: "8px" }}>
        <OptionCard icon={recommended.icon} name={recommended.name} cost={recommended.cost} reason={recommended.reason} isSelected={selectedIdx === -1} isRecommended onSelect={() => onSelect(-1)} />
        {alts.map((alt, i) => (
          <OptionCard key={i} icon={alt.icon} name={alt.name} cost={alt.cost} pros={alt.pros} cons={alt.cons} isSelected={selectedIdx === i} onSelect={() => onSelect(i)} />
        ))}
      </div>
    </div>
  );
}

// ─── Cost Table ───────────────────────────────────────────────────────────────
function CostScalingTable({ costScaling, costBreakdown }) {
  return (
    <div style={{ marginTop: "14px" }}>
      {costScaling && costScaling.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Cost scaling (EUR / month)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px" }}>
            {costScaling.map((tier, i) => (
              <div key={i} style={{ background: "#f9fafb", border: "1px solid #e8e8ee", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#aaa", fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px", textTransform: "uppercase" }}>
                  {tier.users >= 1000000 ? `${tier.users / 1000000}M` : tier.users >= 1000 ? `${tier.users / 1000}k` : tier.users} users
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: tier.eurPerMonth === 0 ? "#16a34a" : "#111", letterSpacing: "-0.03em", wordBreak: "break-word" }}>
                  {tier.eurPerMonth === 0 ? "Free" : `€${tier.eurPerMonth}`}
                </div>
                {tier.note && <div style={{ fontSize: "10px", color: "#bbb", marginTop: "4px", lineHeight: "1.4" }}>{tier.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {costBreakdown && costBreakdown.length > 0 && (
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Per-service breakdown</div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "400px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f4" }}>
                  {["Service", "Cost (EUR)", "Free until"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "#aaa", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {costBreakdown.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f4f4f7" }}>
                    <td style={{ padding: "9px 10px", color: "#222", fontWeight: 500, wordBreak: "break-word" }}>{row.item}</td>
                    <td style={{ padding: "9px 10px", whiteSpace: "nowrap" }}>
                      <span style={{ color: "#16a34a", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700 }}>{row.costEur || row.cost}</span>
                    </td>
                    <td style={{ padding: "9px 10px", color: "#888", fontSize: "12px" }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Loading overlay for sections ─────────────────────────────────────────────
function SectionSkeleton({ color = "#7c3aed" }) {
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {[80, 60, 90, 50].map((w, i) => (
        <div key={i} style={{ height: "12px", borderRadius: "6px", background: `${color}10`, width: `${w}%`, animation: "shimmer 1.4s ease-in-out infinite", animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const width = useWidth();
  const stackCols = width < 500 ? 1 : 2;

  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("archgen_groq_key") || "";
    return "";
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);       // initial full result, stack stays here
  const [dynData, setDynData] = useState(null);     // architecture/cost/scaling/prompt — updates on stack change
  const [updating, setUpdating] = useState(false);  // true while regenerating after stack switch
  const [error, setError] = useState(null);
  const [rawError, setRawError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [stackSelections, setStackSelections] = useState({});
  const [committedSelections, setCommittedSelections] = useState({});
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const resultRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("archgen_groq_key", apiKey);
    }
  }, [apiKey]);

  const steps = [
    "Analysing requirements…",
    "Evaluating tech stacks…",
    "Mapping system architecture…",
    "Calculating hosting costs in EUR…",
    "Crafting AI coding agent prompt…",
    "Finalising…",
  ];

  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const iv = setInterval(() => setLoadingStep(s => (s + 1) % steps.length), 2000);
    return () => clearInterval(iv);
  }, [loading]);

  // Build stack summary string from selections
  const getStackSummary = (res, sels) => {
    if (!res?.stack) return "";
    return res.stack.map((cat, i) => {
      const idx = sels[i] ?? -1;
      const item = idx === -1 ? cat.recommended : cat.alternatives?.[idx];
      return item ? `${cat.category}: ${item.name}` : null;
    }).filter(Boolean).join("\n");
  };

  // Regenerate everything except the stack picker itself
  const regenerateAll = useCallback(async (res, sels) => {
    if (!res) return;
    // Cancel any in-flight regen
    if (abortRef.current) abortRef.current = false;
    const token = {};
    abortRef.current = token;
    setUpdating(true);

    const stackSummary = getStackSummary(res, sels);

    const systemPrompt = `You are an expert software architect. Output ONLY a valid JSON object, no text before or after.

Return this JSON structure:
{
  "architecture": {
    "overview": "3-5 sentences on how this specific stack fits together",
    "dataFlow": ["step 1", "step 2", "step 3", "step 4"],
    "keyDecisions": ["decision with rationale", "decision 2"]
  },
  "costBreakdown": [
    { "item": "service", "costEur": "€0/mo", "notes": "free until..." }
  ],
  "costScaling": [
    { "users": 100, "eurPerMonth": 0, "note": "all free tiers" },
    { "users": 1000, "eurPerMonth": 8, "note": "DB compute kicks in" },
    { "users": 10000, "eurPerMonth": 45, "note": "upgrade DB + bandwidth" },
    { "users": 100000, "eurPerMonth": 280, "note": "dedicated infra needed" }
  ],
  "scalingPath": "What to upgrade first and when, specific to this stack",
  "codingAgentPrompt": "codingAgentPrompt": "350-450 word prompt for Claude Code/Cursor. Be concise but complete: stack with exact versions, folder structure, key features, DB schema outline, API routes, auth approach, env vars list, build order."
  }`;

    try {
      if (!apiKey) throw new Error("Please enter your Groq API key in the top right corner.");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `App: ${description}\n\nSelected tech stack:\n${stackSummary}\n\nGenerate architecture, costs, scaling path and coding prompt for this exact stack. Output ONLY a valid JSON object.` }
          ]
        })
      });
      if (token !== abortRef.current) return; // superseded
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || "API Request Failed");
      }
      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "";
      const parsed = extractJSON(raw);
      if (parsed && token === abortRef.current) {
        setDynData(parsed);
      }
    } catch { }
    finally {
      if (token === abortRef.current) setUpdating(false);
    }
  }, [description]);


  // True if current selections differ from last committed ones
  const selectionsChanged = (current, committed, stackLen) => {
    for (let i = 0; i < stackLen; i++) {
      if ((current[i] ?? -1) !== (committed[i] ?? -1)) return true;
    }
    return false;
  };

  const handleSelect = (catIdx, altIdx) => {
    setStackSelections(prev => {
      const next = { ...prev, [catIdx]: altIdx };
      setHasPendingChanges(selectionsChanged(next, committedSelections, result?.stack?.length || 0));
      return next;
    });
  };

  const handleUpdateSections = () => {
    setHasPendingChanges(false);
    setCommittedSelections({ ...stackSelections });
    regenerateAll(result, stackSelections);
  };

  const handleGenerate = async () => {
    if (!description.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setDynData(null);
    setError(null);
    setRawError(null);
    setStackSelections({});
    setCommittedSelections({});
    setHasPendingChanges(false);

const systemPrompt = `
You are an expert software architect specialising in cost‑effective, production‑ready systems.
Respond ONLY with a valid JSON object. No text before '{' and no text after '}'.

Generate a JSON object with the following structure:

{
  "summary": "string - 1-2 sentence summary",
  "estimatedMonthlyCost": "string - e.g. €0-15/mo",
  
  "stack": [
    {
      "category": "string - e.g. Frontend, Backend, Database, Hosting",
      "recommended": {
        "icon": "string - single emoji character",
        "name": "string - technology name with version",
        "reason": "string - 2-3 sentences explaining why this is best",
        "cost": "string - pricing summary"
      },
      "alternatives": [
        // Include a VARIABLE number of popular, production-proven alternatives.
        // The number should reflect what's actually used in the industry today.
        // Some categories have many popular options, others have fewer.
        // Let the market reality dictate the count - never default to a fixed number.
        
        // Each alternative's pros/cons should reflect genuine technical and business tradeoffs.
        // The number of pros and cons should vary naturally based on real strengths/weaknesses.
        // Never pad with weak points just to make counts even.
      ]
    }
  ],

  "architecture": {
    "overview": "string - 3-5 sentences",
    "dataFlow": ["string", "string", "string", "string"],
    "keyDecisions": ["string", "string"]
  },

  "costBreakdown": [
    { "item": "string", "costEur": "string", "notes": "string" }
  ],

  "costScaling": [
    { "users": number, "eurPerMonth": number, "note": "string" }
  ],

  "scalingPath": "string - detailed roadmap",

  "codingAgentPrompt": "string - 350-450 word prompt"
}

IMPORTANT:
- The number of alternatives should vary based on what's actually popular in the industry today
- The number of pros and cons for each alternative should vary naturally
- Never default to exactly 2 alternatives
- Never default to exactly 2 pros and 2 cons
- Include only genuinely viable, production-proven options
`;

    try {
      if (!apiKey) throw new Error("Please enter your Groq API key in the top right corner.");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Design cost-effective production architecture for: ${description}. Output ONLY a valid JSON object.` }
          ]
        }),
      });
      if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e?.error?.message || `API error ${response.status}`); }
      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content || "";
      const parsed = extractJSON(rawText);
      console.log('API response stack:', parsed?.stack);
      if (!parsed) { setRawError(rawText.slice(0, 2000)); throw new Error("Could not parse response as JSON. See raw output below."); }
      setResult(parsed);
      setDynData({
        architecture: parsed.architecture,
        costBreakdown: parsed.costBreakdown,
        costScaling: parsed.costScaling,
        scalingPath: parsed.scalingPath,
        codingAgentPrompt: parsed.codingAgentPrompt,
      });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Active dynamic data (falls back to result on first load)
  const arch = dynData?.architecture;
  const costBreakdown = dynData?.costBreakdown;
  const costScaling = dynData?.costScaling;
  const scalingPath = dynData?.scalingPath;
  const codingPrompt = dynData?.codingAgentPrompt || "";

  return (
    <div style={{ minHeight: "100vh", background: "#f2f2f5", fontFamily: "'Sora', 'Segoe UI', sans-serif", color: "#222" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: #2563eb22; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f2f2f5; } ::-webkit-scrollbar-thumb { background: #d0d0d8; border-radius: 3px; }
        textarea:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px #2563eb18 !important; }
        textarea { resize: vertical; }
        .gen-btn { transition: all 0.18s ease; }
        .gen-btn:hover:not(:disabled) { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 4px 16px #2563eb33 !important; }
        .gen-btn:active:not(:disabled) { transform: translateY(0); }
        .pill:hover { background: #ebebf0 !important; color: #2563eb !important; border-color: #bcd0f8 !important; cursor: pointer; }
        .start-over:hover { background: #ebebf0 !important; color: #333 !important; }
        .fade-in { animation: fadeUp 0.4s ease forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .dot-pulse span { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #2563eb; margin: 0 3px; animation: dotPulse 1.4s ease-in-out infinite; }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; } .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse { 0%,80%,100% { transform: scale(0.55); opacity: 0.35; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4e4ea", padding: "0 16px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: "15px", color: "#111", letterSpacing: "-0.02em" }}>ArchGen</span>
            {width > 400 && <span style={{ fontSize: "11px", color: "#bbb", fontFamily: "'JetBrains Mono', monospace" }}>Groq Powered</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="password"
              placeholder="Groq API Key..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={{ padding: "6px 10px", fontSize: "11px", border: "1px solid #e4e4ea", borderRadius: "6px", width: width > 500 ? "200px" : "120px", fontFamily: "'JetBrains Mono', monospace" }}
            />
            {width > 600 && (
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#2563eb", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace" }}>Get Free Key</a>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4e4ea", padding: "44px 16px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#2563eb", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: "uppercase", marginBottom: "14px" }}>Architecture Generator</div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.1, color: "#0a0a14", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Describe your app.<br /><span style={{ color: "#2563eb" }}>Get the blueprint.</span>
          </h1>
          <p style={{ fontSize: "clamp(13px, 2vw, 15px)", color: "#777", lineHeight: 1.65, margin: 0 }}>
            Paste your idea — get a cost-optimised architecture, compare alternatives, and export a ready-to-use coding agent prompt.
          </p>
        </div>
      </div>

      {/* Main */}
      <div style={{ margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* Input */}
        <div style={{ background: "#fff", border: "1px solid #e4e4ea", borderRadius: "14px", padding: "20px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'JetBrains Mono', monospace" }}>Describe your software</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            placeholder="e.g. A SaaS platform where yoga studios can manage class schedules, accept online bookings, and send automated reminder emails to students..."
            rows={5}
            style={{ width: "100%", background: "#fafafa", border: "1px solid #e4e4ea", borderRadius: "8px", padding: "12px 14px", color: "#111", fontSize: "14px", lineHeight: "1.65", fontFamily: "'Sora', sans-serif", marginBottom: "14px", transition: "all 0.18s" }}
          />
          <p style={{ fontSize: "11px", color: "#ccc", marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>TRY AN EXAMPLE</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} className="pill" onClick={() => setDescription(ex)}
                style={{ background: "#f5f5f7", border: "1px solid #e8e8ee", borderRadius: "4px", padding: "5px 12px", fontSize: "12px", color: "#777", cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.18s", maxWidth: "100%", textOverflow: "ellipsis", textAlign: "start" }}>
                {ex}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <button className="gen-btn" onClick={handleGenerate} disabled={!description.trim() || loading}
              style={{ background: !description.trim() || loading ? "#e8e8ee" : "#2563eb", border: "none", borderRadius: "8px", padding: "11px 24px", cursor: !description.trim() || loading ? "not-allowed" : "pointer", color: !description.trim() || loading ? "#bbb" : "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.01em", marginLeft: "auto" }}>
              {loading ? "Generating…" : "Generate Architecture →"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ background: "#fff", border: "1px solid #e4e4ea", borderRadius: "14px", padding: "36px 20px", textAlign: "center", marginBottom: "16px" }}>
            <div className="dot-pulse" style={{ marginBottom: "16px" }}><span /><span /><span /></div>
            <p style={{ color: "#999", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", margin: 0 }}>{steps[loadingStep]}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "10px", padding: "14px 18px", marginBottom: "16px" }}>
            <p style={{ color: "#dc2626", fontSize: "14px", margin: rawError ? "0 0 10px" : 0 }}>⚠ {error}</p>
            {rawError && (
              <details>
                <summary style={{ fontSize: "12px", color: "#999", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>Show raw API response</summary>
                <pre style={{ fontSize: "11px", color: "#666", marginTop: "8px", whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#fafafa", padding: "10px", borderRadius: "6px", border: "1px solid #f0d0d0", overflow: "auto" }}>{rawError}</pre>
              </details>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultRef} className="fade-in">

            {/* Summary */}
            <div style={{ background: "#f0f6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "20px", marginBottom: "14px", display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontSize: "10px", color: "#2563eb", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 700 }}>✓ Architecture Ready</div>
                <p style={{ color: "#1e3a6e", fontSize: "14px", lineHeight: "1.65", margin: 0, fontWeight: 500 }}>{result.summary}</p>
              </div>
              {result.estimatedMonthlyCost && (
                <div style={{ background: "#fff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "10px 16px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "10px", color: "#93c5fd", fontFamily: "'JetBrains Mono', monospace", marginBottom: "3px", fontWeight: 700, textTransform: "uppercase" }}>Est. Monthly</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#16a34a", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{result.estimatedMonthlyCost}</div>
                </div>
              )}
            </div>

            {/* Stack Picker */}
            <Section title="Tech Stack — Click to Switch" badge="Stack" accentColor="#2563eb">
              <div style={{ marginTop: "12px" }}>
                <p style={{ fontSize: "12px", color: "#888", margin: "0 0 12px", lineHeight: "1.5" }}>
                  <span style={{ color: "#d97706", fontWeight: 600 }}>Top pick</span> is pre-selected. Click alternatives to compare, then hit <strong style={{ color: "#111" }}>Update Sections</strong> to regenerate.
                </p>
                {(result.stack || []).map((cat, i) => (
                  <StackCategoryRow
                    key={i}
                    category={cat.category}
                    recommended={cat.recommended || {}}
                    alternatives={cat.alternatives || []}
                    selectedIdx={stackSelections[i] ?? -1}
                    onSelect={(altIdx) => handleSelect(i, altIdx)}
                    minCardWidth={stackCols === 1 ? 260 : 200}
                  />
                ))}

                {/* Update button bar */}
                <div style={{
                  marginTop: "4px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "12px", flexWrap: "wrap",
                  padding: "12px 14px",
                  background: hasPendingChanges ? "#fffbeb" : "#fafafa",
                  border: `1px solid ${hasPendingChanges ? "#fde68a" : "#e8e8ee"}`,
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{ fontSize: "12px", color: hasPendingChanges ? "#92400e" : "#bbb", fontFamily: "'JetBrains Mono', monospace", transition: "color 0.2s" }}>
                    {hasPendingChanges ? "⚠ You have unsaved stack changes" : "✓ Sections reflect current selection"}
                  </span>
                  <button
                    onClick={handleUpdateSections}
                    disabled={!hasPendingChanges || updating}
                    className="gen-btn"
                    style={{
                      background: !hasPendingChanges || updating ? "#e8e8ee" : "#2563eb",
                      border: "none", borderRadius: "7px",
                      padding: "9px 20px",
                      cursor: !hasPendingChanges || updating ? "not-allowed" : "pointer",
                      color: !hasPendingChanges || updating ? "#aaa" : "#fff",
                      fontWeight: 700, fontSize: "13px",
                      fontFamily: "'Sora', sans-serif",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}>
                    {updating ? <><SpinnerIcon /> Updating…</> : "Update Sections →"}
                  </button>
                </div>
              </div>
            </Section>

            {/* Architecture */}
            <Section title="System Architecture" badge="Architecture" accentColor="#7c3aed" updating={updating}>
              {updating ? <SectionSkeleton color="#7c3aed" /> : (
                <div style={{ marginTop: "14px" }}>
                  <p style={{ color: "#444", fontSize: "14px", lineHeight: "1.75", margin: "0 0 18px" }}>{arch?.overview}</p>
                  {(arch?.dataFlow || []).length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Data Flow</div>
                      {arch.dataFlow.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                          <span style={{ flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginTop: "2px" }}>{i + 1}</span>
                          <span style={{ color: "#555", fontSize: "13px", lineHeight: "1.6" }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(arch?.keyDecisions || []).length > 0 && (
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Key Decisions</div>
                      {arch.keyDecisions.map((d, i) => (
                        <div key={i} style={{ padding: "9px 13px", borderLeft: "3px solid #c4b5fd", marginBottom: "7px", background: "#faf8ff", borderRadius: "0 8px 8px 0", fontSize: "13px", color: "#555", lineHeight: "1.6" }}>{d}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Section>

            {/* Cost */}
            <Section title="Cost Breakdown" badge="Cost" accentColor="#16a34a" updating={updating}>
              {updating ? <SectionSkeleton color="#16a34a" /> : (
                <CostScalingTable costScaling={costScaling} costBreakdown={costBreakdown} />
              )}
            </Section>

            {/* Scaling */}
            <Section title="Scaling Roadmap" badge="Scale" accentColor="#ea580c" updating={updating}>
              {updating ? <SectionSkeleton color="#ea580c" /> : (
                <div style={{ marginTop: "14px", padding: "13px 15px", background: "#fff7f0", border: "1px solid #fed7aa", borderRadius: "8px" }}>
                  <p style={{ color: "#7c2d12", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{scalingPath}</p>
                </div>
              )}
            </Section>

            {/* Coding Prompt */}
            <Section title="AI Coding Agent Prompt" badge="Prompt" accentColor="#0891b2" updating={updating}>
              <div style={{ marginTop: "14px" }}>
                {updating ? (
                  <div style={{ background: "#f0f8ff", border: "1px solid #cce8f4", borderRadius: "10px", padding: "28px", textAlign: "center" }}>
                    <div className="dot-pulse" style={{ marginBottom: "10px" }}><span style={{ background: "#0891b2" }} /><span style={{ background: "#0891b2" }} /><span style={{ background: "#0891b2" }} /></div>
                    <p style={{ color: "#0891b2", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", margin: 0 }}>Updating prompt for selected stack…</p>
                  </div>
                ) : (
                  <div style={{ background: "#f8fbfc", border: "1px solid #cce8f4", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", background: "#f0f8ff", borderBottom: "1px solid #cce8f4", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#0891b2", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                        PASTE INTO: Claude Code · Cursor · Copilot
                      </span>
                      <CopyButton text={codingPrompt} label="Copy Prompt" />
                    </div>
                    <pre style={{ padding: "16px", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "12.5px", lineHeight: "1.75", color: "#1e4a5a", fontFamily: "'JetBrains Mono', monospace", maxHeight: "460px", overflowY: "auto", overflowX: "hidden" }}>
                      {codingPrompt}
                    </pre>
                  </div>
                )}
              </div>
            </Section>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button className="start-over"
                onClick={() => { setResult(null); setDynData(null); setDescription(""); setStackSelections({}); setCommittedSelections({}); setHasPendingChanges(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ background: "#fff", border: "1px solid #e0e0e8", borderRadius: "8px", padding: "10px 24px", color: "#999", fontSize: "13px", cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.18s" }}>
                ← Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
