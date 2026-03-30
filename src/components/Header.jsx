import { useState, useRef, useEffect } from "react";
import { MoonIcon, SunIcon, HistoryIcon } from "./Common/Icons";

export function Header({ apiKey, setApiKey, width, history, onHistorySelect, clearHistory, darkMode, setDarkMode }) {
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    }
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistory]);

  return (
    <div style={{ 
      background: darkMode ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.85)", 
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid", 
      borderColor: darkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(228, 228, 234, 0.5)", 
      padding: width < 500 ? "0 12px" : "0 24px", 
      position: "sticky", 
      top: 0, 
      zIndex: 100
    }}>
      <div style={{ maxWidth: "100%", margin: "0 auto", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
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
              borderColor: darkMode ? "#334155" : "#e8e8ee", 
              borderRadius: "6px", 
              background: darkMode ? "#1e293b" : "#f5f5f7", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: darkMode ? "#f8fafc" : "#1e293b"
            }}
          >
            {darkMode ? <MoonIcon /> : <SunIcon />}
          </button>

          <div ref={historyRef} style={{ position: "relative", display: "flex" }}>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              style={{ 
                height: "32px",
                padding: "0 12px", 
                fontSize: "10px", 
                border: "1px solid", 
                borderColor: darkMode ? "#334155" : "#e8e8ee", 
                borderRadius: "6px", 
                background: darkMode ? "#1e293b" : "#f5f5f7", 
                color: darkMode ? "#f8fafc" : "#1e293b",
                cursor: "pointer", 
                 fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif",
                display: "flex",
                fontWeight: 600,
                alignItems: "center",
                gap: "6px"
              }}
            >
              {/* <HistoryIcon /> */}
              History ({history.length})
            </button>
            
            {showHistory && (
              <div style={{ 
                position: width < 500 ? "fixed" : "absolute", 
                top: width < 500 ? "100%" : "calc(100% + 12px)", 
                right: 0,
                width: width < 500 ? "100vw" : "300px",
                background: darkMode ? "#0f172a" : "#fff", 
                border: "1px solid", 
                borderColor: darkMode ? "#334155" : "#e2e8f0", 
                borderRadius: "12px", 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", 
                maxHeight: "300px", 
                overflowY: "auto", 
                padding: "16px",
                boxSizing: "border-box"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "10px", fontWeight: 700, margin: 0, color: darkMode ? "#94a3b8" : "#777", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent Generations</h3>
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
                          padding: "10px", 
                          border: "1px solid", 
                          borderColor: darkMode ? "#334155" : "#f2f2f5", 
                          borderRadius: "8px", 
                          background: darkMode ? "#1e293b" : "#fafafa", 
                          cursor: "pointer" 
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? "#334155" : "#f0f6ff"}
                        onMouseLeave={e => e.currentTarget.style.background = darkMode ? "#1e293b" : "#fafafa"}
                      >
                        <div style={{ fontSize: "12px", fontWeight: 600, color: darkMode ? "#f8fafc" : "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>
                        <div style={{ fontSize: "10px", color: darkMode ? "#94a3b8" : "#999" }}>{new Date(item.timestamp).toLocaleDateString()}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <input
            type="password"
            placeholder="Groq API Key..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ 
              height: "32px",
              padding: "0 12px", 
              fontSize: "12px", 
              border: "1px solid", 
              borderColor: darkMode ? "#334155" : "#e8e8ee", 
              borderRadius: "6px", 
              background: darkMode ? "#1e293b" : "#f5f5f7",
              color: darkMode ? "#f8fafc" : "#1e293b",
              width: width > 500 ? "200px" : "120px", 
              fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif",
              outline: "none",
              display: "flex",
              alignItems: "center"
            }}
          />
        </div>
      </div>
    </div>
  );
}
