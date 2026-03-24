import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Sora, sans-serif',
});

export function MermaidDiagram({ chart, darkMode }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);

  // Clean the chart input
  const cleanChart = (raw) => {
    if (!raw) return "";
    let c = raw.trim()
      .replace(/^```mermaid\s*/, '')
      .replace(/```$/, '')
      .replace(/;/g, '\n');

    // Step 0: Fix the "-->>" sequence-style arrow which fails in graph TD
    c = c.replace(/-->>/g, '-->');

    // Step 1: Fix the double-quote label mess (e.g. [""Label""] or ["> "Label""])
    // 1.1: Fix [""Label""] -> ["Label"]
    c = c.replace(/\[\s*"{2,}([^"]+)"{2,}\s*\]/g, '["$1"]');
    
    // 1.2: Fix ["> "Label""] -> ["> Label"]
    c = c.replace(/\[\s*">\s*"([^"]+)"\s*\]/g, '["> $1"]');

    // Step 2: Fix repeated ID issues and common squashing
    // e.g. ID[Label] ID --> becomes ID[Label] -->
    c = c.replace(/(\[[^\]]+\])\s*(\w+)\s+(?=-->|--|-.->|==>)/g, '$1 ');
    c = c.replace(/(\w+)\["[^"]+"\]\s*\1\s+/g, '$1 ');

    // Handle squashed definitions where a label is immediately followed by another bracket
    c = c.replace(/(\])\s*(\[)/g, '$1\n$2');

    // Fix missing quotes in brackets/shapes for better compatibility
    c = c.replace(/\[([^"\]\n]+)\]/g, '["$1"]');
    c = c.replace(/\(\(([^" \)\n]+)\)\)/g, '(("$1"))');
    c = c.replace(/\{([^"\}\n]+)\}/g, '{"$1"}');

    // Fix squashed diagram starts or directions in the middle (e.g., "]TD[", "]graph TD[")
    c = c.replace(/(\])\s*(TD|LR|BT|RL|graph|flowchart)\s*([\[\w])/gi, '$1\n$3');

    // Step 3: Normalize header and force newline
    const headerPattern = /^(graph|flowchart|sequenceDiagram|classDiagram)(\s+)(TD|LR|BT|RL)?/i;
    const match = c.match(headerPattern);
    
    if (match) {
      const fullHeaderMatch = match[0];
      const remainder = c.slice(fullHeaderMatch.length).trim();
      const type = match[1];
      const dir = match[3] || 'TD';
      c = `${type} ${dir}\n${remainder}`;
    } else {
      c = 'flowchart TD\n' + c;
    }

    // Secondary header cleanup
    c = c.replace(/\n\s*(graph|flowchart|sequenceDiagram|classDiagram)(\s+)(TD|LR|BT|RL)?/gi, '\n');

    let lines = c.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const processedLines = lines.map((line, index) => {
      if (index === 0) return line; 
      
      let l = line.trim();
      if (!l) return null;

      // Part 0: Technical sanitization
      // Fix accidental quotes inside labels that aren't properly escaped (simplified)
      if (l.includes('[') && l.includes(']')) {
         // If we have [ "Something "else" " ], try to normalize to ["Something else"]
         l = l.replace(/\[\s*"(.*?)"\s*\]/g, (m, p1) => `["${p1.replace(/"/g, '')}"]`);
      }

      // Fix unclosed brackets within this line (extremely common AI hallucination)
      const openBrackets = (l.match(/\[/g) || []).length;
      const closeBrackets = (l.match(/\]/g) || []).length;
      if (openBrackets > closeBrackets) {
        l = l + ']'.repeat(openBrackets - closeBrackets);
      }

      // Handle subgraph ID spaces and formatting
      if (l.toLowerCase().startsWith('subgraph ')) {
        const parts = l.split(' ');
        if (parts.length > 2) {
          const content = parts.slice(1).join(' ').replace(/"/g, '').replace(/[\[\]]/g, '');
          const id = content.replace(/[^a-z0-9]/gi, '_');
          l = `subgraph ${id} ["${content}"]`;
        }
      }

      // Sanitize reserved keywords used as IDs at line start
      l = l.replace(/^(TD|LR|BT|RL|graph|flowchart|subgraph|end)(\[)/i, 'node_$1$2');

      // Check for standalone text with spaces that isn't a reserved block
      const isReserved = /^(subgraph|end|style|class|click|linkStyle|title|accTitle|accDescr|note|participant|actor)/i.test(l);
      const hasBrackets = l.includes('[') || l.includes('(') || l.includes('{');
      const hasConnector = l.includes('-->') || l.includes('--') || l.includes('-.->') || l.includes('==>');
      
      if (!isReserved && !hasBrackets && !hasConnector && l.includes(' ')) {
        const id = l.replace(/[^a-z0-9]/gi, '_');
        l = `${id}["${l}"]`;
      }

      // Fix invalid arrow syntax
      l = l.replace(/-->\s*\|([^|]+)\|\s*>/g, '-->|$1|');
      l = l.replace(/--\s*\|([^|]+)\|\s*>/g, '--|$1|');

      // Convert standalone multi-word text to bracketed strings for parts of a connection
      if (/^[^\[({|]+(?=-->|--|-.->|==>)/.test(l)) {
        l = l.replace(/^([^\[({|]+)(?=-->|--|-.->|==>)/, (match) => {
          const labelText = match.trim();
          if (!labelText) return match;
          const id = labelText.replace(/[^a-z0-9]/gi, '_');
          return `${id}["${labelText}"] `;
        });
      }

      if (/(?:-->|--|-.->|==>|\|)\s*([^\[({|]+)$/.test(l)) {
        l = l.replace(/(?:(-->|--|-.->|==>|\|))\s*([^\[({|]+)$/, (match, conn, labelText) => {
          const label = labelText.trim();
          if (!label) return match;
          const id = label.replace(/[^a-z0-9]/gi, '_');
          return `${conn} ${id}["${label}"]`;
        });
      }

      return l;
    }).filter(Boolean);

    return processedLines.join('\n');
  };

  useEffect(() => {
    const renderDiagram = async () => {
      if (ref.current && chart) {
        try {
          setError(null);
          
          // Re-initialize with correct theme right before rendering
          mermaid.initialize({
            startOnLoad: false,
            theme: darkMode ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Sora, sans-serif',
            suppressErrorIndicators: true,
            themeVariables: darkMode ? {
              primaryColor: '#3b82f6',
              primaryTextColor: '#f8fafc',
              primaryBorderColor: '#1e293b',
              lineColor: '#94a3b8',
              secondaryColor: '#1e293b',
              tertiaryColor: '#0f172a',
            } : {}
          });

          const processedChart = cleanChart(chart);
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          const { svg } = await mermaid.render(id, processedChart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (err) {
          console.error("Mermaid render error:", err);
          setError(err.message || "Failed to render diagram. Syntax error in Mermaid code.");
        }
      }
    };
    renderDiagram();
  }, [chart, darkMode]);

  if (!chart) return null;

  return (
    <div style={{ position: 'relative' }}>
      {error && (
        <div style={{ 
          fontSize: '12px', 
          color: '#ef4444', 
          background: darkMode ? '#450a0a' : '#fef2f2', 
          padding: '12px', 
          borderRadius: '8px', 
          border: '1px solid #fee2e2',
          marginBottom: '10px'
        }}>
          <strong>Diagram Error:</strong> {error}
          <pre style={{ fontSize: '10px', marginTop: '8px', overflow: 'auto', background: 'rgba(0,0,0,0.05)', padding: '8px' }}>
            {cleanChart(chart)}
          </pre>
        </div>
      )}
      <div 
        className="mermaid" 
        ref={ref}
        style={{ 
          background: darkMode ? '#0f172a' : '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid',
          borderColor: darkMode ? '#334155' : '#e8e8ee',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100px',
          visibility: error ? 'hidden' : 'visible'
        }}
      >
      </div>
    </div>
  );
}
