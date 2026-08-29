// ============================================================================
// authService.js - Connected to Real Backend API
// ============================================================================

import api from "./api";

const TOKEN_KEY = "internshield_token";
const SESSION_KEY = "internshield_session";

// ── Register ──
export async function register(arg1, arg2, arg3) {
  let name, email, password;

  if (typeof arg1 === "object" && arg1 !== null) {
    name = arg1.name;
    email = arg1.email;
    password = arg1.password;
  } else {
    name = arg1;
    email = arg2;
    password = arg3;
  }

  const response = await api.post("/auth/register", { name, email, password });
  const { token, ...user } = response.data;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.email,
    name: user.name,
    email: user.email,
    role: "STUDENT"
  }));

  return getSession();
}

// ── Login ──
export async function login(arg1, arg2) {
  let email, password;

  if (typeof arg1 === "object" && arg1 !== null) {
    email = arg1.email;
    password = arg1.password;
  } else {
    email = arg1;
    password = arg2;
  }

  const response = await api.post("/auth/login", { email, password });
  const { token, ...user } = response.data;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.email,
    name: user.name,
    email: user.email,
    role: "STUDENT"
  }));

  return getSession();
}

// ── Logout ──
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// ── Get Session ──
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Get Token ──
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ── Delete Account ──
export async function deleteAccount() {
  const token = getToken();
  await api.delete("/auth/delete", {
    headers: { Authorization: `Bearer ${token}` }
  });
  logout();
}

// ── Update Profile ──
export async function updateUserProfile(userId, profileData) {
  const token = getToken();
  const currentSession = getSession() || {};
  const updatedSession = { ...currentSession, ...profileData };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
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