export function CostScalingTable({ costScaling, costBreakdown, darkMode }) {
  return (
    <div style={{ marginTop: "14px" }}>
      {costScaling && costScaling.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#16a34a", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Cost scaling (EUR / month)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px" }}>
            {costScaling.map((tier, i) => (
              <div key={i} style={{ background: darkMode ? "#1e293b" : "#f9fafb", border: "1px solid", borderColor: darkMode ? "#334155" : "#e8e8ee", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: darkMode ? "#64748b" : "#aaa", fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px", textTransform: "uppercase" }}>
                  {tier.users >= 1000000 ? `${tier.users / 1000000}M` : tier.users >= 1000 ? `${tier.users / 1000}k` : tier.users} users
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: tier.eurPerMonth === 0 ? "#16a34a" : (darkMode ? "#f8fafc" : "#111"), letterSpacing: "-0.03em", wordBreak: "break-word" }}>
                  {tier.eurPerMonth === 0 ? "Free" : `€${tier.eurPerMonth}`}
                </div>
                {tier.note && <div style={{ fontSize: "10px", color: darkMode ? "#94a3b8" : "#bbb", marginTop: "4px", lineHeight: "1.4" }}>{tier.note}</div>}
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
                <tr style={{ borderBottom: `2px solid ${darkMode ? "#334155" : "#f0f0f4"}` }}>
                  {["Service", "Cost (EUR)", "Free until"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: darkMode ? "#64748b" : "#aaa", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {costBreakdown.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f4f4f7"}` }}>
                    <td style={{ padding: "9px 10px", color: darkMode ? "#cbd5e1" : "#222", fontWeight: 500, wordBreak: "break-word" }}>{row.item}</td>
                    <td style={{ padding: "9px 10px", whiteSpace: "nowrap" }}>
                      <span style={{ color: "#16a34a", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700 }}>{row.costEur || row.cost}</span>
                    </td>
                    <td style={{ padding: "9px 10px", color: darkMode ? "#94a3b8" : "#888", fontSize: "12px" }}>{row.notes}</td>
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
