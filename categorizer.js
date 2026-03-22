// TabSense Categorizer
// Local domain ruleset — no API needed, works offline

const CATEGORIES = {
  PRODUCTIVE: "productive",
  LEARNING: "learning",
  ENTERTAINMENT: "entertainment",
  NEUTRAL: "neutral",
  SOCIAL: "social",
};

const CATEGORY_META = {
  productive: { label: "Productive", emoji: "💻", color: "#4ade80", weight: 1.0 },
  learning:   { label: "Learning",   emoji: "📚", color: "#60a5fa", weight: 0.85 },
  neutral:    { label: "Neutral",    emoji: "🔘", color: "#94a3b8", weight: 0.5 },
  social:     { label: "Social",     emoji: "💬", color: "#f59e0b", weight: 0.3 },
  entertainment: { label: "Entertainment", emoji: "🎮", color: "#f87171", weight: 0.1 },
};

// ─── Domain Map ───────────────────────────────────────────────────────────────

const DOMAIN_MAP = {

  // ── Productive ──
  "github.com":           CATEGORIES.PRODUCTIVE,
  "gitlab.com":           CATEGORIES.PRODUCTIVE,
  "bitbucket.org":        CATEGORIES.PRODUCTIVE,
  "stackoverflow.com":    CATEGORIES.PRODUCTIVE,
  "stackexchange.com":    CATEGORIES.PRODUCTIVE,
  "codepen.io":           CATEGORIES.PRODUCTIVE,
  "codesandbox.io":       CATEGORIES.PRODUCTIVE,
  "replit.com":           CATEGORIES.PRODUCTIVE,
  "vercel.com":           CATEGORIES.PRODUCTIVE,
  "netlify.com":          CATEGORIES.PRODUCTIVE,
  "railway.app":          CATEGORIES.PRODUCTIVE,
  "supabase.com":         CATEGORIES.PRODUCTIVE,
  "figma.com":            CATEGORIES.PRODUCTIVE,
  "notion.so":            CATEGORIES.PRODUCTIVE,
  "linear.app":           CATEGORIES.PRODUCTIVE,
  "jira.atlassian.com":   CATEGORIES.PRODUCTIVE,
  "confluence.atlassian.com": CATEGORIES.PRODUCTIVE,
  "trello.com":           CATEGORIES.PRODUCTIVE,
  "asana.com":            CATEGORIES.PRODUCTIVE,
  "clickup.com":          CATEGORIES.PRODUCTIVE,
  "monday.com":           CATEGORIES.PRODUCTIVE,
  "airtable.com":         CATEGORIES.PRODUCTIVE,
  "retool.com":           CATEGORIES.PRODUCTIVE,
  "amplitude.com":        CATEGORIES.PRODUCTIVE,
  "mixpanel.com":         CATEGORIES.PRODUCTIVE,
  "datadog.com":          CATEGORIES.PRODUCTIVE,
  "sentry.io":            CATEGORIES.PRODUCTIVE,
  "postman.com":          CATEGORIES.PRODUCTIVE,
  "insomnia.rest":        CATEGORIES.PRODUCTIVE,
  "aws.amazon.com":       CATEGORIES.PRODUCTIVE,
  "console.cloud.google.com": CATEGORIES.PRODUCTIVE,
  "portal.azure.com":     CATEGORIES.PRODUCTIVE,
  "anthropic.com":        CATEGORIES.PRODUCTIVE,
  "openai.com":           CATEGORIES.PRODUCTIVE,
  "huggingface.co":       CATEGORIES.PRODUCTIVE,
  "kaggle.com":           CATEGORIES.PRODUCTIVE,
  "overleaf.com":         CATEGORIES.PRODUCTIVE,
  "docs.google.com":      CATEGORIES.PRODUCTIVE,
  "sheets.google.com":    CATEGORIES.PRODUCTIVE,
  "slides.google.com":    CATEGORIES.PRODUCTIVE,

  // ── Learning ──
  "coursera.org":         CATEGORIES.LEARNING,
  "udemy.com":            CATEGORIES.LEARNING,
  "edx.org":              CATEGORIES.LEARNING,
  "khanacademy.org":      CATEGORIES.LEARNING,
  "freecodecamp.org":     CATEGORIES.LEARNING,
  "theodinproject.com":   CATEGORIES.LEARNING,
  "leetcode.com":         CATEGORIES.LEARNING,
  "hackerrank.com":       CATEGORIES.LEARNING,
  "codecademy.com":       CATEGORIES.LEARNING,
  "brilliant.org":        CATEGORIES.LEARNING,
  "pluralsight.com":      CATEGORIES.LEARNING,
  "skillshare.com":       CATEGORIES.LEARNING,
  "lynda.com":            CATEGORIES.LEARNING,
  "medium.com":           CATEGORIES.LEARNING,
  "dev.to":               CATEGORIES.LEARNING,
  "hashnode.com":         CATEGORIES.LEARNING,
  "substack.com":         CATEGORIES.LEARNING,
  "arxiv.org":            CATEGORIES.LEARNING,
  "scholar.google.com":   CATEGORIES.LEARNING,
  "researchgate.net":     CATEGORIES.LEARNING,
  "wikipedia.org":        CATEGORIES.LEARNING,
  "investopedia.com":     CATEGORIES.LEARNING,
  "w3schools.com":        CATEGORIES.LEARNING,
  "mdn.mozilla.org":      CATEGORIES.LEARNING,
  "css-tricks.com":       CATEGORIES.LEARNING,
  "smashingmagazine.com": CATEGORIES.LEARNING,
  "roadmap.sh":           CATEGORIES.LEARNING,

  // ── Entertainment ──
  "youtube.com":          CATEGORIES.ENTERTAINMENT,
  "netflix.com":          CATEGORIES.ENTERTAINMENT,
  "primevideo.com":       CATEGORIES.ENTERTAINMENT,
  "hotstar.com":          CATEGORIES.ENTERTAINMENT,
  "disneyplus.com":       CATEGORIES.ENTERTAINMENT,
  "hulu.com":             CATEGORIES.ENTERTAINMENT,
  "twitch.tv":            CATEGORIES.ENTERTAINMENT,
  "reddit.com":           CATEGORIES.ENTERTAINMENT,
  "9gag.com":             CATEGORIES.ENTERTAINMENT,
  "buzzfeed.com":         CATEGORIES.ENTERTAINMENT,
  "imgur.com":            CATEGORIES.ENTERTAINMENT,
  "tumblr.com":           CATEGORIES.ENTERTAINMENT,
  "pinterest.com":        CATEGORIES.ENTERTAINMENT,
  "tiktok.com":           CATEGORIES.ENTERTAINMENT,
  "spotify.com":          CATEGORIES.ENTERTAINMENT,
  "soundcloud.com":       CATEGORIES.ENTERTAINMENT,
  "twitch.com":           CATEGORIES.ENTERTAINMENT,
  "crunchyroll.com":      CATEGORIES.ENTERTAINMENT,
  "imdb.com":             CATEGORIES.ENTERTAINMENT,
  "rottentomatoes.com":   CATEGORIES.ENTERTAINMENT,
  "gamespot.com":         CATEGORIES.ENTERTAINMENT,
  "ign.com":              CATEGORIES.ENTERTAINMENT,
  "steam.com":            CATEGORIES.ENTERTAINMENT,
  "epicgames.com":        CATEGORIES.ENTERTAINMENT,

  // ── Social ──
  "twitter.com":          CATEGORIES.SOCIAL,
  "x.com":                CATEGORIES.SOCIAL,
  "instagram.com":        CATEGORIES.SOCIAL,
  "facebook.com":         CATEGORIES.SOCIAL,
  "linkedin.com":         CATEGORIES.SOCIAL,
  "snapchat.com":         CATEGORIES.SOCIAL,
  "discord.com":          CATEGORIES.SOCIAL,
  "slack.com":            CATEGORIES.SOCIAL,
  "telegram.org":         CATEGORIES.SOCIAL,
  "whatsapp.com":         CATEGORIES.SOCIAL,
  "messenger.com":        CATEGORIES.SOCIAL,
  "teams.microsoft.com":  CATEGORIES.SOCIAL,
  "meet.google.com":      CATEGORIES.SOCIAL,
  "zoom.us":              CATEGORIES.SOCIAL,

  // ── Neutral ──
  "google.com":           CATEGORIES.NEUTRAL,
  "gmail.com":            CATEGORIES.NEUTRAL,
  "mail.google.com":      CATEGORIES.NEUTRAL,
  "calendar.google.com":  CATEGORIES.NEUTRAL,
  "drive.google.com":     CATEGORIES.NEUTRAL,
  "maps.google.com":      CATEGORIES.NEUTRAL,
  "outlook.com":          CATEGORIES.NEUTRAL,
  "office.com":           CATEGORIES.NEUTRAL,
  "dropbox.com":          CATEGORIES.NEUTRAL,
  "icloud.com":           CATEGORIES.NEUTRAL,
  "amazon.com":           CATEGORIES.NEUTRAL,
  "paypal.com":           CATEGORIES.NEUTRAL,
  "weather.com":          CATEGORIES.NEUTRAL,
  "translate.google.com": CATEGORIES.NEUTRAL,
  "news.google.com":      CATEGORIES.NEUTRAL,
  "bbc.com":              CATEGORIES.NEUTRAL,
  "cnn.com":              CATEGORIES.NEUTRAL,
  "nytimes.com":          CATEGORIES.NEUTRAL,
};

