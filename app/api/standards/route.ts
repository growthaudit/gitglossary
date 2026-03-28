import { NextRequest, NextResponse } from "next/server";
import { saveStandard, getPublicStandards } from "@/lib/supabase";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ standards: [] });
  }

  const standards = await getPublicStandards();
  return NextResponse.json({ standards });
}

export async function POST(req: NextRequest) {
  let body: {
    slug?: string;
    name?: string;
    base_standard?: string;
    custom_rules?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, name, base_standard, custom_rules } = body;

  if (!slug || !SLUG_REGEX.test(slug)) {
    return NextResponse.json(
      {
        error:
          "slug must be 3-50 characters, lowercase letters, numbers, and hyphens only, cannot start or end with a hyphen",
      },
      { status: 400 }
    );
  }

  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    return NextResponse.json(
      { error: "name must be between 2 and 100 characters" },
      { status: 400 }
    );
  }

  const validBaseStandards = ["conventional", "angular", "emoji", "jira", "simple", "custom"];
  if (!base_standard || !validBaseStandards.includes(base_standard)) {
    return NextResponse.json(
      { error: `base_standard must be one of: ${validBaseStandards.join(", ")}` },
      { status: 400 }
    );
  }

  if (custom_rules && custom_rules.length > 500) {
    return NextResponse.json(
      { error: "custom_rules must be 500 characters or fewer" },
      { status: 400 }
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await saveStandard({
    slug,
    name: name.trim(),
    base_standard,
    custom_rules,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 409 });
  }

  return NextResponse.json({ standard: data }, { status: 201 });
}
