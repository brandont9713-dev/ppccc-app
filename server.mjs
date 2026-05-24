import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 4173);
const root = join(process.cwd(), "public");
const teamupKey = "kse1p8ynvg2fvo2ez6";
const mediaRssUrl = "https://www.palopintocowboychurch.com/rss_feed.cfm?content=download";
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

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatTime(value, allDay) {
  if (allDay || !value || !value.includes("T")) return "All day";
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });
}

function normalizeTeamupEvent(event) {
  const image = event.attachments?.[0]?.preview || event.attachments?.[0]?.thumbnail || "";
  return {
    id: String(event.id),
    sourceId: String(event.id),
    title: event.title || "Church Event",
    date: (event.start_dt || "").slice(0, 10),
    time: formatTime(event.start_dt, event.all_day),
    category: event.subcalendar_name || teamupCalendars[event.subcalendar_id] || event.category || "Church Wide",
    location: event.location || "Palo Pinto Cowboy Church",
    description: event.notes || "",
    image,
    sourceUrl: `https://teamup.com/${teamupKey}/events/${event.id}`,
    source: "teamup",
  };
}

function xmlValue(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim()) : "";
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function formatMediaDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "Website archive";
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
}

function parseMediaRss(text) {
  return text.split(/<item>/i).slice(1).map((block, index) => {
    const title = xmlValue(block, "title");
    return {
      id: xmlValue(block, "guid") || `rss-media-${index}`,
      title,
      date: formatMediaDate(xmlValue(block, "pubDate")),
      category: xmlValue(block, "category") || "Messages",
      description: xmlValue(block, "description"),
      sourceUrl: xmlValue(block, "link"),
      source: "faithconnector-rss",
    };
  }).filter((item) => item.title);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ics": "text/calendar; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const requested = url.pathname;

    if (requested === "/api/app/events") {
      const startDate = url.searchParams.get("startDate") || dateOffset(-7);
      const endDate = url.searchParams.get("endDate") || dateOffset(120);
      const teamupUrl = `https://teamup.com/${teamupKey}/events?startDate=${startDate}&endDate=${endDate}&tz=America%2FChicago`;
      const response = await fetch(teamupUrl, {
        headers: { "Accept": "application/json", "User-Agent": "PPCCC-App-Prototype/1.0" },
      });
      if (!response.ok) throw new Error(`Teamup responded ${response.status}`);
      const payload = await response.json();
      const events = (payload.events || [])
        .map(normalizeTeamupEvent)
        .filter((event) => event.date)
        .sort((a, b) => a.date.localeCompare(b.date));
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      });
      res.end(JSON.stringify({
        source: "teamup",
        calendarUrl: `https://teamup.com/${teamupKey}`,
        calendarFeedUrl: `https://ics.teamup.com/feed/${teamupKey}/0.ics`,
        lastSyncedAt: new Date().toISOString(),
        events,
      }));
      return;
    }

    if (requested === "/api/app/media") {
      const response = await fetch(mediaRssUrl, {
        headers: { "Accept": "application/rss+xml,application/xml,text/xml,*/*", "User-Agent": "PPCCC-App-Prototype/1.0" },
      });
      if (!response.ok) throw new Error(`FaithConnector RSS responded ${response.status}`);
      const items = parseMediaRss(await response.text());
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      });
      res.end(JSON.stringify({
        source: "faithconnector-rss",
        feedUrl: mediaRssUrl,
        lastSyncedAt: new Date().toISOString(),
        items,
      }));
      return;
    }

    const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
    const filePath = join(root, safePath === "/" ? "index.html" : safePath);
    const body = await readFile(filePath);
    res.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    const fallback = await readFile(join(root, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fallback);
  }
}).listen(port, () => {
  console.log(`PPCC app prototype running at http://localhost:${port}`);
});
