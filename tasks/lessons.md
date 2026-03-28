# Lessons Learned

## Build Process

### create-next-app interactive prompts are not fully scriptable
`npx create-next-app@latest` added new prompts (React Compiler, AGENTS.md) that don't honour
piped stdin in the same shell session. Workaround: build the project structure manually.
This is faster and gives more control over the output anyway.

### Next.js 14 has a known security vulnerability (fixed in 15)
`next@14.2.29` triggers a security warning on install. The fix is in Next.js 15.
For this build we stayed on 14 per the spec, but a production upgrade path would be:
- `npm install next@15` — App Router API is largely compatible
- Only breaking change: `cookies()`, `headers()`, `params`, `searchParams` become async

## Architecture Patterns

### In-memory rate limiting resets on serverless cold starts
The module-level `rateLimitMap` works well for dev but on serverless each function instance
has its own memory. For production enforcement, replace with Vercel KV:
```ts
import { kv } from '@vercel/kv';
const count = await kv.incr(`rl:${ip}`);
if (count === 1) await kv.expire(`rl:${ip}`, 3600);
```

### Client components with useSearchParams need Suspense boundary
Next.js App Router requires `useSearchParams()` to be wrapped in `<Suspense>` during
static rendering. Pattern: extract the component using the hook into a child component,
wrap with `<Suspense fallback={...}>` in the parent.

### Server components can import client components directly
A server page (no `"use client"`) can import and render client components. Next.js
handles the boundary automatically. No need for a "ServerVersion" wrapper component.

## Design

### Tailwind custom colors need to be CSS-safe names
Custom color names like `surface-2` work in Tailwind config but the CSS variable
`--tw-color-surface-2` can cause issues. Prefer all-lowercase no-hyphen names for
reliable JIT compilation. `surface2` over `surface-2`.

### bg-noise utility requires the SVG to be URL-encoded
The SVG noise background must have all special characters URL-encoded in the
`data:image/svg+xml` string. Use `%3C` for `<`, `%3E` for `>`, `%23` for `#`, etc.
