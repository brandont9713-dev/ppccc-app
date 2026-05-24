const urlParams = new URLSearchParams(window.location.search);
const platformPreview = urlParams.get("platform");
const appConfig = {
  teamupKey: "kse1p8ynvg2fvo2ez6",
  calendarUrl: "https://teamup.com/kse1p8ynvg2fvo2ez6",
  teamupEventsJsonUrl: "https://teamup.com/kse1p8ynvg2fvo2ez6/events",
  calendarFeedUrl: "https://ics.teamup.com/feed/kse1p8ynvg2fvo2ez6/0.ics",
  eventsApiUrl: "/api/app/events",
  supabaseEventsApiUrl: "https://lwrnoexybfqykfvxgjjs.supabase.co/functions/v1/get-teamup-events",
  generatedEventsUrl: "/events.generated.json",
  mediaApiUrl: "/api/app/media",
  sermonFeedUrl: "https://www.palopintocowboychurch.com/rss_feed.cfm?content=download",
  generatedMediaUrl: "/media.generated.json",
  notificationApiUrl: "/api/notifications/send",
  passwordResetApiUrl: "/api/auth/password-reset",
  supabaseUrl: "https://lwrnoexybfqykfvxgjjs.supabase.co",
  supabaseAnonKey: "sb_publishable_4l0vcy9ofspgvk-oON7UxA_RT8pDBlI",
  youtubeChannelUrl: "https://www.youtube.com/@palopintocountycowboychurc3584",
  verseApiUrl: "/api/app/daily-verse?version=CSB",
};
const demoAdminPasscode = "ppccctest2026";
const localAdminStorageKey = "ppcc-local-admin-beta";
const localAccountStorageKey = "ppcc-local-account-beta";
const hasLocalAdminMode = () => localStorage.getItem(localAdminStorageKey) === "true";

function loadLocalAccount() {
  try {
    const saved = JSON.parse(localStorage.getItem(localAccountStorageKey) || "{}");
    return {
      isSignedIn: Boolean(saved.isSignedIn),
      name: saved.name || "",
      email: saved.email || "",
      phone: saved.phone || "",
      parentName: saved.parentName || "",
      role: saved.role || "end_user",
      linkedFamilies: Array.isArray(saved.linkedFamilies) ? saved.linkedFamilies : [],
    };
  } catch {
    return {
      isSignedIn: false,
      name: "",
      email: "",
      phone: "",
      parentName: "",
      role: "end_user",
      linkedFamilies: [],
    };
  }
}

if (platformPreview) {
  document.documentElement.dataset.platform = platformPreview;
}

if (urlParams.get("preview") === "compare") {
  document.documentElement.dataset.preview = "compare";
}

if (urlParams.get("native") === "1") {
  document.documentElement.dataset.nativeApp = "true";
}

const events = [
  {
    id: "sunday-service",
    title: "Sunday Worship Service",
    date: "2026-05-24",
    time: "10:30 AM",
    location: "Palo Pinto Cowboy Church",
    description: "Weekly worship service with Kids Korral available.",
  },
  {
    id: "arena-night",
    title: "Arena Night",
    date: "2026-05-27",
    time: "6:30 PM",
    location: "Church Arena",
    description: "Riding, fellowship, and devotional time.",
  },
  {
    id: "youth",
    title: "Youth Gathering",
    date: "2026-05-31",
    time: "5:00 PM",
    location: "Youth Room",
    description: "Food, teaching, and small groups for students.",
  },
];

let teamupEvents = [
  { id: "iron-grace-barrels", title: "Iron Grace Production Barrel Race", date: "2026-05-18", time: "All day", category: "Arena Event" },
  { id: "glitter-productions", title: "Glitter Productions", date: "2026-05-18", time: "All day", category: "Arena Event" },
  { id: "new-believers-class", title: "New Believer's Class", date: "2026-05-18", time: "9:00 AM", category: "Church Wide" },
  { id: "men-word", title: "Men of the Word", date: "2026-05-18", time: "9:00 AM", category: "Men's Ministry" },
  { id: "wow-study", title: "WOW Women's Bible Study", date: "2026-05-18", time: "9:30 AM", category: "Women's Ministry" },
  { id: "iron-horse-team", title: "Iron Horse Team", date: "2026-05-18", time: "3:00 PM", category: "Iron Horse" },
  { id: "open-arena", title: "Open Arena", date: "2026-05-19", time: "9:00 AM", category: "Arena Event" },
  { id: "crafting-cowgirls", title: "Crafting Cowgirls", date: "2026-05-20", time: "10:00 AM", category: "Women's Ministry" },
  { id: "cowgirl-study", title: "Cowgirl Bible Study", date: "2026-05-20", time: "2:00 PM", category: "Women's Ministry" },
  { id: "miniature-horse", title: "Miniature Horse Ministry Practice", date: "2026-05-20", time: "4:30 PM", category: "Church Wide" },
  { id: "cr-step-studies", title: "CR Step Studies", date: "2026-05-20", time: "6:30 PM", category: "Celebrate Recovery" },
  { id: "mens-coffee", title: "Men's Coffee", date: "2026-05-21", time: "7:30 AM", category: "Men's Ministry" },
  { id: "bible-study", title: "Bible Study", date: "2026-05-21", time: "6:30 PM", category: "Church Wide" },
  { id: "kids-youth", title: "Kids Korral and Youth", date: "2026-05-21", time: "6:30 PM", category: "Kids Korral" },
  { id: "young-adults-event", title: "Young Adults Group", date: "2026-05-21", time: "6:30 PM", category: "Young Adults Group" },
  { id: "celebrate-recovery-event", title: "Celebrate Recovery", date: "2026-05-22", time: "6:00 PM", category: "Celebrate Recovery" },
  { id: "diamond-team-roping", title: "Diamond Productions Team Roping", date: "2026-05-23", time: "5:00 PM", category: "Arena Event" },
  { id: "gals-gather", title: "Gals Who Gather", date: "2026-05-23", time: "12:00 PM", category: "Women's Ministry" },
];

const homeSlides = [
  {
    title: "Welcome to Palo Pinto County Cowboy Church",
    caption: "The app home can pull the same marquee image from the website.",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/hotels_business_website.png",
  },
  {
    title: "Sundays",
    caption: "Service details can stay connected to the website source.",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/2_1.png",
  },
  {
    title: "Radio Update",
    caption: "Announcements can appear in the app as soon as the website changes.",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/3_1.png",
  },
];

const homeHighlights = [
  {
    title: "Laughter & Lemonade",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/laughter_and_lemonade_500_x_300_px_1.png",
    pageId: "laughter-lemonade",
  },
  {
    title: "Kids Korral",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/kids_korral_may_square_2.png",
    pageId: "kids-ministry",
  },
  {
    title: "Men's Breakfast",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/men_s_breakfast_500_x_300_px_handout.png",
    pageId: "men",
  },
  {
    title: "Dutch Oven Class",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/2026_dutch_oven_class_500_x_300_px.png",
    pageId: "dutch-oven",
  },
  {
    title: "Iron Horse Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ironhorse_website_1.png",
    pageId: "iron-horse",
  },
  {
    title: "New Believers",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/new_believers_website_2.png",
    pageId: "new-believers",
  },
];

