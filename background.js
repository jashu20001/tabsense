// TabSense — background.js
// Service worker: tracks tabs, times sessions, fires notifications

importScripts("categorizer.js");

// ─── Constants ────────────────────────────────────────────────────────────────

const ALARM_CHECK    = "tabsense_check";     // every 30 mins pattern check
const ALARM_EOD      = "tabsense_eod";       // end of day reflection at 9pm
const MIN_DURATION   = 5 * 1000;             // ignore tabs open < 5 seconds
const CHECK_INTERVAL = 30;                   // minutes between check-ins

// ─── State (in-memory, backed by chrome.storage) ──────────────────────────────

let activeTab = null;       // { tabId, url, title, startTime, category }
let lastNotifTime = 0;      // throttle: don't notify more than once per 25 mins

// ─── Boot ─────────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  console.log("[TabSense] Installed");
  await initStorage();
  setupAlarms();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log("[TabSense] Browser started");
  await initStorage();
  setupAlarms();
});

async function initStorage() {
  const data = await chrome.storage.local.get(["sessions", "settings", "todayDate"]);

  const today = getToday();

  // Reset sessions if it's a new day
  if (data.todayDate !== today) {
    await chrome.storage.local.set({
      sessions: [],
      todayDate: today,
      lastReflection: null,
    });
    console.log("[TabSense] New day — sessions reset");
  }

  // Default settings
  if (!data.settings) {
    await chrome.storage.local.set({
      settings: {
        notificationsEnabled: true,
        checkInterval: CHECK_INTERVAL,
        workStartHour: 9,
        workEndHour: 22,
        entertainmentTolerance: 30, // % of time allowed for entertainment
      },
    });
  }
}

function setupAlarms() {
  chrome.alarms.clearAll(() => {
    chrome.alarms.create(ALARM_CHECK, { periodInMinutes: CHECK_INTERVAL });
    // End of day alarm at 9pm
    const now = new Date();
    const eod = new Date();
    eod.setHours(21, 0, 0, 0);
    if (now > eod) eod.setDate(eod.getDate() + 1);
    const minsUntilEod = Math.round((eod - now) / 60000);
    chrome.alarms.create(ALARM_EOD, { delayInMinutes: minsUntilEod, periodInMinutes: 1440 });
    console.log("[TabSense] Alarms set");
  });
}

// ─── Tab Tracking ─────────────────────────────────────────────────────────────

chrome.tabs.onActivated.addListener(async (info) => {
  try {
    const tab = await chrome.tabs.get(info.tabId);
    await handleTabSwitch(tab);
  } catch (e) {
    // tab may have closed before we got to it
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    await handleTabSwitch(tab);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus — save current tab session
    await saveActiveTab();
    activeTab = null;
    return;
  }
  try {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) await handleTabSwitch(tab);
  } catch (e) {}
});

async function handleTabSwitch(tab) {
  // Save the previous tab first
  await saveActiveTab();

  if (!tab.url || tab.url.startsWith("chrome://")) {
    activeTab = null;
    return;
  }

  const category = categorizeDomain(tab.url);

  activeTab = {
    tabId:     tab.id,
    url:       tab.url,
    title:     tab.title || tab.url,
    startTime: Date.now(),
    category,
  };
}

async function saveActiveTab() {
  if (!activeTab) return;

  const duration = Date.now() - activeTab.startTime;
  if (duration < MIN_DURATION) return; // ignore flash visits

  const entry = {
    url:       activeTab.url,
    title:     activeTab.title,
    category:  activeTab.category,
    startTime: activeTab.startTime,
    duration,
  };

  const { sessions = [] } = await chrome.storage.local.get("sessions");

  // Merge with last entry if same category and within 2 mins
  const last = sessions[sessions.length - 1];
  if (
    last &&
    last.category === entry.category &&
    entry.startTime - (last.startTime + last.duration) < 2 * 60 * 1000
  ) {
    last.duration += duration;
    last.title = entry.title; // update to latest title
  } else {
    sessions.push(entry);
  }

  // Keep only today's data (max 500 entries)
  const today = getToday();
  const todaySessions = sessions
    .filter(s => isToday(s.startTime))
    .slice(-500);

  await chrome.storage.local.set({ sessions: todaySessions });
}

