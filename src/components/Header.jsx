import { useState } from "react";

export function Header({ apiKey, setApiKey, width, history, onHistorySelect, clearHistory, darkMode, setDarkMode }) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div style={{ 
      background: darkMode ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.85)", 
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid", 
      borderColor: darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(228, 228, 234, 0.5)", 
      padding: "0 24px", 
      position: "sticky", 
      top: 0, 
      zIndex: 100
    }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ position: "relative", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill={darkMode ? "#2563eb" : "#1e40af"} />
              <path d="M17 7L10 18H16L15 25L22 14H16L17 7Z" fill="white" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
              <path opacity="0.3" d="M12 21L19 10H14L15 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ 
            fontWeight: 900, 
            fontSize: "18px", 
            color: darkMode ? "#60a5fa" : "#2563eb", 
            letterSpacing: "-0.04em"
          }}>ArchGen</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ 
              height: "32px",
              padding: "0 10px", 
              fontSize: "14px", 
              border: "1px solid", 
              borderColor: darkMode ? "#334155" : "#e4e4ea", 
              borderRadius: "6px", 
              background: darkMode ? "#334155" : "#fff", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{ 
              height: "32px",
              padding: "0 12px", 
              fontSize: "12px", 
              border: "1px solid", 
              borderColor: darkMode ? "#334155" : "#e4e4ea", 
              borderRadius: "6px", 
              background: darkMode ? "#334155" : "#fff", 
              color: darkMode ? "#f8fafc" : "#333",
              cursor: "pointer", 
              fontFamily: "'Sora', sans-serif",
              display: "flex",
              alignItems: "center"
            }}
          >
            History ({history.length})
          </button>
          
          <input
            type="password"
            placeholder="Groq API Key..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ 
              height: "32px",
              padding: "0 10px", 
              fontSize: "12px", 
              border: "1px solid", 
              borderColor: darkMode ? "rgba(148, 163, 184, 0.2)" : "rgba(0,0,0,0.1)", 
              borderRadius: "8px", 
              background: darkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(255,255,255,0.5)",
              color: darkMode ? "#f8fafc" : "#111",
              width: width > 500 ? "200px" : "120px", 
              fontFamily: "'JetBrains Mono', monospace",
              outline: "none",
              display: "flex",
              alignItems: "center"
            }}
          />
        </div>
      </div>

      {showHistory && (
        <div style={{ 
          position: "absolute", 
          top: "56px", 
          right: "16px", 
          width: "300px", 
          background: darkMode ? "#1e293b" : "#fff", 
          border: "1px solid", 
          borderColor: darkMode ? "#334155" : "#e4e4ea", 
          borderRadius: "0 0 12px 12px", 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
          maxHeight: "400px", 
          overflowY: "auto", 
          padding: "12px" 
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: darkMode ? "#64748b" : "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent Generations</h3>
            {history.length > 0 && (
              <button 
                onClick={() => { if(confirm("Clear all history?")) clearHistory(); }}
                style={{ background: "transparent", border: "none", color: "#dc2626", fontSize: "10px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", padding: "2px 4px" }}
              >
                Clear
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#bbb", margin: 0 }}>No history yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onHistorySelect(item); setShowHistory(false); }}
                  style={{ 
                    textAlign: "left", 
                    padding: "8px", 
                    border: "1px solid", 
                    borderColor: darkMode ? "#334155" : "#f2f2f5", 
                    borderRadius: "6px", 
                    background: darkMode ? "#334155" : "#fafafa", 
                    cursor: "pointer" 
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? "#312e81" : "#f0f6ff"}
                  onMouseLeave={e => e.currentTarget.style.background = darkMode ? "#334155" : "#fafafa"}
                >
                  <div style={{ fontSize: "12px", fontWeight: 600, color: darkMode ? "#f8fafc" : "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>
                  <div style={{ fontSize: "10px", color: "#999" }}>{new Date(item.timestamp).toLocaleDateString()}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
