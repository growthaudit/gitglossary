import { NextRequest, NextResponse } from "next/server";
import { getStandardBySlug } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const standard = await getStandardBySlug(slug);

  if (!standard) {
    return NextResponse.json({ error: "Standard not found" }, { status: 404 });
  }

  return NextResponse.json({ standard });
}
