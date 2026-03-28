export function Hero({ width, darkMode }) {
  return (
    <div style={{ 
      background: darkMode 
        ? "radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.15) 0%, #0f172a 60%)" 
        : "radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.05) 0%, #ffffff 60%)", 
      borderBottom: "1px solid", 
      borderColor: darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(228, 228, 234, 0.5)", 
      padding: "80px 24px 60px", 
      textAlign: "center" 
    }}>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: darkMode ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.1)", padding: "6px 16px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.14em", color: darkMode ? "#60a5fa" : "#2563eb", fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: "24px", border: "1px solid", borderColor: darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(37, 99, 235, 0.2)" }}>Architecture Generator</div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.1, color: darkMode ? "#f8fafc" : "#0f172a", margin: "0 0 16px", letterSpacing: "-0.04em", fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
          Describe your app.<br />
          <span style={{ color: darkMode ? "#60a5fa" : "#2563eb" }}>Get the blueprint.</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: darkMode ? "#94a3b8" : "#555", lineHeight: 1.6, margin: "0 auto", maxWidth: "600px", fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
          Turn your idea into a full architecture blueprint with AI-recommended stacks and a ready-to-use coding prompt.
        </p>
      </div>
    </div>
  );
}