const staffMembers = [
  { name: "Roger Keck", role: "Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/7d240ae3_f3ff_4285_92c4_27331e40b8f5.jpg" },
  { name: "Brad Thompson", role: "Associate Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/a224b121_f414_490c_9952_06779eb751f7.jpg" },
  { name: "Natalie Stanley", role: "Church Secretary", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/e3427f81_e9ee_4b5a_95ca_f3fcc5f53716.jpg" },
  { name: "Phyllis Banks", role: "Financial Secretary", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/ce473bbb_045d_4c40_839b_084f08679768.jpg" },
  { name: "Ike Mercer", role: "Worship Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/ike_edited.png" },
  { name: "Shawna McCommas", role: "Kids Korral Leader", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/450954152_1651551118968753_3409514351980604823_n.jpg" },
  { name: "Adam Wroblski", role: "Media Team Leader", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359932929_575064288161572_4061951424346166033_n.jpg" },
  { name: "Cindy Clary", role: "Janitorial Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/367519413_850426159849879_5500778989426720128_n.jpg" },
  { name: "Katie Peugh", role: "Youth Group Leader", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/ff987398_31fc_4115_b249_421e9d176279.jpg" },
];

const roles = {
  end_user: { label: "General User" },
  kids_korral: { label: "Kids Korral Staff" },
  admin: { label: "Admin" },
};

const localAccount = loadLocalAccount();

const state = {
  route: "home",
  history: [],
  accountSignedIn: localAccount.isSignedIn,
  accountMode: localAccount.isSignedIn ? "profile" : "create",
  parentName: localAccount.parentName || "",
  linkedFamilies: localAccount.linkedFamilies,
  notifications: false,
  currentUser: {
    name: localAccount.isSignedIn ? localAccount.name || "Church Family" : "Guest",
    email: localAccount.isSignedIn ? localAccount.email || "" : "",
    phone: localAccount.phone || "",
    role: hasLocalAdminMode() ? "admin" : localAccount.role || "end_user",
  },
  theme: localStorage.getItem("ppcc-theme") || "light",
  eventFilter: "All",
  eventMonth: new Date().toLocaleDateString("en-CA").slice(0, 7),
  eventsLoadedAt: "",
  eventsSource: "Static fallback",
  eventsLoading: false,
  mediaLoadedAt: "",
  mediaSource: "Static fallback",
  mediaLoading: false,
  pendingUsers: [
    { name: "Pastor Account", email: "pastor@example.com", role: "end_user" },
    { name: "Church Member", email: "member@example.com", role: "end_user" },
  ],
};

const titles = {
  home: "Home",
  events: "Events",
  live: "Live",
  kids: "Kids Korral",
  more: "More",
  manage: "Manage Users",
  account: "Settings",
  staff: "Staff",
  contact: "Contact Us",
  feedback: "Feedback",
  security: "Security",
  "forgot-password": "Reset Password",
};

const websiteSections = [
  { title: "Visitors", pageId: "visitors" },
  { title: "Service Times", pageId: "service-times" },
  { title: "Get Directions", pageId: "directions" },
  { title: "About Us", pageId: "about" },
  { title: "Mission Statement", pageId: "mission" },
  { title: "Elders and Lay Pastors", pageId: "elders" },
  { title: "Team Leaders", pageId: "team-leaders" },
  { title: "Teams", pageId: "teams" },
  { title: "Prayer Requests", pageId: "prayer-requests" },
  { title: "Testimonies", pageId: "testimonies" },
  { title: "Connect Groups", pageId: "connect-groups" },
  { title: "Text Alerts", pageId: "text-alerts" },
];

const ministries = [
  { title: "Arena Team", pageId: "arena" },
  { title: "Building and Grounds", pageId: "building-grounds" },
  { title: "Card Ministry", pageId: "card-ministry" },
  { title: "Celebrate Recovery", pageId: "celebrate-recovery" },
  { title: "Chuckwagon Team", pageId: "chuckwagon" },
  { title: "Concessions", pageId: "concessions" },
  { title: "Door Greeters", pageId: "greeters" },
  { title: "General Store", pageId: "general-store" },
  { title: "Harvest Team", pageId: "harvest" },
  { title: "Iron Horse Ministry", pageId: "iron-horse" },
  { title: "Kids Korral", pageId: "kids-ministry" },
  { title: "Media Team", pageId: "media-team" },
  { title: "Men's Ministry", pageId: "men" },
  { title: "MW State Park Ministry", pageId: "park" },
  { title: "New Believer's Class", pageId: "new-believers" },
  { title: "Prayer Team", pageId: "prayer-team" },
  { title: "Sound Team", pageId: "sound-team" },
  { title: "Worship Team", pageId: "worship-team" },
  { title: "Women's Ministry", pageId: "women" },
  { title: "Young Adults Group", pageId: "young-adults" },
  { title: "Youth Ministry", pageId: "youth" },
];

const socialLinks = [
  { title: "Facebook", url: "https://www.facebook.com/palopintocowboychurch/", brand: "facebook" },
  { title: "Instagram", url: "https://www.instagram.com/palopintocowboychurch/", brand: "instagram" },
  { title: "YouTube", url: "https://www.youtube.com/c/PaloPintoCountyCowboyChurchPPCCC", brand: "youtube" },
  { title: "Email Office", url: "mailto:ppcccoffice@gmail.com", brand: "mail" },
];

const contactInfo = {
  address: "2731 S FM 129, Santo, TX 76472",
  phone: "940-769-1000",
  email: "ppcccoffice@gmail.com",
  mapsUrl: "https://maps.apple.com/?q=2731%20S%20FM%20129%2C%20Santo%2C%20TX%2076472",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=2731%20S%20FM%20129%2C%20Santo%2C%20TX%2076472",
};

const verseFallbacks = [
  { reference: "Psalm 118:24", text: "This is the day the LORD has made; let's rejoice and be glad in it.", version: "CSB" },
  { reference: "Proverbs 3:5", text: "Trust in the LORD with all your heart, and do not rely on your own understanding.", version: "CSB" },
  { reference: "John 14:6", text: "I am the way, the truth, and the life.", version: "CSB" },
  { reference: "Romans 12:12", text: "Rejoice in hope; be patient in affliction; be persistent in prayer.", version: "CSB" },
  { reference: "Philippians 4:4", text: "Rejoice in the Lord always. I will say it again: Rejoice!", version: "CSB" },
  { reference: "Colossians 3:2", text: "Set your minds on things above, not on earthly things.", version: "CSB" },
  { reference: "1 Thessalonians 5:17", text: "Pray constantly.", version: "CSB" },
];

function dailyVerseFallback() {
  const dayNumber = Math.floor(new Date(`${todayIso()}T12:00:00`).getTime() / 86400000);
  return verseFallbacks[dayNumber % verseFallbacks.length];
}

let verseOfDay = dailyVerseFallback();

const eventFilters = ["All", "Church Wide", "Arena Event", "Kids Korral", "Women's Ministry", "Men's Ministry", "Celebrate Recovery"];
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

const syncSources = [
  { key: "home", label: "Home Marquee + Featured Items", source: "Website homepage images/content", strategy: "CMS/API or scraper cache", status: "Ready for connector" },
  { key: "events", label: "Events Calendar", source: "Teamup public JSON + iCalendar", strategy: "Direct public JSON, same-origin proxy, generated cache, iCalendar fallback", status: "Connected to PPCCC Teamup public feed" },
  { key: "live", label: "Live Service", source: "Website livestream embed / YouTube channel", strategy: "In-app player fed by livestream status endpoint", status: "Player shell ready" },
  { key: "more", label: "More Sections", source: "Website pages under Welcome, Teams, Resources", strategy: "Page registry maps each URL to native app templates", status: "Mapped" },
  { key: "media", label: "Sermons + Bible Study", source: "FaithConnector downloads RSS", strategy: "Public RSS feed, same-origin proxy, generated cache, static video fallbacks", status: "Connected to PPCCC media RSS" },
  { key: "forms", label: "Website Forms", source: "Prayer, Text Alerts, Connect Groups, RSVP pages", strategy: "Submit to app backend, then forward/sync to church workflow", status: "Native forms ready" },
  { key: "kids", label: "Kids Korral Alerts", source: "App-only database", strategy: "Role-gated push notifications; not synced to website", status: "App-only by design" },
  { key: "auth", label: "Accounts + Roles", source: "App auth database", strategy: "Admin-managed permissions", status: "Prototype ready" },
];

const pageSourceUrls = {
  visitors: "https://www.palopintocowboychurch.com/visitors",
  "service-times": "https://www.palopintocowboychurch.com/service-times",
  mission: "https://www.palopintocowboychurch.com/mission-statement",
  elders: "https://www.palopintocowboychurch.com/eldersandlaypastors",
  "team-leaders": "https://www.palopintocowboychurch.com/teamleaders",
  arena: "https://www.palopintocowboychurch.com/arena",
  "building-grounds": "https://www.palopintocowboychurch.com/BG",
  "card-ministry": "https://www.palopintocowboychurch.com/cardministry",
  "celebrate-recovery": "https://www.palopintocowboychurch.com/CR",
  chuckwagon: "https://www.palopintocowboychurch.com/chuckwagon",
  concessions: "https://www.palopintocowboychurch.com/Concession",
  greeters: "https://www.palopintocowboychurch.com/greeters",
  "general-store": "https://www.palopintocowboychurch.com/generalstore",
  harvest: "https://www.palopintocowboychurch.com/harvest",
  "iron-horse": "https://www.palopintocowboychurch.com/ironhorse",
  "kids-ministry": "https://www.palopintocowboychurch.com/kids",
  "media-team": "https://www.palopintocowboychurch.com/mediateam",
  men: "https://www.palopintocowboychurch.com/men",
  park: "https://www.palopintocowboychurch.com/park",
  "new-believers": "https://www.palopintocowboychurch.com/new",
  "prayer-team": "https://www.palopintocowboychurch.com/prayer",
  "sound-team": "https://www.palopintocowboychurch.com/sound",
  "worship-team": "https://www.palopintocowboychurch.com/worship",
  women: "https://www.palopintocowboychurch.com/women",
  "young-adults": "https://www.palopintocowboychurch.com/youngadults",
  youth: "https://www.palopintocowboychurch.com/youth",
  sermons: "https://www.palopintocowboychurch.com/sermons",
  "bible-study": "https://www.palopintocowboychurch.com/biblestudy",
  "prayer-requests": "https://www.palopintocowboychurch.com/prayer-requests",
  testimonies: "https://www.palopintocowboychurch.com/testimonies",
  "connect-groups": "https://www.palopintocowboychurch.com/connectgroups",
  "text-alerts": "https://www.palopintocowboychurch.com/textalerts",
  give: "https://www.palopintocowboychurch.com/give",
};

const appPages = {
  visitors: {
    title: "Visitors",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/131901764_10218876925614462_4584006058819768448_n_1.jpg",
    body: "Visitors can find a welcome message, what to expect, and the heart of the church. The website includes 1 Corinthians 9:19-23 and visitor-focused imagery.",
    actions: [{ label: "Service Times", route: "service-times" }, { label: "Directions", route: "directions" }],
  },
  "service-times": {
    title: "Service Times",
    body: "Sunday Worship Service is at 10:30 AM. Wednesday night has a free meal at 6:00 PM, with Pre-Teen, Youth, College and Career, and Adult Bible Study at 6:30 PM. Free childcare is available.",
    actions: [{ label: "Add Sunday to Calendar", calendar: "sunday-service" }],
  },
  directions: {
    title: "Get Directions",
    body: `${contactInfo.address}. The app opens the user's native maps app instead of sending them to the website.`,
    actions: [{ label: "Open in Maps", maps: true }],
  },
  about: {
    title: "About Us",
    body: "Palo Pinto County Cowboy Church is represented in the app as a native church information page. This page will sync the full website content once the importer/API is connected.",
  },
  mission: {
    title: "Mission Statement",
    body: "Our Code: Jesus is the Center. We believe big and start small. We honor one another to glorify God. We are contributors, not consumers. We can do more by doing less. We don't maintain, we multiply. We eat the fish and leave the bones. We want to be known for what we are for. We will not take this for granted. I am the first line of resolution.",
  },
  elders: {
    title: "Elders and Lay Pastors",
    body: "The website lists elders and lay pastors including Don Berry, John Martin, John Welborn, John Abraham, Danny Gerald, Billy James, Rocky Mahan, Jim Mann, David Crawford, Alan Fires, James Johnson, Gary Bowling, JJ Jernigan, Brian Jordan, Bill Kiker, Tony Leach, Phil Lockwood, Mike Morris, and Todd Smith.",
  },
  "team-leaders": {
    title: "Team Leaders",
    body: "Team leaders listed on the website include leaders for building maintenance, Iron Horse, decorating, audit, college and career, chow hall, concessions, connect groups, Celebrate Recovery, buildings and grounds, and more. In production these become searchable people/team cards.",
  },
  teams: {
    title: "Teams",
    body: "Teams include arena, building and grounds, card ministry, Celebrate Recovery, chuckwagon, concessions, greeters, general store, harvest, iron horse, Kids Korral, media, men's, park, new believers, prayer, sound, worship, women's, young adults, and youth.",
  },
  "prayer-requests": {
    title: "Prayer Requests",
    body: "The website has a Prayer/Praise Report form. The app should keep this in-app with fields for request type, description, intended prayer group, and contact details.",
    actions: [{ label: "Open Prayer Form", route: "contact" }],
  },
  testimonies: {
    title: "Testimonies",
    image: "icons/icon.svg",
    body: "Testimonies\n\nQuotes and stories from the website.",
  },
  "connect-groups": {
    title: "Connect Groups",
    body: "Connect Groups are groups of 6 to 20 people who do life together, meet weekly in host homes, discuss the sermon, fellowship, learn, pray, and help each other.",
  },
  "text-alerts": {
    title: "Text Alerts",
    body: "The website has a text alerts signup. In the app, this should become notification preferences and optional SMS signup, all kept inside the account area.",
  },
  sermons: {
    title: "Sermons",
    body: "The website lists recent sermon media. In production, this should become an in-app media library with sermon artwork, audio/video playback, notes, and saved messages.",
  },
  "bible-study": {
    title: "Bible Study",
    body: "The website lists Bible Study media. In production, this should become an in-app media library with study recordings, resources, and saved sessions.",
  },
  arena: {
    title: "Arena Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena_facebook.jpg",
    body: "Arena team hosts weekly and monthly events. Days vary. Events include barrel races, playdays, team roping, and open arena days.",
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/118217122_249534359680759_1375965202103954066_n.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena1_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena3_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena2_1.jpg",
    ],
  },
  "building-grounds": {
    title: "Building and Grounds",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/455363918_2253480411680659_2950973258386417251_n_1.jpg",
    body: "Team Lead and Grounds: Mark Turpen, 817-999-0882. Building: Teresa Conger, 254-631-1561.",
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/gratisography_241h.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359729918_1657580051414485_6748833929548026709_n_1.jpg",
    ],
  },
  "card-ministry": { title: "Card Ministry", body: "Card Ministry is listed on the website as a church team. This native page will hold ministry description, leader contact, and serving opportunities once synced." },
  "celebrate-recovery": {
    title: "Celebrate Recovery",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/cr_website_3.png",
    body: "A 12 step bible-based program of recovery from life's hurts, hang ups, and habits. Every Thursday night at PPCCC: Meal 6:00 PM, Large Group 7:00 PM, Small Groups 8:00 PM. Team Lead: John Longworth, 702-279-4917.",
  },
  chuckwagon: {
    title: "Chuckwagon Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck1.jpg",
    body: "Chuckwagon Team supports church meals and events. This native page can show serving needs, event support, and team contact details.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck2.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck3.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/8f6043a2_a35e_4516_80ed_421ed305c4ae.jpg"],
  },
  concessions: {
    title: "Concessions",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/concessions1.jpg",
    body: "Concessions is a serving team for church and arena events. This native page can show schedules, serving needs, and team contact info.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/0a266feb_8f60_4915_9fe7_bd1b649ef655.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242593264_577908139918830_3877664977060728858_n_1.jpg"],
  },
  greeters: {
    title: "Door Greeters",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/greeters.jpg",
    body: "Door Greeters help welcome people into church. This native page can show team details and ways to serve.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/f951fde5_4fb7_4276_9369_a774ffdeedeb.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/church1_1.jpg"],
  },
  "general-store": {
    title: "General Store",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/general_store.jpg",
    body: "General Store is listed on the website as a church team. This native page can show store info, hours, and team contact details.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242847316_396236698739749_8171333804767005852_n_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242636446_595635228456931_1284282420251819865_n_1.jpg"],
  },
  harvest: {
    title: "Harvest Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/harvest.jpg",
    body: "Harvest Team is listed on the website as a ministry team. This native page can show outreach details and serving opportunities.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ca82561b_66cd_4220_a5be_aa033c42b115.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/wheat_harvest_fields_ripe_wheat_agrarian_industry_wheat_harvest_fields_ripe_wheat_agrarian_industry_173008882.jpg"],
  },
  "iron-horse": { title: "Iron Horse Ministry", image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ironhorse_website_1.png", body: "Iron Horse Ministry is listed on the website. The app can show ministry updates, contacts, and events here." },
  "kids-ministry": { title: "Kids Korral", image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/kids_korral_may_square_2.png", body: "Kids Korral has a public ministry page and a parent-alert feature in the app. Parents can attach their Kids Korral number in the app account." },
  "media-team": {
    title: "Media Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/media.jpg",
    body: "Media Team supports church media, livestream, and production. This native page can show serving details, livestream support info, and team contact.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/wantto_create_bboxv0rveog_unsplash.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359932929_575064288161572_4061951424346166033_n_1.jpg"],
  },
  men: { title: "Men's Ministry", image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/men_s_breakfast_500_x_300_px_handout.png", body: "Men's Ministry is listed on the website and can include breakfasts, gatherings, and announcements." },
  park: {
    title: "MW State Park Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/lmwsp_overlook_0369.jpg",
    body: "Church service is every Sunday morning in Mineral Wells State Park. It is a non-denominational service with coffee, doughnuts, live Christian music, and a 15 minute devotional. Contact: Mike Pierce, 281-865-2041.",
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/250589599_1226117457875695_5515991011464047407_n_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ff7136a6_13b9_41e5_b682_b6042a9b5e92.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/248534057_427018112320965_6130763414557701777_n_1.jpg",
    ],
  },
  "new-believers": { title: "New Believer's Class", image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/new_believers_website_2.png", body: "New Believer's Class is listed on the website and can include class dates, signup, and resources." },
  "prayer-team": {
    title: "Prayer Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/prayer.jpg",
    body: "Prayer Team is listed on the website. This native page connects naturally to in-app prayer request workflows.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/20180408_sundayscripture_ps18.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/11125_bst_prayer_verses_slide6.jpg"],
  },
  "sound-team": {
    title: "Sound Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/sound.jpg",
    body: "Sound Team is listed on the website as a serving team. This native page can hold team details and serving opportunities.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359819797_1765753837228452_5419681350569170164_n_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/isaiah491_1.jpg"],
  },
  "worship-team": {
    title: "Worship Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/band.jpg",
    body: "Worship Team is listed on the website. This native page can hold worship team details and serving opportunities.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/244890953_307057087484704_6986061951613743040_n_1_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/243568686_588048309279382_1113807042124914206_n_1_1.jpg"],
  },
  women: { title: "Women's Ministry", body: "PPCCC Cowgirls create opportunities for women to gather, grow, and give together.", image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/gals_who_gather_website_1.png" },
  "young-adults": { title: "Young Adults Group", image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/young_adults_website.png", body: "Every Wednesday at 6:30 PM for ages 18-29. Chris Pruitt 940-452-0026. Lay Pastor John Knight 940-452-2961." },
  youth: { title: "Youth Ministry", image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/palo_pinto_county_cowboy.jpg", body: "A group for 7th-12th grade students. Every Wednesday dinner at 6:15 PM and study at 6:30 PM in the barn. Bryce Harrington 940-452-4910." },
  "laughter-lemonade": { title: "Laughter & Lemonade RSVP", image: "https://faithconnector.s3.amazonaws.com/6267/images/page/specific/laughter_lemonade.jpg", body: "Women's Laughter & Lemonade RSVP is listed on the website. This app version keeps signup in-app.", signup: "laughter" },
  "dutch-oven": { title: "Dutch Oven Class RSVP", image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/2026_dutch_oven_class_500_x_300_px.png", body: "Dutch Oven Class RSVP is listed on the website. This app version keeps signup in-app.", signup: "dutch" },
};

Object.assign(appPages, {
  visitors: {
    title: "Visitors",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/131901764_10218876925614462_4584006058819768448_n_1.jpg",
    body: "Welcome to Palo Pinto County Cowboy Church. The visitors page centers on 1 Corinthians 9:19-23 and the church's heart for reaching people where they are. Visitors can use this page to learn what to expect, see service times, get directions, and meet the church family.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/roger_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/117819405_10218119343435381_1622029456958240269_n_1.jpg"],
    actions: [{ label: "Service Times", pageId: "service-times" }, { label: "Directions", pageId: "directions" }],
  },
  "service-times": {
    title: "Service Times",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/2_1.png",
    body: "Sunday Worship Service is at 10:30 AM. Wednesday night includes a free meal at 6:00 PM, then Pre-Teen and Youth Bible Study, College and Career Bible Study, and Adult Bible Study at 6:30 PM. Free childcare is available. Thursday night Celebrate Recovery has meal at 6:15 PM and session at 7:00 PM with free childcare available.",
    actions: [{ label: "Add Sunday to Calendar", calendar: "sunday-service" }, { label: "Directions", route: "directions" }],
  },
  mission: {
    title: "Mission Statement",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/hotels_business_website.png",
    body: "Our Code: 1. Jesus is the Center. 2. We believe big and start small. 3. We honor one another to glorify God. 4. We are contributors, not consumers. 5. We can do more by doing less. 6. We don't maintain, we multiply. 7. We eat the fish and leave the bones. 8. We want to be known for what we are for. 9. We will not take this for granted. 10. I am the first line of resolution.",
  },
  elders: {
    title: "Elders & Lay Pastors",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359685916_676167124556074_9092077316176717027_n.jpg",
    body: "Elders: Don Berry, John Martin, John Welborn. Lay Pastors: John Abraham, Danny Gerald, Billy James, Rocky Mahan, Jim Mann, David Crawford, Alan Fires, James Johnson, Gary Bowling, JJ Jernigan, Brian Jordan, Bill Kiker, Tony Leach, Phil Lockwood, Mike Morris, and Todd Smith.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/member/449949132_1000112208378342_6996346522036791670_n.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/member/169fed82_88ee_464e_8abb_760fd0f8f993.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/member/364073147_838252901184795_8235112329675751575_n.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/member/billy_james_updated.png"],
  },
  "team-leaders": {
    title: "Team Leaders",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359957205_983372079646695_5982784191060705686_n.jpg",
    body: "Team Leaders include leaders for church teams and ministries, including building maintenance, Iron Horse, decorating, audit, college and career, chow hall, concessions, connect groups, Celebrate Recovery, buildings and grounds, and more.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/member/360048597_3461852037406412_3927946777074442229_n.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/member/359729918_1657580051414485_6748833929548026709_n.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/member/360048569_992122385371926_2416262934447045694_n.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/member/364215539_679625227539196_6475605505459150032_n.jpg"],
  },
  "card-ministry": {
    title: "Card Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication6.jpg",
    body: "Card Ministry is a serving ministry listed on the website. This app page gives the ministry a native home for details, leader information, photos, and ways to serve.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/360048597_3461852037406412_3927946777074442229_n_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/info_1.jpg"],
  },
  "iron-horse": {
    title: "Iron Horse Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih1.jpg",
    body: "Iron Horse Ministry is listed on the website as one of the church ministries. This native page can include ministry updates, ride/event information, leader contact, and photos.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih3.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih5.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ih2_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/130231231_100188271966705_3557301890575191403_n_1.jpg"],
  },
  "kids-ministry": {
    title: "Kids Korral",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk1.jpg",
    body: "Kids Korral is the children's ministry page from the website and also connects to the app's parent alert feature. Parents can attach their Kids Korral number in the app, and approved staff can send parent notifications when needed.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk5.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk2.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk3.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk6.jpg"],
    actions: [{ label: "Open Kids Korral Alerts", route: "kids" }],
  },
  men: {
    title: "Men's Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication1.jpg",
    body: "Men's Ministry includes men's gatherings, breakfasts, fellowship, and Bible study opportunities. This native app page can hold current events and ministry updates.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/marquee/fireside_website_4.png", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/untitled_design_6_1.png", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/img_3618_800x533_crop.jpg"],
  },
  women: {
    title: "Women's Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication1_1.jpg",
    body: "PPCCC Cowgirls create opportunities for women to gather, grow, and give. The ministry helps women gather together, grow in their relationships with Jesus and others, and give back to the community.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/marquee/wow_website_1.png", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/crafting_cowgirls_facebook.png", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/women_s_ministry_verse_1.png", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/1deef34d_166a_4c1e_add2_a47b874176f9.jpg"],
  },
  "young-adults": {
    title: "Young Adults Group",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/young_adults_website.png",
    body: "Young Adults Group meets every Wednesday at 6:30 PM for ages 18-29. It is a time of fellowship. Contacts listed on the website include Chris Pruitt at 940-452-0026 and Lay Pastor John Knight at 940-452-2961.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/364215539_679625227539196_6475605505459150032_n_1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/e7a6e2a24d78ef43341080e15acf01f8_1.jpg"],
  },
  youth: {
    title: "Youth Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/palo_pinto_county_cowboy.jpg",
    body: "Youth Ministry is for students in 7th-12th grade who love Jesus and are learning to keep Him at the center of their lives. They meet every Wednesday with dinner at 6:15 PM and study at 6:30 PM in the barn. Contact: Bryce Harrington, 940-452-4910.",
    gallery: ["https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth1.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth2.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth3.jpg", "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth4.jpg"],
  },
});

const placeholderPersonImage = "https://www.palopintocowboychurch.com/sr/images/user_placeholder.png";

