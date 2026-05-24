const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const teamupKey = "kse1p8ynvg2fvo2ez6";
const teamupCalendars: Record<number, string> = {
  9152325: "Arena Event",
  9242824: "Celebrate Recovery",
  9242764: "Church Wide",
  9242872: "Iron Horse",
  9152326: "Kids Korral",
  9152368: "Men's Ministry",
  9152367: "Women's Ministry",
  9242777: "Young Adults Group",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = new URL(req.url);
  const now = new Date();
  const startDate = cleanDate(url.searchParams.get("startDate")) || dateOffset(now, -365);
  const endDate = cleanDate(url.searchParams.get("endDate")) || dateOffset(now, 1095);
  const teamupUrl = `https://teamup.com/${teamupKey}/events?startDate=${startDate}&endDate=${endDate}&tz=America%2FChicago`;

  const response = await fetch(teamupUrl, {
    headers: { Accept: "application/json", "User-Agent": "PPCCC-App-Teamup-Sync/1.0" },
  });

  if (!response.ok) return json({ error: `Teamup responded ${response.status}` }, 502);

  const payload = await response.json();
  const events = (payload.events ?? [])
    .map(normalizeTeamupEvent)
    .filter((event) => event.date)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return json({
    source: "teamup",
    calendarUrl: `https://teamup.com/${teamupKey}`,
    calendarFeedUrl: `https://ics.teamup.com/feed/${teamupKey}/0.ics`,
    lastSyncedAt: new Date().toISOString(),
    events,
  });
});

function normalizeTeamupEvent(event: Record<string, any>) {
  return {
    id: String(event.id ?? ""),
    sourceId: String(event.id ?? ""),
    title: event.title || "Church Event",
    date: String(event.start_dt || "").slice(0, 10),
    endDate: String(event.end_dt || "").slice(0, 10),
    time: formatTime(event.start_dt, Boolean(event.all_day)),
    startDateTime: event.start_dt || "",
    endDateTime: event.end_dt || "",
    allDay: Boolean(event.all_day),
    category: event.subcalendar_name || teamupCalendars[event.subcalendar_id] || "Church Wide",
    location: event.location || "Palo Pinto Cowboy Church",
    description: event.notes || "",
    image: event.attachments?.[0]?.preview || event.attachments?.[0]?.thumbnail || "",
    sourceUrl: `https://teamup.com/${teamupKey}/events/${event.id}`,
    source: "teamup",
  };
}

function formatTime(value: string, allDay: boolean) {
  if (allDay || !value || !value.includes("T")) return "All day";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

function cleanDate(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function dateOffset(from: Date, days: number) {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}
