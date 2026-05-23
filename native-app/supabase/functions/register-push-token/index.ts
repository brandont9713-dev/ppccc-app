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

  const payload = await readJson(req);
  if (!payload) {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const expoPushToken = String(payload.expoPushToken ?? "").trim();
  const platform = String(payload.platform ?? "");
  const deviceName = typeof payload.deviceName === "string" ? payload.deviceName.trim().slice(0, 80) : null;
  const tokenPattern = /^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/;
  if (!tokenPattern.test(expoPushToken) || !["ios", "android"].includes(platform)) {
    return json({ error: "Invalid push token payload" }, 400);
  }

  const { error } = await admin.from("push_tokens").upsert(
    {
      profile_id: userData.user.id,
      expo_push_token: expoPushToken,
      platform,
      device_name: deviceName ?? null,
      enabled: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "expo_push_token" },
  );

  if (error) {
    return json({ error: error.message }, 500);
  }

  return json({ ok: true });
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
