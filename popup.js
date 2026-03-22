// TabSense — popup.js
// Requests data from background, renders dashboard

const COLORS = {
  productive:    "#4ade80",
  learning:      "#60a5fa",
  social:        "#f59e0b",
  entertainment: "#f87171",
  neutral:       "#475569",
};

const LABELS = {
  productive:    "Productive",
  learning:      "Learning",
  social:        "Social",
  entertainment: "Entertainment",
  neutral:       "Neutral",
};

const STATUS_MESSAGES = {
  DEEP_FOCUS:        "🔥 Deep focus mode",
  ON_TRACK:          "✅ On track",
  BALANCED:          "⚖️  Well balanced",
  LIGHT_DISTRACTION: "🌀 Slightly drifting",
  DEEP_DISTRACTION:  "⚠️  Off track",
};

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  renderDate();
  loadStatus();

  document.getElementById("checkBtn").addEventListener("click", forceCheck);
  document.getElementById("settingsBtn").addEventListener("click", openSettings);
});

// ─── Load Data from Background ────────────────────────────────────────────────

function loadStatus() {
  chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
    if (chrome.runtime.lastError || !response) {
      renderError();
      return;
    }
    renderDashboard(response);
  });
}

// ─── Render Dashboard ─────────────────────────────────────────────────────────

function renderDashboard(data) {
  const { focusScore, breakdown, pattern, sessions, reflection, activeTab } = data;

  renderScore(focusScore, pattern);
  renderActiveTab(activeTab);
  renderBreakdown(breakdown);
  renderStats(breakdown);
  renderTimeline(sessions);
  renderReflection(reflection);
}

// ── Score Ring ──

function renderScore(score, pattern) {
  const number = document.getElementById("scoreNumber");
  const status = document.getElementById("scoreStatus");
  const ring   = document.getElementById("ringFill");
  const wrap   = document.querySelector(".score-ring-wrap");

  number.textContent = score;
  status.textContent = STATUS_MESSAGES[pattern] || "⚖️  Balanced";

  // Ring fill: circumference = 2π × 42 ≈ 264
  const circumference = 264;
  const offset = circumference - (score / 100) * circumference;
  ring.style.strokeDashoffset = offset;

  // Color state
  wrap.classList.remove("score-high", "score-mid", "score-low");
  if (score >= 65)      wrap.classList.add("score-high");
  else if (score >= 40) wrap.classList.add("score-mid");
  else                  wrap.classList.add("score-low");
}

// ── Active Tab ──

function renderActiveTab(activeTab) {
  const el = document.getElementById("activeTab");
  if (!activeTab) {
    el.textContent = "No active tab";
    return;
  }
  const mins = Math.round(activeTab.duration / 60000);
  const label = LABELS[activeTab.category] || "Neutral";
  el.textContent = `${truncate(activeTab.title, 28)} · ${label}${mins > 0 ? ` · ${mins}m` : ""}`;
  el.style.color = COLORS[activeTab.category] || "#475569";
}

// ── Breakdown Bar ──

function renderBreakdown(breakdown) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  if (total === 0) return;

  const keys = ["productive", "learning", "social", "entertainment", "neutral"];
  const legend = document.getElementById("breakdownLegend");
  legend.innerHTML = "";

  for (const key of keys) {
    const ms  = breakdown[key] || 0;
    const pct = total > 0 ? Math.round((ms / total) * 100) : 0;

    // Update bar segment
    const seg = document.getElementById(`bar-${key}`);
    if (seg) seg.style.width = `${pct}%`;

    // Only show legend items with time
    if (ms < 10000) continue;

    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <div class="legend-dot" style="background:${COLORS[key]}"></div>
      <span>${LABELS[key]}</span>
      <span class="legend-time">${formatDuration(ms)}</span>
    `;
    legend.appendChild(item);
  }
}

// ── Stats Row ──

function renderStats(breakdown) {
  const productiveMs = (breakdown.productive || 0) + (breakdown.learning || 0);
  const entertainMs  = (breakdown.entertainment || 0) + (breakdown.social || 0);
  const totalMs      = Object.values(breakdown).reduce((a, b) => a + b, 0);

  document.getElementById("statProductiveMins").textContent = formatDuration(productiveMs);
  document.getElementById("statEntertainMins").textContent  = formatDuration(entertainMs);
  document.getElementById("statTotalMins").textContent      = formatDuration(totalMs);
}

// ── Timeline ──

function renderTimeline(sessions) {
  const container = document.getElementById("timeline");
  if (!sessions || sessions.length === 0) return;

  container.innerHTML = "";

  // Show last 12 entries, most recent first
  const recent = [...sessions].reverse().slice(0, 12);

  for (const entry of recent) {
    const el = document.createElement("div");
    el.className = "timeline-entry";

    const color = COLORS[entry.category] || COLORS.neutral;
    const time  = new Date(entry.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    el.innerHTML = `
      <div class="entry-dot" style="background:${color}"></div>
      <div class="entry-title">${escapeHtml(truncate(entry.title || entry.url, 32))}</div>
      <div class="entry-time">${time}</div>
      <div class="entry-cat" style="background:${color}22; color:${color}">
        ${entry.category.slice(0, 4)}
      </div>
    `;
    container.appendChild(el);
  }

  // Scroll to top (most recent)
  container.scrollTop = 0;
}

// ── Reflection ──

function renderReflection(text) {
  const el = document.getElementById("reflectionText");
  el.textContent = text || "Keep browsing — TabSense is building your picture.";
}

// ── Error State ──

function renderError() {
  document.getElementById("scoreNumber").textContent = "?";
  document.getElementById("scoreStatus").textContent = "Could not load data";
  document.getElementById("reflectionText").textContent = "Reload the extension and try again.";
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function forceCheck() {
  const btn = document.getElementById("checkBtn");
  btn.disabled = true;
  btn.textContent = "Checking...";

  chrome.runtime.sendMessage({ type: "FORCE_CHECK" }, () => {
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Check in now";
      loadStatus();
    }, 800);
  });
}

function openSettings() {
  chrome.runtime.openOptionsPage();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderDate() {
  const el = document.getElementById("footerDate");
  el.textContent = new Date().toLocaleDateString([], {
    weekday: "short", month: "short", day: "numeric",
  });
}

function formatDuration(ms) {
  if (!ms || ms < 60000) return "<1m";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
