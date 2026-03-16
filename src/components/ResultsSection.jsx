import { CopyButton } from "./Common/CopyButton";
import { Section, SectionSkeleton } from "./Common/Section";
import { StackCategoryRow } from "./StackPicker";
import { CostScalingTable } from "./CostSection";
import { MermaidDiagram } from "./MermaidDiagram";

export function ResultsSection({
  result,
  dynData,
  updating,
  stackSelections,
  handleSelect,
  stackCols,
  hasPendingChanges,
  handleUpdateSections,
  resultRef,
  darkMode
}) {
  if (!result) return null;

  const arch = dynData?.architecture;
  const costBreakdown = dynData?.costBreakdown;
  const costScaling = dynData?.costScaling;
  const scalingPath = dynData?.scalingPath;
  const codingPrompt = dynData?.codingAgentPrompt || "";
  const mermaidChart = dynData?.mermaidChart;

  const exportAsMarkdown = () => {
    const content = `# Architecture Blueprint: ${result.summary}

## Overview
${arch?.overview}

## Tech Stack
${result.stack.map((cat, i) => {
      const idx = stackSelections[i] ?? -1;
      const item = idx === -1 ? cat.recommended : cat.alternatives[idx];
      return `- **${cat.category}**: ${item.name}`;
    }).join('\n')}

## Cost Breakdown
${costBreakdown?.map(row => `- ${row.item}: ${row.costEur} (${row.notes})`).join('\n')}

## Scaling Roadmap
${scalingPath}

## Mermaid Diagram
\`\`\`mermaid
${mermaidChart}
\`\`\`

## Coding Agent Prompt
${codingPrompt}
`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "architecture-blueprint.md";
    a.click();
  };

  const exportAsJSON = () => {
    const data = { ...result, ...dynData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "architecture-blueprint.json";
    a.click();
  };

  return (
    <div ref={resultRef} className="fade-in">
      {/* Summary */}
      <div style={{ background: darkMode ? "#1e293b" : "#f0f6ff", border: "1px solid", borderColor: darkMode ? "#334155" : "#bfdbfe", borderRadius: "14px", padding: "20px", marginBottom: "14px", display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ fontSize: "10px", color: darkMode ? "#3b82f6" : "#2563eb", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 700 }}>✓ Architecture Ready</div>
          <p style={{ color: darkMode ? "#cbd5e1" : "#1e3a6e", fontSize: "14px", lineHeight: "1.65", margin: 0, fontWeight: 500 }}>{result.summary}</p>

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button onClick={exportAsMarkdown} style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "6px", border: "1px solid", borderColor: darkMode ? "#475569" : "#e4e4ea", background: darkMode ? "#334155" : "#fff", color: darkMode ? "#f8fafc" : "#666", cursor: "pointer" }}>Export MD</button>
            <button onClick={exportAsJSON} style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "6px", border: "1px solid", borderColor: darkMode ? "#475569" : "#e4e4ea", background: darkMode ? "#334155" : "#fff", color: darkMode ? "#f8fafc" : "#666", cursor: "pointer" }}>Export JSON</button>
          </div>
        </div>
      </div>

      {/* Stack Picker */}
      <Section title="Tech Stack — Click to Switch" badge="Stack" accentColor="#2563eb" darkMode={darkMode}>
        <div style={{ marginTop: "12px" }}>
          <p style={{ fontSize: "12px", color: darkMode ? "#94a3b8" : "#888", margin: "0 0 12px", lineHeight: "1.5" }}>
            <span style={{ color: "#d97706", fontWeight: 600 }}>Top pick</span> is pre-selected. Click alternatives to compare, then hit <strong style={{ color: darkMode ? "#f8fafc" : "#111" }}>Update Sections</strong> to regenerate.
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
              darkMode={darkMode}
            />
          ))}

          {/* Update button bar */}
          <div style={{
            marginTop: "4px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "12px", flexWrap: "wrap",
            padding: "12px 14px",
            background: hasPendingChanges ? (darkMode ? "#334155" : "#fffbeb") : (darkMode ? "#1e293b" : "#fafafa"),
            border: `1px solid ${hasPendingChanges ? "#fde68a" : (darkMode ? "#334155" : "#e8e8ee")}`,
            borderRadius: "10px",
          }}>
            <span style={{ fontSize: "12px", color: hasPendingChanges ? (darkMode ? "#fbbf24" : "#92400e") : "#bbb", fontFamily: "'JetBrains Mono', monospace" }}>
              {hasPendingChanges ? "⚠ You have unsaved stack changes" : "✓ Sections reflect current selection"}
            </span>
            <button
              onClick={handleUpdateSections}
              disabled={!hasPendingChanges || updating}
              className="gen-btn"
              style={{
                background: !hasPendingChanges || updating ? (darkMode ? "#334155" : "#e8e8ee") : "#2563eb",
                border: "none", borderRadius: "7px",
                padding: "9px 20px",
                cursor: !hasPendingChanges || updating ? "not-allowed" : "pointer",
                color: !hasPendingChanges || updating ? "#aaa" : "#fff",
                fontWeight: 700, fontSize: "13px",
                fontFamily: "'Sora', sans-serif",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
              {updating ? "Updating…" : "Update Sections →"}
            </button>
          </div>
        </div>
      </Section>

      {/* Visual Diagram */}
      {mermaidChart && (
        <Section title="Architecture Diagram" badge="Visual" accentColor="#ec4899" updating={updating} darkMode={darkMode}>
          {updating ? <SectionSkeleton color="#ec4899" /> : (
            <div style={{ marginTop: "14px" }}>
              <MermaidDiagram chart={mermaidChart} darkMode={darkMode} />
            </div>
          )}
        </Section>
      )}

      {/* Architecture */}
      <Section title="System Architecture" badge="Architecture" accentColor="#7c3aed" updating={updating} darkMode={darkMode}>
        {updating ? <SectionSkeleton color="#7c3aed" /> : (
          <div style={{ marginTop: "14px" }}>
            <p style={{ color: darkMode ? "#cbd5e1" : "#444", fontSize: "14px", lineHeight: "1.75", margin: "0 0 18px" }}>{arch?.overview}</p>
            {(arch?.dataFlow || []).length > 0 && (
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Data Flow</div>
                {arch.dataFlow.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginTop: "2px" }}>{i + 1}</span>
                    <span style={{ color: darkMode ? "#94a3b8" : "#555", fontSize: "13px", lineHeight: "1.6" }}>{step}</span>
                  </div>
                ))}
              </div>
            )}
            {(arch?.keyDecisions || []).length > 0 && (
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#7c3aed", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Key Decisions</div>
                {arch.keyDecisions.map((d, i) => (
                  <div key={i} style={{ padding: "9px 13px", borderLeft: "3px solid #c4b5fd", marginBottom: "7px", background: darkMode ? "#0f172a" : "#faf8ff", borderRadius: "0 8px 8px 0", fontSize: "13px", color: darkMode ? "#94a3b8" : "#555", lineHeight: "1.6" }}>{d}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Cost */}
      <Section title="Cost Breakdown" badge="Cost" accentColor="#16a34a" updating={updating} darkMode={darkMode}>
        {updating ? <SectionSkeleton color="#16a34a" /> : (
          <CostScalingTable costScaling={costScaling} costBreakdown={costBreakdown} darkMode={darkMode} />
        )}
      </Section>

      {/* Scaling */}
      <Section title="Scaling Roadmap" badge="Scale" accentColor="#ea580c" updating={updating} darkMode={darkMode}>
        {updating ? <SectionSkeleton color="#ea580c" /> : (
          <div style={{ marginTop: "14px", padding: "13px 15px", background: darkMode ? "#431407" : "#fff7f0", border: "1px solid", borderColor: darkMode ? "#7c2d12" : "#fed7aa", borderRadius: "8px" }}>
            <p style={{ color: darkMode ? "#fdba74" : "#7c2d12", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{scalingPath}</p>
          </div>
        )}
      </Section>

      {/* Coding Prompt */}
      <Section title="AI Coding Agent Prompt" badge="Prompt" accentColor="#0891b2" updating={updating} darkMode={darkMode}>
        <div style={{ marginTop: "14px" }}>
          {updating ? (
            <SectionSkeleton color="#0891b2" />
          ) : (
            <div style={{ background: darkMode ? "#0f172a" : "#f8fbfc", border: "1px solid", borderColor: darkMode ? "#334155" : "#cce8f4", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", background: darkMode ? "#1e293b" : "#f0f8ff", borderBottom: "1px solid", borderBottomColor: darkMode ? "#334155" : "#cce8f4", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: darkMode ? "#22d3ee" : "#0891b2", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                  PASTE INTO: Claude Code · Cursor · Copilot
                </span>
                <CopyButton text={codingPrompt} label="Copy Prompt" darkMode={darkMode} />
              </div>
              <pre style={{ padding: "16px", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "12.5px", lineHeight: "1.75", color: darkMode ? "#cbd5e1" : "#1e4a5a", fontFamily: "'JetBrains Mono', monospace", maxHeight: "460px", overflowY: "auto", overflowX: "hidden" }}>
                {codingPrompt}
              </pre>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
