import { readFile, writeFile } from "node:fs/promises";

const input = process.argv[2];
const output = process.argv[3] || "public/events.generated.json";

if (!input) {
  console.error("Usage: node tools/import-teamup-ics.mjs <teamup-feed.ics> [output.json]");
  process.exit(1);
}

const teamupKey = process.env.TEAMUP_KEY || "kse1p8ynvg2fvo2ez6";
const source = (await readFile(input, "utf8")).replace(/\r?\n[ \t]/g, "");
const blocks = source.split("BEGIN:VEVENT").slice(1).map((block) => block.split("END:VEVENT")[0]);

function field(block, name) {
  const line = block.split(/\r?\n/).find((entry) => entry.startsWith(`${name}:`) || entry.startsWith(`${name};`));
  if (!line) return "";
  return line.slice(line.indexOf(":") + 1).replace(/\\n/g, " ").trim();
}

function parseDate(value) {
  const compact = value.slice(0, 8);
  if (!/^\d{8}$/.test(compact)) return "";
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

function parseTime(value) {
  if (!value.includes("T")) return "All day";
  const hour = Number(value.slice(9, 11));
  const minute = value.slice(11, 13);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
}

const events = blocks.map((block, index) => {
  const start = field(block, "DTSTART");
  const title = field(block, "SUMMARY") || "Untitled Event";
  const uid = field(block, "UID") || `${title}-${index}`;
  const sourceId = uid.split("@")[0] || uid;
  return {
    id: uid.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    sourceId,
    title,
    date: parseDate(start),
    time: parseTime(start),
    category: field(block, "CATEGORIES") || "Church Wide",
    location: field(block, "LOCATION") || "Palo Pinto Cowboy Church",
    description: field(block, "DESCRIPTION"),
    image: "",
    sourceUrl: `https://teamup.com/${teamupKey}`,
    source: "teamup-ics",
  };
}).filter((event) => event.date).sort((a, b) => a.date.localeCompare(b.date));

await writeFile(output, `${JSON.stringify({
  source: "teamup-ics",
  calendarUrl: `https://teamup.com/${teamupKey}`,
  calendarFeedUrl: `https://ics.teamup.com/feed/${teamupKey}/0.ics`,
  lastSyncedAt: new Date().toISOString(),
  events,
}, null, 2)}\n`);
console.log(`Imported ${events.length} events to ${output}`);
