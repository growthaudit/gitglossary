import { NextRequest, NextResponse } from "next/server";
import { generateCommitMessage } from "@/lib/anthropic";
import { STANDARDS, StandardId } from "@/lib/standards";
import { incrementUseCount } from "@/lib/supabase";

// Simple in-memory rate limiter: IP → { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Maximum 10 requests per hour." },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      }
    );
  }

  let body: {
    diff?: string;
    standard?: string;
    customRules?: string;
    ticketNumber?: string;
    slug?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { diff, standard, customRules, ticketNumber, slug } = body;

  if (!diff || typeof diff !== "string" || diff.trim().length === 0) {
    return NextResponse.json({ error: "diff is required" }, { status: 400 });
  }

  if (!standard || !(standard in STANDARDS)) {
    return NextResponse.json(
      { error: `standard must be one of: ${Object.keys(STANDARDS).join(", ")}` },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API not configured" },
      { status: 503 }
    );
  }

  try {
    const message = await generateCommitMessage({
      diff,
      standard: standard as StandardId,
      customRules,
      ticketNumber,
    });

    // Fire-and-forget use count increment
    if (slug) {
      incrementUseCount(slug).catch(() => {});
    }

    return NextResponse.json(
      { message },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate commit message. Please try again." },
      { status: 500 }
    );
  }
}
