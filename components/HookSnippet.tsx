"use client";

import { useState } from "react";

interface HookSnippetProps {
  standard: string;
  slug?: string;
}

function buildSnippet(standard: string, slug?: string): string {
  return `#!/bin/bash
# gitglossary.com — AI commit message generator
# Install: save this file to .git/hooks/prepare-commit-msg && chmod +x .git/hooks/prepare-commit-msg
# Global:  mkdir -p ~/.git-hooks && save there, then: git config --global core.hooksPath ~/.git-hooks

COMMIT_MSG_FILE="$1"
COMMIT_SOURCE="$2"

# Only run for blank commits (not merges, amends, etc.)
if [ -n "$COMMIT_SOURCE" ]; then
  exit 0
fi

# Get staged diff
DIFF=$(git diff --cached)

if [ -z "$DIFF" ]; then
  exit 0
fi

echo "Generating commit message via gitglossary.com..." >&2

RESPONSE=$(curl -s -X POST https://gitglossary.com/api/generate \\
  -H "Content-Type: application/json" \\
  -d "$(jq -n \\
    --arg diff "$DIFF" \\
    --arg standard "${standard}"${slug ? ` \\\n    --arg slug "${slug}"` : ""} \\
    '{diff: $diff, standard: $standard${slug ? ", slug: $slug" : ""}}')" )

MESSAGE=$(echo "$RESPONSE" | jq -r '.message // empty')

if [ -n "$MESSAGE" ]; then
  echo "$MESSAGE" > "$COMMIT_MSG_FILE"
  echo "Done. Edit the message above if needed." >&2
else
  echo "Could not generate message — writing diff summary instead." >&2
fi`;
}

export default function HookSnippet({ standard, slug }: HookSnippetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = buildSnippet(standard, slug);

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-mono text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-accent">$</span> Use in your terminal
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-2">
            <span className="text-xs font-mono text-text-faint">.git/hooks/prepare-commit-msg</span>
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
          </div>
          <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed bg-background">
            <code>
              {snippet.split("\n").map((line, i) => {
                if (line.startsWith("#")) {
                  return <span key={i} className="text-text-faint">{line}{"\n"}</span>;
                }
                if (line.match(/^(if|fi|then|else|exit|echo|DIFF|RESPONSE|MESSAGE|COMMIT)/)) {
                  return <span key={i} className="text-text-primary">{line}{"\n"}</span>;
                }
                return <span key={i} className="text-text-muted">{line}{"\n"}</span>;
              })}
            </code>
          </pre>
          <div className="px-4 py-3 border-t border-border bg-surface-2">
            <p className="text-xs text-text-faint font-mono">
              Requires <span className="text-text-muted">curl</span> and <span className="text-text-muted">jq</span>.
              {" "}Install with: <span className="text-accent">brew install jq</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
