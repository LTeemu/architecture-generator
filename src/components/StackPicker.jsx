export function OptionCard({ icon, name, cost, reason, pros, cons, isSelected, isRecommended, onSelect, darkMode }) {
  return (
    <div onClick={onSelect} style={{
      background: isSelected ? (darkMode ? "#1e3a8a" : "#f0f6ff") : (darkMode ? "#334155" : "#fff"),
      border: `2px solid ${isSelected ? "#2563eb" : (darkMode ? "#475569" : "#e8e8ee")}`,
      borderRadius: "10px", padding: "12px", cursor: "pointer",
      boxShadow: isSelected ? "0 0 0 3px #2563eb14" : "none",
      display: "flex", flexDirection: "column", gap: "6px",
      minWidth: 0, overflow: "hidden",
    }}>
      {/* Top row: icon + badges */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", minWidth: 0 }}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>{icon || "🔧"}</span>
          {isRecommended && (
            <span style={{ 
              fontSize: "9px", 
              fontFamily: "'JetBrains Mono', monospace", 
              fontWeight: 700, 
              color: darkMode ? "#fbbf24" : "#d97706", 
              background: darkMode ? "#451a03" : "#fffbeb", 
              border: `1px solid ${darkMode ? "#78350f" : "#fde68a"}`, 
              padding: "1px 5px", 
              borderRadius: "4px", 
              textTransform: "uppercase", 
              letterSpacing: "0.05em", 
              flexShrink: 0 
            }}>Top pick</span>
          )}
        </div>
        {cost && (
          <span style={{ 
            fontSize: "10px", 
            fontFamily: "'JetBrains Mono', monospace", 
            color: darkMode ? "#4ade80" : "#16a34a", 
            background: darkMode ? "#064e3b" : "#f0faf4", 
            border: `1px solid ${darkMode ? "#065f46" : "#bbf7d0"}`, 
            padding: "1px 6px", 
            borderRadius: "4px", 
            fontWeight: 600, 
            flexShrink: 1, 
            whiteSpace: "wrap" 
          }}>{cost}</span>
        )}
      </div>

      {/* Name */}
      <div style={{ fontWeight: 700, fontSize: "12.5px", color: darkMode ? "#fff" : "#111", lineHeight: "1.3", wordBreak: "break-word" }}>{name}</div>

      {/* Reason (recommended) */}
      {reason && <p style={{ fontSize: "11.5px", color: darkMode ? "#94a3b8" : "#666", margin: 0, lineHeight: "1.5" }}>{reason}</p>}

      {/* Pros/Cons (alternatives) */}
      {(pros || cons) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {(pros || []).map((p, i) => (
            <div key={`p${i}`} style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
              <span style={{ color: "#16a34a", fontSize: "11px", flexShrink: 0, marginTop: "1px", fontWeight: 700 }}>+</span>
              <span style={{ fontSize: "11.5px", color: darkMode ? "#cbd5e1" : "#444", lineHeight: "1.4" }}>{p}</span>
            </div>
          ))}
          {(cons || []).map((c, i) => (
            <div key={`c${i}`} style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
              <span style={{ color: "#dc2626", fontSize: "11px", flexShrink: 0, marginTop: "1px", fontWeight: 700 }}>−</span>
              <span style={{ fontSize: "11.5px", color: darkMode ? "#94a3b8" : "#888", lineHeight: "1.4" }}>{c}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StackCategoryRow({ category, recommended, alternatives, selectedIdx, onSelect, minCardWidth, darkMode }) {
  const alts = alternatives || [];
  return (
    <div style={{ background: darkMode ? "#1e293b" : "#fafafa", border: "1px solid", borderColor: darkMode ? "#334155" : "#e8e8ee", borderRadius: "12px", padding: "14px", marginBottom: "12px", overflow: "hidden" }}>
      <div style={{ fontSize: "10px", fontWeight: 700, color: darkMode ? "#64748b" : "#aaa", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>{category}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`, gap: "8px" }}>
        <OptionCard icon={recommended.icon} name={recommended.name} cost={recommended.cost} reason={recommended.reason} isSelected={selectedIdx === -1} isRecommended onSelect={() => onSelect(-1)} darkMode={darkMode} />
        {alts.map((alt, i) => {
          if (!alt || !alt.name || alt.name.includes("2nd alternative") || alt.name.includes("3rd alternative") || alt.name.includes("string -")) return null;
          return <OptionCard key={i} icon={alt.icon} name={alt.name} cost={alt.cost} pros={alt.pros} cons={alt.cons} isSelected={selectedIdx === i} onSelect={() => onSelect(i)} darkMode={darkMode} />
        })}
      </div>
    </div>
  );
}
