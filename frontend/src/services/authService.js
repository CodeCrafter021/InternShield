// ============================================================================
// authService.js
//
// This is a MOCK auth layer so Login/Register/Dashboard work fully in the
// browser right now, with zero backend required.
// ============================================================================

import api from "./api";

const USERS_KEY = "internshield_users";
const TOKEN_KEY = "internshield_token";
const SESSION_KEY = "internshield_session";

// Demo starter accounts
const INITIAL_DEMO_USERS = [
  {
    id: "demo-user-1",
    name: "Atharva Wallapkar",
    email: "atharvawallapkar261@gmail.com",
    password: "password123",
    role: "STUDENT",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-user-2",
    name: "Alex Chen",
    email: "alex@example.com",
    password: "password123",
    role: "STUDENT",
    createdAt: new Date().toISOString(),
  },
];

// --- tiny helpers around the mock "database" -------------------------------
function readUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_DEMO_USERS));
    return INITIAL_DEMO_USERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function fakeToken(email) {
  return btoa(`${email}:${Date.now()}`);
}

function normalizeCredentials(arg1, arg2, arg3) {
  if (typeof arg1 === "object" && arg1 !== null) {
    return {
      name: (arg1.name || "").trim(),
      email: (arg1.email || "").trim(),
      password: arg1.password || "",
    };
  }
  if (typeof arg1 === "string" && typeof arg2 === "string" && typeof arg3 === "string") {
    return { name: arg1.trim(), email: arg2.trim(), password: arg3 };
  }
  if (typeof arg1 === "string" && typeof arg2 === "string") {
    return { name: "", email: arg1.trim(), password: arg2 };
  }
  return { name: "", email: "", password: "" };
}

export async function register(arg1, arg2, arg3) {
  await simulateNetwork();

  const { name, email, password } = normalizeCredentials(arg1, arg2, arg3);

  if (!email || !password) {
    throw new Error("Please provide a valid email and password.");
  }

  const users = readUsers();
  if (users.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
    name: name || "Student",
    email,
    password,
    role: "STUDENT",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  localStorage.setItem(TOKEN_KEY, fakeToken(email));
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

export async function login(arg1, arg2) {
  await simulateNetwork();

  const { email, password } = normalizeCredentials(arg1, arg2);

  if (!email || !password) {
    throw new Error("Please provide your email and password.");
  }

  const users = readUsers();
  const found = users.find(
    (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
  );

  if (!found || found.password !== password) {
    // If not found, but it's a valid email in demo mode, create or reject clearly:
    throw new Error("Incorrect email or password. If you haven't registered yet, please switch to Sign Up.");
  }

  const session = { id: found.id, name: found.name, email: found.email, role: found.role };
  localStorage.setItem(TOKEN_KEY, fakeToken(email));
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return session;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Profile Updates ──
export async function updateUserProfile(userId, profileData) {
  await simulateNetwork();
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId || u.email === profileData.email);

  if (idx === -1) {
    throw new Error("User record not found.");
  }

  const updatedUser = {
    ...users[idx],
    ...profileData,
  };

  users[idx] = updatedUser;
  writeUsers(users);

  // Update active session
  const currentSession = getSession() || {};
  const updatedSession = {
    ...currentSession,
    ...profileData,
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
}

// ── Password Reset with OTP ──
const OTP_STORE_KEY = "internshield_otp_store";

export async function requestPasswordResetOtp(email) {
  await simulateNetwork();
  if (!email || !email.trim()) {
    throw new Error("Please enter a valid email address.");
  }

  const users = readUsers();
  const found = users.find(
    (u) => u.email && u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!found) {
    throw new Error("No InternShield account associated with this email.");
  }

  // Generate 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpRecord = {
    email: email.trim().toLowerCase(),
    otp: code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  localStorage.setItem(OTP_STORE_KEY, JSON.stringify(otpRecord));
  return { success: true, otp: code, email: email.trim() };
}

export async function verifyPasswordResetOtp(email, otp) {
  await simulateNetwork();
  const raw = localStorage.getItem(OTP_STORE_KEY);
  if (!raw) {
    throw new Error("No active OTP request found. Please request a new verification code.");
  }

  const record = JSON.parse(raw);
  if (record.email !== email.trim().toLowerCase()) {
    throw new Error("OTP does not match this email address.");
  }

  if (Date.now() > record.expiresAt) {
    throw new Error("Verification code has expired. Please request a new OTP.");
  }

  if (record.otp !== otp.trim()) {
    throw new Error("Invalid 6-digit OTP code. Please check and try again.");
  }

  return { verified: true };
}

export async function resetPasswordWithOtp(email, otp, newPassword) {
  await simulateNetwork();
  await verifyPasswordResetOtp(email, otp);

  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  const users = readUsers();
  const idx = users.findIndex(
    (u) => u.email && u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (idx === -1) {
    throw new Error("User account not found.");
  }

  users[idx].password = newPassword;
  writeUsers(users);
  localStorage.removeItem(OTP_STORE_KEY);

  return { success: true, message: "Password has been successfully updated." };
}

// ── Persistent App & Privacy Settings ──
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

function simulateNetwork() {
  return new Promise((resolve) => setTimeout(resolve, 250));
}
