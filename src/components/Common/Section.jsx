import { useState } from "react";
import { ChevronIcon, SpinnerIcon } from "./Icons";

export function Section({ badge, children, accentColor = "#2563eb", accentColorDark, updating, darkMode }) {
  const [open, setOpen] = useState(true);
  const effectiveAccentColor = darkMode ? (accentColorDark || accentColor + "dd") : accentColor;
  return (
    <div style={{ 
      border: "1px solid", 
      borderColor: darkMode ? "#1e293b" : "#e2e8f0", 
      borderRadius: "14px", 
      overflow: "hidden", 
      marginBottom: "16px", 
      background: darkMode ? "#0f172a" : "#fff", 
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
    }}>
      <div style={{ display: "flex", alignItems: "center", padding: "0 18px", borderBottom: open ? `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}` : "none" }}>
        <button onClick={() => setOpen(o => !o)} style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "14px 0", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", minWidth: 0 }}>
          <span style={{ fontSize: "10px", fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif", background: effectiveAccentColor + "25", color: effectiveAccentColor, border: `1px solid ${effectiveAccentColor}40`, padding: "2px 9px", borderRadius: "4px", letterSpacing: "0.08em", fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>{badge}</span>
          <span style={{ color: darkMode ? "#64748b" : "#bbb", flexShrink: 0 }}><ChevronIcon open={open} /></span>
        </button>
        {updating && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "12px", flexShrink: 0, color: effectiveAccentColor, fontSize: "11px", fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
            <SpinnerIcon /> Updating…
          </div>
        )}
      </div>
      {open && <div style={{ padding: "0 18px 20px" }}>{children}</div>}
    </div>
  );
}

export function SectionSkeleton({ color = "#7c3aed", darkMode }) {
  const adjustedColor = darkMode ? (color + "dd") : color;
  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {[80, 60, 90, 50].map((w, i) => (
        <div key={i} style={{ height: "12px", borderRadius: "6px", background: `${adjustedColor}10`, width: `${w}%`, animation: "shimmer 1.4s ease-in-out infinite", animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  );
}
