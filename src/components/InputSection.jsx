import { useState } from "react";
import { EXAMPLES } from "../utils/constants";

export function InputSection({ description, setDescription, loading, handleGenerate, darkMode }) {
  const [showExamples, setShowExamples] = useState(true);

  return (
    <div style={{ 
      background: darkMode ? "#1e293b" : "#fff", 
      border: "1px solid", 
      borderColor: darkMode ? "#334155" : "#e4e4ea", 
      borderRadius: "14px", 
      padding: "20px", 
      marginBottom: "16px", 
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)" 
    }}>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: darkMode ? "#64748b" : "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'JetBrains Mono', monospace" }}>Describe your software</label>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
        placeholder="e.g. A SaaS platform where yoga studios can manage class schedules, accept online bookings, and send automated reminder emails to students..."
        rows={5}
        style={{ width: "100%", background: darkMode ? "#0f172a" : "#fafafa", border: "1px solid", borderColor: darkMode ? "#334155" : "#e4e4ea", borderRadius: "8px", padding: "12px 14px", color: darkMode ? "#f8fafc" : "#111", fontSize: "14px", lineHeight: "1.65", fontFamily: "'Sora', sans-serif", marginBottom: "14px" }}
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
          {EXAMPLES.map((ex, i) => (
            <button key={i} className="pill" onClick={() => setDescription(ex)}
              style={{ 
                background: darkMode ? "#334155" : "#f5f5f7", 
                border: "1px solid", 
                borderColor: darkMode ? "#475569" : "#e8e8ee", 
                borderRadius: "4px", 
                padding: "5px 12px", 
                fontSize: "12px", 
                color: darkMode ? "#94a3b8" : "#777", 
                cursor: "pointer", 
                fontFamily: "'Sora', sans-serif", 
                maxWidth: "100%", 
                textOverflow: "ellipsis", 
                textAlign: "start" 
              }}>
              {ex}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <button className="gen-btn" onClick={handleGenerate} disabled={!description.trim() || loading}
          style={{ background: !description.trim() || loading ? (darkMode ? "#334155" : "#e8e8ee") : "#2563eb", border: "none", borderRadius: "8px", padding: "11px 24px", cursor: !description.trim() || loading ? "not-allowed" : "pointer", color: !description.trim() || loading ? "#999" : "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.01em", marginLeft: "auto" }}>
          {loading ? "Generating…" : "Generate Architecture →"}
        </button>
      </div>
    </div>
  );
}
