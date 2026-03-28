import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Git Commit Best Practices — The Definitive Guide | gitglossary",
  description: "Write better git commit messages: imperative mood, atomic commits, what to put in the body, subject line limits, and how to enforce standards with hooks. Real examples included.",
  openGraph: {
    title: "Git Commit Best Practices — The Definitive Guide",
    url: "https://gitglossary.com/git-commit-best-practices",
  },
};

export default function GitCommitBestPracticesPage() {
  return (
    <main className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-mono text-sm font-bold">git</span>
            <span className="font-heading text-text-primary text-lg font-semibold">glossary</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/standards" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">Standards</Link>
            <Link href="/git-commit-best-practices" className="text-xs font-mono text-accent">Guide</Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Guide</p>
          <h1 className="font-heading text-4xl text-text-primary font-semibold tracking-tight mb-4">
            Git Commit Best Practices
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            A good commit message is the difference between a history you can navigate and one you dread.
            These rules apply regardless of which convention your team uses.
          </p>
        </div>

        <div className="mb-10 p-5 bg-accent-dim border border-accent/20 rounded-lg flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-sm text-accent mb-0.5">Stop writing commit messages manually</p>
            <p className="text-xs text-text-muted">Paste your diff and let AI generate a best-practice message.</p>
          </div>
          <Link
            href="/"
            className="shrink-0 px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-mono text-sm font-semibold rounded-lg transition-colors"
          >
            Try the generator →
          </Link>
        </div>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">1. Use imperative mood</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Write your subject line as if completing the sentence: &ldquo;If applied, this commit will…&rdquo;
            Git itself uses imperative mood in its own generated messages (Merge branch, Revert &ldquo;…&rdquo;).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-mono text-error mb-2 uppercase tracking-widest">Wrong</p>
              {["Fixed the login bug", "Adding user authentication", "I changed the database schema"].map(m => (
                <div key={m} className="flex items-center gap-2 p-2 mb-1.5 bg-surface border border-border/50 rounded">
                  <span className="text-error text-xs">✗</span>
                  <code className="font-mono text-xs text-text-muted">{m}</code>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-mono text-success mb-2 uppercase tracking-widest">Right</p>
              {["Fix login bug in session handler", "Add user authentication", "Update database schema for multi-tenancy"].map(m => (
                <div key={m} className="flex items-center gap-2 p-2 mb-1.5 bg-surface border border-border/50 rounded">
                  <span className="text-success text-xs">✓</span>
                  <code className="font-mono text-xs text-text-primary">{m}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">2. Keep the subject line under 72 characters</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Most git tools truncate at 72 characters in log views. GitHub wraps at 72. <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-text-primary">git log --oneline</code> is
            unreadable when lines wrap. The 72-character limit forces clarity — if you can&apos;t describe
            the change in 72 characters, the commit is probably doing too much.
          </p>
          <div className="p-3 bg-surface border border-border rounded font-mono text-xs overflow-x-auto">
            <p className="text-success">✓ feat(auth): add JWT refresh token rotation (44 chars)</p>
            <p className="text-error mt-1">✗ feat(auth): add JWT refresh token rotation and update the session management to handle the new token lifecycle properly (116 chars)</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">3. Explain why, not what</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            The diff shows <em>what</em> changed. The commit body should explain <em>why</em> you made the change —
            the business context, the bug that triggered it, the trade-off you made. Future you (or your colleague
            at 2am) will thank you.
          </p>
          <pre className="p-4 bg-surface border border-border rounded font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
{`fix(auth): increase bcrypt rounds from 10 to 12

Security audit flagged that bcrypt with 10 rounds completes in ~100ms
on modern hardware — below the OWASP recommended 250ms threshold.
Increasing to 12 rounds brings hashing time to ~400ms on our servers.

No user-facing impact; existing password hashes remain valid.
Ref: internal security audit #SA-2024-018`}
          </pre>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">4. Commit one logical change at a time</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Atomic commits make bisect work, make reverts safe, and make code review comprehensible.
            If your commit message requires &ldquo;and&rdquo; to describe it, split the commit.
          </p>
          <div className="space-y-3">
            <div className="p-3 border border-error/30 bg-surface rounded">
              <p className="text-xs font-mono text-error mb-1">Avoid</p>
              <code className="font-mono text-xs text-text-muted">fix(api): fix auth bug, update deps, reformat user service</code>
            </div>
            <div className="p-3 border border-success/30 bg-surface rounded">
              <p className="text-xs font-mono text-success mb-2">Better — three commits:</p>
              <div className="space-y-1">
                <code className="block font-mono text-xs text-text-primary">fix(api): handle missing auth header in middleware</code>
                <code className="block font-mono text-xs text-text-primary">chore(deps): upgrade express from 4.18 to 4.19</code>
                <code className="block font-mono text-xs text-text-primary">style(user): run prettier on UserService</code>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">5. Be specific</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Vague commit messages are noise. Name the component, method, or file. If you fixed a bug,
            say where and what it caused.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { bad: "Fix bug", good: "Fix null check in UserService.authenticate()" },
              { bad: "Update code", good: "Refactor payment module to use Strategy pattern" },
              { bad: "Add feature", good: "Add CSV export to analytics dashboard" },
              { bad: "Fix tests", good: "Fix flaky integration test in OrderController" },
            ].map(({ bad, good }) => (
              <div key={bad} className="flex flex-col gap-1.5 p-3 bg-surface border border-border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-error text-xs">✗</span>
                  <code className="font-mono text-xs text-text-muted">{bad}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-success text-xs">✓</span>
                  <code className="font-mono text-xs text-text-primary">{good}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">6. Enforce it with a hook</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Good intentions break down under deadline pressure. Use a <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-text-primary">prepare-commit-msg</code> hook
            to automate message generation, and a <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-text-primary">commit-msg</code> hook to validate format.
            gitglossary.com generates the hook snippet automatically.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-accent hover:text-accent-hover transition-colors"
          >
            Get your hook snippet →
          </Link>
        </section>

        <section className="p-5 bg-surface border border-border rounded-lg">
          <h2 className="font-heading text-xl text-text-primary font-semibold mb-3">Pick a standard for your team</h2>
          <div className="flex flex-col gap-2">
            <Link href="/conventional-commits" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors">Conventional Commits →</Link>
            <Link href="/angular-commit-style" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors">Angular Commit Style →</Link>
            <Link href="/standards" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors">Browse team standards →</Link>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Git Commit Best Practices — The Definitive Guide",
            description: "How to write better git commit messages: imperative mood, atomic commits, body content, and enforcement via hooks",
            url: "https://gitglossary.com/git-commit-best-practices",
            publisher: { "@type": "Organization", name: "gitglossary" },
          }),
        }}
      />
    </main>
  );
}
