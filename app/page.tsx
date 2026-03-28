"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DiffInput from "@/components/DiffInput";
import StandardSelector from "@/components/StandardSelector";
import MessageOutput from "@/components/MessageOutput";
import HookSnippet from "@/components/HookSnippet";
import SaveStandardModal from "@/components/SaveStandardModal";
import { StandardId } from "@/lib/standards";
import Link from "next/link";

function GeneratorInner() {
  const searchParams = useSearchParams();
  const presetStandard = searchParams.get("standard") as StandardId | null;
  const presetSlug = searchParams.get("slug");

  const [diff, setDiff] = useState("");
  const [standard, setStandard] = useState<StandardId>(
    presetStandard ?? "conventional"
  );
  const [ticketNumber, setTicketNumber] = useState("");
  const [customRules, setCustomRules] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Sync from URL params when they change
  useEffect(() => {
    if (presetStandard) setStandard(presetStandard);
  }, [presetStandard]);

  async function handleGenerate() {
    if (!diff.trim()) {
      setError("Paste a git diff first.");
      return;
    }
    setError("");
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diff,
          standard,
          customRules: customRules || undefined,
          ticketNumber: ticketNumber || undefined,
          slug: presetSlug || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setMessage(data.message);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Input panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiffInput value={diff} onChange={setDiff} disabled={isLoading} />
        <StandardSelector
          value={standard}
          onChange={setStandard}
          ticketNumber={ticketNumber}
          onTicketChange={setTicketNumber}
          customRules={customRules}
          onCustomRulesChange={setCustomRules}
          disabled={isLoading}
        />
      </div>

      {/* Generate button */}
      <div className="flex flex-col gap-2">
        {error && (
          <p className="text-sm font-mono text-error">{error}</p>
        )}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !diff.trim()}
          className="w-full lg:w-auto lg:self-start flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-black font-mono text-sm font-semibold rounded-lg transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 14" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Generate commit message
            </>
          )}
        </button>
      </div>

      {/* Output */}
      <MessageOutput message={message} isLoading={isLoading} />

      {/* Hook snippet */}
      <HookSnippet standard={standard} slug={presetSlug ?? undefined} />

      {/* Save CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-sm text-text-muted">
          Enforce this standard across your whole team.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-sm font-mono text-accent hover:text-accent-hover transition-colors"
        >
          Save as team standard →
        </button>
      </div>

      {showModal && (
        <SaveStandardModal
          standard={standard}
          customRules={customRules}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background bg-noise">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-mono text-sm font-bold tracking-tight">git</span>
            <span className="font-heading text-text-primary text-lg font-semibold tracking-tight">glossary</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/standards" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">
              Standards
            </Link>
            <Link href="/git-commit-best-practices" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">
              Guide
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl text-text-primary font-semibold tracking-tight mb-3">
            Perfect git commits,{" "}
            <span className="text-accent">every time.</span>
          </h1>
          <p className="text-text-muted text-base max-w-xl">
            Paste your diff, pick your standard, get a commit message that fits your team&apos;s format exactly.
          </p>
        </div>

        <Suspense fallback={<div className="text-text-muted font-mono text-sm">Loading…</div>}>
          <GeneratorInner />
        </Suspense>
      </section>

      {/* Below-fold: standards overview */}
      <section className="border-t border-border mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-2">
            Five standards built in.
          </h2>
          <p className="text-text-muted mb-8 max-w-lg">
            Pick the format your team already uses — or save a custom one with your own rules.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Conventional Commits", example: "feat(auth): add OAuth2 login", badge: "popular" },
              { name: "Angular Style", example: "fix(api): handle null response in parser" },
              { name: "Emoji Prefix", example: "✨ Add user profile photo upload" },
              { name: "Jira-Linked", example: "[APP-1234] Fix session timeout bug" },
              { name: "Simple", example: "Fix race condition in token refresh" },
              { name: "Custom", example: "Define your own rules for your team", isCustom: true },
            ].map((item) => (
              <div
                key={item.name}
                className={`p-4 bg-surface border rounded-lg flex flex-col gap-2 ${item.isCustom ? "border-accent/30 bg-accent-dim" : "border-border"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-text-primary">{item.name}</span>
                  {item.badge && (
                    <span className="text-xs font-mono px-1.5 py-0.5 bg-accent/10 text-accent rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                <code className="text-xs font-mono text-text-muted leading-relaxed">{item.example}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-text-faint">
            gitglossary.com — AI-powered git commit messages
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/conventional-commits" className="text-xs font-mono text-text-faint hover:text-text-muted transition-colors">Conventional Commits</Link>
            <Link href="/angular-commit-style" className="text-xs font-mono text-text-faint hover:text-text-muted transition-colors">Angular Style</Link>
            <Link href="/git-commit-best-practices" className="text-xs font-mono text-text-faint hover:text-text-muted transition-colors">Best Practices</Link>
            <Link href="/standards" className="text-xs font-mono text-text-faint hover:text-text-muted transition-colors">Standards</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
