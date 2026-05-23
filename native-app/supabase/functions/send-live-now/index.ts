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
    return json({ error: "Forbidden" }, 403);
  }

  const payload = await readJson(req);
  if (!payload) {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const title = String(payload.title ?? "Live Now").trim().slice(0, 60);
  const message = String(payload.message ?? "Sunday service is live.").trim().slice(0, 160);
  if (!title || !message) {
    return json({ error: "Missing title or message" }, 400);
  }
  const { data: preferences } = await admin
    .from("notification_preferences")
    .select("profile_id")
    .eq("live_now", true);

  const profileIds = (preferences ?? []).map((item) => item.profile_id);
  const { data: tokens } = profileIds.length
    ? await admin.from("push_tokens").select("expo_push_token").in("profile_id", profileIds).eq("enabled", true)
    : { data: [] };

  const messages = (tokens ?? []).map((token) => ({
    to: token.expo_push_token,
    sound: "default",
    title,
    body: message,
    data: { route: "live" },
  }));

  const sendResult = await sendExpoMessages(messages);
  const status = sendResult.ok ? "sent" : "failed";
  const errorText = sendResult.error;

  await admin.from("notification_audit").insert({
    kind: "live_now",
    sent_by: userData.user.id,
    title,
    body: message,
    recipient_count: messages.length,
    status,
    error: errorText,
  });

  return json({ ok: status === "sent", recipientCount: messages.length, status, chunks: sendResult.chunks });
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

async function sendExpoMessages(messages: Array<Record<string, unknown>>) {
  let chunks = 0;
  const errors: string[] = [];

  for (let index = 0; index < messages.length; index += 100) {
    chunks += 1;
    const chunk = messages.slice(index, index + 100);
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chunk),
    });

    if (!response.ok) {
      errors.push(await response.text());
    }
  }

  return {
    ok: errors.length === 0,
    chunks,
    error: errors.length ? errors.join("\n").slice(0, 4000) : null,
  };
}
