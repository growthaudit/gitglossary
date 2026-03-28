import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conventional Commits — The Complete Guide | gitglossary",
  description: "Everything you need to know about Conventional Commits: format, types, scopes, breaking changes, and how to adopt it on your team. With an AI generator.",
  openGraph: {
    title: "Conventional Commits — The Complete Guide",
    description: "Master the Conventional Commits standard: format, types, real examples, and a free AI generator.",
    url: "https://gitglossary.com/conventional-commits",
  },
};

export default function ConventionalCommitsPage() {
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
            Conventional Commits
          </h1>
          <p className="text-lg text-text-muted leading-relaxed">
            The most widely adopted git commit message standard. Conventional Commits gives your history a
            machine-readable structure that enables automated changelogs, semantic versioning, and
            better code review tooling.
          </p>
        </div>

        {/* CTA */}
        <div className="mb-10 p-5 bg-accent-dim border border-accent/20 rounded-lg flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-sm text-accent mb-0.5">Try the AI generator</p>
            <p className="text-xs text-text-muted">Paste your diff, get a perfect Conventional Commit in seconds.</p>
          </div>
          <Link
            href="/?standard=conventional"
            className="shrink-0 px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-mono text-sm font-semibold rounded-lg transition-colors"
          >
            Open generator →
          </Link>
        </div>

        <section className="prose-section mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">The format</h2>
          <div className="p-4 bg-surface border border-border rounded-lg font-mono text-sm mb-4">
            <p className="text-accent mb-1">type(scope): description</p>
            <p className="text-text-faint text-xs">[blank line]</p>
            <p className="text-text-muted text-xs">Optional body explaining WHY</p>
            <p className="text-text-faint text-xs">[blank line]</p>
            <p className="text-text-muted text-xs">Optional footer: BREAKING CHANGE: ...</p>
          </div>
          <p className="text-text-muted leading-relaxed">
            The <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-text-primary">type</code> is
            required and describes the category of change. The <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-text-primary">scope</code> is
            optional but recommended — it names the part of the codebase affected. The description is a
            concise summary in imperative mood, under 72 characters.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">Commit types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { type: "feat", desc: "A new feature visible to users" },
              { type: "fix", desc: "A bug fix visible to users" },
              { type: "docs", desc: "Documentation changes only" },
              { type: "style", desc: "Formatting, whitespace — no logic change" },
              { type: "refactor", desc: "Code restructure with no feature/fix" },
              { type: "perf", desc: "Performance improvement" },
              { type: "test", desc: "Adding or fixing tests" },
              { type: "chore", desc: "Build tooling, deps, CI config" },
            ].map(({ type, desc }) => (
              <div key={type} className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg">
                <code className="font-mono text-xs text-accent bg-accent-dim px-2 py-1 rounded shrink-0">{type}</code>
                <span className="text-sm text-text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">Real examples</h2>
          <div className="flex flex-col gap-3">
            {[
              "feat(auth): add OAuth2 login with Google",
              "fix(api): handle null response in user.profile endpoint",
              "docs(readme): update setup instructions for M1 Macs",
              "perf(db): add index on users.email column",
              "refactor(payments): extract Stripe client into service layer",
              "feat!: replace REST API with GraphQL\n\nBREAKING CHANGE: all /api/v1 endpoints removed",
            ].map((example) => (
              <pre key={example} className="p-3 bg-surface border border-border rounded-lg font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
                {example}
              </pre>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">Breaking changes</h2>
          <p className="text-text-muted leading-relaxed mb-4">
            When your change breaks backward compatibility, you must signal it in two places: append{" "}
            <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-accent">!</code> after the
            type/scope, and add a <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded text-accent">BREAKING CHANGE:</code> footer
            explaining what changed and what users need to do.
          </p>
          <pre className="p-4 bg-surface border border-border rounded-lg font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
{`feat(auth)!: require email verification before first login

BREAKING CHANGE: users who registered before 2024-01-01 will be
prompted to verify their email on next login. Silent login no
longer supported for unverified accounts.`}
          </pre>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl text-text-primary font-semibold mb-4">Why adopt it?</h2>
          <ul className="flex flex-col gap-3">
            {[
              "Automated changelog generation — tools like release-please and semantic-release parse your commit types to build changelogs",
              "Semantic versioning — feat bumps MINOR, fix bumps PATCH, BREAKING CHANGE bumps MAJOR. Automate your releases.",
              "Better code review — reviewers immediately understand the intent of a commit from its type",
              "Searchable history — `git log --grep='^feat'` instantly shows all features added",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-muted text-sm leading-relaxed">
                <span className="text-accent font-mono text-xs mt-0.5 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-5 bg-surface border border-border rounded-lg">
          <h2 className="font-heading text-xl text-text-primary font-semibold mb-2">Related guides</h2>
          <div className="flex flex-col gap-2 mt-3">
            <Link href="/angular-commit-style" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors">Angular Commit Style →</Link>
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
            headline: "Conventional Commits — The Complete Guide",
            description: "Everything you need to know about the Conventional Commits standard",
            url: "https://gitglossary.com/conventional-commits",
            publisher: { "@type": "Organization", name: "gitglossary" },
          }),
        }}
      />
    </main>
  );
}
