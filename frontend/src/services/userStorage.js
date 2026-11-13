const SESSION_KEY = "internshield_session";

function currentEmail() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return (s?.email || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

export function userKey(base, email = currentEmail()) {
  return `${base}:${email || "anon"}`;
}

const SETTINGS_CACHE = "internshield_settings_cache";

export function cacheUserSettings(settings) {
  localStorage.setItem(userKey(SETTINGS_CACHE), JSON.stringify(settings));
}

export function getCachedUserSettings() {
  try {
    return JSON.parse(localStorage.getItem(userKey(SETTINGS_CACHE)) || "{}");
  } catch {
    return {};
  }
}

// Old versions stored this data in shared (global) keys. Remove those once so no
// new account can inherit someone else's (or the developer's test) data.
const LEGACY_KEYS = [
  "internshield_checks_history",
  "internshield_community_alerts",
  "internshield_companies_db",
  "internshield_settings",
  "internshield_notif_read",
  "internshield_otp_store",
];

export function purgeLegacyKeys() {
  try {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* storage unavailable */
  }
}

// Remove everything stored for one user (used when the account is deleted)
export function purgeUserData(email) {
  const suffix = `:${(email || "").trim().toLowerCase()}`;
  if (suffix === ":") return;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("internshield_") && k.endsWith(suffix))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}