// ─── URL Heuristics (fallback for unknown domains) ────────────────────────────

const PRODUCTIVE_KEYWORDS = [
  "docs", "api", "dev", "code", "app", "admin", "dashboard",
  "console", "portal", "manage", "deploy", "build", "test", "repo",
];

const LEARNING_KEYWORDS = [
  "learn", "course", "tutorial", "guide", "how-to", "study",
  "lecture", "lesson", "training", "education", "academy",
];

const ENTERTAINMENT_KEYWORDS = [
  "watch", "play", "game", "stream", "music", "video", "movies",
  "shows", "meme", "fun", "clip", "episode",
];

// ─── Core Categorize Function ─────────────────────────────────────────────────

function categorizeDomain(url) {
  if (!url || url === "chrome://newtab/" || url.startsWith("chrome://")) {
    return CATEGORIES.NEUTRAL;
  }

  try {
    const hostname = new URL(url).hostname.replace("www.", "");

    // 1. Direct domain match
    if (DOMAIN_MAP[hostname]) return DOMAIN_MAP[hostname];

    // 2. Subdomain match (e.g. docs.github.com → github.com)
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const rootDomain = parts.slice(-2).join(".");
      if (DOMAIN_MAP[rootDomain]) return DOMAIN_MAP[rootDomain];
    }

    // 3. Keyword heuristic on full URL
    const fullUrl = url.toLowerCase();

    for (const kw of PRODUCTIVE_KEYWORDS) {
      if (fullUrl.includes(kw)) return CATEGORIES.PRODUCTIVE;
    }
    for (const kw of LEARNING_KEYWORDS) {
      if (fullUrl.includes(kw)) return CATEGORIES.LEARNING;
    }
    for (const kw of ENTERTAINMENT_KEYWORDS) {
      if (fullUrl.includes(kw)) return CATEGORIES.ENTERTAINMENT;
    }

    return CATEGORIES.NEUTRAL;

  } catch {
    return CATEGORIES.NEUTRAL;
  }
}

