"use client";

import { useState } from "react";

interface MessageOutputProps {
  message: string;
  isLoading: boolean;
}

export default function MessageOutput({ message, isLoading }: MessageOutputProps) {
  const [copied, setCopied] = useState(false);

  const subjectLine = message.split("\n")[0] ?? "";
  const subjectLen = subjectLine.length;

  const charColor =
    subjectLen === 0
      ? "text-text-faint"
      : subjectLen <= 72
      ? "text-success"
      : subjectLen <= 80
      ? "text-accent"
      : "text-error";

  async function handleCopy() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Commit message
        </label>
        <div className="flex items-center gap-3">
          {subjectLen > 0 && (
            <span className={`text-xs font-mono ${charColor}`}>
              {subjectLen} chars
            </span>
          )}
          {message && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-accent transition-colors"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="relative min-h-[120px] bg-surface border border-border rounded-lg p-4 font-mono text-sm">
        {isLoading ? (
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-0" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : message ? (
          <pre className="whitespace-pre-wrap text-text-primary leading-relaxed">{message}</pre>
        ) : (
          <span className="text-text-faint">Your commit message will appear here…</span>
        )}
      </div>
    </div>
  );
}
