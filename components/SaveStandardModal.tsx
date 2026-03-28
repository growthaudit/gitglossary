"use client";

import { useState } from "react";
import { StandardId, STANDARDS } from "@/lib/standards";

interface SaveStandardModalProps {
  standard: StandardId;
  customRules?: string;
  onClose: () => void;
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

export default function SaveStandardModal({ standard, customRules, onClose }: SaveStandardModalProps) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedUrl, setSavedUrl] = useState("");

  const slugValid = SLUG_REGEX.test(slug);
  const slugError =
    slug.length > 0 && !slugValid
      ? "Lowercase letters, numbers, hyphens. 3–50 chars."
      : "";

  async function handleSave() {
    if (!slugValid || !name.trim()) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name: name.trim(),
          base_standard: standard,
          custom_rules: customRules || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setSavedUrl(`https://gitglossary.com/standards/${slug}`);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  const [urlCopied, setUrlCopied] = useState(false);
  async function handleCopyUrl() {
    await navigator.clipboard.writeText(savedUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-heading text-lg text-text-primary">Save team standard</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {savedUrl ? (
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-text-primary">
                Your standard is live. Share this URL with your team:
              </p>
              <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                <span className="flex-1 font-mono text-xs text-accent truncate">{savedUrl}</span>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1 text-xs font-mono text-text-muted hover:text-accent transition-colors shrink-0"
                >
                  {urlCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted">
              Anyone with this link will have your standard pre-selected when they generate a commit message.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover text-black font-mono text-sm font-semibold rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
                URL slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="acme-engineering"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-colors"
              />
              {slugError && (
                <p className="text-xs text-error font-mono">{slugError}</p>
              )}
              {slug.length >= 3 && slugValid && (
                <p className="text-xs text-text-faint font-mono">
                  gitglossary.com/standards/<span className="text-accent">{slug}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-text-muted uppercase tracking-widest">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Engineering"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 bg-accent-dim border border-accent/20 rounded-lg">
              <span className="font-mono text-xs text-text-muted">Base standard:</span>
              <span className="font-mono text-xs text-accent">{STANDARDS[standard].name}</span>
            </div>

            {error && (
              <p className="text-xs text-error font-mono">{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !slugValid || !name.trim()}
              className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono text-sm font-semibold rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Save standard →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