Object.assign(appPages, {
  visitors: {
    title: "Visitors",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/131901764_10218876925614462_4584006058819768448_n_1.jpg",
    body: "Visitors\n\n1 Corinthians 9:19-23\n\nWelcome to Palo Pinto County Cowboy Church. The visitors page shares Pastor Roger's welcome, the church's heart for reaching people where they are, and what a first-time guest can expect when they come through the doors.",
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/roger_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/117819405_10218119343435381_1622029456958240269_n_1.jpg",
    ],
    people: [
      { name: "Roger Keck", role: "Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/7d240ae3_f3ff_4285_92c4_27331e40b8f5.jpg" },
    ],
    actions: [{ label: "Service Times", route: "service-times" }, { label: "Directions", route: "directions" }],
  },
  "service-times": {
    title: "Service Times",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/2_1.png",
    body: "Sunday Worship Service - 10:30AM\n\nWednesday Night\nFree Meal 6:00pm\nPre-Teen and Youth Bible Study 6:30PM\nCollege and Career Bible Study 6:30PM\nAdult Bible Study 6:30PM\nFREE CHILDCARE AVAILABLE\n\nThursday Night\nCelebrate Recovery\nMeal at 6:15pm\nSession at 7:00pm\nFREE CHILDCARE AVAILABLE\n\n(see calendar for more info)",
    actions: [{ label: "Add Sunday to Calendar", calendar: "sunday-service" }, { label: "Directions", route: "directions" }],
  },
  mission: {
    title: "Mission Statement",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/hotels_business_website.png",
    body: "OUR CODE\n\n1. Jesus is the Center. Priorities\n2. We believe big and start small. Active Faith\n3. We honor one another to glorify God. Valuing People\n4. We are contributors, not consumers. Taking Action\n5. We can do more by doing less. Focused Excellence\n6. We don't maintain, we multiply. Ongoing Growth\n7. We eat the fish and leave the bones. Teachable Attitudes\n8. We want to be known for what we are for. Promoting Unity\n9. We will not take this for granted. Expressing Gratitude\n10. I am the first line of resolution.",
  },
  elders: {
    title: "Elders & Lay Pastors",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359685916_676167124556074_9092077316176717027_n.jpg",
    body: "Elders and Lay Pastors listed on the website.",
    people: [
      { name: "Don Berry", role: "Elder", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359685916_676167124556074_9092077316176717027_n.jpg" },
      { name: "John Martin", role: "Elder", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/449949132_1000112208378342_6996346522036791670_n.jpg" },
      { name: "John Welborn", role: "Elder", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/169fed82_88ee_464e_8abb_760fd0f8f993.jpg" },
      { name: "John Abraham", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364073147_838252901184795_8235112329675751575_n.jpg" },
      { name: "Danny Gerald", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364157058_801844541574306_5162351741474972937_n.jpg" },
      { name: "Billy James", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/billy_james_updated.png" },
      { name: "Rocky Mahan", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359099043_1478788899589398_8598323603006138843_n.jpg" },
      { name: "Jim Mann", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359940411_854227005566180_308518925004795677_n.jpg" },
      { name: "David Crawford", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/e5fbf621_a216_4e0b_94d5_15f1725e17f8.jpg" },
      { name: "Alan Fires", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364215840_1462906064468180_1003418982349130543_n.jpg" },
      { name: "James Johnson", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/367510073_1254031085303884_7633015150808989648_n.jpg" },
      { name: "Gary Bowling", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/9665743a_84fe_4b28_84d8_27d674d22a3d.jpg" },
      { name: "JJ Jernigan", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Brian Jordan", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Bill Kiker", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Tony Leach", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Phil Lockwood", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Mike Morris", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Todd Smith", role: "Lay Pastor", image: placeholderPersonImage },
    ],
  },
  "team-leaders": {
    title: "Team Leaders",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359957205_983372079646695_5982784191060705686_n.jpg",
    body: "Team leaders listed on the website.",
    people: [
      { name: "Nickey Bunch", role: "Prayer Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359957205_983372079646695_5982784191060705686_n.jpg" },
      { name: "Barbara Johnson", role: "Card Ministry Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/360048597_3461852037406412_3927946777074442229_n.jpg" },
      { name: "Teresa Conger", role: "Building Maintenance Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359729918_1657580051414485_6748833929548026709_n.jpg" },
      { name: "Sam McCommas", role: "Iron Horse Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359820224_1290801031641732_6720316773276009510_n.jpg" },
      { name: "Dana Keck", role: "Decorating Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/360048569_992122385371926_2416262934447045694_n.jpg" },
      { name: "Cale Isham", role: "Sound Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359819797_1765753837228452_5419681350569170164_n.jpg" },
      { name: "Jason Carter", role: "Audit Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/06e7441a_7906_4a77_bbef_1dd3c427b7cc.jpg" },
      { name: "Chris Pruitt", role: "College and Career Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364215539_679625227539196_6475605505459150032_n.jpg" },
      { name: "Michael Barham", role: "Door Greeters Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/d9b1e3e3_0649_47b8_9ad6_747ca89585b0.jpg" },
      { name: "Melinda Beard", role: "General Store Team Lead", image: placeholderPersonImage },
      { name: "Kim Carter", role: "Chow Hall Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/8f6043a2_a35e_4516_80ed_421ed305c4ae.jpg" },
      { name: "Dianne Eagleton", role: "Concession Stand Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/a2d0274c_fff1_4545_8f82_4d62f6eb4e30.jpg" },
      { name: "Mike and Kelley Foltz", role: "Connect Group Leads", image: placeholderPersonImage },
      { name: "John Longworth", role: "Celebrate Recovery Team Lead", image: placeholderPersonImage },
      { name: "Christalyn Mahan", role: "Women's Ministry Team Lead", image: placeholderPersonImage },
      { name: "Carolyn Mercer", role: "Harvest Team Lead", image: placeholderPersonImage },
      { name: "Mike Pierce", role: "MW State Park Ministry Team Lead", image: placeholderPersonImage },
      { name: "Mark Turpen", role: "Buildings and Grounds Team Lead", image: placeholderPersonImage },
      { name: "Rhonda Welborn", role: "Door Greeters Team Lead", image: placeholderPersonImage },
    ],
  },
});

Object.assign(appPages, {
  arena: {
    title: "Arena Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena_facebook.jpg",
    body: "Arena Team\n\nArena team host events weekly and monthly. Days of the week vary. The website lists events such as barrel races, playdays, team roping, and open arena days. Like the Arena page on Facebook for updates.",
    people: [{ name: "Robert Ward", role: "940-745-9343", image: placeholderPersonImage }],
  },
  "building-grounds": {
    title: "Building and Grounds",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/gratisography_241h.jpg",
    body: "Building and Grounds\n\nBuilding: Teresa Conger 254-631-1561",
    people: [{ name: "Teresa Conger", role: "254-631-1561", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359729918_1657580051414485_6748833929548026709_n.jpg" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359729918_1657580051414485_6748833929548026709_n_1.jpg",
    ],
  },
  "card-ministry": {
    title: "Card Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication6.jpg",
    body: "Card Ministry\n\nOur ministry provides support and communication through cards for birthdays, anniversaries, and other church family moments.",
    people: [{ name: "Barbara Johnson", role: "Card Ministry Team Lead", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/360048597_3461852037406412_3927946777074442229_n.jpg" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/360048597_3461852037406412_3927946777074442229_n_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/info_1.jpg",
    ],
  },
  "celebrate-recovery": {
    title: "Celebrate Recovery",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/cr.jpg",
    body: "Celebrate Recovery\n\nEvery Thursday Night at PPCCC.\nCelebration Place for Kids and The Landing for Teens.\n\nMEAL 6:00PM\nLARGE GROUP 7:00PM\nSMALL GROUPS 8:00PM",
    people: [{ name: "John Longworth", role: "702-279-4917", image: placeholderPersonImage }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/steps.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/principles.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/verse.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/cr_website_3.png",
    ],
  },
  chuckwagon: {
    title: "Chuckwagon Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck1.jpg",
    body: "Chuckwagon Team",
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck2.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck3.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck5.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/member/8f6043a2_a35e_4516_80ed_421ed305c4ae.jpg",
    ],
  },
  concessions: {
    title: "Concessions",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/concessions1.jpg",
    body: "The Concession Team will be open for events in the arena. Volunteers will cook and serve food.",
    people: [{ name: "Dianne Eagleton", role: "Team Lead: 817-909-1856", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/a2d0274c_fff1_4545_8f82_4d62f6eb4e30.jpg" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/0a266feb_8f60_4915_9fe7_bd1b649ef655.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242593264_577908139918830_3877664977060728858_n_1.jpg",
    ],
  },
  greeters: {
    title: "Door Greeters",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/greeters.jpg",
    body: "People will know they are welcome. We greet each person as they arrive.",
    people: [
      { name: "Pat Clary", role: "940-682-6589", image: placeholderPersonImage },
      { name: "Sam McCommas", role: "Greeters: 940-654-0539", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359820224_1290801031641732_6720316773276009510_n.jpg" },
      { name: "Rhonda Welborn", role: "Door Greeters Team Lead", image: placeholderPersonImage },
    ],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/church1_1.jpg",
    ],
  },
  "general-store": {
    title: "General Store",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/general_store.jpg",
    body: "General Store\n\nOpen every Sunday 9:45am-10:15am and 11:45am-12:15pm.",
    people: [{ name: "Melinda Beard", role: "General Store Team Lead", image: placeholderPersonImage }],
  },
  harvest: {
    title: "Harvest Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/harvest.jpg",
    body: "Harvest Team\n\nOutreach",
    people: [{ name: "Carolyn Mercer", role: "Harvest Team Lead", image: placeholderPersonImage }],
  },
  "iron-horse": {
    title: "Iron Horse Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih1.jpg",
    body: "Iron Horse Ministry\n\nWe are a diverse group of motorcycle enthusiasts. We ride as a group once a month.",
    people: [{ name: "Sam McCommas", role: "940-654-0539", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359820224_1290801031641732_6720316773276009510_n.jpg" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih3.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih5.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih4.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih6.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ih2_1.jpg",
    ],
  },
  "kids-ministry": {
    title: "Kids Korral",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk1.jpg",
    body: "Kids Korral is for kids 0-12 years of age.\n\nSundays at 10:30am\nWednesdays at 6:30pm",
    people: [{ name: "Shawna McCommas", role: "940-445-4305", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/450954152_1651551118968753_3409514351980604823_n.jpg" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk5.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk2.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk3.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk6.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk8.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk10.jpg",
    ],
    actions: [{ label: "Open Kids Korral Alerts", route: "kids" }],
  },
  "media-team": {
    title: "Media Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/media.jpg",
    body: "Media Team members will be trained and comfortable with either the filming, computer, or both. Once a month rotation for volunteers.",
    people: [{ name: "Adam Wroblski", role: "682-429-5598", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359932929_575064288161572_4061951424346166033_n.jpg" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359932929_575064288161572_4061951424346166033_n_1.jpg",
    ],
  },
  men: {
    title: "Men's Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication1.jpg",
    body: "Men's Ministry",
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/fireside_website_4.png",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/untitled_design_6_1.png",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/img_3618_800x533_crop.jpg",
    ],
  },
  park: {
    title: "MW State Park Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/lmwsp_overlook_0369.jpg",
    body: "MW State Park Ministry\n\nChurch service is every Sunday morning in the Mineral Wells State Park. It is a Non Denomination service with coffee, doughnuts, Live Christian Music, and a 15 minute devotional.",
    people: [{ name: "Mike Pierce", role: "281-865-2041", image: placeholderPersonImage }],
  },
  "new-believers": {
    title: "New Believer's Class",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/new.jpg",
    body: "New Believer's Class\n\nEvery Sunday Morning at 9:00am.",
    people: [{ name: "Brian Jordan", role: "817-658-5610", image: placeholderPersonImage }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/new_believers_website_2.png",
    ],
  },
  "prayer-team": {
    title: "Prayer Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/prayer.jpg",
    body: "How can we pray for you today?\n\nSubmit your prayer under resources tab.",
    people: [{ name: "Nickey Bunch", role: "817-613-6654", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359957205_983372079646695_5982784191060705686_n.jpg" }],
    actions: [{ label: "Open Prayer Form", route: "contact" }],
  },
  "sound-team": {
    title: "Sound Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/sound.jpg",
    body: "Our team provides professional quality audio for all services and events sponsored by Palo Pinto County Cowboy Church.",
    people: [{ name: "Cale Isham", role: "817-312-2705", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359819797_1765753837228452_5419681350569170164_n.jpg" }],
  },
  "worship-team": {
    title: "Worship Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/band.jpg",
    body: "Worship Team\n\nThe worship page includes ministry, mission, latest media, and the worship team.",
    people: [{ name: "Ike Mercer", role: "Worship Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/ike_edited.png" }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/244890953_307057087484704_6986061951613743040_n_1_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/243568686_588048309279382_1113807042124914206_n_1_1.jpg",
    ],
  },
  women: {
    title: "Women's Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication1_1.jpg",
    body: "PPCCC Cowgirls\n\nThe Women's Ministry creates opportunities for women to gather, grow, and give together through Bible study, fellowship, and serving.",
    people: [{ name: "Christalyn Mahan", role: "Women's Ministry Team Lead", image: placeholderPersonImage }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/wow_website_1.png",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/crafting_cowgirls_facebook.png",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/women_s_ministry_verse_1.png",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/1deef34d_166a_4c1e_add2_a47b874176f9.jpg",
    ],
  },
  "young-adults": {
    title: "Young Adults Group",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/young_adults_website.png",
    body: "Young Adults Group\n\nEvery Wednesday at 6:30 PM.\nAges 18-29.\nA time of fellowship.",
    people: [
      { name: "Chris Pruitt", role: "940-452-0026", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364215539_679625227539196_6475605505459150032_n.jpg" },
      { name: "John Knight", role: "Lay Pastor: 940-452-2961", image: placeholderPersonImage },
    ],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/364215539_679625227539196_6475605505459150032_n_1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/e7a6e2a24d78ef43341080e15acf01f8_1.jpg",
    ],
  },
  youth: {
    title: "Youth Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/palo_pinto_county_cowboy.jpg",
    body: "Youth Ministry\n\nFor 7th-12th grade students who love Jesus and are learning to keep Him at the center of their lives.\n\nEvery Wednesday\nDinner at 6:15 PM\nStudy at 6:30 PM in the barn.",
    people: [{ name: "Bryce Harrington", role: "940-452-4910", image: placeholderPersonImage }],
    gallery: [
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth1.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth2.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth3.jpg",
      "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth4.jpg",
    ],
  },
});

Object.assign(appPages, {
  "building-grounds": {
    title: "Building and Grounds",
    image: null,
    body: "",
    imageTiles: [
      {
        image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/455363918_2253480411680659_2950973258386417251_n_1.jpg",
        label: "Team Lead and Grounds: Mark Turpen 817-999-0882",
      },
      {
        image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/gratisography_241h.jpg",
        label: "Building and Grounds",
      },
      {
        image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359729918_1657580051414485_6748833929548026709_n_1.jpg",
        label: "Building: Teresa Conger 254-631-1561",
      },
    ],
  },
  "new-believers": {
    title: "New Believer's Class",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/new.jpg",
    body: "New Believer's Class\n\nEvery Sunday Morning at 9:00am.",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/for_by_grace_you_have_been_saved_through_faith_and_this_is_not_your_own_doi_niv_292.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/e8e04a5d_11c3_44a8_903c_0ba7f1f760d7.jpg", label: "Brian Jordan 817-658-5610" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/newb_1.jpg" },
    ],
  },
  "card-ministry": {
    title: "Card Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication6.jpg",
    body: "Card Ministry\n\nOur ministry provides support and communication to our church members through card mailing. We do this by sending cards to members for their birthdays, anniversaries, weddings, baptisms, births, hospitalizations, loss of loved ones, and encouragement during difficult times reminding them of the love of God and the love of this church.",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/360048597_3461852037406412_3927946777074442229_n_1.jpg", label: "Barbara Johnson - Card Ministry Team Lead" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/info_1.jpg" },
    ],
  },
  "celebrate-recovery": {
    title: "Celebrate Recovery",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/cr.jpg",
    body: "Celebrate Recovery\n\nCelebrate Recovery 12 step bible-based program of recovery from life's hurts, hang ups, and habits. We encourage all to access God's healing from broken hearts through Jesus Christ. We provide a safe environment with confidentiality and anonymity.\n\nCelebrate Recovery Team Lead: John Longworth 702-279-4917\n\nEvery Thursday Night at PPCCC.\nCelebration Place for Kids and The Landing for Teens.\n\nMEAL 6:00PM\nLARGE GROUP 7:00PM\nSMALL GROUPS 8:00PM",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/steps.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/principles.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/verse.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/website_ads_1.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/cr_website_3.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/celebrate_recovery_3_1_1.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/6d665375_a59e_4f56_8587_0f48187116bf.jpg", label: "John Longworth 702-279-4917" },
    ],
  },
  chuckwagon: {
    title: "Chuckwagon Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck1.jpg",
    body: "Chuckwagon Team\n\nChuckwagon Team provides monthly PPCCC luncheons and any special event meals.\n\nTeam Lead: Kim Carter 940-445-1748",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck2.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck3.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/chuck5.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/8f6043a2_a35e_4516_80ed_421ed305c4ae.jpg", label: "Kim Carter 940-445-1748" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/il_794xn_2406317215_kfh2.jpg" },
    ],
  },
  concessions: {
    title: "Concessions",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/concessions1.jpg",
    body: "Concessions\n\nThe Concession Team will be open for events in the arena so the attendees can have access to food and drinks without leaving the church property. Volunteers will cook and serve food at each event and represent PPCCC.\n\nTeam Lead: Dianne Eagleton 817-909-1856",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/0a266feb_8f60_4915_9fe7_bd1b649ef655.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242593264_577908139918830_3877664977060728858_n_1.jpg", label: "Dianne Eagleton 817-909-1856" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/1000_f_180724459_eipds48y9dmqawwklblr0tac5pgripsm_1.jpg" },
    ],
  },
  greeters: {
    title: "Door Greeters",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/greeters.jpg",
    body: "Door Greeters\n\nPeople will know they are welcome, needed, and wanted when they walk in the doors of PPCCC. We greet each person in a way that they feel God's spirit as they go through the door. We welcome each person as they enter the doors with a smile and hospitality. We give out handouts and answer any questions you might have.",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/f951fde5_4fb7_4276_9369_a774ffdeedeb.jpg", label: "Pat Clary 940-682-6589" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/church1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359820224_1290801031641732_6720316773276009510_n_1.jpg", label: "GREETERS Sam McCommas 940-654-0539" },
    ],
  },
  "general-store": {
    title: "General Store",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/general_store.jpg",
    body: "General Store\n\nOpen every Sunday 9:45am-10:15am and 11:45am-12:15pm",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242847316_396236698739749_8171333804767005852_n_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/242636446_595635228456931_1284282420251819865_n_1.jpg" },
    ],
  },
  harvest: {
    title: "Harvest Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/harvest.jpg",
    body: "Harvest Team\n\nWe are an outreach mission for the PPCCC.\n\n1. Feeding the Homeless, The Center of Life hosts a project that all area churches participate in.\n\nOur team chose to prepare a full meal and serve on the first and fifth Thursdays of the month.\n\n2. The Harvest team is fortunate to have a budget provided by the church so we can financially support financial needs to children at schools that cannot pay for their lunches, support a few community events per request.\n\nCarolyn Mercer 817-597-7013\n\nOutreach",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ca82561b_66cd_4220_a5be_aa033c42b115.jpg", label: "Carolyn Mercer 817-597-7013" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/wheat_harvest_fields_ripe_wheat_agrarian_industry_wheat_harvest_fields_ripe_wheat_agrarian_industry_173008882.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/4012_2_imagelink_outreach_1.jpg", label: "Outreach" },
    ],
  },
});

const app = document.querySelector("#app");
const title = document.querySelector("#screenTitle");
const toast = document.querySelector("#toast");
const backButton = document.querySelector("#backButton");

document.documentElement.dataset.theme = state.theme;

Object.assign(appPages, {
  arena: {
    title: "Arena Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena_facebook.jpg",
    body: "Arena Team\n\nArena team host events weekly and monthly. Days of the week vary. This team is always looking for people to help as needed with events including barrel races, playdays, team roping, and open arena days.\n\nLike our page on Facebook for all the current events!\n\nRobert Ward 940-745-9343",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/118217122_249534359680759_1375965202103954066_n.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/3.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena3_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena2_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/arena5.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/462722292_122145532742312324_4539751600814781940_n_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/51ad23b2_5cb4_422e_b854_be435f83e345.jpg", label: "Robert Ward 940-745-9343" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/271244315_1313720359100108_49771290183458227_n_2.jpg" },
    ],
  },
  "iron-horse": {
    title: "Iron Horse Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih1.jpg",
    body: "Iron Horse Ministry\n\nWe are a diverse group of motorcycle enthusiasts as well as believers in Christ. Our mission is to love and serve God in all we do. Our purpose is to spread the Word of God to all those we encounter not only through fellowship but by our actions as well. We use motorcycles to reach others and share God's love through His Word. We ride as a group once a month and do outreach events occasionally.\n\nSam McCommas 940-654-0539",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih3.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih5.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih4.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/ih6.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ih2_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359820224_1290801031641732_6720316773276009510_n_2.jpg", label: "Sam McCommas 940-654-0539" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/130231231_100188271966705_3557301890575191403_n_1.jpg" },
    ],
  },
  "kids-ministry": {
    title: "Kids Korral",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk1.jpg",
    body: "Kids Korral\n\nOur goals include increasing kids self-confidence by improving their communication, leadership, trust, and problem-solving skills. We will help each child find their sense of purpose. Our lessons will prepare them for a lifelong walk with Christ. To be involved, all you need is a love for sharing the story of Jesus and what He has done for us. Kids Korral is for kids 0-12 years of age.\n\nSundays at 10:30am\nWednesdays at 6:30pm\n\nShawna McCommas 940-445-4305",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk5.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk2.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk3.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk6.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk8.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk10.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk7.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/339580807_6248140081944829_8908122487182928033_n.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/339568586_101854109547045_1658581658582894247_n.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/338326146_201670552478637_7795697382776016255_n.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/337860629_764269015260773_5551615355019046008_n.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/12_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/450954152_1651551118968753_3409514351980604823_n_1.jpg", label: "Shawna McCommas 940-445-4305" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/untitled_design_7_1.png" },
    ],
    actions: [{ label: "Open Kids Korral Alerts", route: "kids" }],
  },
  "media-team": {
    title: "Media Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/media.jpg",
    body: "Media Team\n\nThe Media Team is responsible for putting up slides on Sunday morning, live streaming the services and filming. We are also going to be at future events for the church to take pictures and video for the website. Media Team members will be trained and comfortable with either the filming, computer, or both. Once a month rotation for volunteers.\n\nAdam Wroblski 682-429-5598",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/wantto_create_bboxv0rveog_unsplash.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359932929_575064288161572_4061951424346166033_n_1.jpg", label: "Adam Wroblski 682-429-5598" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/243380069_10220474902602888_7894213457691044540_n_1.jpg" },
    ],
  },
  park: {
    title: "MW State Park Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/lmwsp_overlook_0369.jpg",
    body: "Mineral Wells State Park Ministry\n\nChurch service is every Sunday morning in the Mineral Wells State park. It is a Non Denomination service with coffee, doughnuts, Live Christian Music, and a 15 minute devotional.\n\nMike Pierce 281-865-2041",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/250589599_1226117457875695_5515991011464047407_n_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/ff7136a6_13b9_41e5_b682_b6042a9b5e92.jpg", label: "Mike Pierce 281-865-2041" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/248534057_427018112320965_6130763414557701777_n_1.jpg" },
    ],
  },
  "prayer-team": {
    title: "Prayer Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/prayer.jpg",
    body: "Prayer Team\n\nHow can we pray for you today?\n\nSubmit your prayer under resources tab at the top of this page.\n\nNickey Bunch 817-613-6654",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/20180408_sundayscripture_ps18.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359957205_983372079646695_5982784191060705686_n_1.jpg", label: "Nickey Bunch 817-613-6654" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/11125_bst_prayer_verses_slide6.jpg" },
    ],
    actions: [{ label: "Open Prayer Form", route: "contact" }],
  },
  "sound-team": {
    title: "Sound Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/sound.jpg",
    body: "Sound Team\n\nOur team provides professional quality audio for all services and events sponsored by Palo Pinto County Cowboy Church.\n\nCale Isham 817-312-2705",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/359819797_1765753837228452_5419681350569170164_n_1.jpg", label: "Cale Isham 817-312-2705" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/isaiah491_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/243380069_10220474902602888_7894213457691044540_n_2.jpg" },
    ],
  },
});

