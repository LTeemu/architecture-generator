import { useState } from "react";
import { CopyIcon, CheckIcon } from "./Icons";

export function CopyButton({ text, label = "Copy", darkMode }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2200); }}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "5px", 
        background: copied ? (darkMode ? "#064e3b" : "#f0faf4") : (darkMode ? "#334155" : "#f5f5f7"), 
        border: `1px solid ${copied ? (darkMode ? "#059669" : "#86efac") : (darkMode ? "#475569" : "#e0e0e6")}`, 
        color: copied ? (darkMode ? "#34d399" : "#16a34a") : (darkMode ? "#cbd5e1" : "#555"), 
        padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "'Space Grotesk', system-ui, Avenir, Helvetica, Arial, sans-serif", fontWeight: 500, whiteSpace: "nowrap" 
      }}>
      {copied ? <CheckIcon /> : <CopyIcon />}{copied ? "Copied!" : label}
    </button>
  );
}
