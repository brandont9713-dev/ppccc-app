import { writeFile } from "node:fs/promises";

const feedUrl = process.env.SERMON_FEED_URL || "https://www.palopintocowboychurch.com/rss_feed.cfm?content=download";
const output = process.argv[2] || "public/media.generated.json";

function decodeXml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function xmlValue(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim()) : "";
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

const response = await fetch(feedUrl, {
  headers: { Accept: "application/rss+xml,application/xml,text/xml,*/*", "User-Agent": "PPCCC-App-Importer/1.0" },
});

if (!response.ok) {
  throw new Error(`FaithConnector RSS responded ${response.status} for ${feedUrl}`);
}

const items = parseMediaRss(await response.text());

await writeFile(output, `${JSON.stringify({
  source: "faithconnector-rss",
  feedUrl,
  lastSyncedAt: new Date().toISOString(),
  items,
}, null, 2)}\n`);

console.log(`Imported ${items.length} media RSS items to ${output}`);