Object.assign(appPages, {
  men: {
    title: "Men's Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication1.jpg",
    body: "Men's Ministry\n\nFireside Devotional on the 2rd Saturday of every month at 6:00pm\n\nMen's Bible Study every Sunday Morning at 9:00am\n\nSpit and Whittle Men's Coffee every Wednesday at Rusty's 7:30am\n\nStay Tuned for other events like retreats, conferences, and other bible study opportunities.",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/fireside_website_4.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/untitled_design_6_1.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/img_3618_800x533_crop.jpg" },
    ],
  },
  "worship-team": {
    title: "Worship Team",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/band.jpg",
    body: "Worship Team\n\nOur Ministry:\nReach the heart and souls of people through music for Christ.\n\nOur Mission Statement:\nTo promote a united atmosphere and feeling of fellowship for worship through music.\n\nLatest Media\nWayfaring Stranger\n10/5/21 | 9:08a\n\nKeeper of My Heart\n10/5/21 | 8:32a\n\nIke Mercer\nRoger Keck\nDebbie Talley\nAlbert Talley\nGrace Partridge\nMichael Cote\nKerry Moore",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/244890953_307057087484704_6986061951613743040_n_1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/243568686_588048309279382_1113807042124914206_n_1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/244957563_1018566822310714_5166503930518054048_n_1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/244930428_773469256820498_5205477437404774667_n_1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/341040019_1280475632880249_7410595501452676888_n_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/245121337_593615572076852_5763789962327056139_n_1_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/1000_f_180724459_eipds48y9dmqawwklblr0tac5pgripsm_1_2.jpg" },
    ],
  },
  women: {
    title: "Women's Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/publication1_1.jpg",
    body: "Women's Ministry\n\nPPCCC Cowgirls Mission Statement\n\nWe will fulfill our mission to live in God's purpose by creating opportunities for women to gather, grow and give. Gather together with other women, grow in our relationships with Jesus and others, and give back to our community by serving and reaching others for Jesus.\n\nWomen's Ministry Leader - Chris Mahan 940.682.1298\nWomen of the Word Leader - Janelle Kiker 254.592.6822\nCowgirl Bible Study Leader - Pat Bazzell 940.682.6589\nCrafting Cowgirls Leader - Linda Behrens 817.475.2528\nGrace House Liaison - Dianne Eagleton 817.909.1856\n\nOther Team Members:\nBetty Thompson 940.229.2321\nPhyllis Banks 940.328.4426\n\nOpportunities to Gather\n\nSundays 9:00am Women of the Word Bible Study.\nMondays 9:00am Crafting Cowgirls.\nTuesdays 10:00am Cowgirl Bible Study.",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/wow_website_1.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/crafting_cowgirls_facebook.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/women_s_ministry_verse_1.png" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/1deef34d_166a_4c1e_add2_a47b874176f9.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/untitled_design_6.png" },
    ],
  },
  "young-adults": {
    title: "Young Adults Group",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/young_adults_website.png",
    body: "Young Adults Group\n\nEvery Wednesday at 6:30pm.\n\nFor ages 18-29 years of age. Great time of fellowship!\n\nContact Chris Pruitt 940-452-0026",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/364215539_679625227539196_6475605505459150032_n_1.jpg", label: "Chris Pruitt 940-452-0026" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/e7a6e2a24d78ef43341080e15acf01f8_1.jpg" },
    ],
  },
  youth: {
    title: "Youth Ministry",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/palo_pinto_county_cowboy.jpg",
    body: "Youth Ministry\n\nWe are a fun loving group of kids in 7th-12th grade that love Jesus and are learning to keep Him the center of our lives.\n\nEvery Wednesday Dinner at 6:15pm and Study at 6:30pm in the barn.\n\nBryce Harrington 940-452-4910",
    imageTiles: [
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth2.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth3.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth4.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth5.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth7.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/youth6.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/4012_2_imagelink_events_1.jpg" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/06671cf7_3ae9_492b_a9e2_623130cc6024.jpg", label: "Bryce Harrington 940-452-4910" },
      { image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/4012_2_imagelink_outreach_1.jpg" },
    ],
  },
  elders: {
    ...appPages.elders,
    people: [
      { name: "Don Berry", role: "Elder", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359685916_676167124556074_9092077316176717027_n.jpg" },
      { name: "John Martin", role: "Elder", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/449949132_1000112208378342_6996346522036791670_n.jpg" },
      { name: "John Welborn", role: "Elder", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/169fed82_88ee_464e_8abb_760fd0f8f993.jpg" },
      { name: "John Abraham", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364073147_838252901184795_8235112329675751575_n.jpg" },
      { name: "Danny Gerald", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364157058_801844541574306_5162351741474972937_n.jpg" },
      { name: "Billy James", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/billy_james_updated.png" },
      { name: "Rocky Mahan", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359099043_1478788899589398_8598323603006138843_n.jpg" },
      { name: "Jim Mann", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/359940411_854227005566180_308518925004795677_n.jpg" },
      { name: "David Crawford", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/e5fbf621_a216_4e0b_94d5_15f1725e17f8.jpg" },
      { name: "Alan Fires", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/364215840_1462906064468180_1003418982349130543_n.jpg" },
      { name: "James Johnson", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/367510073_1254031085303884_7633015150808989648_n.jpg" },
      { name: "Gary Bowling", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/9665743a_84fe_4b28_84d8_27d674d22a3d.jpg" },
      { name: "JJ Jernigan", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/436732248_281504631722492_3975665264098041481_n.jpg" },
      { name: "Brian Jordan", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/brian_updated.png" },
      { name: "Bill Kiker", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/383677817_265439839792465_7786232742928677584_n.jpg" },
      { name: "Tony Leach", role: "Lay Pastor", image: placeholderPersonImage },
      { name: "Phil Lockwood", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/20224305_716b_4d99_b566_3fd59c4bb59d.jpg" },
      { name: "Mike Morris", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/436731462_8183908454966102_2278846158475439669_n.jpg" },
      { name: "Todd Smith", role: "Lay Pastor", image: "https://faithconnector.s3.amazonaws.com/6267/images/member/30b48a48_1b15_4afe_bd3d_f7a1fcc028bb.jpg" },
    ],
  },
});

Object.assign(appPages, {
  "prayer-requests": {
    title: "Prayer Requests",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/prayer.jpg",
    body: "Prayer Request / Praise Report\n\nShare a prayer request or praise report with the appropriate prayer group. This keeps the website form inside the app experience.",
    form: {
      kind: "prayer",
      title: "Submit Prayer or Praise",
      button: "Submit Request",
      fields: [
        { label: "Request Type", type: "select", options: ["Prayer Request", "Praise Report"] },
        { label: "Description", placeholder: "How can we pray or celebrate with you?" },
        { label: "Intended For", placeholder: "Name or family this is for" },
        { label: "Prayer Group", type: "select", options: ["Appropriate Prayer Group", "Everyone"] },
        { label: "Your Name", placeholder: "Name" },
        { label: "Phone or Email", placeholder: "Optional contact info" },
      ],
    },
    actions: [{ label: "Open Prayer Team", pageId: "prayer-team" }],
  },
  "text-alerts": {
    title: "Text Alerts",
    body: "Sign up for PPCCC Text Alerts\n\nText alerts can be used for church announcements, cancellations, and church events. Standard message and data rates may apply.",
    form: {
      kind: "text-alerts",
      title: "SMS Signup",
      button: "Join Text Alerts",
      fields: [
        { label: "Name", placeholder: "Full name" },
        { label: "Email", placeholder: "Email address" },
        { label: "Phone Number", placeholder: "Mobile number", inputmode: "tel" },
        { label: "Terms & Conditions", type: "checkbox", placeholder: "I agree to receive SMS announcements from PPCCC." },
      ],
    },
  },
  sermons: {
    title: "Sermons",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/marquee/band.jpg",
    body: "Sermons\n\nRecent messages from the website, presented as an in-app media library. Videos play inside the app when a YouTube video ID is available from the website sync or media admin entry.",
    mediaItems: [
      { title: "The Way Home", date: "05/10/2026", speaker: "Roger Keck", youtubeVideoId: "zIZoHHk_vug", image: "https://faithconnector.s3.amazonaws.com/6267/images/thumbs/downloads/the_way_home_square.png" },
      { title: "The Believer's Battle", date: "04/12/2026", speaker: "Roger Keck", youtubeVideoId: "ARI_IobhLWU", image: "https://faithconnector.s3.amazonaws.com/6267/images/thumbs/downloads/a_believer_s_facebook_post.png" },
      { title: "Narrow is the Way", date: "04/05/2026", speaker: "Roger Keck", youtubeVideoId: "UwuLNdZEfGI", image: "https://faithconnector.s3.amazonaws.com/6267/images/thumbs/downloads/narrow_is_the_way_square_940_x_788_px.png" },
      { title: "Crowd or Follower", date: "Website Sermon Archive", speaker: "Roger Keck", youtubeVideoId: "Sk_YnPGa8hg", image: "https://faithconnector.s3.amazonaws.com/6267/images/thumbs/downloads/crowd_or_follower_sermon_slides_facebook_post.png" },
      { title: "Green with Envy", date: "Website Sermon Archive", speaker: "Roger Keck", youtubeVideoId: "8v9EcuqKlcY", image: "https://faithconnector.s3.amazonaws.com/6267/images/thumbs/downloads/green_with_envy_square.png" },
    ],
    actions: [{ label: "YouTube Channel", url: "youtube" }],
  },
  "bible-study": {
    title: "Bible Study",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/20180408_sundayscripture_ps18.jpg",
    body: "Bible Study\n\nStudy sessions from the website archive. Recordings stay in-app when the source provides an embeddable YouTube video ID.",
    mediaItems: [
      { title: "Session 17 Psalms", date: "05/11/2022", videoUrl: "" },
      { title: "Session 16 Speaking in Tongues", date: "05/04/2022", videoUrl: "" },
      { title: "Psalm Session 15", date: "Bible Study Archive", videoUrl: "" },
      { title: "Psalm Session 14", date: "Bible Study Archive", videoUrl: "" },
      { title: "Psalm Session 13", date: "Bible Study Archive", videoUrl: "" },
      { title: "Psalm Session 12", date: "Bible Study Archive", videoUrl: "" },
    ],
    actions: [{ label: "YouTube Channel", url: "youtube" }],
  },
  testimonies: {
    title: "Testimonies",
    image: "icons/icon.svg",
    body: "Testimonies\n\nQuotes copied from the website into an app-friendly reading view.",
    testimonials: [
      {
        title: "Dear Cowboy Church",
        quote: "Dear Cowboy Church,\n\nMy social anxiety prevents me from saying things sometimes but God put it on my heart to let yall know this so Im gonna jot it down. To make a long story short, I was raised right but I went left. Alcohol, drugs, you name it. I turned away from God and my life reflected it. I lost everything a few times. I finally came back to God and found myself here at Cowboy Church. Tonight at bible study the preacher asked what it was that made us stay here. I didnt raise my hand but my answer is: Because yall make me feel like I belong here. Im not just a guest, Im a part of the family. Ive seen no frowns or turned up noses, only smiles and outstretched arms. That means so much to me and I'd be honored to call myself a member of this church. It feels like I already am. Thank yall. Thank God.",
        featured: true,
      },
      { quote: "Not even 1 thing that I don't like. The Lord brought me here for a reason and I'm Blessed!" },
      { quote: "The amount of energy in the room, an excellent pastor & a well engaged congregation." },
      { quote: "The fact you can be yourself! The teaching from the Bible! That you always feel welcome!" },
      { quote: "Everyone is so inviting." },
      { quote: "God's Word, the fellowship and the band. This church is our family." },
      { quote: "I always feel like I'm welcome and loved there!" },
      { quote: "Knowing our pastor will always be preaching straight from the Bible! Great worship through music and the friendly, caring people." },
      { quote: "Roger's sermons, the music, and the fact you don't have to try to be something your not to be included." },
      { quote: "The people!!! Nothing like them." },
      { quote: "The people, through and through! They make it feel like home!!" },
      { quote: "The safe environment." },
      { quote: "The spirit I felt the first time I walked in. That hasn't changed." },
      { quote: "The people there will help you work on having a relationship with your Lord and Savior." },
    ],
  },
  "connect-groups": {
    title: "Connect Groups",
    image: "https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/117819405_10218119343435381_1622029456958240269_n_1.jpg",
    body: "Connect Groups\n\nConnect Groups are groups of 6 to 20 people who do life together, meet weekly in host homes, discuss the sermon, fellowship, learn, pray, and help each other.\n\nFill out this form and we will get you connected to a group.",
    form: {
      kind: "connect-group",
      title: "Find a Connect Group",
      button: "Request Group Info",
      fields: [
        { label: "Name", placeholder: "Full name" },
        { label: "Phone or Email", placeholder: "Best way to contact you" },
        { label: "Preferred Area", placeholder: "Town or area" },
        { label: "Notes", placeholder: "Anything we should know?" },
      ],
    },
  },
  "privacy-data": {
    title: "Privacy & Data",
    image: "icons/icon.svg",
    body: "Privacy & Data\n\nThis app is designed for church communication, not advertising.\n\nNo ads.\nNo ad tracking.\nNo background location tracking.\nNo selling personal data.\nNo hidden background data collection.\n\nThe app only loads church content such as events, pages, images, livestream information, and notification settings. Event/content refresh happens when the app opens, when you refresh, or when the operating system allows a lightweight app refresh. Push notifications require permission and are intended only for church alerts, live service notices, event reminders, and Kids Korral alerts.\n\nKids Korral numbers, accounts, roles, and push tokens must be stored in a secure backend before production launch.",
  },
  give: {
    title: "Give",
    image: "icons/icon.svg",
    body: "Tithing is part of worship\n\n\"Honour the LORD with thy substance, and with the firstfruits of all thine increase.\" - Proverbs 3:9 (KJV)\n\nGiving will stay separate from the app account system for security. When the church giving provider is chosen, this screen can hand off clearly to that trusted tithing page.",
  },
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function todayIso() {
  return new Date().toLocaleDateString("en-CA");
}

function isoDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function teamupEventsUrl() {
  const params = new URLSearchParams({
    startDate: isoDateOffset(-365),
    endDate: isoDateOffset(1095),
    tz: "America/Chicago",
  });
  return `${appConfig.teamupEventsJsonUrl}?${params}`;
}

function eventDateOnly(value) {
  return String(value || "").slice(0, 10);
}

function normalizeEvent(item) {
  const start = item.start_dt || item.date || "";
  const end = item.end_dt || item.endDateTime || "";
  const allDay = Boolean(item.all_day || item.allDay || item.time === "All day");
  const date = item.date || eventDateOnly(start);
  const endDate = item.endDate || eventDateOnly(end);
  const time = item.time || (allDay ? "All day" : formatTime(start));
  return {
    id: String(item.id || item.sourceId || `${item.title}-${date}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    sourceId: String(item.sourceId || item.id || ""),
    title: item.title || "Church Event",
    date,
    endDate,
    time,
    startDateTime: item.startDateTime || item.start_dt || "",
    endDateTime: item.endDateTime || item.end_dt || "",
    allDay,
    category: item.category || item.categories || item.subcalendar || teamupCalendars[item.subcalendar_id] || "Church Wide",
    location: item.location || "Palo Pinto Cowboy Church",
    description: item.description || item.notes || "",
    image: item.image || item.attachments?.[0]?.preview || item.attachments?.[0]?.thumbnail || "",
    sourceUrl: item.sourceUrl || item.url || (item.id ? `${appConfig.calendarUrl}/events/${item.id}` : appConfig.calendarUrl),
  };
}

function formatTime(value) {
  if (!value || !value.includes("T")) return "All day";
  return new Date(value).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function unfoldIcs(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function icsField(block, name) {
  const line = block.split(/\r?\n/).find((entry) => entry.startsWith(`${name}:`) || entry.startsWith(`${name};`));
  if (!line) return "";
  return line.slice(line.indexOf(":") + 1)
    .replace(/\\n/g, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .trim();
}

function parseIcsDateField(value) {
  const compact = String(value).slice(0, 8);
  if (!/^\d{8}$/.test(compact)) return "";
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

function parseIcsTimeField(value) {
  if (!String(value).includes("T")) return "All day";
  const hour = Number(value.slice(9, 11));
  const minute = value.slice(11, 13);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minute} ${suffix}`;
}

function parseIcsEvents(text) {
  return unfoldIcs(text)
    .split("BEGIN:VEVENT")
    .slice(1)
    .map((block, index) => {
      const start = icsField(block, "DTSTART");
      const title = icsField(block, "SUMMARY") || "Untitled Event";
      const uid = icsField(block, "UID") || `${title}-${index}`;
      return {
        id: uid.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        sourceId: uid,
        title,
        date: parseIcsDateField(start),
        endDate: parseIcsDateField(icsField(block, "DTEND")),
        time: parseIcsTimeField(start),
        startDateTime: "",
        endDateTime: "",
        allDay: !String(start).includes("T"),
        category: icsField(block, "CATEGORIES") || "Church Wide",
        location: icsField(block, "LOCATION") || "Palo Pinto Cowboy Church",
        description: icsField(block, "DESCRIPTION"),
        sourceUrl: icsField(block, "URL") || appConfig.calendarUrl,
        source: "teamup-ics",
      };
    })
    .filter((event) => event.date);
}

async function fetchJson(url) {
  const headers = {};
  if (url.startsWith(appConfig.supabaseUrl)) {
    headers.apikey = appConfig.supabaseAnonKey;
    headers.authorization = `Bearer ${appConfig.supabaseAnonKey}`;
  }
  const response = await fetch(url, { cache: "no-store", headers });
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

async function loadVerseOfDay() {
  try {
    const payload = await fetchJson(appConfig.verseApiUrl);
    if (payload?.text && payload?.reference) {
      verseOfDay = {
        text: String(payload.text).trim(),
        reference: String(payload.reference).trim(),
        version: payload.version || "CSB",
      };
      return true;
    }
  } catch {
    // A licensed CSB verse feed can be connected here for production.
  }
  verseOfDay = dailyVerseFallback();
  return false;
}

async function fetchIcs(url) {
  const response = await fetch(url, { cache: "no-store", headers: { accept: "text/calendar,text/plain,*/*" } });
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return parseIcsEvents(await response.text());
}

async function loadEvents() {
  state.eventsLoading = true;
  const nativeApp = Boolean(window.__PPCCC_NATIVE_APP__);
  const browserSources = [
    { url: teamupEventsUrl(), label: "Public Teamup JSON" },
    { url: appConfig.eventsApiUrl, label: "Live Teamup feed" },
    { url: appConfig.calendarFeedUrl, label: "Public Teamup iCalendar", type: "ics" },
  ];
  const sources = [
    { url: appConfig.supabaseEventsApiUrl, label: "Live Teamup sync" },
    ...(nativeApp ? [] : browserSources),
    { url: appConfig.generatedEventsUrl, label: "Generated Teamup cache" },
  ];

  for (const source of sources) {
    try {
      const payload = source.type === "ics" ? await fetchIcs(source.url) : await fetchJson(source.url);
      const items = Array.isArray(payload) ? payload : payload.events;
      if (Array.isArray(items) && items.length) {
        teamupEvents = items.map(normalizeEvent).filter((event) => event.date).sort((a, b) => a.date.localeCompare(b.date));
        state.eventsLoadedAt = payload.lastSyncedAt || new Date().toISOString();
        state.eventsSource = source.label;
        state.eventsLoading = false;
        return true;
      }
    } catch {
      // Fall through to the next launch-safe source.
    }
  }

  state.eventsLoadedAt = "";
  state.eventsSource = "Static fallback";
  state.eventsLoading = false;
  return false;
}

function mediaKey(value) {
  return String(value || "").toLowerCase().replace(/&apos;|&#39;/g, "'").replace(/[^a-z0-9]+/g, " ").trim();
}

function formatMediaDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "Website archive";
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
}

function staticMediaByTitle() {
  return [...(appPages.sermons.mediaItems || []), ...(appPages["bible-study"].mediaItems || [])].reduce((map, item) => {
    map.set(mediaKey(item.title), item);
    return map;
  }, new Map());
}

function normalizeMediaItem(item, fallbackMap = staticMediaByTitle()) {
  const title = item.title || "Church Media";
  const fallback = fallbackMap.get(mediaKey(title)) || {};
  return {
    id: item.id || fallback.id || mediaKey(title).replace(/\s+/g, "-"),
    title,
    date: item.date || formatMediaDate(item.pubDate),
    category: item.category || fallback.category || "Messages",
    speaker: item.speaker || fallback.speaker || "",
    description: item.description || fallback.description || "",
    image: item.image || fallback.image || "",
    youtubeVideoId: item.youtubeVideoId || fallback.youtubeVideoId || "",
    videoUrl: item.videoUrl || fallback.videoUrl || "",
    sourceUrl: item.sourceUrl || fallback.sourceUrl || "",
    source: item.source || "faithconnector-rss",
  };
}

function parseMediaRss(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const fallbackMap = staticMediaByTitle();
  return Array.from(doc.querySelectorAll("item")).map((item, index) => {
    const read = (selector) => item.querySelector(selector)?.textContent?.trim() || "";
    return normalizeMediaItem({
      id: read("guid") || `rss-media-${index}`,
      title: read("title"),
      sourceUrl: read("link"),
      description: read("description"),
      pubDate: read("pubDate"),
      category: read("category") || "Messages",
      source: "faithconnector-rss",
    }, fallbackMap);
  }).filter((item) => item.title);
}

async function fetchMediaRss(url) {
  const response = await fetch(url, { cache: "no-store", headers: { accept: "application/rss+xml,application/xml,text/xml,*/*" } });
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return parseMediaRss(await response.text());
}

function applyMediaItems(items, sourceLabel, loadedAt = new Date().toISOString()) {
  const normalized = items.map((item) => normalizeMediaItem(item)).filter((item) => item.title);
  const messages = normalized.filter((item) => mediaKey(item.category).includes("message"));
  const bibleStudy = normalized.filter((item) => mediaKey(item.category).includes("bible study"));
  if (messages.length) appPages.sermons.mediaItems = messages.slice(0, 12);
  if (bibleStudy.length) appPages["bible-study"].mediaItems = bibleStudy.slice(0, 12);
  state.mediaLoadedAt = loadedAt;
  state.mediaSource = sourceLabel;
  state.mediaLoading = false;
  return Boolean(messages.length || bibleStudy.length);
}

async function loadMedia() {
  state.mediaLoading = true;
  const sources = [
    { url: appConfig.mediaApiUrl, label: "Live FaithConnector RSS" },
    { url: appConfig.sermonFeedUrl, label: "Public FaithConnector RSS", type: "rss" },
    { url: appConfig.generatedMediaUrl, label: "Generated media cache" },
  ];

  for (const source of sources) {
    try {
      const payload = source.type === "rss" ? await fetchMediaRss(source.url) : await fetchJson(source.url);
      const items = Array.isArray(payload) ? payload : payload.items;
      if (Array.isArray(items) && items.length && applyMediaItems(items, source.label, payload.lastSyncedAt)) {
        return true;
      }
    } catch {
      // Fall through to the next launch-safe media source.
    }
  }

  state.mediaLoadedAt = "";
  state.mediaSource = "Static fallback";
  state.mediaLoading = false;
  return false;
}

async function enableNotifications() {
  if (!("Notification" in window)) {
    showToast("Notifications need the native build or a supported browser.");
    return;
  }

  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  state.notifications = permission === "granted";
  showToast(state.notifications ? "Notifications enabled." : "Notifications were not enabled.");
  render();
}

function sendLocalNotification(title, body) {
  if (!state.notifications || !("Notification" in window) || Notification.permission !== "granted") return;
  navigator.serviceWorker?.ready?.then((registration) => {
    registration.showNotification(title, {
      body,
      icon: "/icons/icon.svg",
      badge: "/icons/maskable-icon.svg",
      data: { url: "/" },
    });
  }).catch(() => new Notification(title, { body, icon: "/icons/icon.svg" }));
}

function isLocalAdminMode() {
  return state.currentUser.role === "admin" && hasLocalAdminMode();
}

function isSignedIn() {
  return Boolean(state.accountSignedIn);
}

function safeText(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeFamilyNumber(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 8);
}

function saveAccountState() {
  localStorage.setItem(localAccountStorageKey, JSON.stringify({
    isSignedIn: state.accountSignedIn,
    name: state.currentUser.name,
    email: state.currentUser.email,
    phone: state.currentUser.phone || "",
    parentName: state.parentName,
    role: state.currentUser.role === "admin" && hasLocalAdminMode() ? "end_user" : state.currentUser.role,
    linkedFamilies: state.linkedFamilies,
  }));
}

function resetCurrentUser() {
  state.accountSignedIn = false;
  state.accountMode = "sign-in";
  state.parentName = "";
  state.linkedFamilies = [];
  state.currentUser = {
    name: "Guest",
    email: "",
    phone: "",
    role: "end_user",
  };
}

function setLocalAccount({ name, email, phone = "", parentName = "", linkedFamilies = [] }) {
  state.accountSignedIn = true;
  state.accountMode = "profile";
  state.parentName = parentName || `${name}'s Family`;
  state.linkedFamilies = linkedFamilies;
  state.currentUser = {
    name,
    email,
    phone,
    role: hasLocalAdminMode() ? "admin" : "end_user",
  };
  saveAccountState();
}

function familyNumbers() {
  return state.linkedFamilies.map((family) => normalizeFamilyNumber(family.number)).filter(Boolean);
}

function linkedFamilySummary() {
  const numbers = familyNumbers();
  if (!numbers.length) return "Link Kids Korral";
  if (numbers.length === 1) return `#${numbers[0]}`;
  return numbers.map((number) => `#${number}`).join(", ");
}

function firstLinkedFamilyNumber() {
  return familyNumbers()[0] || "";
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function resolveActionUrl(url) {
  if (url === "youtube") return appConfig.youtubeChannelUrl;
  return url;
}

function openMaps() {
  const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  openExternal(isApple ? contactInfo.mapsUrl : contactInfo.googleMapsUrl);
}

function openEmail() {
  const subject = encodeURIComponent("Palo Pinto Cowboy Church App Contact");
  openExternal(`mailto:${contactInfo.email}?subject=${subject}`);
}

function extractYouTubeVideoId(item) {
  const directId = item.youtubeVideoId || item.youtube_video_id || item.videoId || item.video_id;
  if (/^[A-Za-z0-9_-]{6,32}$/.test(String(directId || ""))) return String(directId);
  const url = item.videoUrl || item.url || "";
  const match = String(url).match(/(?:youtube(?:-nocookie)?\.com\/(?:.*[?&]v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,32})/);
  return match && /^[A-Za-z0-9_-]{6,32}$/.test(match[1]) ? match[1] : "";
}

function mediaEmbed(item) {
  const videoId = extractYouTubeVideoId(item);
  if (!videoId) {
    return `
      <div class="media-placeholder" ${item.image ? `style="--media-image: url('${item.image}')"` : ""}>
        <button class="play-button" aria-label="Video pending">▶</button>
        <span>Video embed ready</span>
      </div>
    `;
  }

  return `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1"
      title="${String(item.title || "Video").replaceAll('"', "&quot;")}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
}

function formFieldValues(container) {
  return Array.from(container.querySelectorAll(".field")).reduce((payload, field) => {
    const label = field.querySelector("label")?.textContent?.trim() || "Field";
    const input = field.querySelector("input, select");
    if (!input) return payload;
    payload[label] = input.type === "checkbox" ? input.checked : input.value || "";
    return payload;
  }, {});
}

async function submitAppForm(kind, payload) {
  const response = await fetch(`${appConfig.supabaseUrl}/functions/v1/submit-app-form`, {
    method: "POST",
    headers: {
      "apikey": appConfig.supabaseAnonKey,
      "authorization": `Bearer ${appConfig.supabaseAnonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      kind,
      source: window.__PPCCC_NATIVE_APP__ ? "ios_app" : "web_app",
      sourceUrl: location.href,
      payload: {
        ...payload,
        submittedAt: new Date().toISOString(),
      },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Form submission failed.");
  return data;
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function shiftMonth(month, offset) {
  const base = /^\d{4}-\d{2}$/.test(month) ? `${month}-01T12:00:00` : `${todayIso().slice(0, 7)}-01T12:00:00`;
  const date = new Date(base);
  date.setMonth(date.getMonth() + offset);
  return date.toLocaleDateString("en-CA").slice(0, 7);
}

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function calendarIcsDateTime(date, time) {
  if (!time || time === "All day") return `${date.replaceAll("-", "")}T090000`;
  const [hourText, minuteText] = time.replace(" AM", "").replace(" PM", "").split(":");
  let hour = Number(hourText);
  const minute = Number(minuteText);
  if (time.includes("PM") && hour !== 12) hour += 12;
  const compact = date.replaceAll("-", "");
  return `${compact}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
}

function calendarIcsEndDateTime(event) {
  if (event.endDate && event.endDate > event.date) return `${event.endDate.replaceAll("-", "")}T000000`;
  if (!event.time || event.time === "All day") return `${event.date.replaceAll("-", "")}T103000`;
  const match = event.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const start = new Date(`${event.date}T09:00:00`);
  if (match) {
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    start.setHours(hour, minute, 0, 0);
  }
  start.setMinutes(start.getMinutes() + 90);
  const compact = start.toISOString().slice(0, 10).replaceAll("-", "");
  return `${compact}T${String(start.getHours()).padStart(2, "0")}${String(start.getMinutes()).padStart(2, "0")}00`;
}

function sendNativeMessage(message) {
  if (!window.ReactNativeWebView?.postMessage) return false;
  window.ReactNativeWebView.postMessage(JSON.stringify(message));
  return true;
}

function addToCalendar(eventId) {
  const event = [...events, ...teamupEvents].find((item) => item.id === eventId);
  if (!event) {
    showToast("Event not found.");
    return;
  }
  if (sendNativeMessage({ type: "calendar", event })) {
    showToast("Opening device calendar.");
    return;
  }
  const start = calendarIcsDateTime(event.date, event.time);
  const end = calendarIcsEndDateTime(event);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Palo Pinto Cowboy Church//App//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@palopintocowboychurch.com`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location || "Palo Pinto Cowboy Church"}`,
    `DESCRIPTION:${event.description || event.category || "Palo Pinto Cowboy Church event"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${event.id}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Calendar file created.");
}

function pageThumb(pageId) {
  const page = appPages[pageId];
  if (!page) return "";
  return page.image || page.imageTiles?.[0]?.image || page.gallery?.[0] || "";
}

function cleanSubtitle(item) {
  if (item.subtitle) return item.subtitle;
  if (item.pageId && appPages[item.pageId]?.body) return appPages[item.pageId].body.split("\n").find((line) => line && line !== appPages[item.pageId].title)?.slice(0, 72) || "Open in app";
  if (item.url?.startsWith("mailto:")) return "Open email app";
  if (item.url) return "External handoff";
  return "Open";
}

function brandIcon(type) {
  const icons = {
    facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.1h2.2V4.5c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.3 1.9-5.3 5.5v3H4.4v4h3.5v9h4.2v-9h3.4l.5-4h-3.9v-2.6c0-1.2.3-2.1 2.1-2.1Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Zm0 2a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm5-2.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.1a3 3 0 0 0-2.1-2.1C17.7 4.5 12 4.5 12 4.5s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31.2 31.2 0 0 0 2 12a31.2 31.2 0 0 0 .4 4.9 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 22 12a31.2 31.2 0 0 0-.4-4.9ZM10 15.4V8.6l6 3.4-6 3.4Z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5h15A2.5 2.5 0 0 1 22 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5Zm.2 2 7.3 5 7.3-5H4.7Zm15.3 9.1V9.2l-7.4 5a1 1 0 0 1-1.2 0L4 9.2v6.9c0 .5.4.9.9.9h14.2c.5 0 .9-.4.9-.9Z"/></svg>`,
    map: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18-5 2V6l5-2 6 2 5-2v14l-5 2-6-2Zm1-11.7v9.9l4 1.3V7.6l-4-1.3Zm-4 1v9.8l2-.8V6.5l-2 .8Zm10 .4v9.8l2-.8V6.9l-2 .8Z"/></svg>`,
    staff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0H5Zm13.5-8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-1.1 2.2A8.8 8.8 0 0 1 21 21h-2a6.9 6.9 0 0 0-1.6-6.3ZM5.5 12.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM6.6 14.7A6.9 6.9 0 0 0 5 21H3a8.8 8.8 0 0 1 3.6-6.3Z"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 11h5v-2h-4V6h-2v7Z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v3h6V2h2v3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM4 8h16V7H4v1Z"/></svg>`,
    prayer: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.4 2.8c.8-.5 1.8-.2 2.2.6l1.4 2.5 1.4-2.5c.4-.8 1.4-1.1 2.2-.6.8.4 1.1 1.4.6 2.2l-2.4 4.2 1.8 3.2 2.2-3.8c.5-.8 1.5-1 2.2-.6.8.5 1 1.5.6 2.2l-4.5 7.8A6 6 0 0 1 5.8 18L1.3 10.2C.9 9.4 1.1 8.4 1.9 8c.8-.4 1.8-.2 2.2.6l2.2 3.8 1.8-3.2L5.7 5c-.4-.8-.1-1.8.7-2.2Z"/></svg>`,
    people: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Zm8.5-.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 1.5a6 6 0 0 1 5.8 6H18a8.9 8.9 0 0 0-2.1-5.7c.5-.2 1-.3 1.6-.3Z"/></svg>`,
    document: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 2v5h4l-4-5ZM7 13h10v-2H7v2Zm0 4h10v-2H7v2Z"/></svg>`,
  };
  return icons[type] || "";
}

function linkList(items) {
  return `<div class="native-list">${items.map((item) => {
    const action = item.id ? `id="${item.id}"` : item.pageId ? `data-page="${item.pageId}"` : item.route ? `data-go="${item.route}"` : `data-open="${item.url}"`;
    const thumb = item.image || (item.pageId ? pageThumb(item.pageId) : "");
    const icon = item.icon || item.title.slice(0, 1);
    const iconSvg = brandIcon(icon);
    const iconMarkup = item.brand
      ? `<span class="row-icon brand-icon brand-${item.brand}">${brandIcon(item.brand)}</span>`
      : `<span class="row-icon ${iconSvg ? "brand-icon" : ""}">${iconSvg || safeText(icon)}</span>`;
    return `
      <button class="native-row" ${action}>
        ${thumb ? `<img src="${thumb}" alt="" />` : iconMarkup}
        <span><strong>${item.title}</strong><span class="muted">${cleanSubtitle(item)}</span></span>
        <span class="chevron">&gt;</span>
      </button>
    `;
  }).join("")}</div>`;
}

function linkedFamilyCards({ removable = false } = {}) {
  if (!state.linkedFamilies.length) {
    return `
      <div class="empty-state">
        <strong>No Kids Korral numbers linked yet</strong>
        <span>Add the family number from check-in so alerts can be routed to the right people.</span>
      </div>
    `;
  }

  return `
    <div class="linked-family-list">
      ${state.linkedFamilies.map((family, index) => `
        <article class="family-card">
          <div class="family-card-main">
            <span class="family-number-chip">#${safeText(family.number)}</span>
            <div>
              <strong>${safeText(family.childName || "Child confirmed")}</strong>
              <span class="muted">Pickup name: ${safeText(family.pickupName || state.parentName || state.currentUser.name)}</span>
            </div>
          </div>
          ${removable ? `<button class="button secondary compact-button" data-remove-family="${index}">Remove</button>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function kidsFamilyForm(prefix, buttonId, buttonLabel = "Link Kids Korral Number") {
  const pickupValue = state.parentName || (state.currentUser.name === "Guest" ? "" : state.currentUser.name);
  return `
    <div class="family-form-grid">
      <div class="field">
        <label for="${prefix}KidsNumber">Family Number</label>
        <input id="${prefix}KidsNumber" inputmode="numeric" autocomplete="off" placeholder="Number from check-in" />
      </div>
      <div class="field">
        <label for="${prefix}ChildName">Child Name</label>
        <input id="${prefix}ChildName" autocomplete="name" placeholder="Child name to confirm" />
      </div>
      <div class="field">
        <label for="${prefix}PickupName">Parent or Pickup Name</label>
        <input id="${prefix}PickupName" autocomplete="name" placeholder="Name staff will recognize" value="${safeText(pickupValue)}" />
      </div>
    </div>
    <button class="button full" id="${buttonId}" data-family-prefix="${prefix}">${buttonLabel}</button>
  `;
}

function readFamilyForm(prefix) {
  const number = normalizeFamilyNumber(document.querySelector(`#${prefix}KidsNumber`)?.value);
  const childName = document.querySelector(`#${prefix}ChildName`)?.value?.trim() || "";
  const pickupName = document.querySelector(`#${prefix}PickupName`)?.value?.trim() || "";
  const hasAnyValue = Boolean(number || childName || pickupName);
  if (!number || !childName || !pickupName) return { hasAnyValue, family: null };
  return {
    hasAnyValue,
    family: {
      id: `family-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      number,
      childName,
      pickupName,
      linkedAt: new Date().toISOString(),
    },
  };
}

function categoryTiles(items) {
  return `<div class="category-grid">${items.map((item) => `
    <button class="category-tile" data-page="${item.pageId}">
      <img src="${pageThumb(item.pageId)}" alt="" />
      <strong>${item.title}</strong>
      <span>${cleanSubtitle(item)}</span>
    </button>
  `).join("")}</div>`;
}

function syncStatusCard() {
  return `
    <article class="card settings-card">
      <h3>Website Updates</h3>
      <div class="native-list">
        <button class="native-row" data-sync-info="overview">
          <span class="row-icon">Sync</span>
          <span><strong>Content Sources</strong><span class="muted">Church website, calendar, livestream, and media sources</span></span>
          <span class="chevron">&gt;</span>
        </button>
      </div>
    </article>
  `;
}

function fullSyncStatusCard() {
  return `
    <article class="card settings-card">
      <div class="row">
        <div>
          <h3>Website Content</h3>
          <p class="muted">Church website content, calendar updates, livestream details, and media can be connected here as those sources are approved.</p>
        </div>
        <span class="pill gold">${syncSources.length} Sources</span>
      </div>
      <div class="native-list">
        ${syncSources.map((item) => `
          <button class="native-row" data-sync-info="${item.key}">
            <span class="row-icon">Sync</span>
            <span><strong>${item.label}</strong><span class="muted">${item.status}</span></span>
            <span class="chevron">&gt;</span>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function currentScroll() {
  return app.scrollTop || 0;
}

function restoreScroll(value) {
  window.setTimeout(() => {
    app.scrollTop = value || 0;
  }, 0);
}

function navigate(route, extras = {}) {
  if (state.route !== route || extras.pageId !== state.pageId) {
    state.history.push({ route: state.route, pageId: state.pageId, scrollTop: currentScroll() });
  }
  state.route = route;
  if ("pageId" in extras) state.pageId = extras.pageId;
  render();
  restoreScroll(0);
}

function goBack() {
  const previous = state.history.pop();
  if (!previous) return;
  state.route = previous.route;
  state.pageId = previous.pageId;
  render();
  restoreScroll(previous.scrollTop);
}

function renderHome() {
  const upcoming = teamupEvents.filter((event) => event.date >= todayIso()).slice(0, 3);
  const accountLabel = isSignedIn() ? roles[state.currentUser.role]?.label || "Signed In" : "Guest";
  app.innerHTML = `
    <section class="home-hero">
      <span class="pill gold">Sunday 10:30 AM</span>
      <div>
        <h2>Palo Pinto County Cowboy Church</h2>
        <p>Come as you are. Worship, community, ministries, events, and care in one app.</p>
      </div>
      <div class="hero-actions">
        <button class="button" data-page="visitors">Plan a Visit</button>
        <button class="button secondary" id="mapsButton">Directions</button>
      </div>
    </section>
    <section class="dashboard-grid">
      <button class="dashboard-card" data-go="live">
        <span class="mini-chip">Live</span>
        <strong>Watch Service</strong>
        <span class="muted">In-app livestream and replays</span>
      </button>
      <button class="dashboard-card" data-page="prayer-requests">
        <span class="mini-chip">Care</span>
        <strong>Prayer Request</strong>
        <span class="muted">Send it without leaving the app</span>
      </button>
      <button class="dashboard-card" data-go="kids">
        <span class="mini-chip">Korral</span>
        <strong>${linkedFamilySummary()}</strong>
        <span class="muted">${state.linkedFamilies.length ? "Kids Korral alerts are linked" : "Add your Kids Korral number"}</span>
      </button>
      <button class="dashboard-card" data-go="events">
        <span class="mini-chip">Calendar</span>
        <strong>This Week</strong>
        <span class="muted">${upcoming.length} upcoming events</span>
      </button>
    </section>
    <section class="action-strip">
      <button class="quick-action wide-action" data-calendar="${events[0].id}"><strong>Add Sunday Worship to Calendar</strong><span>${formatDate(events[0].date)} at ${events[0].time}</span></button>
      <button class="quick-action wide-action" data-page="service-times"><strong>Service Times</strong><span>Sunday, Wednesday, and Celebrate Recovery</span></button>
    </section>
    <section class="panel">
      <h2>Verse of the Day</h2>
      <p>${verseOfDay.text}</p>
      <p class="muted">${verseOfDay.reference} ${verseOfDay.version ? `(${verseOfDay.version})` : ""}</p>
    </section>
    <section class="panel">
      <h2>Service Times</h2>
      <div class="info-list">
        <div class="info-row">
          <strong>Sunday Worship Service</strong>
          <span class="muted">10:30 AM</span>
        </div>
        <div class="info-row">
          <strong>Wednesday Night</strong>
          <span class="muted">Free meal 6:00 PM, Pre-Teen, Youth, College and Career, and Adult Bible Study 6:30 PM. Free childcare available.</span>
        </div>
      </div>
    </section>
    <article class="image-card card">
      <img src="https://faithconnector.s3.amazonaws.com/6267/images/library/design_assets/cr_website_3.png" alt="Celebrate Recovery" />
      <div class="card-body">
        <h2>Celebrate Recovery</h2>
        <p class="muted">A 12 step bible-based program of recovery from life's hurts, hang ups, and habits.</p>
        <div class="info-list">
          <div class="info-row">
            <strong>Every Thursday Night</strong>
            <span class="muted">Meal 6:00 PM, Large Group 7:00 PM, Small Groups 8:00 PM.</span>
          </div>
          <div class="info-row">
            <strong>Team Lead</strong>
            <span class="muted">John Longworth, 702-279-4917</span>
          </div>
        </div>
      </div>
    </article>
    <div class="section-title">
      <h2>Featured</h2>
      <span class="muted">From the website</span>
    </div>
    <section class="stack">
      ${homeHighlights.map((item) => `
        <article class="image-card card feature-card">
          <img src="${item.image}" alt="${item.title}" />
          <div class="card-body">
            <div class="row">
              <h3>${item.title}</h3>
              <button class="button secondary" data-page="${item.pageId}">${appPages[item.pageId]?.signup ? "Sign Up" : "Details"}</button>
            </div>
          </div>
        </article>
      `).join("")}
    </section>
    <section class="panel">
      <div class="row">
        <div>
          <h3>${isSignedIn() ? `Welcome back, ${safeText(state.currentUser.name)}` : "Welcome"}</h3>
          <p class="muted">${isSignedIn() ? "Your profile, alerts, and Kids Korral links are in Settings." : "Create an account in Settings to save family and alert preferences on this device."}</p>
        </div>
        <span class="pill gold">${safeText(accountLabel)}</span>
      </div>
    </section>
  `;
}

function eventCard(event) {
  const day = Number(event.date.slice(-2));
  const month = new Date(`${event.date}T12:00:00`).toLocaleDateString(undefined, { month: "short" });
  return `
    <article class="card event-card">
      <div class="date-badge"><span>${month}</span><strong>${day}</strong></div>
      <div>
        <div class="row">
          <div>
            <h3>${event.title}</h3>
            <p class="meta">${formatDate(event.date)} at ${event.time}</p>
          </div>
          <span class="pill">${event.category || (event.location && event.location.includes("Arena") ? "Arena" : "Church")}</span>
        </div>
        ${event.description ? `<p>${event.description}</p>` : ""}
        <div class="event-meta">
          <span class="mini-chip">Add to phone</span>
          <span class="mini-chip">${event.category || "Church"}</span>
        </div>
        <button class="button secondary full" data-calendar="${event.id}">Add to Calendar</button>
      </div>
    </article>
  `;
}

function renderEvents() {
  const upcomingEvents = teamupEvents.filter((event) => event.date >= todayIso());
  const filteredEvents = state.eventFilter === "All" ? upcomingEvents : upcomingEvents.filter((event) => event.category === state.eventFilter);
  const visibleMonth = state.eventMonth || (filteredEvents[0]?.date || todayIso()).slice(0, 7);
  const monthEvents = filteredEvents.filter((event) => event.date.startsWith(visibleMonth));
  const visibleMonthDate = new Date(`${visibleMonth}-01T12:00:00`);
  const monthLabel = visibleMonthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const dayCount = new Date(visibleMonthDate.getFullYear(), visibleMonthDate.getMonth() + 1, 0).getDate();
  const eventDays = new Set(monthEvents.filter((event) => event.date.startsWith(visibleMonth)).map((event) => Number(event.date.slice(-2))));
  const days = Array.from({ length: dayCount }, (_, index) => index + 1);
  app.innerHTML = `
    <section class="stack">
      <article class="panel">
        <div class="row">
          <div>
            <h2>Church Calendar</h2>
            <p class="muted">Upcoming events from the church Teamup calendar, ready to add to your phone.</p>
          </div>
          <span class="pill gold">${filteredEvents.length} Loaded</span>
        </div>
        <div class="sync-strip">
          <span>${state.eventsSource}</span>
          <span>${state.eventsLoadedAt ? `Updated ${new Date(state.eventsLoadedAt).toLocaleString()}` : "Ready for live feed"}</span>
        </div>
      </article>
      <div class="event-toolbar">
        ${eventFilters.map((filter) => `<button class="filter-chip ${state.eventFilter === filter ? "active" : ""}" data-event-filter="${filter}">${filter}</button>`).join("")}
      </div>
      <article class="card">
        <div class="section-title compact-title">
          <h3>${monthLabel}</h3>
          <span class="muted">${eventDays.size} event days</span>
        </div>
        <div class="month-controls">
          <button class="icon-button" data-event-month="-1" aria-label="Previous month">&lt;</button>
          <button class="button secondary" data-event-month="today">This Month</button>
          <button class="icon-button" data-event-month="1" aria-label="Next month">&gt;</button>
        </div>
        <div class="month-grid">
          ${days.map((day) => `<div class="day-cell ${eventDays.has(day) ? "has-event" : ""}">${day}</div>`).join("")}
        </div>
      </article>
      <div class="section-title">
        <h2>Upcoming</h2>
        <span class="muted">${state.eventFilter} - ${monthEvents.length} this month</span>
      </div>
      ${monthEvents.length ? monthEvents.map(eventCard).join("") : `<article class="panel"><h3>No events in this category</h3><p class="muted">Try another filter or check the full calendar.</p></article>`}
    </section>
  `;
}

function renderLive() {
  app.innerHTML = `
    <section class="stack">
      <article class="screen-hero" style="--screen-image: url('https://faithconnector.s3.amazonaws.com/6267/images/marquee/band.jpg')">
        <span class="pill gold">Sunday 10:30 AM</span>
        <div>
          <h2>Live Worship</h2>
          <p>Watch Sunday service live or catch the latest message.</p>
        </div>
      </article>
      <article class="status-row">
        <span class="status-dot"></span>
        <span><strong>Next live service</strong><span class="muted">Sunday Worship at 10:30 AM</span></span>
        <span class="pill">Ready</span>
      </article>
      <article class="card video-card">
        <div class="video-frame">
          <button class="play-button" id="watchLive" aria-label="Watch live">▶</button>
        </div>
        <div class="card-body">
          <h3>Sunday Worship</h3>
          <p class="muted">The livestream will play here when service is live.</p>
          <div class="split-actions">
            <button class="button full" id="watchLive">Watch Live</button>
            <button class="button secondary full" data-page="sermons">Messages</button>
          </div>
        </div>
      </article>
      ${state.currentUser.role === "admin" ? `
      <article class="card settings-group">
        <div class="row">
          <div>
            <h3>Admin Broadcast</h3>
            <p class="muted">Notify members when Sunday service is live.</p>
          </div>
          <span class="pill red">Admin</span>
        </div>
        <button class="button danger full" id="liveAlert">Notify Members</button>
      </article>
      ` : ""}
      <article class="card settings-group">
        <h3>Media Library</h3>
        ${linkList([
          { title: "Sermons", pageId: "sermons", subtitle: "Recent Sunday messages" },
          { title: "Bible Study", pageId: "bible-study", subtitle: "Study sessions and archive" },
          { title: "YouTube", url: "https://www.youtube.com/c/PaloPintoCountyCowboyChurchPPCCC", subtitle: "Open YouTube app" },
        ])}
      </article>
    </section>
  `;
}

function renderKids() {
  const canAlert = state.currentUser.role === "kids_korral" || state.currentUser.role === "admin";
  const linkedNumbers = familyNumbers();
  const alertNumber = firstLinkedFamilyNumber();
  app.innerHTML = `
    <section class="stack">
      <article class="screen-hero" style="--screen-image: url('https://faithconnector.s3.amazonaws.com/6267/images/marquee/kk1.jpg')">
        <span class="pill gold">Kids 0-12</span>
        <div>
          <h2>Kids Korral</h2>
          <p>Link family check-in numbers and receive parent alerts when needed.</p>
        </div>
      </article>
      <article class="korral-number">
        <div>
          <span>${linkedNumbers.length === 1 ? "Linked Family Number" : "Linked Family Numbers"}</span>
          <strong>${linkedNumbers.length ? linkedNumbers.map((number) => `#${safeText(number)}`).join(" ") : "None"}</strong>
        </div>
        <span class="pill gold">${linkedNumbers.length ? `${linkedNumbers.length} Linked` : "Add One"}</span>
      </article>
      <article class="card settings-group">
        <h3>My Linked Families</h3>
        ${linkedFamilyCards({ removable: true })}
      </article>
      <article class="card settings-group">
        <h3>Link Kids Korral</h3>
        <p class="muted">Add each family number separately and confirm the child and pickup name staff should recognize.</p>
        ${kidsFamilyForm("kids", "addKidsFamily")}
      </article>
      <article class="card settings-group">
        <h3>Schedule</h3>
        <div class="info-list">
          <div class="info-row"><strong>Sundays</strong><span class="muted">10:30 AM</span></div>
          <div class="info-row"><strong>Wednesdays</strong><span class="muted">6:30 PM</span></div>
        </div>
        <button class="button secondary full" data-page="kids-ministry">Kids Korral Ministry Info</button>
      </article>
      <article class="card settings-group ${canAlert ? "" : "locked"}">
        <div class="row">
          <h3>Send Parent Alert</h3>
          ${canAlert ? `<span class="pill gold">Staff</span>` : ""}
        </div>
        <p class="muted">${canAlert ? "Approved staff can notify a parent by family number." : "Kids Korral staff tools are available to approved team members."}</p>
        <div class="field">
          <label for="alertNumber">Family Number</label>
          <input id="alertNumber" value="${safeText(alertNumber)}" inputmode="numeric" />
        </div>
        <div class="field">
          <label for="alertReason">Message</label>
          <select id="alertReason">
            <option>Parent needed at Kids Korral</option>
            <option>Check-in question</option>
            <option>Pickup assistance</option>
          </select>
        </div>
        <button class="button blue full" id="sendKidsAlert" ${canAlert ? "" : "disabled"}>Send Alert</button>
      </article>
    </section>
  `;
}

function renderMore() {
  app.innerHTML = `
    <section class="stack">
      <article class="menu-cover card">
        <img src="https://faithconnector.s3.amazonaws.com/6267/images/marquee/3_1.png" alt="" />
        <div class="card-body">
          <h2>Explore PPCCC</h2>
          <p>Ministries, resources, staff, care, media, and church info in one place.</p>
        </div>
      </article>
      <article class="card menu-section menu-card">
        <h3>New Here</h3>
        ${linkList([
          { title: "Visitors", pageId: "visitors", subtitle: "What to expect and welcome info", icon: "people" },
          { title: "Service Times", pageId: "service-times", subtitle: "Sunday, Wednesday, and CR", icon: "clock" },
          { title: "Get Directions", pageId: "directions", subtitle: contactInfo.address, icon: "map" },
          { title: "Meet the Staff", route: "staff", subtitle: "Pastors and church office", icon: "staff" },
          { title: "Elders & Lay Pastors", pageId: "elders", subtitle: "Church shepherding team", icon: "people" },
          { title: "Team Leaders", pageId: "team-leaders", subtitle: "Ministry contacts", icon: "staff" },
          { title: "Mission Statement", pageId: "mission", subtitle: "Our code and values", icon: "document" },
        ])}
      </article>
      <article class="card menu-section menu-card">
        <h3>Ministries</h3>
        ${categoryTiles(ministries)}
      </article>
      <article class="card menu-section menu-card">
        <h3>Resources</h3>
        ${linkList([
          { title: "Calendar", route: "events", subtitle: "Monthly events and add-to-calendar", icon: "calendar" },
          { title: "Sermons", pageId: "sermons", subtitle: "Messages and replays" },
          { title: "Bible Study", pageId: "bible-study", subtitle: "Session archive" },
          { title: "Prayer Requests", pageId: "prayer-requests", subtitle: "Prayer or praise report form", icon: "prayer" },
          { title: "Testimonies", pageId: "testimonies", subtitle: "Quotes from the website" },
          { title: "Connect Groups", pageId: "connect-groups", subtitle: "Request help finding a group" },
          { title: "Text Alerts", pageId: "text-alerts", subtitle: "SMS announcements and updates" },
          { title: "Give", pageId: "give", subtitle: "Tithing and secure giving" },
        ])}
      </article>
      <article class="card menu-section menu-card">
        <h3>Social</h3>
        ${linkList(socialLinks)}
      </article>
    </section>
  `;
}

function renderManage() {
  if (state.currentUser.role !== "admin") {
    app.innerHTML = `<section class="panel"><h2>Account Required</h2><p class="muted">This area is only available to approved admin accounts.</p></section>`;
    return;
  }
  app.innerHTML = `
    <section class="stack">
      <article class="panel">
        <h2>User Permissions</h2>
        <p class="muted">New signups start as general users. Promote trusted users when needed.</p>
      </article>
      ${state.pendingUsers.map((user, index) => `
        <article class="card">
          <div class="row">
            <div>
              <h3>${user.name}</h3>
              <p class="muted">${user.email}</p>
            </div>
            <span class="pill ${user.role === "admin" ? "gold" : ""}">${roles[user.role].label}</span>
          </div>
          <div class="field">
            <label for="role-${index}">Permission</label>
            <select id="role-${index}" data-user-role="${index}">
              <option value="end_user" ${user.role === "end_user" ? "selected" : ""}>General User</option>
              <option value="kids_korral" ${user.role === "kids_korral" ? "selected" : ""}>Kids Korral Staff</option>
              <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
            </select>
          </div>
          <button class="button full" data-save-role="${index}">Update Permissions</button>
        </article>
      `).join("")}
    </section>
  `;
}

function renderStaff() {
  app.innerHTML = `
    <section class="stack">
      <article class="panel">
        <h2>Meet the Staff</h2>
        <p class="muted">Staff information is pulled from the website. If a photo is missing later, the app will show an easy-to-replace placeholder.</p>
      </article>
      <section class="staff-grid">
        ${staffMembers.map((member) => `
          <article class="staff-card card">
            ${member.image ? `<img src="${member.image}" alt="${member.name}" />` : `<div class="staff-placeholder">Unknown</div>`}
            <div class="card-body">
              <h3>${member.name}</h3>
              <p class="muted">${member.role}</p>
            </div>
          </article>
        `).join("")}
      </section>
    </section>
  `;
}

function renderContact() {
  app.innerHTML = `
    <section class="stack">
      <article class="panel">
        <h2>Contact Us</h2>
        <p class="muted">Send a message without leaving the app.</p>
      </article>
      <article class="card">
        <div class="field">
          <label for="contactName">Name</label>
          <input id="contactName" placeholder="Your name" />
        </div>
        <div class="field">
          <label for="contactEmail">Email</label>
          <input id="contactEmail" placeholder="you@example.com" inputmode="email" />
        </div>
        <div class="field">
          <label for="contactMessage">Message</label>
          <input id="contactMessage" placeholder="How can we help?" />
        </div>
        <div class="form-actions">
          <button class="button full" id="sendContact">Send Message</button>
          <button class="button secondary full" id="emailButton">Open Email App</button>
        </div>
      </article>
      <article class="card">
        <h3>Church Office</h3>
        <div class="info-list">
          <div class="info-row"><strong>Address</strong><span class="muted">${contactInfo.address}</span></div>
          <div class="info-row"><strong>Phone</strong><span class="muted">${contactInfo.phone}</span></div>
          <div class="info-row"><strong>Email</strong><span class="muted">${contactInfo.email}</span></div>
        </div>
        <div class="grid">
          <button class="button secondary" id="mapsButton">Maps</button>
          <button class="button secondary" data-open="tel:${contactInfo.phone}">Call</button>
        </div>
      </article>
    </section>
  `;
}

function renderAppPage() {
  const page = appPages[state.pageId];
  if (!page) {
    app.innerHTML = `<section class="panel"><h2>Not Available Yet</h2><p class="muted">This section is ready for church content.</p></section>`;
    return;
  }

  app.innerHTML = `
    <section class="stack">
      ${page.image ? `
        <article class="image-card page-hero card">
          <img src="${page.image}" alt="${page.title}" />
          <div class="card-body">
            <h2>${page.title}</h2>
          </div>
        </article>
      ` : `
        <article class="panel">
          <h2>${page.title}</h2>
        </article>
      `}
      ${page.body || page.signup || page.actions ? `<article class="card">
        ${page.body ? `<p class="copy-block">${page.body}</p>` : ""}
        ${page.signup ? `
          <div class="field">
            <label for="signupName">Name</label>
            <input id="signupName" placeholder="Your name" />
          </div>
          <div class="field">
            <label for="signupPhone">Phone</label>
            <input id="signupPhone" placeholder="Phone number" inputmode="tel" />
          </div>
          <div class="field">
            <label for="signupGuests">Guests</label>
            <input id="signupGuests" placeholder="How many?" inputmode="numeric" />
          </div>
          <button class="button full" data-submit-signup="${page.signup}">Submit RSVP</button>
        ` : ""}
        ${page.actions ? `<div class="form-actions">${page.actions.map((action) => {
          if (action.maps) return `<button class="button full" id="mapsButton">${action.label}</button>`;
          if (action.calendar) return `<button class="button full" data-calendar="${action.calendar}">${action.label}</button>`;
          if (action.pageId) return `<button class="button full" data-page="${action.pageId}">${action.label}</button>`;
          if (action.route && titles[action.route]) return `<button class="button full" data-go="${action.route}">${action.label}</button>`;
          if (action.route) return `<button class="button full" data-page="${action.route}">${action.label}</button>`;
          if (action.url) return `<button class="button full" data-open="${resolveActionUrl(action.url)}">${action.label}</button>`;
          return `<button class="button full">${action.label}</button>`;
        }).join("")}</div>` : ""}
      </article>` : ""}
      ${page.imageTiles ? `
        <article class="stack">
          ${page.imageTiles.map((tile) => `
            <article class="app-image-tile">
              <img src="${tile.image}" alt="${tile.label || page.title}" />
              ${tile.label ? `<div class="tile-label">${tile.label}</div>` : ""}
            </article>
          `).join("")}
        </article>
      ` : ""}
      ${page.mediaItems ? `
        <article class="stack">
          <div class="source-strip">
            <span>${state.mediaSource}</span>
            <span>${state.mediaLoadedAt ? `Updated ${new Date(state.mediaLoadedAt).toLocaleString()}` : "Ready for media feed"}</span>
          </div>
          ${page.mediaItems.map((item) => `
            <article class="card media-embed-card">
              <div class="media-embed-frame">
                ${mediaEmbed(item)}
              </div>
              <div class="media-embed-body">
                <h3>${item.title}</h3>
                <p class="muted">${item.date}${item.speaker ? ` • ${item.speaker}` : ""}</p>
                ${extractYouTubeVideoId(item) ? `<span class="pill gold">In-app video</span>` : `<span class="pill">Waiting on video ID</span>`}
              </div>
            </article>
          `).join("")}
        </article>
      ` : ""}
      ${page.testimonials ? `
        <div class="section-title">
          <h2>Testimonies</h2>
          <span class="muted">${page.testimonials.length} testimonies</span>
        </div>
        <article class="stack">
          ${page.testimonials.map((item) => `
            <article class="card testimony-card ${item.featured ? "featured-testimony" : ""}">
              ${item.title ? `<h3>${item.title}</h3>` : ""}
              <p>${item.quote.split("\n\n").map((part) => `"${part}"`).join("\n\n")}</p>
            </article>
          `).join("")}
        </article>
      ` : ""}
      ${page.form ? `
        <article class="card">
          <h3>${page.form.title}</h3>
          ${page.form.fields.map((field) => `
            <div class="field">
              <label>${field.label}</label>
              ${field.type === "select" ? `
                <select>${field.options.map((option) => `<option>${option}</option>`).join("")}</select>
              ` : field.type === "checkbox" ? `
                <label class="check-row"><input type="checkbox" /> <span>${field.placeholder}</span></label>
              ` : `
                <input placeholder="${field.placeholder || ""}" ${field.inputmode ? `inputmode="${field.inputmode}"` : ""} />
              `}
            </div>
          `).join("")}
          <button class="button full" data-form-submit="${page.form.kind}">${page.form.button}</button>
        </article>
      ` : ""}
      ${page.people ? `
        <article class="stack">
          <div class="section-title">
            <h3>People</h3>
          </div>
          <div class="staff-grid">
            ${page.people.map((person) => `
              <article class="card staff-card">
                ${person.image ? `<img src="${person.image}" alt="${person.name}" />` : `<div class="staff-placeholder">Photo</div>`}
                <div class="card-body">
                  <h3>${person.name}</h3>
                  <p class="muted">${person.role}</p>
                </div>
              </article>
            `).join("")}
          </div>
        </article>
      ` : ""}
      ${page.gallery ? `
        <article class="card">
          <h3>Photos</h3>
          <div class="photo-strip">
            ${page.gallery.map((src) => `<img src="${src}" alt="${page.title}" />`).join("")}
          </div>
        </article>
      ` : ""}
    </section>
  `;
}

function renderAccount() {
  if (!isSignedIn()) {
    app.innerHTML = `
      <section class="stack">
        <article class="settings-profile">
          <div class="avatar">P</div>
          <div>
            <h2>Set Up Your Account</h2>
            <p class="muted">Save your profile, alerts, and Kids Korral links on this device.</p>
            <span class="pill gold">Account Preview</span>
          </div>
        </article>
        <article class="card settings-card account-access-card">
          <h3>Account Access</h3>
          <div class="account-switch" role="group" aria-label="Account access mode">
            <button class="filter-chip ${state.accountMode === "create" ? "active" : ""}" data-account-mode="create">Create Account</button>
            <button class="filter-chip ${state.accountMode === "sign-in" ? "active" : ""}" data-account-mode="sign-in">Sign In</button>
          </div>
          <p class="muted account-note">For beta testing, this saves only on this device. Secure sign-in will be connected before public launch.</p>
          ${state.accountMode === "sign-in" ? `
            <div class="field">
              <label for="signinEmail">Email Address</label>
              <input id="signinEmail" inputmode="email" autocomplete="email" placeholder="you@example.com" />
            </div>
            <div class="field">
              <label for="signinName">Name</label>
              <input id="signinName" autocomplete="name" placeholder="Your name" />
            </div>
            <button class="button full" id="signInAccount">Continue</button>
          ` : `
            <div class="field">
              <label for="createName">Name</label>
              <input id="createName" autocomplete="name" placeholder="Your name" />
            </div>
            <div class="field">
              <label for="createEmail">Email Address</label>
              <input id="createEmail" inputmode="email" autocomplete="email" placeholder="you@example.com" />
            </div>
            <div class="field">
              <label for="createPhone">Phone</label>
              <input id="createPhone" inputmode="tel" autocomplete="tel" placeholder="Phone number" />
            </div>
            <div class="field">
              <label for="createFamilyName">Family Display Name</label>
              <input id="createFamilyName" autocomplete="organization" placeholder="Smith Family" />
            </div>
            <div class="linked-setup">
              <h4>Link Kids Korral</h4>
              <p class="muted">Optional now. You can add more family numbers after setup.</p>
              ${kidsFamilyForm("setup", "createAccount", "Create Account")}
            </div>
          `}
        </article>
        <article class="card settings-card beta-admin-card">
          <h3>TestFlight Admin Beta</h3>
          <p class="muted">Local demo only. Enter the shared passcode to preview staff controls until real account permissions are connected.</p>
          <div class="admin-status-row">
            <strong>Admin Mode</strong>
            <span class="pill ${isLocalAdminMode() ? "gold" : ""}">${isLocalAdminMode() ? "On locally" : "Off"}</span>
          </div>
          ${isLocalAdminMode() ? `
            <button class="button secondary full" id="demoAdminSignOut">Turn Off Local Admin</button>
          ` : `
            <div class="field">
              <label for="demoAdminPasscode">Passcode</label>
              <input id="demoAdminPasscode" type="password" inputmode="text" autocomplete="off" placeholder="Enter TestFlight passcode" />
            </div>
            <button class="button full" id="demoAdminSignIn">Unlock Admin Preview</button>
          `}
          <p class="muted small-note">For TestFlight preview only. Public launch will use secure server permissions.</p>
        </article>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="stack">
      <article class="settings-profile">
        <div class="avatar">${safeText(state.currentUser.name.slice(0, 1))}</div>
        <div>
          <h2>${safeText(state.currentUser.name)}</h2>
          <p class="muted">${safeText(state.currentUser.email)}</p>
          <span class="pill gold">${isLocalAdminMode() ? "Beta Local Admin" : roles[state.currentUser.role].label}</span>
        </div>
      </article>
      <article class="card settings-card account-access-card">
        <h3>Account</h3>
        <div class="admin-status-row">
          <strong>Account Preview</strong>
          <span class="pill gold">Saved on this device</span>
        </div>
        <p class="muted">This account setup is for beta testing only. Public launch will use secure sign-in and account permissions.</p>
        <button class="button secondary full" id="signOutAccount">Sign Out on This Device</button>
      </article>
      <article class="card settings-card beta-admin-card">
        <h3>TestFlight Admin Beta</h3>
        <p class="muted">Local demo only. Enter the shared passcode to preview staff controls until real account permissions are connected.</p>
        <div class="admin-status-row">
          <strong>Admin Mode</strong>
          <span class="pill ${isLocalAdminMode() ? "gold" : ""}">${isLocalAdminMode() ? "On locally" : "Off"}</span>
        </div>
        ${isLocalAdminMode() ? `
          <button class="button secondary full" id="demoAdminSignOut">Turn Off Local Admin</button>
        ` : `
          <div class="field">
            <label for="demoAdminPasscode">Passcode</label>
            <input id="demoAdminPasscode" type="password" inputmode="text" autocomplete="off" placeholder="Enter TestFlight passcode" />
          </div>
          <button class="button full" id="demoAdminSignIn">Unlock Admin Preview</button>
        `}
        <p class="muted small-note">For TestFlight preview only. Public launch will use secure server permissions.</p>
      </article>
      <article class="card settings-card">
        <h3>Profile</h3>
        <div class="field">
          <label for="accountName">Name</label>
          <input id="accountName" value="${safeText(state.currentUser.name)}" />
        </div>
        <div class="field">
          <label for="accountEmail">Email Address</label>
          <input id="accountEmail" value="${safeText(state.currentUser.email)}" inputmode="email" autocomplete="email" />
        </div>
        <div class="field">
          <label for="accountPhone">Phone</label>
          <input id="accountPhone" value="${safeText(state.currentUser.phone || "")}" inputmode="tel" autocomplete="tel" />
        </div>
        <div class="field">
          <label for="parentName">Family Display Name</label>
          <input id="parentName" value="${safeText(state.parentName)}" />
        </div>
        <button class="button full" id="saveAccount">Save Profile</button>
      </article>
      <article class="card settings-card">
        <h3>Kids Korral Links</h3>
        <p class="muted">Link one or more Kids Korral family numbers and confirm the child and pickup name for each one.</p>
        ${linkedFamilyCards({ removable: true })}
        <div class="linked-setup">
          ${kidsFamilyForm("settings", "addKidsFamily")}
        </div>
      </article>
      <article class="card settings-card">
        <h3>Account Security</h3>
        ${linkList([
          { title: "Forgot Password", route: "forgot-password", subtitle: "Email reset link", icon: "R" },
          { title: "Security Center", route: "security", subtitle: "Password, roles, child safety, audit logs", icon: "S" },
        ])}
      </article>
      <article class="card settings-card">
        <h3>Notifications</h3>
        ${linkList([
          { title: "Push Notifications", id: "notifyButton", subtitle: state.notifications ? "On" : "Off", icon: "N" },
          { title: "Text Alerts", pageId: "text-alerts", subtitle: "SMS announcements and updates", icon: "T" },
          { title: "Kids Korral Alerts", route: "kids", subtitle: "Family number and parent alerts", icon: "K" },
        ])}
      </article>
      ${state.currentUser.role === "admin" ? `
        <article class="card settings-card">
          <h3>Admin</h3>
          ${linkList([
            { title: "User Permissions", route: "manage", subtitle: "Manage account roles", icon: "A" },
          ])}
        </article>
      ` : ""}
      <article class="card settings-card">
        <h3>Support</h3>
        ${linkList([
          { title: "Send App Feedback", route: "feedback", subtitle: "Bug reports and suggestions", icon: "F" },
          { title: "Contact Church Office", route: "contact", subtitle: "Send an in-app message", icon: "C" },
          { title: "Privacy & Data", pageId: "privacy-data", subtitle: "No ads, no trackers, no background location", icon: "P" },
        ])}
      </article>
      <article class="card settings-card">
        <h3>Giving</h3>
        ${linkList([
          { title: "Give Online", pageId: "give", subtitle: "Tithing and secure giving", icon: "$" },
        ])}
      </article>
      <article class="card settings-card">
        <h3>Church Contact</h3>
        <div class="info-list">
          <div class="info-row">
            <strong>Address</strong>
            <span class="muted">${contactInfo.address}</span>
          </div>
          <div class="info-row">
            <strong>Phone</strong>
            <span class="muted">${contactInfo.phone}</span>
          </div>
          <div class="info-row">
            <strong>Email</strong>
            <span class="muted">${contactInfo.email}</span>
          </div>
        </div>
        <div class="grid">
          <button class="button secondary" id="mapsButton">Maps</button>
          <button class="button secondary" data-open="tel:${contactInfo.phone}">Call</button>
          <button class="button secondary" id="emailButton">Email</button>
          <button class="button secondary" data-go="contact">Form</button>
        </div>
      </article>
      ${state.currentUser.role === "admin" ? syncStatusCard() : ""}
    </section>
  `;
}

function renderFeedback() {
  app.innerHTML = `
    <section class="stack">
      <article class="panel">
        <h2>Bug Report / App Suggestions</h2>
        <p class="muted">Keep app feedback inside the app so issues are easier to track.</p>
      </article>
      <article class="card">
        <div class="field">
          <label for="feedbackType">Type</label>
          <select id="feedbackType">
            <option>Bug Report</option>
            <option>App Suggestion</option>
            <option>Content Correction</option>
          </select>
        </div>
        <div class="field">
          <label for="feedbackMessage">Details</label>
          <input id="feedbackMessage" placeholder="Tell us what happened or what would help." />
        </div>
        <button class="button full" id="sendFeedback">Submit Feedback</button>
      </article>
    </section>
  `;
}

function renderForgotPassword() {
  app.innerHTML = `
    <section class="stack">
      <article class="screen-hero security-hero">
        <span class="pill gold">Account Recovery</span>
        <div>
          <h2>Reset Password</h2>
          <p>Enter your account email and we will send a secure reset link.</p>
        </div>
      </article>
      <article class="card">
        <div class="field">
          <label for="resetEmail">Email Address</label>
          <input id="resetEmail" value="${safeText(state.currentUser.email)}" placeholder="you@example.com" inputmode="email" autocomplete="email" />
        </div>
        <button class="button full" id="sendPasswordReset">Send Reset Link</button>
        <p class="muted small-note">For your privacy, the app shows the same confirmation either way and sends reset links only through the secure account system.</p>
      </article>
      <article class="card security-list">
        <h3>Reset Link Rules</h3>
        <div class="security-row"><strong>Expires quickly</strong><span>Use short-lived, single-use links.</span></div>
        <div class="security-row"><strong>No password in email</strong><span>Email only carries the reset link.</span></div>
        <div class="security-row"><strong>Rate limited</strong><span>Prevent reset spam and account guessing.</span></div>
        <div class="security-row"><strong>Logged</strong><span>Record request time, IP/device fingerprint, and outcome.</span></div>
      </article>
    </section>
  `;
}

function renderSecurity() {
  const securityItems = [
    ["Backend-only roles", "Admin and Kids Korral permissions must be enforced by the server, not only hidden in the app."],
    ["Least data for kids", "Store Kids Korral numbers and family links only. Avoid birthdates, medical notes, addresses, school info, and custody details unless leadership formally approves."],
    ["Targeted push only", "Kids Korral alerts go only to devices linked to that family number, never to public topics."],
    ["Audit logs", "Log role changes, Kids Korral alerts, login events, password resets, and failed admin attempts."],
    ["Rate limits", "Limit login, reset email, forms, notification sends, and calendar/API requests."],
    ["MFA for staff", "Require multi-factor authentication for admins and Kids Korral staff."],
    ["Biometric unlock", "Use Face ID, Touch ID, or Android fingerprint in the native app before opening admin tools or sending alerts."],
    ["Encrypted transport", "All production traffic must use HTTPS. No secrets or API keys in the mobile bundle."],
    ["Data isolation", "Users can read/update only their own profile, notification preferences, and family number."],
    ["DDoS protection", "Use Cloudflare/Vercel/managed hosting protection, caching, WAF rules, bot limits, and backend request quotas."],
    ["Incident controls", "Admin revoke access, disable push sending, rotate keys, and export audit logs quickly."],
  ];

  app.innerHTML = `
    <section class="stack">
      <article class="screen-hero security-hero">
        <span class="pill gold">Security Center</span>
        <div>
          <h2>Protect Families First</h2>
          <p>Security must live in the backend, with the app showing only the safe controls each user is allowed to use.</p>
        </div>
      </article>
      <article class="card">
        <h3>Production Security Standard</h3>
        <p class="copy-block">This design minimizes exposed data, keeps secrets off phones, rate-limits abuse, logs sensitive actions, and requires server-side role checks before anything involving accounts, admins, Kids Korral, or push notifications.</p>
      </article>
      <article class="card security-list">
        <h3>Required Controls</h3>
        ${securityItems.map(([title, body]) => `<div class="security-row"><strong>${title}</strong><span>${body}</span></div>`).join("")}
      </article>
      <article class="card warning-card">
        <h3>Do Not Ship Without</h3>
        <p>Real auth provider, server-side role checks, secure database rules, push-token registration, audit logs, rate limits, privacy policy, admin MFA, and a Kids Korral operating policy.</p>
      </article>
    </section>
  `;
}

function render() {
  title.textContent = state.route === "page" && appPages[state.pageId] ? appPages[state.pageId].title : titles[state.route];
  app.dataset.route = state.route;
  backButton.classList.toggle("show", state.history.length > 0 && state.route !== "home");
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.route === state.route);
  });
  if (state.route === "home") renderHome();
  if (state.route === "events") renderEvents();
  if (state.route === "live") renderLive();
  if (state.route === "kids") renderKids();
  if (state.route === "more") renderMore();
  if (state.route === "manage") renderManage();
  if (state.route === "account") renderAccount();
  if (state.route === "staff") renderStaff();
  if (state.route === "contact") renderContact();
  if (state.route === "feedback") renderFeedback();
  if (state.route === "forgot-password") renderForgotPassword();
  if (state.route === "security") renderSecurity();
  if (state.route === "page") renderAppPage();
}

document.body.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.id === "backButton") {
    goBack();
    return;
  }

  if (target.dataset.route) {
    state.history = [];
    state.route = target.dataset.route;
    render();
    restoreScroll(0);
  }

  if (target.dataset.go) {
    navigate(target.dataset.go);
  }

  if (target.dataset.page) {
    navigate("page", { pageId: target.dataset.page });
  }

  if (target.dataset.open) openExternal(target.dataset.open);
  if (target.dataset.calendar) addToCalendar(target.dataset.calendar);

  if (target.dataset.eventFilter) {
    state.eventFilter = target.dataset.eventFilter;
    renderEvents();
    restoreScroll(0);
  }

  if (target.dataset.eventMonth) {
    state.eventMonth = target.dataset.eventMonth === "today"
      ? todayIso().slice(0, 7)
      : shiftMonth(state.eventMonth, Number(target.dataset.eventMonth));
    renderEvents();
    restoreScroll(0);
  }

  if (target.dataset.accountMode) {
    state.accountMode = target.dataset.accountMode;
    renderAccount();
    restoreScroll(0);
  }

  if (target.id === "mapsButton") {
    openMaps();
  }

  if (target.id === "emailButton") {
    openEmail();
  }

  if (target.id === "notifyButton") {
    await enableNotifications();
  }

  if (target.id === "themeButton") {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem("ppcc-theme", state.theme);
    showToast(`${state.theme === "dark" ? "Dark" : "Light"} mode enabled.`);
  }

  if (target.id === "giveButton") {
    showToast("Giving link can be added after the provider is chosen.");
  }

  if (target.id === "liveAlert") {
    if (state.currentUser.role !== "admin") {
      showToast("Live notifications require admin access.");
      return;
    }
    showToast("Live now push prepared.");
    sendLocalNotification("Live Now", "Palo Pinto Cowboy Church service is live.");
  }

  if (target.id === "watchLive") {
    navigate("page", { pageId: "sermons" });
    showToast("Live stream embeds here once the live video ID is available.");
  }

  if (target.id === "sendContact") {
    const card = target.closest("article");
    const payload = formFieldValues(card);
    try {
      await submitAppForm("contact", payload);
      showToast("Message sent to the church office.");
    } catch {
      showToast("Message saved locally. Connection needed to send.");
    }
  }

  if (target.id === "sendFeedback") {
    const card = target.closest("article");
    const payload = formFieldValues(card);
    try {
      await submitAppForm("app_feedback", payload);
      showToast("Feedback sent. Thank you.");
    } catch {
      showToast("Feedback saved locally. Connection needed to send.");
    }
  }

  if (target.id === "sendPasswordReset") {
    const email = document.querySelector("#resetEmail")?.value?.trim();
    if (!email || !email.includes("@")) {
      showToast("Enter a valid email address.");
      return;
    }
    showToast("If that email has an account, a reset link will be sent.");
  }

  if (target.id === "demoAdminSignIn") {
    const passcode = document.querySelector("#demoAdminPasscode")?.value?.trim();
    if (passcode !== demoAdminPasscode) {
      showToast("Passcode did not match.");
      return;
    }
    localStorage.setItem(localAdminStorageKey, "true");
    state.currentUser.role = "admin";
    if (isSignedIn()) saveAccountState();
    showToast("Local beta admin mode enabled.");
    render();
  }

  if (target.id === "demoAdminSignOut") {
    localStorage.removeItem(localAdminStorageKey);
    state.currentUser.role = "end_user";
    if (isSignedIn()) saveAccountState();
    showToast("Local beta admin mode turned off.");
    render();
  }

  if (target.dataset.formSubmit) {
    const labels = {
      prayer: "Prayer request",
      "text-alerts": "Text alert signup",
      "connect-group": "Connect Group request",
    };
    const card = target.closest("article");
    const payload = formFieldValues(card);
    try {
      await submitAppForm(target.dataset.formSubmit, payload);
      showToast(`${labels[target.dataset.formSubmit] || "Form"} sent to the church.`);
    } catch {
      showToast(`${labels[target.dataset.formSubmit] || "Form"} saved locally. Connection needed to send.`);
    }
  }

  if (target.dataset.syncInfo) {
    if (target.dataset.syncInfo === "overview") {
      showToast("Church content sources are mapped for future automatic updates.");
      return;
    }
    const item = syncSources.find((source) => source.key === target.dataset.syncInfo);
    if (item) showToast(`${item.label}: ${item.strategy}.`);
  }

  if (target.id === "createAccount") {
    const name = document.querySelector("#createName")?.value?.trim();
    const email = document.querySelector("#createEmail")?.value?.trim();
    const phone = document.querySelector("#createPhone")?.value?.trim() || "";
    const parentName = document.querySelector("#createFamilyName")?.value?.trim() || "";
    if (!name || !email || !email.includes("@")) {
      showToast("Enter your name and a valid email address.");
      return;
    }
    const linkedFamilies = [];
    const setupFamily = readFamilyForm("setup");
    if (setupFamily.hasAnyValue) {
      if (!setupFamily.family) {
        showToast("Finish the Kids Korral number, child name, and pickup name to link it.");
        return;
      }
      linkedFamilies.push(setupFamily.family);
    }
    setLocalAccount({ name, email, phone, parentName, linkedFamilies });
    showToast("Account setup saved on this device.");
    render();
  }

  if (target.id === "signInAccount") {
    const email = document.querySelector("#signinEmail")?.value?.trim();
    const name = document.querySelector("#signinName")?.value?.trim() || email?.split("@")[0] || "Church Family";
    if (!email || !email.includes("@")) {
      showToast("Enter a valid email address.");
      return;
    }
    setLocalAccount({ name, email, linkedFamilies: state.linkedFamilies });
    showToast("Signed in on this device.");
    render();
  }

  if (target.id === "signOutAccount") {
    localStorage.removeItem(localAdminStorageKey);
    resetCurrentUser();
    saveAccountState();
    showToast("Signed out on this device.");
    render();
  }

  if (target.id === "addKidsFamily") {
    const prefix = target.dataset.familyPrefix || "kids";
    const result = readFamilyForm(prefix);
    if (!result.family) {
      showToast("Enter the family number, child name, and pickup name.");
      return;
    }
    if (state.linkedFamilies.some((family) => normalizeFamilyNumber(family.number) === result.family.number)) {
      showToast(`Kids Korral number #${result.family.number} is already linked.`);
      return;
    }
    state.linkedFamilies.push(result.family);
    if (isSignedIn()) saveAccountState();
    showToast(`Kids Korral number #${result.family.number} linked.`);
    render();
  }

  if (target.dataset.removeFamily) {
    const index = Number(target.dataset.removeFamily);
    const removed = state.linkedFamilies.splice(index, 1)[0];
    if (isSignedIn()) saveAccountState();
    showToast(removed ? `Kids Korral number #${removed.number} removed.` : "Kids Korral link removed.");
    render();
  }

  if (target.id === "sendKidsAlert") {
    if (state.currentUser.role !== "kids_korral" && state.currentUser.role !== "admin") {
      showToast("Kids Korral alerts require staff access.");
      return;
    }
    const number = normalizeFamilyNumber(document.querySelector("#alertNumber").value) || firstLinkedFamilyNumber();
    if (!number) {
      showToast("Enter a Kids Korral family number.");
      return;
    }
    showToast(`Push sent to family linked to #${number}.`);
    sendLocalNotification("Kids Korral Alert", `Family #${number}, please check in with Kids Korral.`);
  }

  if (target.dataset.saveRole) {
    const index = Number(target.dataset.saveRole);
    const select = document.querySelector(`[data-user-role="${index}"]`);
    state.pendingUsers[index].role = select.value;
    showToast(`${state.pendingUsers[index].name} is now ${roles[select.value].label}.`);
    render();
  }

  if (target.dataset.submitSignup) {
    const name = document.querySelector("#signupName")?.value || "Guest";
    const card = target.closest("article");
    const payload = formFieldValues(card);
    try {
      await submitAppForm(`signup:${target.dataset.submitSignup}`, {
        ...payload,
        pageId: state.pageId,
        pageTitle: appPages[state.pageId]?.title || "Signup",
      });
      showToast(`${name}'s RSVP was sent to the church.`);
    } catch {
      showToast(`${name}'s RSVP saved locally. Connection needed to send.`);
    }
  }

  if (target.id === "saveAccount") {
    const name = document.querySelector("#accountName")?.value?.trim() || state.currentUser.name;
    const email = document.querySelector("#accountEmail")?.value?.trim() || state.currentUser.email;
    if (!email || !email.includes("@")) {
      showToast("Enter a valid email address.");
      return;
    }
    state.currentUser.name = name;
    state.currentUser.email = email;
    state.currentUser.phone = document.querySelector("#accountPhone")?.value?.trim() || "";
    state.parentName = document.querySelector("#parentName").value || state.parentName;
    saveAccountState();
    showToast("Family profile saved.");
    render();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // The native app shell can run without service worker support.
    });
  });
}

render();
loadEvents().then((loaded) => {
  if (loaded && (state.route === "events" || state.route === "home")) render();
});
loadMedia().then((loaded) => {
  if (loaded && state.route === "page" && ["sermons", "bible-study"].includes(state.pageId)) render();
});
loadVerseOfDay().then((loaded) => {
  if (loaded && state.route === "home") render();
});
