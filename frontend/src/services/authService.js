import api from "./api";
import { userKey, purgeUserData } from "./userStorage";

const TOKEN_KEY = "internshield_token";
const SESSION_KEY = "internshield_session";

function friendlyError(err, fallback) {
  const msg = err?.response?.data?.error || err?.response?.data?.message;
  if (msg) return msg;
  if (!err?.response) {
    return "Cannot reach the server. It may be waking up — wait 30 seconds and try again.";
  }
  return fallback;
}

// Extra profile details (college, links, bio...) live under a per-user key, so they
// survive logout/login and are never mixed up between accounts.
const PROFILE_KEY = "internshield_profile";
const LOCKED_FIELDS = ["id", "email", "provider", "role"];

function readExtras(email) {
  try {
    return JSON.parse(localStorage.getItem(userKey(PROFILE_KEY, email)) || "{}");
  } catch {
    return {};
  }
}

function merge(base) {
  if (!base) return null;
  const extras = readExtras(base.email);
  const merged = { ...base, ...extras };
  LOCKED_FIELDS.forEach((k) => (merged[k] = base[k]));
  return merged;
}

function saveSession(data, fallbackEmail = "") {
  const { token, ...user } = data;
  const email = (user.email || fallbackEmail || "").toLowerCase();
  const session = {
    id: email,
    name: user.name || email.split("@")[0],
    email,
    avatar: user.avatar || "",
    provider: user.provider || "password",
    role: "STUDENT",
  };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return merge(session);
}

// ── Register ──
export async function register(arg1, arg2, arg3) {
  const isObj = typeof arg1 === "object" && arg1 !== null;
  const name = isObj ? arg1.name : arg1;
  const email = isObj ? arg1.email : arg2;
  const password = isObj ? arg1.password : arg3;

  if (!email || !password) throw new Error("Email and password are required.");
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const res = await api.post("/auth/register", {
      name: name ? name.trim() : normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password,
    });
    return saveSession(res.data, normalizedEmail);
  } catch (err) {
    throw new Error(friendlyError(err, "Could not create the account."));
  }
}

// ── Login ──
export async function login(arg1, arg2) {
  const isObj = typeof arg1 === "object" && arg1 !== null;
  const email = isObj ? arg1.email : arg1;
  const password = isObj ? arg1.password : arg2;

  if (!email || !password) throw new Error("Email and password are required.");
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const res = await api.post("/auth/login", { email: normalizedEmail, password });
    return saveSession(res.data, normalizedEmail);
  } catch (err) {
    throw new Error(friendlyError(err, "Invalid email or password."));
  }
}

// ── Google / GitHub (authorization-code flow, finished on the backend) ──
export async function oauthLogin(provider, code, redirectUri) {
  try {
    const res = await api.post(`/auth/oauth/${provider}`, { code, redirectUri });
    return saveSession(res.data);
  } catch (err) {
    throw new Error(friendlyError(err, `Could not sign in with ${provider}.`));
  }
}

// ── Logout ──
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? merge(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ── Delete Account ──
export async function deleteAccount() {
  let email = "";
  try {
    email = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}").email || "";
  } catch {
    /* ignore */
  }
  try {
    await api.delete("/auth/delete");
  } finally {
    purgeUserData(email);
    logout();
  }
}

// ── Update Profile (extra details are kept on this device, per user) ──
export async function updateUserProfile(userId, profileData) {
  const base = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (!base) throw new Error("No active session.");
  const extras = { ...readExtras(base.email), ...profileData };
  LOCKED_FIELDS.forEach((k) => delete extras[k]);
  localStorage.setItem(userKey(PROFILE_KEY, base.email), JSON.stringify(extras));
  return merge(base);
}

// ── Password Reset (OTP based - local) ──
const OTP_STORE_BASE = "internshield_otp_store";
const otpKey = () => userKey(OTP_STORE_BASE);

export async function requestPasswordResetOtp(email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpRecord = {
    email: email.trim().toLowerCase(),
    otp: code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  localStorage.setItem(otpKey(), JSON.stringify(otpRecord));
  return { success: true, otp: code, email: email.trim() };
}

export async function verifyPasswordResetOtp(email, otp) {
  const raw = localStorage.getItem(otpKey());
  if (!raw) throw new Error("No active OTP request found.");

  const record = JSON.parse(raw);
  if (record.email !== email.trim().toLowerCase())
    throw new Error("OTP does not match this email.");
  if (Date.now() > record.expiresAt)
    throw new Error("OTP expired. Please request a new one.");
  if (record.otp !== otp.trim())
    throw new Error("Invalid OTP code.");

  return { verified: true };
}

export async function resetPasswordWithOtp(email, otp, newPassword) {
  await verifyPasswordResetOtp(email, otp);
  if (!newPassword || newPassword.length < 6)
    throw new Error("Password must be at least 6 characters.");
  localStorage.removeItem(otpKey());
  return { success: true };
}

// ── Settings ──
const SETTINGS_BASE = "internshield_settings";
const settingsKey = () => userKey(SETTINGS_BASE);
const DEFAULT_SETTINGS = {
  twoFactorEnabled: false,
  incognitoVerification: false,
  telemetrySharing: true,
  scamAlertsEmail: true,
  weeklyThreatDigest: true,
  communityAlerts: true,
  discordWebhook: "",
  apiKey: "",
};

export function getUserSettings() {
  const raw = localStorage.getItem(settingsKey());
  if (!raw) {
    localStorage.setItem(settingsKey(), JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateUserSettings(newSettings) {
  const current = getUserSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem(settingsKey(), JSON.stringify(updated));
  return updated;
}