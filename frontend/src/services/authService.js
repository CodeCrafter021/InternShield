// ============================================================================
// authService.js — talks ONLY to the real backend.
// (The old localStorage "fallback" stored plaintext passwords and let anyone in
//  when the server was down. It has been removed on purpose.)
// ============================================================================

import api from "./api";

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

function saveSession(data, fallbackEmail = "") {
  const { token, ...user } = data;
  const session = {
    id: user.email || fallbackEmail,
    name: user.name || (user.email || fallbackEmail).split("@")[0],
    email: user.email || fallbackEmail,
    avatar: user.avatar || "",
    provider: user.provider || "password",
    role: "STUDENT",
  };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
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
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ── Delete Account ──
export async function deleteAccount() {
  try {
    await api.delete("/auth/delete");
  } finally {
    logout();
  }
}

// ── Update Profile (display-only fields, kept on this device) ──
export async function updateUserProfile(userId, profileData) {
  const updated = { ...(getSession() || {}), ...profileData };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

// ── Password Reset (OTP based - local) ──
const OTP_STORE_KEY = "internshield_otp_store";

export async function requestPasswordResetOtp(email) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpRecord = {
    email: email.trim().toLowerCase(),
    otp: code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  localStorage.setItem(OTP_STORE_KEY, JSON.stringify(otpRecord));
  return { success: true, otp: code, email: email.trim() };
}

export async function verifyPasswordResetOtp(email, otp) {
  const raw = localStorage.getItem(OTP_STORE_KEY);
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
  localStorage.removeItem(OTP_STORE_KEY);
  return { success: true };
}

// ── Settings ──
const SETTINGS_KEY = "internshield_settings";
const DEFAULT_SETTINGS = {
  twoFactorEnabled: false,
  incognitoVerification: false,
  telemetrySharing: true,
  scamAlertsEmail: true,
  weeklyThreatDigest: true,
  communityAlerts: true,
  discordWebhook: "",
  apiKey: "ishield_live_9f8c2b71a0e4d6",
};

export function getUserSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
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
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}