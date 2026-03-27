export function OptionCard({ name, cost, reason, isSelected, isRecommended, onSelect, darkMode }) {
  return (
    <div onClick={onSelect} style={{
      position: "relative",
      background: isSelected ? (darkMode ? "#334155" : "#f0f6ff") : (darkMode ? "#1e293b" : "#fff"),
      border: `2px solid ${isSelected ? "#2563eb" : (darkMode ? "#334155" : "#e8e8ee")}`,
      borderRadius: "10px", padding: "12px", paddingTop: "22px", cursor: "pointer",
      boxShadow: isSelected ? (darkMode ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "0 0 0 3px #2563eb14") : "none",
      display: "flex", flexDirection: "column", gap: "6px",
      minWidth: 0, overflow: "hidden"
    }}>
      {/* Cost badge — top right inside card */}
      {cost && (
        <span style={{ 
          position: "absolute", top: "0px", right: "0px",
          fontSize: "9px", 
          fontFamily: "'JetBrains Mono', monospace", 
          color: darkMode ? "#4ade80" : "#16a34a", 
          background: darkMode ? "#1e293b" : "#fff", 
          border: `1px solid ${darkMode ? "#334155" : "#e8e8ee"}`,
          borderTop: "none", borderRight: "none",
          padding: "2px 7px", 
          borderRadius: "0 10px 0 4px",
          fontWeight: 700, 
          letterSpacing: "0.03em",
          whiteSpace: "nowrap"
        }}>{cost}</span>
      )}

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: "12.5px", color: darkMode ? "#fff" : "#111", lineHeight: "1.3", wordBreak: "break-word" }}>{name}</div>

      {/* Reason */}
      {reason && <p style={{ fontSize: "11.5px", color: darkMode ? "#94a3b8" : "#666", margin: 0, lineHeight: "1.5" }}>{reason}</p>}
    </div>
  );
}

export function StackCategoryRow({ category, recommended, alternatives, selectedIdx, onSelect, minCardWidth, darkMode }) {
  const alts = alternatives || [];
  return (
    <div style={{ background: darkMode ? "#0f172a" : "#fafafa", border: "1px solid", borderColor: darkMode ? "#1e293b" : "#e8e8ee", borderRadius: "12px", padding: "14px", marginBottom: "12px", overflow: "hidden" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: darkMode ? "#64748b" : "#aaa", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
        <span style={{ marginRight: "6px" }}>{recommended.icon || "🔧"}</span>
        {category}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`, gap: "8px" }}>
        <OptionCard name={recommended.name} cost={recommended.cost} reason={recommended.reason} isSelected={selectedIdx === -1} isRecommended onSelect={() => onSelect(-1)} darkMode={darkMode} />
        {alts.map((alt, i) => {
          if (!alt || !alt.name || alt.name.includes("2nd alternative") || alt.name.includes("3rd alternative") || alt.name.includes("string -")) return null;
          return <OptionCard key={i} name={alt.name} cost={alt.cost} reason={alt.reason} isSelected={selectedIdx === i} onSelect={() => onSelect(i)} darkMode={darkMode} />
        })}
      </div>
    </div>
  );
}
