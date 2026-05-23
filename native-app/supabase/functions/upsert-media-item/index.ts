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
    return json({ error: "Forbidden: admin media access required" }, 403);
  }

  const item = await readJson(req);
  if (!item) {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const title = String(item.title ?? "").trim();
  const youtubeVideoId = String(item.youtube_video_id ?? "").trim();
  const kind = String(item.kind ?? "sermon");
  if (!title || title.length > 140 || !/^[A-Za-z0-9_-]{6,32}$/.test(youtubeVideoId) || !["sermon", "livestream", "replay"].includes(kind)) {
    return json({ error: "Missing title or youtube_video_id" }, 400);
  }

  const { data, error } = await admin
    .from("media_items")
    .upsert({
      id: item.id,
      kind,
      title,
      speaker: optionalString(item.speaker, 120),
      description: optionalString(item.description, 2000),
      youtube_video_id: youtubeVideoId,
      source_url: optionalString(item.source_url, 500),
      published_at: item.published_at ? String(item.published_at) : null,
      is_published: item.is_published ?? true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, 500);
  }

  return json({ ok: true, media: data });
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
