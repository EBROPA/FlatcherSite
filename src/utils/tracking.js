const UTM_STORAGE_KEY = "flatcher_utm";
const VISIT_STORAGE_KEY = "flatcher_visit_started_at";

const emptyUtm = () => ({
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: ""
});

export function ensureVisitTimestamp() {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return new Date().toISOString();
  }
  let ts = sessionStorage.getItem(VISIT_STORAGE_KEY);
  if (!ts) {
    ts = new Date().toISOString();
    sessionStorage.setItem(VISIT_STORAGE_KEY, ts);
  }
  return ts;
}

export function persistUtmParams(data) {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return;
  }
  try {
    const stored = readUtmParams();
    const merged = {
      ...stored,
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value || ""])
      )
    };
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  } catch (_) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
  }
}

export function readUtmParams() {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return emptyUtm();
  }
  const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!raw) return emptyUtm();
  try {
    const parsed = JSON.parse(raw);
    return {
      utm_source: parsed.utm_source || parsed.source || "",
      utm_medium: parsed.utm_medium || parsed.medium || "",
      utm_campaign: parsed.utm_campaign || parsed.campaign || "",
      utm_content: parsed.utm_content || parsed.content || "",
      utm_term: parsed.utm_term || parsed.term || ""
    };
  } catch (_) {
    return emptyUtm();
  }
}

export function collectClientMeta() {
  if (typeof window === "undefined") {
    return {};
  }

  const ua = navigator.userAgent || "";
  const language = navigator.language || "";
  const platform = navigator.platform || "";
  const screenInfo = window.screen || { width: 0, height: 0 };
  const screen = `${screenInfo.width || 0}x${screenInfo.height || 0}`;
  const viewport = `${window.innerWidth || 0}x${window.innerHeight || 0}`;
  const timezone = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "";
  const referrer = document.referrer || "";
  const deviceType = /Mobi|Android|iP(ad|hone)|Touch/i.test(ua) ? "mobile" : "desktop";
  const browser = detectBrowser(ua);

  return {
    userAgent: ua,
    language,
    platform,
    screen,
    viewport,
    timezone,
    referrer,
    deviceType,
    browser,
    visitStartedAt: ensureVisitTimestamp(),
    page: window.location.href
  };
}

function detectBrowser(ua) {
  if (!ua) return "";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua) && !/OPR\//i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox/i.test(ua)) return "Firefox";
  return "";
}

