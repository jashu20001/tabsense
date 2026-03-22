// TabSense — options.js

document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  await loadStorageUsage();
  bindEvents();
});

// ─── Load ─────────────────────────────────────────────────────────────────────

async function loadSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  if (!settings) return;

  document.getElementById("notificationsEnabled").checked = settings.notificationsEnabled ?? true;
  document.getElementById("checkInterval").value          = settings.checkInterval ?? 30;
  document.getElementById("workStartHour").value          = settings.workStartHour ?? 9;
  document.getElementById("workEndHour").value            = settings.workEndHour ?? 22;
  document.getElementById("entertainmentTolerance").value = settings.entertainmentTolerance ?? 30;

  updateToleranceHint(settings.entertainmentTolerance ?? 30);
}

async function loadStorageUsage() {
  const all = await chrome.storage.local.get(null);
  const bytes = new TextEncoder().encode(JSON.stringify(all)).length;
  const kb = (bytes / 1024).toFixed(1);
  document.getElementById("storageUsed").textContent = `${kb} KB used`;
}

// ─── Events ───────────────────────────────────────────────────────────────────

function bindEvents() {
  document.getElementById("saveBtn").addEventListener("click", saveSettings);
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("clearBtn").addEventListener("click", clearData);

  document.getElementById("entertainmentTolerance").addEventListener("input", (e) => {
    updateToleranceHint(parseInt(e.target.value));
  });
}

// ─── Save ─────────────────────────────────────────────────────────────────────

async function saveSettings() {
  const settings = {
    notificationsEnabled:    document.getElementById("notificationsEnabled").checked,
    checkInterval:           parseInt(document.getElementById("checkInterval").value),
    workStartHour:           parseInt(document.getElementById("workStartHour").value),
    workEndHour:             parseInt(document.getElementById("workEndHour").value),
    entertainmentTolerance:  parseInt(document.getElementById("entertainmentTolerance").value),
  };

  await chrome.storage.local.set({ settings });

  // Tell background to reset alarms with new interval
  chrome.runtime.sendMessage({ type: "RELOAD_SETTINGS" });

  showBanner();
}

function showBanner() {
  const banner = document.getElementById("saveBanner");
  banner.classList.add("visible");
  setTimeout(() => banner.classList.remove("visible"), 2200);
}

// ─── Export ───────────────────────────────────────────────────────────────────

async function exportData() {
  const data = await chrome.storage.local.get(null);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `tabsense_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Clear ────────────────────────────────────────────────────────────────────

async function clearData() {
  const confirmed = confirm("Clear all of today's session data? This cannot be undone.");
  if (!confirmed) return;

  await chrome.storage.local.set({ sessions: [], lastCheckIn: null });
  await loadStorageUsage();

  const btn = document.getElementById("clearBtn");
  btn.textContent = "Cleared ✓";
  setTimeout(() => (btn.textContent = "Clear data"), 2000);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function updateToleranceHint(val) {
  const hint = document.getElementById("toleranceHint");
  const note = document.getElementById("balanceNote");

  hint.textContent = `${val}% of your day`;

  const hoursIn8 = ((val / 100) * 8).toFixed(1);

  if (val <= 15) {
    note.textContent = `⚡ Strict mode — TabSense will nudge you after just ${hoursIn8}h of leisure in an 8-hour day. Great for deep work days.`;
  } else if (val <= 30) {
    note.textContent = `💡 At ${val}%, TabSense nudges you after ~${hoursIn8}h of leisure in an 8-hour day. That's a healthy balance.`;
  } else if (val <= 45) {
    note.textContent = `😌 Relaxed mode — up to ${hoursIn8}h of leisure before a nudge. Good for lighter days or weekends.`;
  } else {
    note.textContent = `🌴 Very relaxed — ${hoursIn8}h of leisure allowed. TabSense will only intervene when things get really off track.`;
  }
}
