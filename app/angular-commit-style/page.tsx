import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angular Commit Style — Complete Guide | gitglossary",
  description: "The Angular commit message convention: required scopes, breaking change footers, and stricter rules than standard Conventional Commits. With examples and an AI generator.",
  openGraph: {
    title: "Angular Commit Style — Complete Guide",
    url: "https://gitglossary.com/angular-commit-style",
  },
};

export default function AngularCommitStylePage() {
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
            <Link href="/git-commit-best-practices" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">Guide</Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Commit standard</p>
          <h1 className="font-heading text-4xl text-text-primary font-semibold tracking-tight mb-4">
            Angular Commit Style
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            The Angular project&apos;s commit message convention — the original inspiration for Conventional Commits.
            Stricter than its successor: scope is required on every commit, and breaking changes must follow
            an exact footer format.
          </p>
        </div>

        <div className="mb-10 p-5 bg-accent-dim border border-accent/20 rounded-lg flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-sm text-accent mb-0.5">Generate Angular-style commits</p>
            <p className="text-xs text-text-muted">Paste your diff and get a formatted Angular commit message.</p>
          </div>
          <Link
            href="/?standard=angular"
            className="shrink-0 px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-mono text-sm font-semibold rounded-lg transition-colors"
          >
            Open generator →
          </Link>
        </div>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">How it differs from Conventional Commits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text-muted font-normal text-xs uppercase tracking-widest">Rule</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-normal text-xs uppercase tracking-widest">Angular</th>
                  <th className="text-left py-2 text-text-muted font-normal text-xs uppercase tracking-widest">Conventional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Scope", "Required", "Optional"],
                  ["Breaking changes", "Footer only + ! in header", "Footer or ! in header"],
                  ["Revert format", "Strict: revert: + body hash", "Flexible"],
                  ["Footer format", "token: value (strict)", "Loosely defined"],
                ].map(([rule, angular, conventional]) => (
                  <tr key={rule} className="border-b border-border/50">
                    <td className="py-2.5 pr-4 text-text-primary text-xs">{rule}</td>
                    <td className="py-2.5 pr-4 text-xs text-accent">{angular}</td>
                    <td className="py-2.5 text-xs text-text-muted">{conventional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">The format</h2>
          <div className="p-4 bg-surface border border-border rounded-lg font-mono text-sm mb-4">
            <p className="text-accent">type(scope): description</p>
            <p className="text-text-faint text-xs mt-2">[blank line]</p>
            <p className="text-text-muted text-xs">Body (optional)</p>
            <p className="text-text-faint text-xs">[blank line]</p>
            <p className="text-text-muted text-xs">BREAKING CHANGE: explanation</p>
            <p className="text-text-muted text-xs">Fixes #issue-number</p>
          </div>
          <p className="text-text-muted leading-relaxed text-sm">
            The scope is non-negotiable — every commit must identify which part of the codebase it affects.
            This keeps large monorepos scannable and makes automated tooling more reliable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">Commit types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"].map((type) => (
              <code key={type} className="font-mono text-xs text-accent bg-surface border border-border px-2.5 py-1.5 rounded text-center">
                {type}
              </code>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-3 font-mono">
            Note: <span className="text-text-primary">build</span> and <span className="text-text-primary">ci</span> are explicit Angular types — not in the base Conventional spec.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">Examples</h2>
          <div className="flex flex-col gap-3">
            {[
              "feat(compiler): add strict null checks in template expressions",
              "fix(router): prevent navigation loop on hash change",
              "perf(core): memoize change detection in OnPush components",
              `feat(http)!: remove deprecated HttpModule in favour of provideHttpClient

BREAKING CHANGE: HttpModule has been removed. Migrate to provideHttpClient()
in your app config. See migration guide at angular.dev/migration/http`,
              `revert: feat(router): add hash-based location strategy

This reverts commit a1b2c3d4.`,
            ].map((example) => (
              <pre key={example} className="p-3 bg-surface border border-border rounded-lg font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
                {example}
              </pre>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">When to use Angular style</h2>
          <ul className="flex flex-col gap-3">
            {[
              "Large monorepos with multiple packages where scope is critical for routing automated tooling",
              "Teams that want maximal commit history clarity — scope requirement prevents vague commits",
              "Projects using Angular's own tooling (ng generate changelog, semantic versioning bots)",
              "Orgs that adopted it before Conventional Commits was formalised and want to stay consistent",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-muted text-sm leading-relaxed">
                <span className="text-accent font-mono text-xs mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 bg-surface border border-border rounded-lg">
          <h2 className="font-heading text-xl text-text-primary font-semibold mb-3">Related guides</h2>
          <div className="flex flex-col gap-2">
            <Link href="/conventional-commits" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors">Conventional Commits →</Link>
            <Link href="/git-commit-best-practices" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors">Git Commit Best Practices →</Link>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Angular Commit Style — Complete Guide",
            description: "The Angular project commit message convention with required scopes and strict breaking change format",
            url: "https://gitglossary.com/angular-commit-style",
            publisher: { "@type": "Organization", name: "gitglossary" },
          }),
        }}
      />
    </main>
  );
}
