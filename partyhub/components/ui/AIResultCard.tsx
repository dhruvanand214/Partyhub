"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface Props {
  result: string;
}

function tryParse(raw: string) {
  try {
    // Extract JSON from markdown code blocks if present
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    return JSON.parse(match ? match[1] : raw);
  } catch {
    return null;
  }
}

export default function AIResultCard({ result }: Props) {
  const [expanded, setExpanded] = useState(true);
  const parsed = tryParse(result);

  return (
    <div className="glass rounded-3xl overflow-hidden mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-base">AI Recommendation</span>
        </div>
        {expanded ? (
          <ChevronUp size={20} className="text-white/50" />
        ) : (
          <ChevronDown size={20} className="text-white/50" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          {parsed ? (
            <ParsedResult data={parsed} />
          ) : (
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ParsedResult({ data }: { data: any }) {
  const renderValue = (val: any, depth = 0): React.ReactNode => {
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      return (
        <span className="text-white/80 text-sm">{String(val)}</span>
      );
    }

    if (Array.isArray(val)) {
      return (
        <ul className="space-y-2 mt-1">
          {val.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-orange-400 mt-0.5 shrink-0">•</span>
              <div className="flex-1">
                {typeof item === "object" ? (
                  <div className="glass rounded-2xl p-3 space-y-1">
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-xs text-white/40 capitalize">
                          {k.replace(/([A-Z])/g, " $1")}:{" "}
                        </span>
                        <span className="text-sm text-white/80">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-white/80">{String(item)}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof val === "object" && val !== null) {
      return (
        <div className={`space-y-3 ${depth > 0 ? "pl-3 border-l border-white/10 mt-2" : ""}`}>
          {Object.entries(val).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                {k.replace(/([A-Z])/g, " $1")}
              </p>
              {renderValue(v, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return <div>{renderValue(data)}</div>;
}