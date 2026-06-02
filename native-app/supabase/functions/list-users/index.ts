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

  const { data: requester, error: requesterError } = await userClient
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (requesterError || requester?.role !== "admin") {
    return json({ error: "Forbidden: admin access required" }, 403);
  }

  const { data: profileRows, error: profileError } = await userClient
    .from("profiles")
    .select("id,email,display_name,role,created_at")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (profileError) {
    return json({ error: profileError.message }, 500);
  }

  const { data: authData, error: authError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (authError) {
    return json({ error: authError.message }, 500);
  }

  const profilesById = new Map((profileRows ?? []).map((profile) => [profile.id, profile]));
  const missingProfiles = authData.users
    .filter((user) => !profilesById.has(user.id) && user.email)
    .map((user) => ({
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Church Family",
      role: "general",
    }));

  if (missingProfiles.length) {
    const { data: repairedProfiles } = await admin
      .from("profiles")
      .upsert(missingProfiles, { onConflict: "id" })
      .select("id,email,display_name,role,created_at");

    for (const profile of repairedProfiles ?? []) {
      profilesById.set(profile.id, profile);
    }
  }

  const users = authData.users
    .map((user) => {
      const profile = profilesById.get(user.id);
      const metadata = user.user_metadata ?? {};
      return {
        id: user.id,
        email: profile?.email ?? user.email ?? "",
        display_name: profile?.display_name ?? metadata.display_name ?? user.email?.split("@")[0] ?? "Church Family",
        family_name: metadata.parent_name ?? metadata.family_name ?? metadata.familyName ?? "",
        phone: metadata.phone ?? "",
        role: profile?.role ?? "general",
        created_at: profile?.created_at ?? user.created_at,
      };
    })
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));

  return json({ ok: true, users });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
