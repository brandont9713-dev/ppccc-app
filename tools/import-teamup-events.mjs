import { writeFile } from "node:fs/promises";

const teamupKey = process.env.TEAMUP_KEY || "kse1p8ynvg2fvo2ez6";
const output = process.argv[2] || "public/events.generated.json";
const dayMs = 24 * 60 * 60 * 1000;
const startDate = process.env.START_DATE || new Date(Date.now() - 365 * dayMs).toISOString().slice(0, 10);
const endDate = process.env.END_DATE || new Date(Date.now() + 1095 * dayMs).toISOString().slice(0, 10);
const teamupCalendars = {
  9152325: "Arena Event",
  9242824: "Celebrate Recovery",
  9242764: "Church Wide",
  9242872: "Iron Horse",
  9152326: "Kids Korral",
  9152368: "Men's Ministry",
  9152367: "Women's Ministry",
  9242777: "Young Adults Group",
};

function formatTime(value, allDay) {
  if (allDay || !value || !value.includes("T")) return "All day";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
}

function normalize(event) {
  return {
    id: String(event.id),
    sourceId: String(event.id),
    title: event.title || "Church Event",
    date: (event.start_dt || "").slice(0, 10),
    endDate: (event.end_dt || "").slice(0, 10),
    time: formatTime(event.start_dt, event.all_day),
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

const url = `https://teamup.com/${teamupKey}/events?startDate=${startDate}&endDate=${endDate}&tz=America%2FChicago`;
const response = await fetch(url, {
  headers: { Accept: "application/json", "User-Agent": "PPCCC-App-Importer/1.0" },
});

if (!response.ok) {
  throw new Error(`Teamup responded ${response.status} for ${url}`);
}

const payload = await response.json();
const events = (payload.events || [])
  .map(normalize)
  .filter((event) => event.date)
  .sort((a, b) => a.date.localeCompare(b.date));

await writeFile(output, `${JSON.stringify({
  source: "teamup",
  calendarUrl: `https://teamup.com/${teamupKey}`,
  calendarFeedUrl: `https://ics.teamup.com/feed/${teamupKey}/0.ics`,
  lastSyncedAt: new Date().toISOString(),
  events,
}, null, 2)}\n`);

console.log(`Imported ${events.length} Teamup events to ${output}`);
