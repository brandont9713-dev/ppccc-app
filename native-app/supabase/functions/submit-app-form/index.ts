import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const allowedKinds = new Set([
  "contact",
  "app_feedback",
  "prayer",
  "text-alerts",
  "connect-group",
  "signup:laughter-lemonade",
  "signup:dutch-oven",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const payload = await readJson(req);
  if (!payload) return json({ error: "Invalid JSON payload" }, 400);

  const kind = String(payload.kind ?? "").trim().slice(0, 80);
  const source = String(payload.source ?? "app").trim().slice(0, 40);
  const sourceUrl = String(payload.sourceUrl ?? "").trim().slice(0, 500);
  const formPayload = payload.payload;

  if (!allowedKinds.has(kind)) return json({ error: "Unsupported form type" }, 400);
  if (!formPayload || typeof formPayload !== "object" || Array.isArray(formPayload)) {
    return json({ error: "Missing form payload" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  const admin = createClient(supabaseUrl, serviceKey);
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData } = await userClient.auth.getUser();
  const profileId = userData.user?.id ?? null;

  const cleanPayload = sanitizePayload(formPayload as Record<string, unknown>);
  const { data, error } = await admin
    .from("form_submissions")
    .insert({
      profile_id: profileId,
      kind,
      source,
      source_url: sourceUrl || null,
      payload: cleanPayload,
    })
    .select("id")
    .single();

  if (error) return json({ error: error.message }, 500);

  await maybeSendEmail(kind, cleanPayload, data.id);

  return json({ ok: true, id: data.id });
});

function sanitizePayload(payload: Record<string, unknown>) {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload).slice(0, 30)) {
    const cleanKey = key.trim().slice(0, 80);
    if (!cleanKey) continue;
    if (typeof value === "boolean") clean[cleanKey] = value;
    else clean[cleanKey] = String(value ?? "").trim().slice(0, 1200);
  }
  return clean;
}

async function maybeSendEmail(kind: string, payload: Record<string, unknown>, id: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("FORM_NOTIFICATION_EMAIL");
  const from = Deno.env.get("FORM_NOTIFICATION_FROM") ?? "PPCCC App <onboarding@resend.dev>";
  if (!resendKey || !to) return;

  const lines = Object.entries(payload).map(([key, value]) => `${key}: ${String(value)}`);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `PPCCC App ${kind} submission`,
      text: [`Submission ID: ${id}`, `Kind: ${kind}`, "", ...lines].join("\n"),
    }),
  }).catch(() => {});
}

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