// ─── Focus Score Calculator ───────────────────────────────────────────────────
// Returns 0–100. Considers time ratios + recent activity weight

function calculateFocusScore(sessionData) {
  if (!sessionData || sessionData.length === 0) return 100;

  const now = Date.now();
  const RECENCY_WINDOW = 30 * 60 * 1000; // last 30 mins weighted more

  let weightedScore = 0;
  let totalWeight = 0;

  for (const entry of sessionData) {
    const age = now - entry.startTime;
    const recencyWeight = age < RECENCY_WINDOW ? 2.0 : 1.0;
    const categoryWeight = CATEGORY_META[entry.category]?.weight ?? 0.5;
    const duration = entry.duration || 0;

    weightedScore += categoryWeight * duration * recencyWeight;
    totalWeight += duration * recencyWeight;
  }

  if (totalWeight === 0) return 100;

  const raw = (weightedScore / totalWeight) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

// ─── Time Breakdown ───────────────────────────────────────────────────────────

function getTimeBreakdown(sessionData) {
  const breakdown = {
    productive: 0,
    learning: 0,
    entertainment: 0,
    social: 0,
    neutral: 0,
  };

  for (const entry of sessionData) {
    if (breakdown[entry.category] !== undefined) {
      breakdown[entry.category] += entry.duration || 0;
    }
  }

  return breakdown;
}

// ─── Pattern Detector ─────────────────────────────────────────────────────────
// Detects streaks and triggers for notifications

function detectPattern(sessionData) {
  if (!sessionData || sessionData.length < 2) return null;

  const recent = sessionData.slice(-10); // last 10 entries
  const now = Date.now();
  const WINDOW = 45 * 60 * 1000; // 45 min window

  const recentWindow = recent.filter(e => now - e.startTime < WINDOW);
  if (recentWindow.length === 0) return null;

  const totalTime = recentWindow.reduce((s, e) => s + (e.duration || 0), 0);
  const entertainmentTime = recentWindow
    .filter(e => e.category === CATEGORIES.ENTERTAINMENT || e.category === CATEGORIES.SOCIAL)
    .reduce((s, e) => s + (e.duration || 0), 0);
  const productiveTime = recentWindow
    .filter(e => e.category === CATEGORIES.PRODUCTIVE || e.category === CATEGORIES.LEARNING)
    .reduce((s, e) => s + (e.duration || 0), 0);

  const entertainmentRatio = totalTime > 0 ? entertainmentTime / totalTime : 0;
  const productiveRatio = totalTime > 0 ? productiveTime / totalTime : 0;

  if (entertainmentTime > 40 * 60 * 1000 && entertainmentRatio > 0.8) {
    return { type: "DEEP_DISTRACTION", entertainmentTime, ratio: entertainmentRatio };
  }

  if (entertainmentTime > 20 * 60 * 1000 && entertainmentRatio > 0.6) {
    return { type: "LIGHT_DISTRACTION", entertainmentTime, ratio: entertainmentRatio };
  }

  if (productiveTime > 90 * 60 * 1000 && productiveRatio > 0.85) {
    return { type: "DEEP_FOCUS", productiveTime, ratio: productiveRatio };
  }

  if (productiveRatio > 0.6) {
    return { type: "ON_TRACK", productiveTime, ratio: productiveRatio };
  }

  return { type: "BALANCED", entertainmentTime, productiveTime };
}

// ─── Notification Messages ────────────────────────────────────────────────────

function getNotificationMessage(pattern, breakdown) {
  if (!pattern) return null;

  const entertainmentMins = Math.round((breakdown.entertainment + breakdown.social) / 60000);
  const productiveMins = Math.round((breakdown.productive + breakdown.learning) / 60000);

  const messages = {
    DEEP_DISTRACTION: [
      {
        title: "Hey, still with us? 👀",
        body: `You've been on entertainment/social for ~${entertainmentMins} mins. No judgment — but what was the thing you wanted to get done today?`,
      },
      {
        title: "Small check-in 🧠",
        body: `${entertainmentMins} mins of entertainment in a row. Your brain might actually want a challenge right now. What's one small task you could knock out?`,
      },
    ],
    LIGHT_DISTRACTION: [
      {
        title: "Quick check-in ✌️",
        body: `You've drifted a bit — totally normal. Just a nudge: is there something you wanted to finish today?`,
      },
      {
        title: "Balance check 🎯",
        body: `Mix of work and distraction happening. That's fine! Just making sure it's intentional and not accidental.`,
      },
    ],
    DEEP_FOCUS: [
      {
        title: "Seriously impressive 🔥",
        body: `${productiveMins} mins of deep focus. You're in a flow state. Drink some water, you've earned it.`,
      },
      {
        title: "Deep work streak 💪",
        body: `You've been locked in for ${productiveMins} mins. Consider a 5-min break — it'll actually make the next session stronger.`,
      },
    ],
    ON_TRACK: [
      {
        title: "You're doing great 👍",
        body: `Solid focus session going. Keep the momentum — you're on track.`,
      },
    ],
    BALANCED: [
      {
        title: "Good balance today ⚖️",
        body: `${productiveMins} mins productive, some breaks mixed in. That's actually healthy. Keep it up.`,
      },
    ],
  };

  const options = messages[pattern.type] || messages.BALANCED;
  return options[Math.floor(Math.random() * options.length)];
}

// ─── End of Day Reflection ────────────────────────────────────────────────────

function generateDailyReflection(breakdown, focusScore) {
  const totalMs = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const totalMins = Math.round(totalMs / 60000);
  const productiveMins = Math.round((breakdown.productive + breakdown.learning) / 60000);
  const entertainmentMins = Math.round((breakdown.entertainment + breakdown.social) / 60000);

  if (totalMins < 10) {
    return "Not enough data yet today. TabSense is watching — come back later!";
  }

  if (focusScore >= 80) {
    return `Strong day. You put in ${productiveMins} mins of focused work — that compounds over time. Rest well tonight.`;
  }

  if (focusScore >= 55) {
    return `Decent balance today — ${productiveMins} mins productive, ${entertainmentMins} mins of downtime. You showed up. That's what matters.`;
  }

  if (focusScore >= 35) {
    return `Today was more distracted than focused — and that's okay sometimes. ${productiveMins} mins of work still happened. Tomorrow, try starting with your hardest task first.`;
  }

  return `Rough day focus-wise. We all have them. ${productiveMins > 0 ? `You still got ${productiveMins} mins in — that counts.` : "Rest up and reset for tomorrow."} Be kind to yourself.`;
}
