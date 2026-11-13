import api, { waitForBackend } from "./api";
import { userKey, purgeUserData, cacheUserSettings } from "./userStorage";

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
const LOCKED_FIELDS = ["id", "email", "provider", "role", "sessionId", "twoFactorEnabled"];

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
    sessionId: user.sessionId || "",
    twoFactorEnabled: !!user.twoFactorEnabled,
  };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return merge(session);
}

// ── Register ──
export async function register(arg1, arg2, arg3, arg4) {
  const isObj = typeof arg1 === "object" && arg1 !== null;
  const name = isObj ? arg1.name : arg1;
  const email = isObj ? arg1.email : arg2;
  const password = isObj ? arg1.password : arg3;
  const options = isObj ? arg2 : arg4;

  if (!email || !password) throw new Error("Email and password are required.");
  const normalizedEmail = email.trim().toLowerCase();
  const backendReady = await waitForBackend({ onWaiting: options?.onWaiting });
  if (!backendReady) {
    throw new Error("The server is taking longer than usual to start. Please try again shortly.");
  }
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
export async function login(arg1, arg2, arg3) {
  const isObj = typeof arg1 === "object" && arg1 !== null;
  const email = isObj ? arg1.email : arg1;
  const password = isObj ? arg1.password : arg2;
  const options = isObj ? arg2 : arg3;

  if (!email || !password) throw new Error("Email and password are required.");
  const normalizedEmail = email.trim().toLowerCase();
  const backendReady = await waitForBackend({ onWaiting: options?.onWaiting });
  if (!backendReady) {
    throw new Error("The server is taking longer than usual to start. Please try again shortly.");
  }
  try {
    const res = await api.post("/auth/login", { email: normalizedEmail, password });
    if (res.data.twoFactorRequired) return res.data;
    return saveSession(res.data, normalizedEmail);
  } catch (err) {
    throw new Error(friendlyError(err, "Invalid email or password."));
  }
}

// ── Google / GitHub (authorization-code flow, finished on the backend) ──
export async function oauthLogin(provider, code, redirectUri) {
  try {
    const res = await api.post(`/auth/oauth/${provider}`, { code, redirectUri });
    if (res.data.twoFactorRequired) return res.data;
    return saveSession(res.data);
  } catch (err) {
    throw new Error(friendlyError(err, `Could not sign in with ${provider}.`));
  }
}

// ── Logout ──
export function logout() {
  const token = localStorage.getItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  if (!token) return Promise.resolve();
  return api.delete("/auth/logout", { headers: { Authorization: `Bearer ${token}` } })
    .then(() => undefined);
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

export async function requestPasswordResetOtp(email) {
  try {
    const response = await api.post("/auth/password-reset/request", { email: email.trim().toLowerCase() });
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not send the verification email."));
  }
}

export async function verifyPasswordResetOtp(email, otp) {
  try {
    const response = await api.post("/auth/password-reset/verify", {
      email: email.trim().toLowerCase(),
      code: otp.trim(),
    });
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Invalid or expired verification code."));
  }
}

export async function resetPasswordWithOtp(email, otp, newPassword) {
  try {
    const response = await api.post("/auth/password-reset/complete", {
      email: email.trim().toLowerCase(),
      code: otp.trim(),
      newPassword,
    });
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not reset the password."));
  }
}

// ── Settings ──
export const DEFAULT_USER_SETTINGS = {
  twoFactorEnabled: false,
  incognitoVerification: false,
  telemetrySharing: true,
  scamAlertsEmail: true,
  weeklyThreatDigest: true,
  communityAlerts: true,
  discordWebhook: "",
  apiKey: "",
};

export async function getUserSettings() {
  try {
    const response = await api.get("/account/settings");
    const settings = { ...DEFAULT_USER_SETTINGS, ...response.data };
    cacheUserSettings(settings);
    return settings;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not load account settings."));
  }
}

export async function updateUserSettings(newSettings) {
  try {
    const response = await api.put("/account/settings", newSettings);
    const settings = { ...DEFAULT_USER_SETTINGS, ...response.data };
    cacheUserSettings(settings);
    return settings;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not save account settings."));
  }
}

export async function getActiveSessions() {
  try {
    const response = await api.get("/account/sessions");
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not load active sessions."));
  }
}

export async function revokeSession(id) {
  try {
    await api.delete(`/account/sessions/${encodeURIComponent(id)}`);
  } catch (err) {
    throw new Error(friendlyError(err, "Could not revoke this session."));
  }
}

export async function revokeOtherSessions() {
  try {
    const response = await api.post("/account/sessions/revoke-others");
    return response.data.revoked;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not sign out other devices."));
  }
}

export async function setupTwoFactor() {
  try {
    const response = await api.post("/account/2fa/setup");
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not start authenticator setup."));
  }
}

export async function enableTwoFactor(code) {
  try {
    const response = await api.post("/account/2fa/enable", { code });
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not enable two-factor authentication."));
  }
}

export async function disableTwoFactor(code) {
  try {
    const response = await api.post("/account/2fa/disable", { code });
    return response.data;
  } catch (err) {
    throw new Error(friendlyError(err, "Could not disable two-factor authentication."));
  }
}

export async function verifyLoginOtp(challengeToken, code) {
  try {
    const response = await api.post("/auth/2fa/verify", { challengeToken, code });
    return saveSession(response.data);
  } catch (err) {
    throw new Error(friendlyError(err, "Invalid or expired authenticator code."));
  }
}