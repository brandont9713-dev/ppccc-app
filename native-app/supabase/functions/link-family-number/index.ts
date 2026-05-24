import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  const admin = createClient(supabaseUrl, serviceKey);
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

  const payload = await readJson(req);
  if (!payload) return json({ error: "Invalid JSON payload" }, 400);

  const number = String(payload.number ?? "").replace(/\D/g, "").slice(0, 8);
  const childName = String(payload.childName ?? "").trim().slice(0, 80);
  const pickupName = String(payload.pickupName ?? "").trim().slice(0, 80);
  if (!number || !childName || !pickupName) {
    return json({ error: "Family number, child name, and pickup name are required" }, 400);
  }

  const label = JSON.stringify({ childName, pickupName });
  const { data: family, error: familyError } = await admin
    .from("family_numbers")
    .upsert({ number, label, created_by: userData.user.id }, { onConflict: "number" })
    .select("id, number, label")
    .single();

  if (familyError) return json({ error: familyError.message }, 500);

  const { error: memberError } = await admin
    .from("family_members")
    .upsert({
      profile_id: userData.user.id,
      family_number_id: family.id,
      relationship: "parent_guardian",
    }, { onConflict: "profile_id,family_number_id" });

  if (memberError) return json({ error: memberError.message }, 500);

  return json({ ok: true, family });
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
