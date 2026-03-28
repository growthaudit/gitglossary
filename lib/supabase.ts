import { createClient } from "@supabase/supabase-js";

export interface DBStandard {
  id: string;
  slug: string;
  name: string;
  base_standard: string;
  custom_rules: string | null;
  created_at: string;
  use_count: number;
  pro_unlock: boolean;
}

// Browser client (anon key — for client components)
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase browser env vars");
  return createClient(url, key);
}

// Server client (service key — for API routes)
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service env vars");
  return createClient(url, key);
}

export async function getStandardBySlug(slug: string): Promise<DBStandard | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("standards")
      .select("*")
      .eq("slug", slug)
      .eq("pro_unlock", false)
      .single();

    if (error) return null;
    return data as DBStandard;
  } catch {
    return null;
  }
}

export async function getPublicStandards(): Promise<DBStandard[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("standards")
      .select("*")
      .eq("pro_unlock", false)
      .order("use_count", { ascending: false })
      .limit(50);

    if (error) return [];
    return (data as DBStandard[]) ?? [];
  } catch {
    return [];
  }
}

export async function saveStandard(params: {
  slug: string;
  name: string;
  base_standard: string;
  custom_rules?: string;
}): Promise<{ data: DBStandard | null; error: string | null }> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("standards")
      .insert({
        slug: params.slug,
        name: params.name,
        base_standard: params.base_standard,
        custom_rules: params.custom_rules || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return { data: null, error: "That slug is already taken. Choose a different name." };
      }
      return { data: null, error: error.message };
    }
    return { data: data as DBStandard, error: null };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

export async function incrementUseCount(slug: string): Promise<void> {
  try {
    const supabase = createServerClient();
    await supabase.rpc("increment_use_count", { standard_slug: slug });
  } catch {
    // fire-and-forget — silently ignore errors
  }
}

export async function getAllPublicSlugs(): Promise<string[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("standards")
      .select("slug")
      .eq("pro_unlock", false);
    return (data ?? []).map((r: { slug: string }) => r.slug);
  } catch {
    return [];
  }
}
