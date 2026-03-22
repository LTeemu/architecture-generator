import { useState, useRef, useEffect, useCallback } from "react";
import { useWidth } from "./hooks/useWidth";
import { usePersistence, useHistory } from "./hooks/usePersistence";
import { extractJSON } from "./utils/json";
import { STEPS, SYSTEM_PROMPT_INITIAL, SYSTEM_PROMPT_REGEN } from "./utils/constants";

// Components
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InputSection } from "./components/InputSection";
import { ResultsSection } from "./components/ResultsSection";

export default function App() {
  const width = useWidth();
  const stackCols = width < 500 ? 1 : 2;

  const [description, setDescription] = useState("");
  const [submittedDescription, setSubmittedDescription] = useState("");
  const [apiKey, setApiKey] = usePersistence("archgen_groq_key", "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dynData, setDynData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [rawError, setRawError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [stackSelections, setStackSelections] = useState({});
  const [committedSelections, setCommittedSelections] = useState({});
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [darkMode, setDarkMode ] = usePersistence("archgen_dark_mode", false);
  
  const resultRef = useRef(null);
  const abortRef = useRef(null);

  const { history, addToHistory, updateHistory, clearHistory } = useHistory();

  useEffect(() => {
    document.body.style.background = darkMode ? "#020617" : "#cbd5e1";
    return () => { document.body.style.background = ""; };
  }, [darkMode]);

  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const iv = setInterval(() => setLoadingStep(s => (s + 1) % STEPS.length), 2000);
    return () => clearInterval(iv);
  }, [loading]);

  const getStackSummary = (res, sels) => {
    if (!res?.stack) return "";
    return res.stack.map((cat, i) => {
      const idx = sels[i] ?? -1;
      const item = idx === -1 ? cat.recommended : cat.alternatives?.[idx];
      return item ? `${cat.category}: ${item.name}` : null;
    }).filter(Boolean).join("\n");
  };

  const regenerateAll = useCallback(async (res, sels) => {
    if (!res) return;
    if (abortRef.current) abortRef.current = false;
    const token = {};
    abortRef.current = token;
    setUpdating(true);

    const stackSummary = getStackSummary(res, sels);

    try {
      if (!apiKey) throw new Error("Please enter your Groq API key.");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          max_tokens: 4096,
          temperature: 0.1,
          messages: [
            { role: "system", content: SYSTEM_PROMPT_REGEN },
            { role: "user", content: `App: ${submittedDescription || description}\n\nSelected tech stack:\n${stackSummary}\n\nGenerate architecture, mermaid chart, costs, scaling path and coding prompt for this exact stack.` }
          ]
        })
      });
      if (token !== abortRef.current) return;
      if (!response.ok) throw new Error("API Request Failed");
      const data = await response.json();
      const parsed = extractJSON(data.choices?.[0]?.message?.content);
      if (parsed && token === abortRef.current) {
        setDynData(parsed);
        // Also update history if we have a current ID
        if (currentHistoryId) {
          updateHistory(currentHistoryId, { dynData: parsed, selections: sels });
        }
      }
    } catch { } finally { if (token === abortRef.current) setUpdating(false); }
  }, [submittedDescription, description, apiKey, currentHistoryId, updateHistory]);

  const selectionsChanged = (current, committed, stackLen) => {
    for (let i = 0; i < stackLen; i++) {
      if ((current[i] ?? -1) !== (committed[i] ?? -1)) return true;
    }
    return false;
  };

  const handleSelect = (catIdx, altIdx) => {
    setStackSelections(prev => {
      const next = { ...prev, [catIdx]: altIdx };
      setHasPendingChanges(selectionsChanged(next, committedSelections, result?.stack?.length || 0));
      return next;
    });
  };

  const handleUpdateSections = () => {
    setHasPendingChanges(false);
    setCommittedSelections({ ...stackSelections });
    regenerateAll(result, stackSelections);
  };

  const handleGenerate = async () => {
    if (!description.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setDynData(null);
    setError(null);
    setRawError(null);
    setStackSelections({});
    setCommittedSelections({});
    setHasPendingChanges(false);

    try {
      if (!apiKey) throw new Error("Please enter your Groq API key.");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          max_tokens: 4096,
          temperature: 0.1,
          messages: [
            { role: "system", content: SYSTEM_PROMPT_INITIAL },
            { role: "user", content: `Design architecture for: ${description}` }
          ]
        }),
      });
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const parsed = extractJSON(data.choices?.[0]?.message?.content);
      if (!parsed) { setRawError(data.choices?.[0]?.message?.content); throw new Error("Invalid JSON"); }
      
      setResult(parsed);
      setDynData(parsed);
      setSubmittedDescription(description);
      const newId = Date.now();
      setCurrentHistoryId(newId);
      addToHistory({ 
        id: newId, 
        description, 
        result: parsed, 
        dynData: parsed, 
        selections: {},
        timestamp: new Date().toISOString() 
      });
      
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setCurrentHistoryId(item.id);
    setDescription(item.description);
    setSubmittedDescription(item.description);
    setResult(item.result);
    setDynData(item.dynData || item.result);
    setStackSelections(item.selections || {});
    setCommittedSelections(item.selections || {});
    setHasPendingChanges(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: darkMode ? "#0f172a" : "#f2f2f5", 
      fontFamily: "'Sora', sans-serif", 
      color: darkMode ? "#e2e8f0" : "#222"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300..800&family=JetBrains+Mono:wght@400..700&display=swap');
        * { box-sizing: border-box; }
        .gen-btn { }
        .gen-btn:hover:not(:disabled) { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 4px 16px #2563eb33 !important; }
        .pill:hover { background: ${darkMode ? "#1e293b" : "#ebebf0"} !important; color: #2563eb !important; border-color: #bcd0f8 !important; cursor: pointer; }
        .fade-in { animation: fadeUp 0.4s ease forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .dot-pulse span { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #2563eb; margin: 0 3px; animation: dotPulse 1.4s ease-in-out infinite; }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; } .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotPulse { 0%,80%,100% { transform: scale(0.55); opacity: 0.35; } 40% { transform: scale(1); opacity: 1; } }
        
        /* Dark mode overrides */
        ${darkMode ? `
          input, textarea { background: #1e293b !important; color: #f8fafc !important; border-color: #334155 !important; }
          .section-card { background: #1e293b !important; border-color: #334155 !important; }
          .text-muted { color: #94a3b8 !important; }
          .bg-muted { background: #1e293b !important; }
        ` : ""}
      `}</style>

      <Header 
        apiKey={apiKey} 
        setApiKey={setApiKey} 
        width={width} 
        history={history} 
        onHistorySelect={loadFromHistory}
        clearHistory={clearHistory}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Hero width={width} darkMode={darkMode} />

      <main style={{ maxWidth: "100%", margin: "0 auto", padding: "28px 16px 80px" }}>
        <InputSection 
          description={description} 
          setDescription={setDescription} 
          loading={loading} 
          handleGenerate={handleGenerate} 
          darkMode={darkMode}
        />

        {loading && (
          <div style={{ 
            background: darkMode ? "#1e293b" : "#fff", 
            border: "1px solid",
            borderColor: darkMode ? "#334155" : "#e4e4ea", 
            borderRadius: "14px", 
            padding: "36px 20px", 
            textAlign: "center", 
            marginBottom: "16px" 
          }}>
            <div className="dot-pulse" style={{ marginBottom: "16px" }}><span /><span /><span /></div>
            <p style={{ color: darkMode ? "#94a3b8" : "#999", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", margin: 0 }}>{STEPS[loadingStep]}</p>
          </div>
        )}

        {error && (
          <div style={{ 
            background: darkMode ? "#450a0a" : "#fff5f5", 
            border: "1px solid",
            borderColor: darkMode ? "#991b1b" : "#fecaca", 
            borderRadius: "10px", 
            padding: "14px 18px", 
            marginBottom: "16px" 
          }}>
            <p style={{ color: darkMode ? "#fca5a5" : "#dc2626", fontSize: "14px", margin: rawError ? "0 0 10px" : 0 }}>⚠ {error}</p>
          </div>
        )}

        <ResultsSection 
          result={result} 
          dynData={dynData} 
          updating={updating} 
          stackSelections={stackSelections} 
          handleSelect={handleSelect} 
          stackCols={stackCols} 
          hasPendingChanges={hasPendingChanges} 
          handleUpdateSections={handleUpdateSections}
          resultRef={resultRef}
          darkMode={darkMode}
        />
      </main>
    </div>
  );
}
