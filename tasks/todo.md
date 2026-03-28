# gitglossary.com — Build Checklist

## Phase 1 — Scaffold
- [x] Create Next.js 14 app structure manually (create-next-app prompts were non-scriptable)
- [x] Install dependencies: @anthropic-ai/sdk, @supabase/supabase-js
- [x] Configure Tailwind with custom design tokens (amber accent, near-black bg, JetBrains Mono)
- [x] Set up fonts: JetBrains Mono + Fraunces via next/font/google
- [x] Create .env.local with all required keys

## Phase 2 — Library Layer
- [x] `lib/standards.ts` — 6 standards with full rules text
- [x] `lib/anthropic.ts` — generateCommitMessage() with diff truncation at 8000 chars
- [x] `lib/supabase.ts` — server/browser clients, CRUD helpers

## Phase 3 — API Routes
- [x] `app/api/generate/route.ts` — Claude proxy, in-memory rate limiting (10 req/hr), input validation
- [x] `app/api/standards/route.ts` — GET list, POST save
- [x] `app/api/standards/[slug]/route.ts` — GET by slug

## Phase 4 — Components
- [x] `components/DiffInput.tsx` — textarea with char counter, placeholder diff
- [x] `components/StandardSelector.tsx` — styled select + Jira ticket input + custom rules textarea
- [x] `components/MessageOutput.tsx` — output with copy button, char count colour coding
- [x] `components/HookSnippet.tsx` — collapsible bash hook snippet with copy
- [x] `components/SaveStandardModal.tsx` — slug/name form → POST → shareable URL

## Phase 5 — Pages
- [x] `app/page.tsx` — homepage generator (client component, useSearchParams for preset standard)
- [x] `app/standards/page.tsx` — browse built-in + community standards
- [x] `app/standards/[slug]/page.tsx` — individual standard page with generator CTA + hook

## Phase 6 — SEO Pages
- [x] `app/conventional-commits/page.tsx` — full guide (~500 words + examples)
- [x] `app/angular-commit-style/page.tsx` — angular style guide with comparison table
- [x] `app/git-commit-best-practices/page.tsx` — broad best practices guide

## Phase 7 — Infrastructure
- [x] `app/layout.tsx` — fonts, base metadata, SoftwareApplication JSON-LD
- [x] `app/globals.css` — scrollbar, selection, global resets
- [x] `app/opengraph-image.tsx` — 1200×630 OG image (Next.js ImageResponse)
- [x] `app/sitemap.ts` — static + dynamic routes from Supabase
- [x] `app/robots.ts`

## Supabase Setup (manual — run in Supabase SQL editor)
```sql
create table standards (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  base_standard text not null,
  custom_rules text,
  created_at timestamp default now(),
  use_count integer default 0,
  pro_unlock boolean default false
);

-- RLS
alter table standards enable row level security;
create policy "Public standards readable" on standards
  for select using (pro_unlock = false);
create policy "Service role can write" on standards
  for all using (auth.role() = 'service_role');

-- Increment function for use_count
create or replace function increment_use_count(standard_slug text)
returns void language sql security definer as $$
  update standards set use_count = use_count + 1 where slug = standard_slug;
$$;
```

## Verification Gates
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run dev` — paste diff → generate → message appears
- [ ] Each standard produces different output format
- [ ] Save modal → Supabase row → shareable URL
- [ ] Hook snippet is valid bash (test in terminal)
- [ ] Rate limit fires on 11th request (429)
- [ ] Mobile at 375px — usable
- [ ] sitemap.xml resolves

## Deploy
- [ ] `vercel link`
- [ ] Add env vars in Vercel dashboard
- [ ] `vercel --prod`
