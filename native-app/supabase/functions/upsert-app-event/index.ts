import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  const admin = createClient(supabaseUrl, serviceKey);
  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { data: profile } = await admin.from("profiles").select("role").eq("id", userData.user.id).single();
  if (!profile || profile.role !== "admin") {
    return json({ error: "Forbidden: admin calendar access required" }, 403);
  }

  const event = await readJson(req);
  if (!event) {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const id = String(event.id ?? "").trim();
  const title = String(event.title ?? "").trim();
  const startsAt = String(event.starts_at ?? "").trim();
  if (!id || id.length > 120 || !title || title.length > 140 || !isValidDate(startsAt)) {
    return json({ error: "Missing id, title, or starts_at" }, 400);
  }

  const endsAt = event.ends_at ? String(event.ends_at).trim() : null;
  if (endsAt && !isValidDate(endsAt)) {
    return json({ error: "Invalid ends_at" }, 400);
  }

  const { data, error } = await admin
    .from("app_events")
    .upsert({
      id,
      title,
      description: optionalString(event.description, 2000),
      starts_at: startsAt,
      ends_at: endsAt,
      location: optionalString(event.location, 200),
      category: optionalString(event.category, 80) ?? "Church Wide",
      source_url: optionalString(event.source_url, 500),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, 500);
  }

  return json({ ok: true, event: data });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function optionalString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function isValidDate(value: string): boolean {
  return value.length > 0 && !Number.isNaN(Date.parse(value));
}
