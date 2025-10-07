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

export function collectClientMeta(context = {}) {
  if (typeof window === "undefined") {
    return { ...normalizeContext(context) };
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
    page: window.location.href,
    ...normalizeContext(context)
  };
}

export function formatPhoneForBackend(value = '') {
  const digits = value.replace(/\D+/g, '');
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.length === 10) {
    return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  }
  return value;
}

function normalizeContext(raw = {}) {
  const result = { ...raw };

  if (result.formValues && typeof result.formValues === "object") {
    result.formValues = sanitizeFormValues(result.formValues);
  }

  if (result.extra && typeof result.extra === "object") {
    result.extra = sanitizeFormValues(result.extra);
  }

  if (result.numericId != null && typeof result.numericId !== "string") {
    result.numericId = String(result.numericId);
  }

  return result;
}

function sanitizeFormValues(values = {}) {
  const parsed = {};
  Object.entries(values).forEach(([key, value]) => {
    if (value == null || value === "") {
      parsed[key] = null;
      return;
    }

    if (Array.isArray(value)) {
      parsed[key] = value.map((item) => sanitizePrimitive(item)).filter((item) => item !== null);
      return;
    }

    if (typeof value === "object") {
      parsed[key] = sanitizeFormValues(value);
      return;
    }

    parsed[key] = sanitizePrimitive(value);
  });

  return parsed;
}

function sanitizePrimitive(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "boolean") return value;
  const numeric = Number(value.toString().replace(/\s+/g, ""));
  return Number.isFinite(numeric) ? numeric : value.toString();
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

