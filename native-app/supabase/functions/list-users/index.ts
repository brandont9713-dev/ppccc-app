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
    .select("id,email,display_name,role,created_at")
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) {
    return json({ error: error.message }, 500);
  }

  return json({ ok: true, users: data ?? [] });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
