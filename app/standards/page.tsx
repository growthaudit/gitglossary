import { getPublicStandards } from "@/lib/supabase";
import { STANDARDS } from "@/lib/standards";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Team Standards — gitglossary",
  description: "Explore shared git commit standards from teams around the world. Find a standard your team can adopt, or save your own.",
};

export const revalidate = 60; // ISR: revalidate every 60s

export default async function StandardsPage() {
  let standards: Awaited<ReturnType<typeof getPublicStandards>> = [];

  try {
    standards = await getPublicStandards();
  } catch {
    // Supabase not configured — show empty state
  }

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
            <Link href="/standards" className="text-xs font-mono text-accent">Standards</Link>
            <Link href="/git-commit-best-practices" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">Guide</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-3xl text-text-primary font-semibold tracking-tight mb-2">
            Team standards
          </h1>
          <p className="text-text-muted max-w-lg">
            Public commit standards saved by teams. Click any to use it as your generator preset — or{" "}
            <Link href="/" className="text-accent hover:text-accent-hover transition-colors">save your own</Link>.
          </p>
        </div>

        {/* Built-in standards */}
        <section className="mb-12">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
            Built-in
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(STANDARDS).filter(s => s.id !== "custom").map((s) => (
              <Link
                key={s.id}
                href={`/?standard=${s.id}`}
                className="group p-4 bg-surface border border-border hover:border-accent/30 rounded-lg flex flex-col gap-2 transition-colors"
              >
                <span className="font-mono text-sm text-text-primary group-hover:text-accent transition-colors">
                  {s.name}
                </span>
                <p className="text-xs text-text-muted leading-relaxed">{s.description}</p>
                <code className="text-xs font-mono text-text-faint mt-auto pt-2 border-t border-border">
                  {s.example.split("\n")[0]}
                </code>
              </Link>
            ))}
          </div>
        </section>

        {/* Community standards */}
        <section>
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
            Community
          </h2>
          {standards.length === 0 ? (
            <div className="py-12 text-center border border-border rounded-lg bg-surface">
              <p className="text-text-muted font-mono text-sm">No public standards yet.</p>
              <p className="text-text-faint font-mono text-xs mt-1">Be the first to save your team&apos;s standard →</p>
              <Link
                href="/"
                className="inline-flex mt-4 items-center gap-1.5 text-sm font-mono text-accent hover:text-accent-hover transition-colors"
              >
                Create a standard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {standards.map((s) => (
                <Link
                  key={s.slug}
                  href={`/standards/${s.slug}`}
                  className="group p-4 bg-surface border border-border hover:border-accent/30 rounded-lg flex flex-col gap-2 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-sm text-text-primary group-hover:text-accent transition-colors">
                      {s.name}
                    </span>
                    <span className="shrink-0 text-xs font-mono px-1.5 py-0.5 bg-muted rounded text-text-muted">
                      {STANDARDS[s.base_standard as keyof typeof STANDARDS]?.name ?? s.base_standard}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-text-faint">
                    gitglossary.com/standards/{s.slug}
                  </p>
                  {s.use_count > 0 && (
                    <p className="text-xs font-mono text-text-muted mt-auto">
                      {s.use_count.toLocaleString()} generation{s.use_count !== 1 ? "s" : ""}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Git Commit Standards — gitglossary",
            description: "Browse public git commit message standards from teams worldwide",
            url: "https://gitglossary.com/standards",
          }),
        }}
      />
    </main>
  );
}
