import { notFound } from "next/navigation";
import { getStandardBySlug } from "@/lib/supabase";
import { STANDARDS } from "@/lib/standards";
import Link from "next/link";
import HookSnippet from "@/components/HookSnippet";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let standard = null;
  try {
    standard = await getStandardBySlug(params.slug);
  } catch {}

  if (!standard) {
    return { title: "Standard not found — gitglossary" };
  }

  return {
    title: `${standard.name} — gitglossary`,
    description: `${standard.name} git commit standard — ${STANDARDS[standard.base_standard as keyof typeof STANDARDS]?.description ?? standard.base_standard}. Use this standard with your team.`,
    openGraph: {
      title: `${standard.name} — gitglossary`,
      url: `https://gitglossary.com/standards/${standard.slug}`,
    },
  };
}

export const revalidate = 300;

export default async function StandardSlugPage({ params }: Props) {
  let standard = null;
  try {
    standard = await getStandardBySlug(params.slug);
  } catch {}

  if (!standard) {
    notFound();
  }

  const baseStandard = STANDARDS[standard.base_standard as keyof typeof STANDARDS];
  const generatorUrl = `/?standard=${standard.base_standard}&slug=${standard.slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${standard.name} git commit standard?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${standard.name} is a team git commit standard based on ${baseStandard?.name ?? standard.base_standard}. ${standard.custom_rules ? `Custom rules: ${standard.custom_rules}` : ""}`,
        },
      },
      {
        "@type": "Question",
        name: "How do I use this standard in my git workflow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Install the git hook snippet below to automatically generate commit messages in this format whenever you commit. Or use the generator above to create messages manually.",
        },
      },
    ],
  };

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
            <Link href="/standards" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">Standards</Link>
            <Link href="/git-commit-best-practices" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors">Guide</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-mono text-text-faint">
          <Link href="/standards" className="hover:text-text-muted transition-colors">standards</Link>
          <span>/</span>
          <span className="text-text-muted">{standard.slug}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-heading text-3xl text-text-primary font-semibold tracking-tight">
              {standard.name}
            </h1>
            <a
              href={`https://gitglossary.com/standards/${standard.slug}`}
              className="shrink-0 flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-accent transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M5 6a2.5 2.5 0 003.54.04l1.5-1.5A2.5 2.5 0 006.5 1L5.75 1.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M7 6a2.5 2.5 0 00-3.54-.04l-1.5 1.5A2.5 2.5 0 005.5 11l.75-.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Copy link
            </a>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono px-2 py-1 bg-surface border border-border rounded text-text-muted">
              Based on: {baseStandard?.name ?? standard.base_standard}
            </span>
            {standard.use_count > 0 && (
              <span className="text-xs font-mono text-text-faint">
                {standard.use_count.toLocaleString()} generation{standard.use_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Standard rules */}
        <section className="mb-8 p-5 bg-surface border border-border rounded-lg">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">Format rules</h2>
          <pre className="font-mono text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
            {baseStandard?.rules ?? ""}
          </pre>
          {standard.custom_rules && (
            <>
              <div className="my-4 border-t border-border" />
              <h3 className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Additional rules</h3>
              <pre className="font-mono text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                {standard.custom_rules}
              </pre>
            </>
          )}
        </section>

        {/* Use the generator */}
        <section className="mb-8 p-5 bg-accent-dim border border-accent/20 rounded-lg">
          <h2 className="font-mono text-sm text-accent mb-2">Generate a commit message with this standard</h2>
          <p className="text-sm text-text-muted mb-4">
            The generator will be pre-loaded with{" "}<span className="text-text-primary">{standard.name}</span> rules.
          </p>
          <Link
            href={generatorUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-mono text-sm font-semibold rounded-lg transition-colors"
          >
            Open generator →
          </Link>
        </section>

        {/* Hook snippet */}
        <section className="mb-8">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">Git hook</h2>
          <HookSnippet standard={standard.base_standard} slug={standard.slug} />
        </section>

        {/* Share */}
        <section className="py-6 border-t border-border">
          <p className="text-sm text-text-muted mb-1">Share this standard with your team:</p>
          <code className="font-mono text-xs text-accent">
            https://gitglossary.com/standards/{standard.slug}
          </code>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}

