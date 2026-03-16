export function Hero({ width, darkMode }) {
  return (
    <div style={{ 
      background: darkMode ? "#0f172a" : "#fff", 
      borderBottom: "1px solid", 
      borderColor: darkMode ? "#1e293b" : "#e4e4ea", 
      padding: "44px 16px 40px", 
      textAlign: "center" 
    }}>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#2563eb", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: "uppercase", marginBottom: "14px" }}>Architecture Generator</div>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.1, color: darkMode ? "#f8fafc" : "#0a0a14", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
          Describe your app.<br /><span style={{ color: "#2563eb" }}>Get the blueprint.</span>
        </h1>
        <p style={{ fontSize: "clamp(13px, 2vw, 15px)", color: darkMode ? "#94a3b8" : "#777", lineHeight: 1.65, margin: 0 }}>
          Paste your idea — get a cost-optimised architecture, compare alternatives, and export a ready-to-use coding agent prompt.
        </p>
      </div>
    </div>
  );
}
