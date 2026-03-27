export function CostScalingTable({ costScaling, darkMode }) {
  if (!costScaling || costScaling.length === 0) return null;
  return (
    <div style={{ marginTop: "14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
        {costScaling.map((tier, i) => (
          <div key={i} style={{ background: darkMode ? "#1e293b" : "#f9fafb", border: "1px solid", borderColor: darkMode ? "#334155" : "#e8e8ee", borderRadius: "10px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: darkMode ? "#f8fafc" : "#111" }}>
                {tier.users >= 1000000 ? `${tier.users / 1000000}M` : tier.users >= 1000 ? `${(tier.users / 1000).toFixed(tier.users % 1000 === 0 ? 0 : 1)}k` : tier.users} users
              </span>
              {tier.phase && <span style={{ fontSize: "10px", color: darkMode ? "#94a3b8" : "#888", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>{tier.phase}</span>}
            </div>
            {(tier.services || []).map((svc, j) => (
              <div key={j} style={{ marginBottom: j < tier.services.length - 1 ? "10px" : 0, paddingBottom: j < tier.services.length - 1 ? "10px" : 0, borderBottom: j < tier.services.length - 1 ? `1px solid ${darkMode ? "#334155" : "#eee"}` : "none" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: darkMode ? "#e2e8f0" : "#333", marginBottom: "4px" }}>{svc.name}</div>
                {svc.freeUntil && (
                  <div style={{ fontSize: "11px", color: darkMode ? "#4ade80" : "#16a34a", lineHeight: "1.4", marginBottom: "2px" }}>
                    Free while: {svc.freeUntil}
                  </div>
                )}
                {svc.costDriver && (
                  <div style={{ fontSize: "11px", color: darkMode ? "#94a3b8" : "#666", lineHeight: "1.4" }}>
                    Cost scales with: {svc.costDriver}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
