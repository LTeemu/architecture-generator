export function extractJSON(raw) {
  if (!raw) return null;
  const tryParse = s => {
    s = s.trim().replace(/,(\s*[}\]])/g, "$1");
    // Handle potential unescaped backslashes in description/prompt content
    try {
      return JSON.parse(s);
    } catch {
      // Very basic attempt to fix common JSON errors if basic parse fails
      return JSON.parse(s.replace(/\\(?!["\\\/bfnrtu])/g, "\\\\"));
    }
  };
  const attempts = [
    () => tryParse(raw),
    () => { const m = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/); if (!m) throw 0; return tryParse(m[1]); },
    () => { const f = raw.indexOf("{"), l = raw.lastIndexOf("}"); if (f < 0 || l <= f) throw 0; return tryParse(raw.slice(f, l + 1)); },
    () => { const c = raw.split("\n").filter(x => !x.trim().startsWith("```")).join("\n"); const f = c.indexOf("{"), l = c.lastIndexOf("}"); if (f < 0 || l <= f) throw 0; return tryParse(c.slice(f, l + 1)); },
  ];
  for (const fn of attempts) { try { return fn(); } catch { } }
  return null;
}
