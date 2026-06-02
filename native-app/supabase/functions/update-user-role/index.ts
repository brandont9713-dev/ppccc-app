import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const allowedRoles = new Set(["general", "kids_korral", "admin"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const body = await readJson(req);
  const userId = String(body?.userId ?? "").trim();
  const role = String(body?.role ?? "").trim();
  if (!isUuid(userId) || !allowedRoles.has(role)) {
    return json({ error: "Valid userId and role are required" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { data: requester, error: requesterError } = await userClient
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (requesterError || requester?.role !== "admin") {
    return json({ error: "Forbidden: admin access required" }, 403);
  }

  const { data, error } = await userClient
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select("id,email,display_name,role,created_at")
    .single();

  if (error) {
    return json({ error: error.message }, 500);
  }

  return json({ ok: true, profile: data });
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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
