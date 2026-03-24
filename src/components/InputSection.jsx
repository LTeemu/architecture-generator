import { useState } from "react";
import { EXAMPLES } from "../utils/constants";

export function InputSection({ description, setDescription, loading, handleGenerate, darkMode }) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div style={{
      background: darkMode ? "#0f172a" : "#fff",
      border: "1px solid",
      borderColor: darkMode ? "#1e293b" : "#e2e8f0",
      borderRadius: "14px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: darkMode ? "#64748b" : "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'JetBrains Mono', monospace" }}>Describe your software</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            setShowExamples(false);
            handleGenerate();
          }
        }}
        placeholder="e.g. A SaaS platform where yoga studios can manage class schedules, accept online bookings, and send automated reminder emails to students..."
        rows={8}
        style={{
          width: "100%",
          background: darkMode ? "#1e293b" : "#f8fafc",
          border: "1px solid",
          borderColor: darkMode ? "#334155" : "#e2e8f0",
          borderRadius: "10px",
          padding: "16px",
          color: darkMode ? "#f8fafc" : "#0f172a",
          fontSize: "14px",
          lineHeight: "1.65",
          fontFamily: "'Sora', sans-serif",
          marginBottom: "14px",
          outline: "none"
        }}
        className="form-textarea"
      />

      <div
        onClick={() => setShowExamples(!showExamples)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          marginBottom: "10px",
          userSelect: "none",
          padding: "4px 0"
        }}
      >
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "14px",
          fontSize: "10px",
          color: darkMode ? "#475569" : "#ccc"
        }}>
          {showExamples ? "▼" : "▶"}
        </span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: darkMode ? "#64748b" : "#999", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
          TRY AN EXAMPLE
        </span>
      </div>

      {showExamples && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
          {EXAMPLES.map((cat, i) => (
            <div key={i}>
              <div style={{
                fontSize: "11px",
                fontWeight: 800,
                color: darkMode ? "#475569" : "#aaa",
                marginBottom: "8px",
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                {cat.icon} {cat.category}
                <div style={{ flex: 1, height: "1px", background: darkMode ? "#334155" : "#f0f0f4" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {cat.items.map((item, j) => (
                  <button key={j} className="pill" onClick={() => setDescription(item)}
                    style={{
                      background: darkMode ? "#1e293b" : "#f5f5f7",
                      border: "1px solid",
                      borderColor: darkMode ? "#334155" : "#e8e8ee",
                      borderRadius: "4px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      color: darkMode ? "#f1f5f9" : "#666",
                      cursor: "pointer",
                      fontFamily: "'Sora', sans-serif",
                      maxWidth: "100%",
                      textAlign: "start"
                    }}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <button className="gen-btn" onClick={() => { setShowExamples(false); handleGenerate(); }} disabled={!description.trim() || loading}
          style={{ background: !description.trim() || loading ? (darkMode ? "#334155" : "#e8e8ee") : "#2563eb", border: "none", borderRadius: "8px", padding: "11px 24px", cursor: !description.trim() || loading ? "not-allowed" : "pointer", color: !description.trim() || loading ? "#999" : "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.01em", marginLeft: "auto" }}>
          {loading ? "Generating…" : "Generate Architecture →"}
        </button>
      </div>
    </div>
  );
}
