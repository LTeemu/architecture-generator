import { useState, useEffect } from "react";

export function usePersistence(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function useHistory() {
  const [history, setHistory] = usePersistence("archgen_history", []);

  const addToHistory = (item) => {
    setHistory(prev => {
      // Remove duplicates by description
      const filtered = prev.filter(h => h.description !== item.description);
      return [item, ...filtered].slice(0, 20); // Keep last 20
    });
  };

  const updateHistory = (id, updates) => {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const clearHistory = () => setHistory([]);

  return { history, addToHistory, removeFromHistory, updateHistory, clearHistory };
}