// ─── Alarm Handler ────────────────────────────────────────────────────────────

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_CHECK) {
    await saveActiveTab(); // flush current tab before analysis
    await runCheckIn();
  }
  if (alarm.name === ALARM_EOD) {
    await runEndOfDay();
  }
});

async function runCheckIn() {
  const { sessions = [], settings } = await chrome.storage.local.get(["sessions", "settings"]);
  if (!settings?.notificationsEnabled) return;

  // Only notify during configured work hours
  const hour = new Date().getHours();
  if (hour < (settings.workStartHour ?? 9) || hour >= (settings.workEndHour ?? 22)) return;

  // Throttle: max 1 notification per 25 mins
  const now = Date.now();
  if (now - lastNotifTime < 25 * 60 * 1000) return;

  const pattern = detectPattern(sessions);
  if (!pattern) return;

  // Only notify on distraction or impressive focus streaks
  const notifyPatterns = ["DEEP_DISTRACTION", "LIGHT_DISTRACTION", "DEEP_FOCUS"];
  if (!notifyPatterns.includes(pattern.type)) return;

  const breakdown = getTimeBreakdown(sessions);
  const message = getNotificationMessage(pattern, breakdown);
  if (!message) return;

  const focusScore = calculateFocusScore(sessions);

  chrome.notifications.create(`tabsense_${Date.now()}`, {
    type:    "basic",
    iconUrl: "icons/icon128.png",
    title:   message.title,
    message: message.body,
    silent:  false,
  });

  lastNotifTime = now;

  // Save last check-in for popup display
  await chrome.storage.local.set({
    lastCheckIn: {
      time: now,
      pattern: pattern.type,
      focusScore,
      message,
    },
  });

  console.log(`[TabSense] Notification fired: ${pattern.type} | Score: ${focusScore}`);
}

async function runEndOfDay() {
  const { sessions = [] } = await chrome.storage.local.get("sessions");
  const breakdown = getTimeBreakdown(sessions);
  const focusScore = calculateFocusScore(sessions);
  const reflection = generateDailyReflection(breakdown, focusScore);

  chrome.notifications.create(`tabsense_eod_${Date.now()}`, {
    type:    "basic",
    iconUrl: "icons/icon128.png",
    title:   "TabSense Daily Wrap 🌙",
    message: reflection,
    silent:  false,
  });

  await chrome.storage.local.set({ lastReflection: { reflection, focusScore, breakdown, time: Date.now() } });
  console.log("[TabSense] End of day reflection fired");
}

// ─── Message Handler (from popup) ─────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATUS") {
    (async () => {
      await saveActiveTab();
      const { sessions = [], lastCheckIn, lastReflection, settings } = await chrome.storage.local.get([
        "sessions", "lastCheckIn", "lastReflection", "settings",
      ]);
      const breakdown  = getTimeBreakdown(sessions);
      const focusScore = calculateFocusScore(sessions);
      const pattern    = detectPattern(sessions);
      const reflection = generateDailyReflection(breakdown, focusScore);

      sendResponse({
        sessions,
        breakdown,
        focusScore,
        pattern: pattern?.type ?? "BALANCED",
        reflection,
        lastCheckIn,
        lastReflection,
        settings,
        activeTab: activeTab ? {
          title: activeTab.title,
          category: activeTab.category,
          duration: Date.now() - activeTab.startTime,
        } : null,
      });
    })();
    return true; // keep channel open for async response
  }

  if (message.type === "FORCE_CHECK") {
    runCheckIn().then(() => sendResponse({ ok: true }));
    return true;
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function isToday(timestamp) {
  return new Date(timestamp).toISOString().split("T")[0] === getToday();
}
